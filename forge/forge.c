#include <ctype.h>
#include <dirent.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>
#include <unistd.h>

#include "forge.h"

/* forge reads content/ and templates/ and writes the site into out/.
 * Static files (CSS, fonts, images) are copied by the Makefile.
 * It runs for a fraction of a second and exits, so allocations are
 * mostly left for the OS to reclaim. */

struct post {
    char       *slug, *title, *subtitle, *date, *originally;
    const char *body;
    size_t      blen;
};

struct var {
    const char *name;
    const char *val;
};

static const char *content_dir = "content";
static const char *tmpl_dir    = "templates";
static const char *out_dir     = "out";

static char *layout;
static struct ini site, status;

static char *path(const char *dir, const char *name)
{
    struct buf b = {0};

    buf_printf(&b, "%s/%s", dir, name);
    return b.s;
}

static const char *site_get(const char *key)
{
    const char *v = sec_get(&site.sec[0], key);

    if (!v)
        die("site.ini: missing %s", key);
    return v;
}

/* A value from status.ini, or NULL when the cluster has not written one. */
static const char *status_get(const char *key)
{
    return status.nsec ? sec_get(&status.sec[0], key) : NULL;
}

static int date_parts(const char *date, int *y, int *m, int *d)
{
    return sscanf(date, "%4d-%2d-%2d", y, m, d) == 3 && *m >= 1 && *m <= 12;
}

static int read_minutes(const char *s, size_t n)
{
    int words = 0, in = 0;

    for (size_t i = 0; i < n; i++) {
        int sp = isspace((unsigned char)s[i]);
        words += !sp && !in;
        in = !sp;
    }
    return words < 220 ? 1 : (words + 110) / 220;
}

/* Front matter values are either bare or JSON-style double-quoted. */
static char *unquote(const char *s, size_t n)
{
    if (n < 2 || s[0] != '"' || s[n - 1] != '"')
        return xstrndup(s, n);

    struct buf b = {0};
    for (size_t i = 1; i + 1 < n; i++) {
        if (s[i] == '\\' && i + 2 < n) {
            i++;
            buf_putc(&b, s[i] == 'n' ? '\n' : s[i]);
        } else {
            buf_putc(&b, s[i]);
        }
    }
    if (!b.s)
        buf_putn(&b, "", 0);
    return b.s;
}

static struct post load_post(const char *file, const char *name)
{
    size_t len;
    char *text = read_file(file, &len);
    struct post p = { .slug = xstrndup(name, strlen(name) - 3) };
    const char *s = text, *end = text + len;

    if (strncmp(s, "---\n", 4))
        die("%s: no front matter", file);
    s += 4;
    for (;;) {
        const char *eol = memchr(s, '\n', (size_t)(end - s));
        if (!eol)
            die("%s: unterminated front matter", file);
        if (eol - s == 3 && !strncmp(s, "---", 3)) {
            s = eol + 1;
            break;
        }
        const char *colon = memchr(s, ':', (size_t)(eol - s));
        if (!colon)
            die("%s: bad front matter line", file);
        const char *v = colon + 1;
        while (v < eol && *v == ' ')
            v++;
        char *val = unquote(v, (size_t)(eol - v));
        size_t kl = (size_t)(colon - s);

        if (kl == 5 && !strncmp(s, "title", 5))
            p.title = val;
        else if (kl == 8 && !strncmp(s, "subtitle", 8))
            p.subtitle = val;
        else if (kl == 4 && !strncmp(s, "date", 4))
            p.date = val;
        else if (kl == 10 && !strncmp(s, "originally", 10))
            p.originally = val;
        else
            free(val);
        s = eol + 1;
    }
    if (!p.title || !p.date)
        die("%s: needs a title and a date", file);
    p.body = s;
    p.blen = (size_t)(end - s);
    return p;
}

static int newest_first(const void *a, const void *b)
{
    return strcmp(((const struct post *)b)->date, ((const struct post *)a)->date);
}

static struct post *load_posts(int *count)
{
    char *dir = path(content_dir, "posts");
    DIR *d = opendir(dir);
    struct post *posts = NULL;
    struct dirent *e;
    int n = 0;

    if (!d)
        die("cannot open %s", dir);
    while ((e = readdir(d))) {
        size_t len = strlen(e->d_name);
        if (len < 4 || e->d_name[0] == '.' || strcmp(e->d_name + len - 3, ".md"))
            continue;
        posts = realloc(posts, (size_t)(n + 1) * sizeof(*posts));
        if (!posts)
            die("out of memory");
        char *file = path(dir, e->d_name);
        posts[n++] = load_post(file, e->d_name);
        free(file);
    }
    closedir(d);
    free(dir);
    qsort(posts, (size_t)n, sizeof(*posts), newest_first);
    *count = n;
    return posts;
}

static const char *lookup(const struct var *vars, const char *name, size_t n)
{
    for (const struct var *v = vars; v->name; v++)
        if (strlen(v->name) == n && !strncmp(v->name, name, n))
            return v->val;
    die("layout: unknown placeholder {{%.*s}}", (int)n, name);
}

static void fill(struct buf *out, const char *tmpl, const struct var *vars)
{
    const char *p = tmpl, *open;

    while ((open = strstr(p, "{{"))) {
        const char *close = strstr(open, "}}");
        if (!close)
            die("layout: unclosed {{");
        buf_putn(out, p, (size_t)(open - p));
        buf_puts(out, lookup(vars, open + 2, (size_t)(close - open - 2)));
        p = close + 2;
    }
    buf_puts(out, p);
}

/* The pages are a k9s session: a header with the cluster, the key hints and
 * a logo, one framed view, then crumbs along the bottom. Every row and hint
 * is a plain link, static/k9s.js only adds the keyboard. */

struct hint {
    const char *key, *label, *href;
};

static const struct hint views[] = {
    { "0", "projects", "/" }, { "1", "blog", "/blog/" }, { "2", "about", "/about/" }, { "3", "lab", "/lab/" },
    { "4", "bench", "/bench/" },
};

static const struct hint list_hints[] = {
    { "enter", "describe", NULL }, { "l", "logs", NULL }, { "j/k", "up/down", NULL }, { "/", "filter", NULL },
    { "ctrl-d", "delete", NULL }, { "s", "shell", NULL }, { ":", "command", NULL }, { "?", "help", NULL },
    { NULL, NULL, NULL },
};

static const struct hint blog_hints[] = {
    { "enter", "read", NULL }, { "j/k", "up/down", NULL }, { "/", "filter", NULL }, { "s", "shell", NULL },
    { ":", "command", NULL }, { "?", "help", NULL }, { NULL, NULL, NULL },
};

static const struct hint project_hints[] = {
    { "esc", "back", NULL }, { "l", "logs", NULL }, { "s", "shell", NULL }, { ":", "command", NULL },
    { "?", "help", NULL }, { NULL, NULL, NULL },
};

