#include <ctype.h>
#include <stdlib.h>
#include <string.h>
#include <strings.h>

#include "forge.h"

struct line {
    const char *s;
    size_t      n;
};

static void inline_md(struct buf *out, const char *s, size_t n);

int url_ok(const char *u, size_t n)
{
    if (!n)
        return 0;
    for (size_t i = 0; i < n; i++)
        if ((unsigned char)u[i] <= ' ' || u[i] == '"' || u[i] == '<' || u[i] == '>')
            return 0;
    if ((n > 7 && !strncasecmp(u, "http://", 7)) ||
        (n > 8 && !strncasecmp(u, "https://", 8)) ||
        (n > 7 && !strncasecmp(u, "mailto:", 7)))
        return 1;
    /* Anything else with a scheme (javascript:, data:, ...) is refused. */
    for (size_t i = 0; i < n && !strchr("/?#", u[i]); i++)
        if (u[i] == ':')
            return 0;
    return 1;
}

static size_t indent(struct line l)
{
    size_t i = 0;

    while (i < l.n && l.s[i] == ' ')
        i++;
    return i;
}

static int blank(struct line l)
{
    return indent(l) == l.n;
}

static int heading_level(struct line l)
{
    size_t i = 0;

    while (i < l.n && i < 7 && l.s[i] == '#')
        i++;
    return i >= 1 && i <= 6 && i < l.n && l.s[i] == ' ' ? (int)i : 0;
}

static int is_rule(struct line l)
{
    char c = 0;
    int count = 0;

    for (size_t i = 0; i < l.n; i++) {
        if (l.s[i] == ' ')
            continue;
        if (!strchr("-*_", l.s[i]) || (c && l.s[i] != c))
            return 0;
        c = l.s[i];
        count++;
    }
    return count >= 3;
}

static int is_fence(struct line l)
{
    return l.n >= 3 && !strncmp(l.s, "```", 3);
}

/* Length of the list marker including its trailing space, 0 if none. */
static size_t list_marker(struct line l, int *ordered)
{
    size_t i = indent(l);

    if (i + 1 < l.n && strchr("-*+", l.s[i]) && l.s[i + 1] == ' ') {
        *ordered = 0;
        return i + 2;
    }
    size_t d = i;
    while (d < l.n && isdigit((unsigned char)l.s[d]))
        d++;
    if (d > i && d - i <= 9 && d + 1 < l.n && l.s[d] == '.' && l.s[d + 1] == ' ') {
        *ordered = 1;
        return d + 2;
    }
    return 0;
}

static int starts_block(struct line l)
{
    int ordered;

    return heading_level(l) || is_rule(l) || is_fence(l) ||
           (l.n && l.s[0] == '>') || list_marker(l, &ordered);
}

static void slug(struct buf *out, const char *s, size_t n)
{
    size_t start = out->len;
    int dash = 0;

    for (size_t i = 0; i < n; i++) {
        unsigned char c = (unsigned char)s[i];
        if (!isalnum(c)) {
            dash = 1;
            continue;
        }
        if (dash && out->len > start)
            buf_putc(out, '-');
        buf_putc(out, (char)tolower(c));
        dash = 0;
    }
}

/* Finds delim (1 or 2 chars) closing a span opened before s[i], skipping
 * escapes and code spans. Returns its index or n. */
static size_t find_close(const char *s, size_t i, size_t n, const char *delim)
{
    size_t dl = strlen(delim);

    for (; i + dl <= n; i++) {
        if (s[i] == '\\') {
            i++;
        } else if (s[i] == '`') {
            const char *e = memchr(s + i + 1, '`', n - i - 1);
            if (e)
                i = (size_t)(e - s);
        } else if (!strncmp(s + i, delim, dl) && i > 0 && s[i - 1] != ' ') {
            /* "***" closing "**": take the last two, the first star closes
             * an inner em. */
            if (i + dl < n && s[i + dl] == delim[0])
                continue;
            return i;
        }
    }
    return n;
}

/* Parses "[text](url)" at s[i] == '['. On success fills the spans and
 * returns the index just past ')'; otherwise returns 0. */