static const struct hint view_hints[] = {
    { "esc", "back", NULL }, { "j/k", "scroll", NULL }, { "s", "shell", NULL }, { ":", "command", NULL },
    { "?", "help", NULL }, { NULL, NULL, NULL },
};

static time_t now;

static void md_file(struct buf *b, const char *name)
{
    size_t len;
    char *file = path(content_dir, name);
    char *text = read_file(file, &len);

    md_render(b, text, len);
    free(text);
    free(file);
}

static void esc_key(struct buf *b, const struct section *s, const char *key)
{
    const char *v = sec_get(s, key);

    buf_esc(b, v ? v : "");
}

/* kubectl's AGE: hours under two days, then days, then years. */
static void age(struct buf *b, const char *date)
{
    struct tm tm = {0};
    int y, m, d;

    if (!date || !date_parts(date, &y, &m, &d)) {
        buf_puts(b, "&lt;unknown&gt;");
        return;
    }
    tm.tm_year = y - 1900;
    tm.tm_mon = m - 1;
    tm.tm_mday = d;
    tm.tm_hour = 12;
    double s = difftime(now, mktime(&tm));
    long hours = s > 0 ? (long)(s / 3600) : 0;
    if (hours < 48)
        buf_printf(b, "%ldh", hours);
    else if (hours < 24 * 365 * 2)
        buf_printf(b, "%ldd", hours / 24);
    else
        buf_printf(b, "%ldy", hours / (24 * 365));
}

static void lower_slug(struct buf *b, const char *s)
{
    for (; *s; s++) {
        unsigned char c = (unsigned char)*s;
        if (isalnum(c))
            buf_putc(b, (char)tolower(c));
        else if (b->len && b->s[b->len - 1] != '-')
            buf_putc(b, '-');
    }
    while (b->len && b->s[b->len - 1] == '-')
        b->s[--b->len] = '\0';
}

/* The header block. Rows with a key read status.ini, the rest are fixed. */
static void info(struct buf *b)
{
    static const struct { const char *label, *key, *fixed; int pct; } rows[] = {
        { "Context", NULL, "homelab", 0 }, { "Cluster", NULL, "k3s", 0 }, { "User", NULL, "marcos", 0 },
        { "Forge Rev", NULL, "v1.0 (C17)", 0 }, { "K8s Rev", "k8s", NULL, 0 },
        { "CPU", "cpu", NULL, 1 }, { "MEM", "mem", NULL, 1 },
    };

    buf_puts(b, "<dl class=info>\n");
    for (size_t i = 0; i < sizeof(rows) / sizeof(rows[0]); i++) {
        buf_printf(b, "<dt>%s:</dt><dd>", rows[i].label);
        if (rows[i].fixed) {
            buf_puts(b, rows[i].fixed);
        } else {
            const char *v = status_get(rows[i].key);
            buf_esc(b, v ? v : "n/a");
            if (v && rows[i].pct)
                buf_putc(b, '%');
        }
        buf_puts(b, "</dd>\n");
    }
    buf_puts(b, "</dl>\n");
}

static void hint(struct buf *b, const struct hint *h)
{
    int num = isdigit((unsigned char)h->key[0]);

    if (h->href)
        buf_printf(b, "<a href=\"%s\" data-key=\"%s\">", h->href, h->key);
    else
        buf_puts(b, "<span>");
    buf_printf(b, "<b class=%s>&lt;", num ? "num" : "key");
    buf_esc(b, h->key);
    buf_puts(b, "&gt;</b> ");
    buf_esc(b, h->label);
    buf_puts(b, h->href ? "</a>\n" : "</span>\n");
}

static void hints(struct buf *b, const struct hint *extra)
{
    buf_puts(b, "<div class=menu>\n<div>\n");
    for (size_t i = 0; i < sizeof(views) / sizeof(views[0]); i++)
        hint(b, &views[i]);
    for (int i = 0; extra[i].key; i++) {
        if (i % 4 == 0)
            buf_puts(b, "</div>\n<div>\n");
        hint(b, &extra[i]);
    }
    buf_puts(b, "</div>\n</div>\n");
}

/* Writes url as out/<url>index.html. frame is the view's title, like
 * "projects(all)[13]"; crumbs are the trail shown at the bottom. */
static void emit(const char *url, const char *title, const char *desc, const char *frame,
                 const char *const *crumbs, const struct hint *extra, const char *back, const struct buf *body)
{
    struct buf page = {0}, ib = {0}, hb = {0}, cb = {0}, t = {0}, d = {0}, fb = {0}, file = {0};
    int err = !strcmp(url, "/404.html");

    info(&ib);
    hints(&hb, extra);
    for (const char *const *c = crumbs; *c; c++) {
        buf_printf(&cb, "<span class=\"crumb%s\">", c[1] ? "" : " active");
        buf_esc(&cb, *c);
        buf_puts(&cb, "</span>");
    }
    if (title) {
        buf_esc(&t, title);
        buf_puts(&t, " - ");
    }
    buf_esc(&t, site_get("title"));
    buf_esc(&d, desc ? desc : site_get("tagline"));
    const char *paren = strchr(frame, '('), *bracket = strchr(frame, '[');
    const char *name_end = paren ? paren : bracket ? bracket : frame + strlen(frame);
    buf_puts(&fb, "<span class=f-name>");
    buf_escn(&fb, frame, (size_t)(name_end - frame));
    buf_puts(&fb, "</span>");
    if (paren) {
        const char *end = bracket ? bracket : frame + strlen(frame);
        buf_puts(&fb, "<span class=f-ns>");
        buf_escn(&fb, paren, (size_t)(end - paren));
        buf_puts(&fb, "</span>");
    }
    if (bracket) {
        buf_puts(&fb, "<span class=f-count>");
        buf_esc(&fb, bracket);
        buf_puts(&fb, "</span>");
    }

    struct var vars[] = {
        { "title", t.s }, { "description", d.s }, { "info", ib.s }, { "hints", hb.s }, { "frame", fb.s },
        { "content", body->s ? body->s : "" }, { "crumbs", cb.s }, { "back", back ? back : "" },
        { "flash", err ? "Boom!! the server could not find the requested resource" : "Forged in C, served from a homelab" },
        { "flash_class", err ? " err" : "" }, { NULL, NULL },
    };
    fill(&page, layout, vars);

    size_t ul = strlen(url);
    if (ul && url[ul - 1] == '/')
        buf_printf(&file, "%s%sindex.html", out_dir, url);
    else
        buf_printf(&file, "%s%s", out_dir, url);
    write_file(file.s, &page);

    buf_free(&page), buf_free(&ib), buf_free(&hb), buf_free(&cb);
    buf_free(&t), buf_free(&d), buf_free(&fb), buf_free(&file);
}

static const char *status_class(const char *st)
{
    if (!st || !strcmp(st, "Running"))
        return "st-run";
    if (!strcmp(st, "Completed"))
        return "st-done";
    if (!strcmp(st, "Pending"))
        return "st-pend";
    return "st-new";
}

static char *commits_file(const char *project)
{
    struct buf b = {0};

    buf_printf(&b, "%s/commits/%s.txt", content_dir, project);
    return b.s;
}

static int has_logs(const char *project)
{
    char *f = commits_file(project);
    int ok = !access(f, R_OK);

    free(f);
    return ok;
}

static void page_projects(const struct ini *projects)
{
    struct buf b = {0}, frame = {0};
    int n = projects->nsec - 1;

    buf_puts(&b, "<table class=k-table data-nav>\n<thead><tr><th>NAME<span class=sort>&uarr;</span></th>"
                 "<th>KIND</th><th>LANG</th><th>STATUS</th><th>AGE</th></tr></thead>\n<tbody>\n");
    for (int i = 1; i < projects->nsec; i++) {
        const struct section *s = &projects->sec[i];
        if (!sec_get(s, "name"))
            die("projects.ini [%s]: needs a name", s->name);
        buf_printf(&b, "<tr class=%s", status_class(sec_get(s, "status")));
        if (has_logs(s->name))
            buf_printf(&b, " data-logs=\"/projects/%s/logs/\"", s->name);
        buf_printf(&b, "><td><a href=\"/projects/%s/\">", s->name);
        buf_esc(&b, s->name);
        buf_puts(&b, "</a></td><td>");
        struct buf kind = {0};
        lower_slug(&kind, sec_get(s, "type") ? sec_get(s, "type") : "");
        buf_puts(&b, kind.s ? kind.s : "");
        buf_free(&kind);
        buf_puts(&b, "</td><td>");
        esc_key(&b, s, "lang");
        buf_puts(&b, "</td><td>");
        buf_esc(&b, sec_get(s, "status") ? sec_get(s, "status") : "Running");
        buf_puts(&b, "</td><td>");
        age(&b, sec_get(s, "since"));
        buf_puts(&b, "</td></tr>\n");
    }
    buf_puts(&b, "</tbody>\n</table>\n");

    buf_printf(&frame, "projects(all)[%d]", n);
    static const char *const crumbs[] = { "projects", NULL };
    emit("/", NULL, NULL, frame.s, crumbs, list_hints, NULL, &b);
    buf_free(&b), buf_free(&frame);
}

/* "Key:   value" lines as kubectl describe prints them. */
static void field(struct buf *b, const char *key, const char *val)
{
    if (!val)
        return;
    buf_printf(b, "<span class=y-key>%s:</span>%*s<span class=y-val>", key, (int)(14 - strlen(key)), "");
    buf_esc(b, val);
    buf_puts(b, "</span>\n");
}

static void link_field(struct buf *b, const char *key, const char *href)
{
    if (!href)
        return;
    if (!url_ok(href, strlen(href)))
        die("bad url for %s: %s", key, href);
    buf_printf(b, "  <span class=y-key>%s:</span>%*s<a href=\"", key, (int)(12 - strlen(key)), "");
    buf_esc(b, href);
    buf_puts(b, "\">");
    buf_esc(b, href);
    buf_puts(b, "</a>\n");
}

static void page_project(const struct section *s)
{
    struct buf b = {0}, url = {0}, frame = {0}, since = {0};

    buf_puts(&b, "<pre class=describe>\n");
    field(&b, "Name", s->name);
    field(&b, "Title", sec_get(s, "name"));
    field(&b, "Kind", sec_get(s, "type"));
    field(&b, "Status", sec_get(s, "status") ? sec_get(s, "status") : "Running");
    if (sec_get(s, "since")) {
        buf_puts(&since, sec_get(s, "since"));
        buf_puts(&since, " (");
        age(&since, sec_get(s, "since"));
        buf_puts(&since, " ago)");
        field(&b, "Created", since.s);
    }
    field(&b, "Built With", sec_get(s, "lang"));
    field(&b, "Part Of", sec_get(s, "set"));
    buf_puts(&b, "<span class=y-key>Highlights:</span>\n");
    for (int k = 0; k < s->nkv; k++) {
        if (strcmp(s->kv[k].key, "stat"))
            continue;
        buf_puts(&b, "  <span class=y-dash>-</span> <span class=y-val>");
        buf_esc(&b, s->kv[k].val);
        buf_puts(&b, "</span>\n");
    }
    field(&b, "Note", sec_get(s, "flavour"));
    buf_puts(&b, "<span class=y-key>Links:</span>\n");
    link_field(&b, "Source", sec_get(s, "repo"));
    link_field(&b, "Demo", sec_get(s, "demo"));
    link_field(&b, "Preprint", sec_get(s, "paper"));
    link_field(&b, "Visit", sec_get(s, "visit"));
    if (has_logs(s->name))
        buf_printf(&b, "  <span class=y-key>Logs:</span>        <a href=\"/projects/%s/logs/\" data-logs>"
                       "latest commits (l)</a>\n", s->name);
    buf_puts(&b, "<span class=y-key>Events:</span>        <span class=y-none>&lt;none&gt;</span>\n</pre>\n");

    buf_printf(&url, "/projects/%s/", s->name);
    buf_printf(&frame, "describe(projects/%s)", s->name);
    static const char *const crumbs[] = { "projects", "describe", NULL };
    emit(url.s, sec_get(s, "name"), NULL, frame.s, crumbs, project_hints, "/", &b);
    buf_free(&b), buf_free(&url), buf_free(&frame), buf_free(&since);
}

/* l on a project: its latest commits, as a log stream. */
static void page_logs(const struct section *s)
{
    struct buf b = {0}, url = {0}, frame = {0}, back = {0};
    char *file = commits_file(s->name);

    if (access(file, R_OK)) {
        free(file);
        return;
    }
    char *text = read_file(file, NULL);
    buf_puts(&b, "<pre class=logstream>\n");
    for (char *line = text, *next; line && *line; line = next) {
        char *eol = strchr(line, '\n');
        next = eol ? eol + 1 : NULL;
        if (eol)
            *eol = '\0';
        char *sha = strchr(line, '\t');
        char *subject = sha ? strchr(sha + 1, '\t') : NULL;
        if (!subject)
            continue;
        *sha++ = '\0';
        *subject++ = '\0';
        buf_puts(&b, "<span class=ts>");
        buf_esc(&b, line);
        buf_puts(&b, "</span> <span class=sha>");
        buf_esc(&b, sha);
        buf_puts(&b, "</span> ");
        buf_esc(&b, subject);
        buf_putc(&b, '\n');
    }
    buf_puts(&b, "</pre>\n");
    free(text);
    free(file);

    buf_printf(&url, "/projects/%s/logs/", s->name);
    buf_printf(&frame, "logs(projects/%s)", s->name);
    buf_printf(&back, "/projects/%s/", s->name);
    static const char *const crumbs[] = { "projects", "describe", "logs", NULL };
    emit(url.s, "Logs", NULL, frame.s, crumbs, view_hints, back.s, &b);
    buf_free(&b), buf_free(&url), buf_free(&frame), buf_free(&back);
}