static size_t parse_link(const char *s, size_t i, size_t n,
                         size_t *text, size_t *tlen, size_t *url, size_t *ulen)
{
    int depth = 0;
    size_t j;

    for (j = i; j < n; j++) {
        if (s[j] == '\\')
            j++;
        else if (s[j] == '[')
            depth++;
        else if (s[j] == ']' && --depth == 0)
            break;
    }
    if (j + 1 >= n || s[j + 1] != '(')
        return 0;
    size_t u = j + 2, e = u;
    int parens = 0;
    for (; e < n && s[e] != ' '; e++) {
        if (s[e] == '(')
            parens++;
        else if (s[e] == ')' && parens-- == 0)
            break;
    }
    size_t close = e;
    if (close < n && s[close] == ' ') {
        /* optional "title", which we drop */
        const char *p = memchr(s + close, ')', n - close);
        if (!p)
            return 0;
        close = (size_t)(p - s);
    }
    if (close >= n)
        return 0;
    *text = i + 1;
    *tlen = j - i - 1;
    *url = u;
    *ulen = e - u;
    return close + 1;
}

static void inline_md(struct buf *out, const char *s, size_t n)
{
    size_t i = 0;

    while (i < n) {
        char c = s[i];

        if (c == '\\' && i + 1 < n && ispunct((unsigned char)s[i + 1])) {
            buf_escn(out, s + i + 1, 1);
            i += 2;
        } else if (c == '`') {
            size_t run = 0;
            while (i + run < n && s[i + run] == '`')
                run++;
            size_t j = i + run, end = n;
            for (; j + run <= n; j++) {
                size_t k = 0;
                while (k < run && s[j + k] == '`')
                    k++;
                if (k == run && (j + run == n || s[j + run] != '`')) {
                    end = j;
                    break;
                }
            }
            if (end == n) {
                buf_escn(out, s + i, run);
                i += run;
                continue;
            }
            size_t a = i + run, b = end;
            if (b - a >= 2 && s[a] == ' ' && s[b - 1] == ' ')
                a++, b--;
            buf_puts(out, "<code>");
            buf_escn(out, s + a, b - a);
            buf_puts(out, "</code>");
            i = end + run;
        } else if ((c == '!' && i + 1 < n && s[i + 1] == '[') || c == '[') {
            int img = c == '!';
            size_t t, tl, u, ul;
            size_t next = parse_link(s, i + img, n, &t, &tl, &u, &ul);
            if (!next) {
                buf_escn(out, s + i, 1);
                i++;
                continue;
            }
            int ok = url_ok(s + u, ul);
            if (img) {
                if (ok) {
                    buf_puts(out, "<img src=\"");
                    buf_escn(out, s + u, ul);
                    buf_puts(out, "\" alt=\"");
                    buf_escn(out, s + t, tl);
                    buf_puts(out, "\" loading=\"lazy\">");
                }
            } else if (ok) {
                buf_puts(out, "<a href=\"");
                buf_escn(out, s + u, ul);
                buf_puts(out, "\">");
                inline_md(out, s + t, tl);
                buf_puts(out, "</a>");
            } else {
                inline_md(out, s + t, tl);
            }
            i = next;
        } else if ((c == '*' || c == '_') && i + 1 < n && s[i + 1] != ' ' &&
                   (c == '*' || i == 0 || !isalnum((unsigned char)s[i - 1]))) {
            int strong = i + 1 < n && s[i + 1] == c;
            char delim[3] = { c, strong ? c : '\0', '\0' };
            size_t open = i + (strong ? 2 : 1);
            size_t close = find_close(s, open, n, delim);
            if (close == n || close == open) {
                buf_escn(out, s + i, open - i);
                i = open;
                continue;
            }
            buf_puts(out, strong ? "<strong>" : "<em>");
            inline_md(out, s + open, close - open);
            buf_puts(out, strong ? "</strong>" : "</em>");
            i = close + (strong ? 2 : 1);
        } else if (c == '\n') {
            if (i >= 2 && s[i - 1] == ' ' && s[i - 2] == ' ')
                buf_puts(out, "<br>");
            buf_putc(out, '\n');
            i++;
        } else {
            size_t j = i + 1;
            while (j < n && !strchr("\\`![*_\n", s[j]))
                j++;
            buf_escn(out, s + i, j - i);
            i = j;
        }
    }
}

static void join(struct buf *b, struct line *lines, size_t a, size_t z)
{
    for (size_t k = a; k < z; k++) {
        if (k > a)
            buf_putc(b, '\n');
        buf_putn(b, lines[k].s, lines[k].n);
    }
}