static void yaml(struct buf *b, int indent, const char *key, const char *val)
{
    buf_printf(b, "%*s<span class=y-key>%s:</span>", indent, "", key);
    if (val) {
        buf_puts(b, " <span class=y-val>");
        buf_esc(b, val);
        buf_puts(b, "</span>");
    }
    buf_putc(b, '\n');
}

static void page_about(const struct ini *cv, const struct ini *links)
{
    struct buf b = {0};

    buf_puts(&b, "<pre class=describe>\n");
    yaml(&b, 0, "apiVersion", "people/v1");
    yaml(&b, 0, "kind", "Person");
    yaml(&b, 0, "metadata", NULL);
    yaml(&b, 2, "name", "marcos-ashton-iglesias");
    yaml(&b, 2, "labels", NULL);
    yaml(&b, 4, "location", "exeter");
    yaml(&b, 4, "seeking", "graduate-swe-2027");
    yaml(&b, 0, "spec", NULL);
    yaml(&b, 2, "bio", "|");
    {
        size_t len;
        char *file = path(content_dir, "intro.md");
        char *text = read_file(file, &len);
        for (char *line = text, *next; line && *line; line = next) {
            char *eol = strchr(line, '\n');
            next = eol ? eol + 1 : NULL;
            size_t n = eol ? (size_t)(eol - line) : strlen(line);
            buf_puts(&b, "    <span class=y-val>");
            buf_escn(&b, line, n);
            buf_puts(&b, "</span>\n");
        }
        free(text);
        free(file);
    }
    for (int i = 0; i < cv->nsec; i++) {
        const struct section *s = &cv->sec[i];
        if (!strcmp(s->name, "sheet")) {
            yaml(&b, 2, "education", sec_get(s, "level"));
            yaml(&b, 2, "university", sec_get(s, "realm"));
        }
    }
    yaml(&b, 2, "skills", NULL);
    for (int i = 0; i < cv->nsec; i++) {
        const struct section *s = &cv->sec[i];
        if (!strcmp(s->name, "attribute")) {
            struct buf k = {0};
            lower_slug(&k, sec_get(s, "name"));
            yaml(&b, 4, k.s, sec_get(s, "value"));
            buf_free(&k);
        }
    }
    yaml(&b, 2, "experience", NULL);
    for (int i = 0; i < cv->nsec; i++) {
        const struct section *s = &cv->sec[i];
        if (strcmp(s->name, "deed"))
            continue;
        buf_puts(&b, "  <span class=y-dash>-</span> <span class=y-key>role:</span> <span class=y-val>");
        esc_key(&b, s, "title");
        buf_puts(&b, "</span>\n");
        yaml(&b, 4, "org", sec_get(s, "where"));
        yaml(&b, 4, "when", sec_get(s, "when"));
        yaml(&b, 4, "stack", sec_get(s, "tags"));
        yaml(&b, 4, "did", NULL);
        for (int k = 0; k < s->nkv; k++) {
            if (strcmp(s->kv[k].key, "point"))
                continue;
            buf_puts(&b, "    <span class=y-dash>-</span> <span class=y-val>");
            buf_esc(&b, s->kv[k].val);
            buf_puts(&b, "</span>\n");
        }
    }
    for (int i = 0; i < cv->nsec; i++) {
        const struct section *s = &cv->sec[i];
        if (strcmp(s->name, "lore"))
            continue;
        yaml(&b, 2, "publications", NULL);
        buf_puts(&b, "  <span class=y-dash>-</span> <span class=y-key>title:</span> <span class=y-val>");
        esc_key(&b, s, "title");
        buf_puts(&b, "</span>\n    <span class=y-key>url:</span> <a href=\"");
        esc_key(&b, s, "href");
        buf_puts(&b, "\">");
        esc_key(&b, s, "href");
        buf_puts(&b, "</a>\n");
    }
    yaml(&b, 0, "status", NULL);
    yaml(&b, 2, "contact", NULL);
    for (int i = 0; i < links->nsec; i++) {
        const struct section *s = &links->sec[i];
        const char *href = sec_get(s, "href");
        if (strcmp(s->name, "link") || !href || !url_ok(href, strlen(href)))
            continue;
        struct buf k = {0};
        lower_slug(&k, sec_get(s, "name"));
        buf_printf(&b, "    <span class=y-key>%s:</span> <a href=\"", k.s);
        buf_esc(&b, href);
        buf_puts(&b, "\">");
        buf_esc(&b, !strncmp(href, "mailto:", 7) ? href + 7 : href);
        buf_puts(&b, "</a>\n");
        buf_free(&k);
    }
    buf_puts(&b, "</pre>\n");

    static const char *const crumbs[] = { "people", "yaml", NULL };
    emit("/about/", "About", "Experience and skills of Marcos Ashton Iglesias", "yaml(people/marcos-ashton-iglesias)",
         crumbs, view_hints, "/", &b);
    buf_free(&b);
}

static void page_blog(const struct post *posts, int np)
{
    struct buf b = {0}, frame = {0};

    buf_puts(&b, "<table class=k-table data-nav>\n<thead><tr><th>TITLE</th><th>PUBLISHED</th><th>READ</th>"
                 "<th>AGE<span class=sort>&darr;</span></th></tr></thead>\n<tbody>\n");
    for (int i = 0; i < np; i++) {
        buf_printf(&b, "<tr class=st-run><td><a href=\"/blog/%s/\">", posts[i].slug);
        buf_esc(&b, posts[i].title);
        buf_printf(&b, "</a></td><td>%s</td><td>%dm</td><td>", posts[i].date, read_minutes(posts[i].body, posts[i].blen));
        age(&b, posts[i].date);
        buf_puts(&b, "</td></tr>\n");
    }
    buf_puts(&b, "</tbody>\n</table>\n<p class=foot-note><a href=\"/blog/feed.xml\">RSS feed</a></p>\n");

    buf_printf(&frame, "blog(all)[%d]", np);
    static const char *const crumbs[] = { "blog", NULL };
    emit("/blog/", "Blog", NULL, frame.s, crumbs, blog_hints, NULL, &b);
    buf_free(&b), buf_free(&frame);
}

static void page_post(const struct post *p)
{
    struct buf b = {0}, url = {0}, frame = {0};

    buf_printf(&b, "<div class=logs>\n<p class=log-head>%sT00:00:00Z <b>", p->date);
    buf_esc(&b, p->title);
    buf_puts(&b, "</b></p>\n");
    if (p->subtitle && *p->subtitle) {
        buf_puts(&b, "<p class=lede>");
        buf_esc(&b, p->subtitle);
        buf_puts(&b, "</p>\n");
    }
    md_render(&b, p->body, p->blen);
    if (p->originally && url_ok(p->originally, strlen(p->originally))) {
        buf_puts(&b, "<p class=foot-note>First published on <a href=\"");
        buf_esc(&b, p->originally);
        buf_puts(&b, "\">Substack</a>.</p>\n");
    }
    buf_puts(&b, "</div>\n");

    buf_printf(&url, "/blog/%s/", p->slug);
    buf_printf(&frame, "logs(blog/%s)", p->slug);
    static const char *const crumbs[] = { "blog", "logs", NULL };
    emit(url.s, p->title, p->subtitle, frame.s, crumbs, view_hints, "/blog/", &b);
    buf_free(&b), buf_free(&url), buf_free(&frame);
}

static void page_lab(void)
{
    struct buf b = {0};
    buf_puts(&b, "<div class=logs>\n");
    md_file(&b, "lab.md");
    buf_puts(&b, "</div>\n<pre class=describe>\n");
    field(&b, "Nodes Ready", status_get("nodes") ? status_get("nodes") : "n/a");
    field(&b, "CPU", status_get("cpu") ? status_get("cpu") : "n/a");
    field(&b, "Memory", status_get("mem") ? status_get("mem") : "n/a");
    field(&b, "Last Reading", status_get("stamp") ? status_get("stamp") : "n/a");
    buf_puts(&b, "</pre>\n");

    static const char *const crumbs[] = { "clusters", "describe", NULL };
    emit("/lab/", "The Lab", "Live status of the homelab", "describe(clusters/homelab)", crumbs, view_hints, "/", &b);
    buf_free(&b);
}

/* :xray, the tree view: everything on the site, one branch per kind. */
static void page_xray(const struct ini *projects, const struct post *posts, int np, const struct ini *cv)
{
    struct buf b = {0};
    int ndeeds = 0, seen = 0;

    for (int i = 0; i < cv->nsec; i++)
        ndeeds += !strcmp(cv->sec[i].name, "deed");
    buf_puts(&b, "<pre class=xray>\n<span class=x-root>marcos-ashton-iglesias</span>\n");
    buf_printf(&b, "├── <span class=x-kind>projects</span> <span class=f-count>[%d]</span>\n", projects->nsec - 1);
    for (int i = 1; i < projects->nsec; i++) {
        const struct section *s = &projects->sec[i];
        int last = i == projects->nsec - 1;
        buf_printf(&b, "│   %s <a href=\"/projects/%s/\">%s</a> <span class=%s>", last ? "└──" : "├──",
                   s->name, s->name, status_class(sec_get(s, "status")));
        buf_esc(&b, sec_get(s, "status") ? sec_get(s, "status") : "Running");
        buf_printf(&b, "</span>\n│   %s   └── <span class=x-leaf>", last ? " " : "│");
        struct buf lang = {0};
        lower_slug(&lang, sec_get(s, "lang") ? sec_get(s, "lang") : "");
        buf_puts(&b, lang.s ? lang.s : "");
        buf_free(&lang);
        buf_puts(&b, "</span>\n");
    }
    buf_printf(&b, "├── <span class=x-kind>blog</span> <span class=f-count>[%d]</span>\n", np);
    for (int i = 0; i < np; i++) {
        buf_printf(&b, "│   %s <a href=\"/blog/%s/\">", i == np - 1 ? "└──" : "├──", posts[i].slug);
        buf_esc(&b, posts[i].title);
        buf_puts(&b, "</a>\n");
    }
    buf_printf(&b, "└── <span class=x-kind>experience</span> <span class=f-count>[%d]</span>\n", ndeeds);
    for (int i = 0; i < cv->nsec; i++) {
        const struct section *s = &cv->sec[i];
        if (strcmp(s->name, "deed"))
            continue;
        buf_printf(&b, "    %s <span class=y-val>", ++seen == ndeeds ? "└──" : "├──");
        esc_key(&b, s, "title");
        buf_puts(&b, "</span>, ");
        esc_key(&b, s, "where");
        buf_putc(&b, '\n');
    }
    buf_puts(&b, "</pre>\n");

    static const char *const crumbs[] = { "xray", NULL };
    emit("/xray/", "Xray", NULL, "xray(all)", crumbs, view_hints, "/", &b);
    buf_free(&b);
}

/* :events, a life as kubectl get events prints it. */
static void page_events(const struct ini *events)
{
    struct buf b = {0}, frame = {0};
    int n = 0;

    buf_puts(&b, "<table class=k-table data-nav>\n<thead><tr><th>LAST SEEN<span class=sort>&uarr;</span></th>"
                 "<th>TYPE</th><th>REASON</th><th>OBJECT</th><th>MESSAGE</th></tr></thead>\n<tbody>\n");
    for (int i = 0; i < events->nsec; i++) {
        const struct section *s = &events->sec[i];
        if (strcmp(s->name, "event"))
            continue;
        const char *type = sec_get(s, "type");
        buf_printf(&b, "<tr class=%s><td>", type && !strcmp(type, "Warning") ? "ev-warn" : "st-run");
        age(&b, sec_get(s, "date"));
        buf_puts(&b, "</td><td>");
        esc_key(&b, s, "type");
        buf_puts(&b, "</td><td>");
        esc_key(&b, s, "reason");
        buf_puts(&b, "</td><td>");
        esc_key(&b, s, "object");
        buf_puts(&b, "</td><td class=wrap>");
        esc_key(&b, s, "message");
        buf_puts(&b, "</td></tr>\n");
        n++;
    }
    buf_puts(&b, "</tbody>\n</table>\n");

    buf_printf(&frame, "events(all)[%d]", n);
    static const char *const crumbs[] = { "events", NULL };
    emit("/events/", "Events", NULL, frame.s, crumbs, blog_hints, "/", &b);
    buf_free(&b), buf_free(&frame);
}

/* :bench, the Keras nightly benchmarks. content/bench/keras.csv holds every
 * run (tools/bench.py keeps it); a series is one backend, device, model and
 * mode, and its runs are in time order because the file is sorted by time. */
struct run {
    char  *time, *backend, *device, *model, *mode, *commit;
    double sps;
};

struct series {
    const struct run *first;
    int              *idx, n;
};

static void chart(struct buf *b, const char *values);

static struct run *bench_runs;
static int nbench;

static void load_bench(void)
{
    char *file = path(content_dir, "bench/keras.csv");

    if (access(file, R_OK)) {
        free(file);
        return;
    }
    char *text = read_file(file, NULL);
    for (char *line = text, *next; line && *line; line = next) {
        char *eol = strchr(line, '\n');
        next = eol ? eol + 1 : NULL;
        if (eol)
            *eol = '\0';
        if (line == text)
            continue; /* header */
        char *f[7];
        int nf = 0;
        for (char *p = line; nf < 7; nf++) {
            f[nf] = p;
            if (!(p = strchr(p, ','))) {
                nf++;
                break;
            }
            *p++ = '\0';
        }
        if (nf < 6)
            continue;
        bench_runs = realloc(bench_runs, (size_t)(nbench + 1) * sizeof(*bench_runs));
        if (!bench_runs)
            die("out of memory");
        bench_runs[nbench++] = (struct run){ f[0], f[1], f[2], f[3], f[4], nf > 6 ? f[6] : "", atof(f[5]) };
    }
    free(file);
}