static void blocks(struct buf *out, struct line *lines, size_t nl)
{
    size_t i = 0;

    while (i < nl) {
        struct line l = lines[i];
        int level, ordered;
        size_t m;

        if (blank(l)) {
            i++;
        } else if (is_fence(l)) {
            size_t j = i + 1;
            while (j < nl && !is_fence(lines[j]))
                j++;
            size_t lang = 3;
            while (lang < l.n && l.s[lang] == ' ')
                lang++;
            buf_puts(out, "<pre><code");
            if (lang < l.n) {
                buf_puts(out, " class=\"lang-");
                buf_escn(out, l.s + lang, l.n - lang);
                buf_putc(out, '"');
            }
            buf_putc(out, '>');
            for (size_t k = i + 1; k < j; k++) {
                buf_escn(out, lines[k].s, lines[k].n);
                buf_putc(out, '\n');
            }
            buf_puts(out, "</code></pre>\n");
            i = j < nl ? j + 1 : j;
        } else if ((level = heading_level(l))) {
            const char *t = l.s + level + 1;
            size_t tn = l.n - (size_t)level - 1;
            while (tn && (t[tn - 1] == '#' || t[tn - 1] == ' '))
                tn--;
            buf_printf(out, "<h%d id=\"", level);
            slug(out, t, tn);
            buf_puts(out, "\">");
            inline_md(out, t, tn);
            buf_printf(out, "</h%d>\n", level);
            i++;
        } else if (is_rule(l)) {
            buf_puts(out, "<hr>\n");
            i++;
        } else if (l.s[0] == '>') {
            size_t j = i;
            struct buf inner = {0};
            while (j < nl && lines[j].n && lines[j].s[0] == '>')
                j++;
            for (size_t k = i; k < j; k++) {
                size_t off = lines[k].n > 1 && lines[k].s[1] == ' ' ? 2 : 1;
                buf_putn(&inner, lines[k].s + off, lines[k].n - off);
                buf_putc(&inner, '\n');
            }
            buf_puts(out, "<blockquote>\n");
            md_render(out, inner.s, inner.len);
            buf_puts(out, "</blockquote>\n");
            buf_free(&inner);
            i = j;
        } else if ((m = list_marker(l, &ordered))) {
            int ord = ordered;
            buf_puts(out, ord ? "<ol>\n" : "<ul>\n");
            while (i < nl && (m = list_marker(lines[i], &ordered)) && ordered == ord) {
                struct buf item = {0};
                size_t j = i + 1;
                buf_putn(&item, lines[i].s + m, lines[i].n - m);
                while (j < nl && !blank(lines[j]) && indent(lines[j]) >= 2 &&
                       !list_marker(lines[j], &ordered)) {
                    buf_putc(&item, '\n');
                    buf_putn(&item, lines[j].s + indent(lines[j]),
                             lines[j].n - indent(lines[j]));
                    j++;
                }
                buf_puts(out, "<li>");
                inline_md(out, item.s, item.len);
                buf_puts(out, "</li>\n");
                buf_free(&item);
                i = j;
            }
            buf_puts(out, ord ? "</ol>\n" : "</ul>\n");
        } else {
            size_t j = i + 1;
            struct buf para = {0};
            while (j < nl && !blank(lines[j]) && !starts_block(lines[j]))
                j++;
            join(&para, lines, i, j);
            buf_puts(out, "<p>");
            inline_md(out, para.s, para.len);
            buf_puts(out, "</p>\n");
            buf_free(&para);
            i = j;
        }
    }
}

void md_render(struct buf *out, const char *src, size_t len)
{
    size_t cap = 64, nl = 0;
    struct line *lines = xmalloc(cap * sizeof(*lines));
    const char *p = src, *end = src + len;

    while (p < end) {
        const char *eol = memchr(p, '\n', (size_t)(end - p));
        size_t n = (size_t)((eol ? eol : end) - p);
        if (n && p[n - 1] == '\r')
            n--;
        if (nl == cap) {
            cap *= 2;
            lines = realloc(lines, cap * sizeof(*lines));
            if (!lines)
                die("out of memory");
        }
        lines[nl++] = (struct line){ p, n };
        p = eol ? eol + 1 : end;
    }
    blocks(out, lines, nl);
    free(lines);
}