static int same_series(const struct run *a, const struct run *b)
{
    return !strcmp(a->backend, b->backend) && !strcmp(a->device, b->device) &&
           !strcmp(a->model, b->model) && !strcmp(a->mode, b->mode);
}

static struct series *group_bench(int *count)
{
    struct series *s = NULL;
    int n = 0;

    for (int i = 0; i < nbench; i++) {
        int k = 0;
        while (k < n && !same_series(s[k].first, &bench_runs[i]))
            k++;
        if (k == n) {
            s = realloc(s, (size_t)(n + 1) * sizeof(*s));
            if (!s)
                die("out of memory");
            s[n++] = (struct series){ &bench_runs[i], NULL, 0 };
        }
        s[k].idx = realloc(s[k].idx, (size_t)(s[k].n + 1) * sizeof(int));
        if (!s[k].idx)
            die("out of memory");
        s[k].idx[s[k].n++] = i;
    }
    *count = n;
    return s;
}

static void series_slug(struct buf *b, const struct run *r)
{
    buf_printf(b, "%s-%s-%s-%s", r->backend, r->device, r->model, r->mode);
}

static void rate(struct buf *b, double v)
{
    if (v >= 1e6)
        buf_printf(b, "%.2fM", v / 1e6);
    else if (v >= 1e3)
        buf_printf(b, "%.1fk", v / 1e3);
    else
        buf_printf(b, "%.0f", v);
}

static int cmp_double(const void *a, const void *b)
{
    double x = *(const double *)a, y = *(const double *)b;

    return (x > y) - (x < y);
}

/* The latest run against the median of the seven before it: below 85% is
 * flagged as a regression, above 115% as an improvement. */
static int verdict(const struct series *s)
{
    double prev[7];
    int n = 0;

    for (int i = s->n - 2; i >= 0 && n < 7; i--)
        prev[n++] = bench_runs[s->idx[i]].sps;
    if (n < 3)
        return 0;
    qsort(prev, (size_t)n, sizeof(double), cmp_double);
    double median = prev[n / 2], last = bench_runs[s->idx[s->n - 1]].sps;
    return last < 0.85 * median ? -1 : last > 1.15 * median ? 1 : 0;
}

static void sparkline(struct buf *b, const struct series *s, int max)
{
    static const char *blocks[] = { "▁", "▂", "▃", "▄", "▅", "▆", "▇", "█" };
    int from = s->n > max ? s->n - max : 0;
    double lo = 1e300, hi = 0;

    for (int i = from; i < s->n; i++) {
        double v = bench_runs[s->idx[i]].sps;
        lo = v < lo ? v : lo;
        hi = v > hi ? v : hi;
    }
    for (int i = from; i < s->n; i++) {
        double v = bench_runs[s->idx[i]].sps;
        int k = hi > lo ? (int)((v - lo) / (hi - lo) * 7.0 + 0.5) : 7;
        buf_puts(b, blocks[k]);
    }
}

static int keras_backend(const char *backend)
{
    return !strcmp(backend, "jax") || !strcmp(backend, "torch") || !strcmp(backend, "openvino") ||
           !strcmp(backend, "tensorflow") || !strcmp(backend, "numpy");
}

static void commit_link(struct buf *b, const struct run *r)
{
    if (!*r->commit) {
        buf_puts(b, "-");
        return;
    }
    if (keras_backend(r->backend)) {
        buf_puts(b, "<a href=\"https://github.com/keras-team/keras/commit/");
        buf_esc(b, r->commit);
        buf_puts(b, "\">");
        buf_esc(b, r->commit);
        buf_puts(b, "</a>");
    } else {
        buf_esc(b, r->commit);
    }
}

static void page_bench_series(const struct series *s)
{
    struct buf b = {0}, url = {0}, frame = {0}, slug = {0}, pct = {0};
    const struct run *first = s->first, *last = &bench_runs[s->idx[s->n - 1]];
    const struct run *best = first;

    for (int i = 0; i < s->n; i++)
        if (bench_runs[s->idx[i]].sps > best->sps)
            best = &bench_runs[s->idx[i]];
    series_slug(&slug, first);

    buf_puts(&b, "<pre class=describe>\n");
    field(&b, "Backend", first->backend);
    field(&b, "Device", first->device);
    field(&b, "Model", first->model);
    field(&b, "Mode", first->mode);
    buf_printf(&b, "<span class=y-key>Runs:</span>%*s<span class=y-val>%d, since %.10s</span>\n", 10, "", s->n, first->time);
    buf_printf(&b, "<span class=y-key>Latest:</span>%*s<span class=y-val>", 8, "");
    rate(&b, last->sps);
    buf_printf(&b, " samples/s on %.10s</span>\n<span class=y-key>Best:</span>%*s<span class=y-val>", last->time, 10, "");
    rate(&b, best->sps);
    buf_printf(&b, " samples/s on %.10s, keras ", best->time);
    commit_link(&b, best);
    buf_puts(&b, "</span>\n</pre>\n");

    int from = s->n > 60 ? s->n - 60 : 0;
    for (int i = from; i < s->n; i++)
        buf_printf(&pct, "%s%d", i > from ? "," : "", (int)(bench_runs[s->idx[i]].sps / best->sps * 100.0 + 0.5));
    buf_puts(&b, "<div class=\"pulse p-bench\">\n<p class=pulse-head>Speed as % of the best run, oldest on the left</p>\n<pre>");
    chart(&b, pct.s ? pct.s : "");
    buf_puts(&b, "</pre>\n</div>\n");

    buf_puts(&b, "<table class=k-table data-nav>\n<thead><tr><th>TIME<span class=sort>&darr;</span></th><th>SAMPLES/S</th>"
                 "<th>&Delta; PREV</th><th>KERAS</th></tr></thead>\n<tbody>\n");
    for (int i = s->n - 1; i >= 0; i--) {
        const struct run *r = &bench_runs[s->idx[i]];
        double prev = i ? bench_runs[s->idx[i - 1]].sps : 0;
        double d = prev > 0 ? (r->sps - prev) / prev * 100.0 : 0;
        buf_printf(&b, "<tr class=%s><td>", d < -15 ? "st-err" : d > 15 ? "st-pend" : "st-run");
        buf_esc(&b, r->time);
        buf_puts(&b, "</td><td>");
        rate(&b, r->sps);
        buf_puts(&b, "</td><td>");
        if (prev > 0)
            buf_printf(&b, "%+.1f%%", d);
        buf_puts(&b, "</td><td>");
        commit_link(&b, r);
        buf_puts(&b, "</td></tr>\n");
    }
    buf_puts(&b, "</tbody>\n</table>\n");

    buf_printf(&url, "/bench/%s/", slug.s);
    buf_printf(&frame, "describe(bench/%s)", slug.s);
    static const char *const crumbs[] = { "bench", "describe", NULL };
    emit(url.s, "Benchmark", NULL, frame.s, crumbs, view_hints, "/bench/", &b);
    buf_free(&b), buf_free(&url), buf_free(&frame), buf_free(&slug), buf_free(&pct);
}

static void page_bench(void)
{
    struct buf b = {0}, frame = {0};
    int ns;
    struct series *s = group_bench(&ns);

    buf_puts(&b, "<div class=logs><p>Keras nightly benchmarks from the homelab, in samples per second, higher is better. "
                 "Every backend trains and runs a small CNN and MLP each night on whatever Keras was at that day. "
                 "The GPU node is clock capped and shares its card with other jobs, so a single dip is usually the "
                 "machine. A drop that stays is worth a look.</p></div>\n");
    if (!ns)
        buf_puts(&b, "<p class=foot-note>No runs yet. tools/bench.py collects them from the homelab.</p>\n");
    else
        buf_puts(&b, "<table class=k-table data-nav>\n<thead><tr><th>BACKEND<span class=sort>&uarr;</span></th><th>DEVICE</th>"
                     "<th>MODEL</th><th>MODE</th><th>LATEST</th><th>&Delta; PREV</th><th>TREND</th><th>RUNS</th>"
                     "<th>STATUS</th></tr></thead>\n<tbody>\n");
    for (int k = 0; k < ns; k++) {
        const struct run *r = s[k].first, *last = &bench_runs[s[k].idx[s[k].n - 1]];
        double prev = s[k].n > 1 ? bench_runs[s[k].idx[s[k].n - 2]].sps : 0;
        int v = verdict(&s[k]);
        struct buf slug = {0};
        series_slug(&slug, r);
        buf_printf(&b, "<tr class=%s><td><a href=\"/bench/%s/\">", v < 0 ? "st-err" : v > 0 ? "st-pend" : "st-run", slug.s);
        buf_esc(&b, r->backend);
        buf_puts(&b, "</a></td><td>");
        buf_esc(&b, r->device);
        buf_puts(&b, "</td><td>");
        buf_esc(&b, r->model);
        buf_puts(&b, "</td><td>");
        buf_esc(&b, r->mode);
        buf_puts(&b, "</td><td>");
        rate(&b, last->sps);
        buf_puts(&b, "</td><td>");
        if (prev > 0)
            buf_printf(&b, "%+.1f%%", (last->sps - prev) / prev * 100.0);
        buf_puts(&b, "</td><td class=spark>");
        sparkline(&b, &s[k], 24);
        buf_printf(&b, "</td><td>%d</td><td>%s</td></tr>\n", s[k].n,
                   v < 0 ? "Regressed" : v > 0 ? "Faster" : "Steady");
        buf_free(&slug);
        page_bench_series(&s[k]);
    }
    if (ns)
        buf_puts(&b, "</tbody>\n</table>\n");

    buf_printf(&frame, "bench(keras)[%d]", ns);
    static const char *const crumbs[] = { "bench", NULL };
    emit("/bench/", "Benchmarks", "Keras nightly benchmark history from the homelab", frame.s, crumbs, list_hints, "/", &b);
    buf_free(&b), buf_free(&frame);
}

/* :pulses, the cluster over the last day as block charts, eight rows high,
 * one column per half hour. */
static void chart(struct buf *b, const char *values)
{
    static const char *blocks[] = { " ", "▁", "▂", "▃", "▄", "▅", "▆", "▇", "█" };
    int v[96], n = 0;

    for (const char *p = values; *p && n < 96;) {
        v[n++] = atoi(p);
        p = strchr(p, ',');
        if (!p)
            break;
        p++;
    }
    for (int row = 7; row >= 0; row--) {
        buf_printf(b, "<span class=axis>%3d%% │</span>", row == 7 ? 100 : row == 0 ? 0 : (row + 1) * 100 / 8);
        for (int i = 0; i < n; i++) {
            int eighths = (v[i] < 0 ? 0 : v[i] > 100 ? 100 : v[i]) * 64 / 100 - row * 8;
            buf_puts(b, blocks[eighths < 0 ? 0 : eighths > 8 ? 8 : eighths]);
        }
        buf_putc(b, '\n');
    }
    buf_puts(b, "<span class=axis>     └");
    for (int i = 0; i < n; i++)
        buf_puts(b, "─");
    buf_printf(b, "</span>\n<span class=axis>      %-*s now</span>\n", n > 4 ? n - 3 : 1,
               n ? "" : "no samples yet");
}

static void page_pulses(const struct ini *pulses)
{
    struct buf b = {0};

    if (!pulses->nsec || pulses->nsec == 1) {
        buf_puts(&b, "<p class=foot-note>No metrics yet. They come from the homelab's Prometheus.</p>\n");
    }
    for (int i = 1; i < pulses->nsec; i++) {
        const struct section *s = &pulses->sec[i];
        const char *vals = sec_get(s, "values");
        if (!vals)
            continue;
        int lo = 100, hi = 0, last = 0, sum = 0, n = 0;
        for (const char *p = vals; *p;) {
            int x = atoi(p);
            lo = x < lo ? x : lo, hi = x > hi ? x : hi, last = x, sum += x, n++;
            if (!(p = strchr(p, ',')))
                break;
            p++;
        }
        buf_printf(&b, "<div class=\"pulse p-%s\">\n<p class=pulse-head>", s->name);
        esc_key(&b, s, "label");
        buf_printf(&b, " <span class=f-count>[%d%%]</span> <span class=axis>min %d%% max %d%% avg %d%%, %d samples, "
                       "one per half hour</span></p>\n<pre>", last, lo, hi, n ? sum / n : 0, n);
        chart(&b, vals);
        buf_puts(&b, "</pre>\n</div>\n");
    }

    static const char *const crumbs[] = { "pulses", NULL };
    emit("/pulses/", "Pulses", "The homelab over the last day", "pulses(cluster/homelab)", crumbs, view_hints, "/", &b);
    buf_free(&b);
}

static void json_str(struct buf *b, const char *s)
{
    buf_putc(b, '"');
    for (; s && *s; s++) {
        unsigned char c = (unsigned char)*s;
        if (c == '"' || c == '\\')
            buf_printf(b, "\\%c", c);
        else if (c < 0x20)
            buf_printf(b, "\\u%04x", c);
        else
            buf_putc(b, (char)c);
    }
    buf_putc(b, '"');
}

/* What the fake shell (s) knows: names and links, nothing it can't show. */
static void shell_json(const struct ini *projects, const struct post *posts, int np, const struct ini *links)
{
    struct buf b = {0}, file = {0};

    buf_puts(&b, "{\"name\":");
    json_str(&b, site_get("title"));
    buf_puts(&b, ",\"tagline\":");
    json_str(&b, site_get("tagline"));
    buf_puts(&b, ",\"email\":");
    json_str(&b, site_get("email"));
    buf_puts(&b, ",\"projects\":[");
    for (int i = 1; i < projects->nsec; i++) {
        const struct section *s = &projects->sec[i];
        buf_puts(&b, i > 1 ? ",{\"id\":" : "{\"id\":");
        json_str(&b, s->name);
        buf_puts(&b, ",\"kind\":");
        json_str(&b, sec_get(s, "type"));
        buf_puts(&b, ",\"status\":");
        json_str(&b, sec_get(s, "status") ? sec_get(s, "status") : "Running");
        buf_putc(&b, '}');
    }
    buf_puts(&b, "],\"posts\":[");
    for (int i = 0; i < np; i++) {
        buf_puts(&b, i ? ",{\"slug\":" : "{\"slug\":");
        json_str(&b, posts[i].slug);
        buf_puts(&b, ",\"title\":");
        json_str(&b, posts[i].title);
        buf_putc(&b, '}');
    }
    buf_puts(&b, "],\"links\":[");
    int first = 1;
    for (int i = 0; i < links->nsec; i++) {
        const struct section *s = &links->sec[i];
        if (strcmp(s->name, "link") || !sec_get(s, "href"))
            continue;
        buf_puts(&b, first ? "{\"name\":" : ",{\"name\":");
        json_str(&b, sec_get(s, "name"));
        buf_puts(&b, ",\"href\":");
        json_str(&b, sec_get(s, "href"));
        buf_putc(&b, '}');
        first = 0;
    }
    buf_puts(&b, "]}\n");

    buf_printf(&file, "%s/shell.json", out_dir);
    write_file(file.s, &b);
    buf_free(&b), buf_free(&file);
}

/* Netlify serves /404.html for anything it cannot find. k9s.js fills in
 * the path that was asked for. */
static void page_404(void)
{
    struct buf b = {0};
    static const char *routes[][2] = {
        { "/", ":projects" }, { "/blog/", ":blog" }, { "/about/", ":about" }, { "/lab/", ":lab" },
    };
    static const char *what[] = {
        "everything I have built", "what I have written", "who I am", "the cluster serving this page",
    };

    size_t len;
    char *file = path(content_dir, "404.txt");
    char *art = read_file(file, &len);

    buf_puts(&b, "<pre class=art>");
    buf_escn(&b, art, len);
    buf_puts(&b, "</pre>\n");
    free(art);
    free(file);
    buf_puts(&b, "<pre class=describe>\n<span class=flash-err>Error from server (NotFound): pages "
                 "\"<span data-path>this page</span>\" not found</span>\n<span class=y-key>Reason:</span> <span class=y-val "
                 "data-reason>NotFound</span>\n\n<span class=y-key>Try one of:</span>\n");
    for (size_t i = 0; i < sizeof(routes) / sizeof(routes[0]); i++)
        buf_printf(&b, "  <a href=\"%s\">%s</a>%*s<span class=y-val>%s</span>\n", routes[i][0], routes[i][1],
                   (int)(12 - strlen(routes[i][1])), "", what[i]);
    buf_puts(&b, "</pre>\n");

    static const char *const crumbs[] = { "pages", "404", NULL };
    emit("/404.html", "Not found", NULL, "describe(pages/not-found)", crumbs, view_hints, "/", &b);
    buf_free(&b);
}

static void feed(const struct post *posts, int np)
{
    struct buf b = {0}, file = {0};
    const char *base = site_get("url");

    buf_puts(&b, "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n<feed xmlns=\"http://www.w3.org/2005/Atom\">\n<title>");
    buf_esc(&b, site_get("title"));
    buf_printf(&b, "</title>\n<link href=\"%s/blog/feed.xml\" rel=\"self\"/>\n"
                   "<link href=\"%s/blog/\"/>\n<id>%s/blog/</id>\n<author><name>", base, base, base);
    buf_esc(&b, site_get("title"));
    buf_printf(&b, "</name></author>\n<updated>%sT00:00:00Z</updated>\n", np ? posts[0].date : "2026-01-01");

    for (int i = 0; i < np && i < 20; i++) {
        struct buf html = {0};
        md_render(&html, posts[i].body, posts[i].blen);
        buf_puts(&b, "<entry>\n<title>");
        buf_esc(&b, posts[i].title);
        buf_printf(&b, "</title>\n<link href=\"%s/blog/%s/\"/>\n<id>%s/blog/%s/</id>\n"
                       "<updated>%sT00:00:00Z</updated>\n<content type=\"html\">",
                   base, posts[i].slug, base, posts[i].slug, posts[i].date);
        buf_escn(&b, html.s ? html.s : "", html.len);
        buf_puts(&b, "</content>\n</entry>\n");
        buf_free(&html);
    }
    buf_puts(&b, "</feed>\n");

    buf_printf(&file, "%s/blog/feed.xml", out_dir);
    write_file(file.s, &b);
    buf_free(&b), buf_free(&file);
}

int main(int argc, char **argv)
{
    if (argc == 4) {
        content_dir = argv[1];
        tmpl_dir = argv[2];
        out_dir = argv[3];
    } else if (argc != 1) {
        fprintf(stderr, "usage: forge [content templates out]\n");
        return 2;
    }

    /* SOURCE_DATE_EPOCH pins the clock for reproducible builds. */
    const char *epoch = getenv("SOURCE_DATE_EPOCH");
    now = epoch ? (time_t)strtoll(epoch, NULL, 10) : time(NULL);

    layout = read_file(path(tmpl_dir, "layout.html"), NULL);
    site = ini_load(path(content_dir, "site.ini"));
    struct ini projects = ini_load(path(content_dir, "projects.ini"));
    struct ini cv = ini_load(path(content_dir, "cv.ini"));
    struct ini links = ini_load(path(content_dir, "links.ini"));
    struct ini events = ini_load(path(content_dir, "events.ini"));

    /* tools/metrics.py writes pulses.ini next to status.ini */
    struct ini pulses = {0};
    char *pf = path(content_dir, "pulses.ini");
    if (!access(pf, R_OK))
        pulses = ini_load(pf);

    /* The cluster writes status.ini. Without it the header says n/a. */
    char *st = path(content_dir, "status.ini");
    if (!access(st, R_OK))
        status = ini_load(st);

    int np;
    struct post *posts = load_posts(&np);
    load_bench();

    page_projects(&projects);
    for (int i = 1; i < projects.nsec; i++) {
        page_project(&projects.sec[i]);
        page_logs(&projects.sec[i]);
    }
    page_about(&cv, &links);
    page_blog(posts, np);
    for (int i = 0; i < np; i++)
        page_post(&posts[i]);
    page_lab();
    page_xray(&projects, posts, np, &cv);
    page_events(&events);
    page_pulses(&pulses);
    page_bench();
    page_404();
    feed(posts, np);
    shell_json(&projects, posts, np, &links);

    printf("forge: %d posts, %d projects -> %s\n", np, projects.nsec - 1, out_dir);
    return 0;
}
