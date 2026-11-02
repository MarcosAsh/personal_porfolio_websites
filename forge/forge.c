#include <ctype.h>
#include <dirent.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
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

static char *layout, *icons;
static struct ini site, status;

static const char *months[] = {
    "January", "February", "March", "April", "May", "June", "July",
    "August", "September", "October", "November", "December",
};

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

static const char *status_get(const char *key)
{
    const char *v = status.nsec ? sec_get(&status.sec[0], key) : NULL;

    return v ? v : "?";
}

static int date_parts(const char *date, int *y, int *m, int *d)
{
    return sscanf(date, "%4d-%2d-%2d", y, m, d) == 3 && *m >= 1 && *m <= 12;
}

static void long_date(struct buf *b, const char *date)
{
    int y, m, d;

    if (date_parts(date, &y, &m, &d))
        buf_printf(b, "%d %s %d", d, months[m - 1], y);
    else
        buf_esc(b, date);
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

/* The pages are a Frutiger Aero desktop: a login splash at the root, then a
 * glass box with a Messenger-style sidebar and tabs across the top. */

struct tab {
    const char *href, *label;
};

static const struct tab tabs[] = {
    { "/home/", "Home" }, { "/projects/", "Projects" }, { "/about/", "About" },
    { "/blog/", "Blog" }, { "/lab/", "Lab" },
};

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

static void sidebar_links(struct buf *b, const struct ini *links)
{
    for (int i = 0; i < links->nsec; i++) {
        const struct section *s = &links->sec[i];
        const char *href = sec_get(s, "href");
        if (strcmp(s->name, "link") || !href || !url_ok(href, strlen(href)))
            continue;
        buf_puts(b, "<a class=\"msn-button glass\" href=\"");
        buf_esc(b, href);
        buf_puts(b, "\"><svg class=glyph aria-hidden=true><use href=\"#i-");
        esc_key(b, s, "icon");
        buf_puts(b, "\"/></svg><span>");
        esc_key(b, s, "name");
        buf_puts(b, "</span></a>\n");
    }
}

static void meter(struct buf *b, const char *label, const char *key)
{
    int p = atoi(status_get(key));

    p = p < 0 ? 0 : p > 100 ? 100 : p;
    buf_printf(b, "<div class=meter><span>%s</span><b>", label);
    buf_esc(b, status_get(key));
    buf_printf(b, "%%</b><div class=bar><i style=\"width:%d%%\"></i></div></div>\n", p);
}

/* Shown only once the cluster has written status.ini, so a build anywhere
 * else never publishes made-up numbers. */
static void gadget(struct buf *b)
{
    if (!status.nsec)
        return;
    buf_puts(b, "<a class=\"gadget glass\" href=\"/lab/\">\n<span class=gadget-title>Homelab</span>\n");
    meter(b, "CPU", "cpu");
    meter(b, "Memory", "mem");
    buf_puts(b, "<span class=gadget-foot>");
    buf_esc(b, status_get("nodes"));
    buf_puts(b, " nodes ready</span>\n</a>\n");
}

/* Writes url (like "/blog/x/") as out/blog/x/index.html inside the layout. */
static void emit(const char *url, const char *title, const char *desc, const struct buf *body,
                 const struct ini *links)
{
    struct buf page = {0}, tb = {0}, lb = {0}, gb = {0}, t = {0}, d = {0}, file = {0};

    for (size_t i = 0; i < sizeof(tabs) / sizeof(tabs[0]); i++) {
        int on = !strncmp(url, tabs[i].href, strlen(tabs[i].href));
        buf_printf(&tb, "<a class=\"tab%s\" href=\"%s\"%s>%s</a>", on ? " active" : "", tabs[i].href,
                   on ? " aria-current=page" : "", tabs[i].label);
    }
    sidebar_links(&lb, links);
    gadget(&gb);
    if (title) {
        buf_esc(&t, title);
        buf_puts(&t, " - ");
    }
    buf_esc(&t, site_get("title"));
    buf_esc(&d, desc ? desc : site_get("tagline"));

    struct var vars[] = {
        { "title", t.s }, { "description", d.s }, { "tabs", tb.s }, { "links", lb.s ? lb.s : "" },
        { "gadget", gb.s }, { "content", body->s ? body->s : "" }, { "icons", icons },
        { "site_title", site_get("title") }, { "tagline", site_get("tagline") }, { NULL, NULL },
    };
    fill(&page, layout, vars);

    size_t ul = strlen(url);
    if (ul && url[ul - 1] == '/')
        buf_printf(&file, "%s%sindex.html", out_dir, url);
    else
        buf_printf(&file, "%s%s", out_dir, url);
    write_file(file.s, &page);

    buf_free(&page), buf_free(&tb), buf_free(&lb), buf_free(&gb);
    buf_free(&t), buf_free(&d), buf_free(&file);
}

static void page_splash(void)
{
    struct buf page = {0}, file = {0};
    char *tmpl = read_file(path(tmpl_dir, "splash.html"), NULL);
    struct var vars[] = {
        { "site_title", site_get("title") }, { "tagline", site_get("tagline") }, { NULL, NULL },
    };

    fill(&page, tmpl, vars);
    buf_printf(&file, "%s/index.html", out_dir);
    write_file(file.s, &page);
    buf_free(&page), buf_free(&file);
    free(tmpl);
}

static void messages(struct buf *b, const struct post *posts, int np, int max)
{
    buf_puts(b, "<div class=messages>\n");
    for (int i = 0; i < np && i < max; i++) {
        buf_printf(b, "<a class=\"message glass\" href=\"/blog/%s/\">\n<span class=title>", posts[i].slug);
        buf_esc(b, posts[i].title);
        buf_puts(b, "</span>\n<span class=date>");
        long_date(b, posts[i].date);
        buf_printf(b, " &middot; %d min read</span>\n", read_minutes(posts[i].body, posts[i].blen));
        if (posts[i].subtitle && *posts[i].subtitle) {
            buf_puts(b, "<span class=preview>");
            buf_esc(b, posts[i].subtitle);
            buf_puts(b, "</span>\n");
        }
        buf_puts(b, "</a>\n");
    }
    buf_puts(b, "</div>\n");
}

static void page_home(const struct post *posts, int np, const struct ini *links)
{
    struct buf b = {0};
    static const struct { const char *img, *id, *name, *what; } featured[] = {
        { "saddle", "saddle", "Saddle", "Optimisers racing across loss surfaces" },
        { "lattice", "lattice", "Lattice", "A wind tunnel on the GPU" },
        { "gpu-node", "homelab", "The Homelab", "The cluster serving this page" },
    };

    buf_puts(&b, "<div class=main-title><h1>Hi, I'm Marcos</h1><span>Systems, ML performance and hardware</span></div>\n"
                 "<div class=\"card glass prose\">\n");
    md_file(&b, "intro.md");
    buf_puts(&b, "</div>\n<h2>Featured</h2>\n<div class=discover-grid>\n");
    for (size_t i = 0; i < sizeof(featured) / sizeof(featured[0]); i++)
        buf_printf(&b, "<a class=\"discover-item glass\" href=\"/projects/#%s\"><img src=\"/img/%s.webp\" "
                       "width=480 height=300 alt=\"\" loading=lazy><span class=name>%s</span><span class=what>%s</span></a>\n",
                   featured[i].id, featured[i].img, featured[i].name, featured[i].what);
    buf_puts(&b, "</div>\n<h2>Notable work</h2>\n<div class=\"card glass prose\">\n");
    md_file(&b, "deeds.md");
    buf_puts(&b, "</div>\n<h2>Latest from the blog</h2>\n");
    messages(&b, posts, np, 3);

    emit("/home/", NULL, NULL, &b, links);
    buf_free(&b);
}

static void link_button(struct buf *b, const struct section *s, const char *key, const char *label)
{
    const char *href = sec_get(s, key);

    if (!href)
        return;
    if (!url_ok(href, strlen(href)))
        die("projects.ini [%s]: bad %s url", s->name, key);
    buf_puts(b, "<a class=\"enter-button glass\" href=\"");
    buf_esc(b, href);
    buf_printf(b, "\">%s <svg class=go aria-hidden=true><use href=\"#i-go\"/></svg></a>\n", label);
}

static void page_projects(const struct ini *projects, const struct ini *links)
{
    struct buf b = {0};

    buf_puts(&b, "<div class=main-title><h1>Projects</h1><span>Things I have built</span></div>\n<div class=\"discover-grid icons\">\n");
    for (int i = 1; i < projects->nsec; i++) {
        const struct section *s = &projects->sec[i];
        if (!sec_get(s, "name") || !sec_get(s, "icon"))
            die("projects.ini [%s]: needs a name and an icon", s->name);
        buf_printf(&b, "<a class=\"discover-item glass\" href=\"#%s\"><span class=orb><svg aria-hidden=true><use href=\"#i-",
                   s->name);
        esc_key(&b, s, "icon");
        buf_puts(&b, "\"/></svg></span><span class=name>");
        esc_key(&b, s, "name");
        buf_puts(&b, "</span><span class=what>");
        esc_key(&b, s, "type");
        buf_puts(&b, "</span></a>\n");
    }
    buf_puts(&b, "</div>\n");

    for (int i = 1; i < projects->nsec; i++) {
        const struct section *s = &projects->sec[i];
        buf_printf(&b, "<section class=project id=\"%s\">\n<h2>", s->name);
        esc_key(&b, s, "name");
        buf_puts(&b, "</h2>\n<div class=project-flex>\n<div class=\"meta-data glass\">\n<span class=k>Kind</span><span>");
        esc_key(&b, s, "type");
        buf_puts(&b, "</span>\n<span class=k>Built with</span><span>");
        esc_key(&b, s, "lang");
        buf_puts(&b, "</span>\n");
        if (sec_get(s, "set")) {
            buf_puts(&b, "<span class=k>Part of</span><span>");
            esc_key(&b, s, "set");
            buf_puts(&b, "</span>\n");
        }
        buf_puts(&b, "</div>\n<div class=\"project-description glass\">\n<ul>\n");
        for (int k = 0; k < s->nkv; k++) {
            if (strcmp(s->kv[k].key, "stat"))
                continue;
            buf_puts(&b, "<li>");
            buf_esc(&b, s->kv[k].val);
            buf_puts(&b, "</li>\n");
        }
        buf_puts(&b, "</ul>\n");
        if (sec_get(s, "flavour")) {
            buf_puts(&b, "<p class=note>");
            esc_key(&b, s, "flavour");
            buf_puts(&b, "</p>\n");
        }
        buf_puts(&b, "</div>\n</div>\n<div class=buttons>\n");
        link_button(&b, s, "repo", "Source");
        link_button(&b, s, "demo", "Demo");
        link_button(&b, s, "paper", "Preprint");
        link_button(&b, s, "visit", "Visit");
        buf_puts(&b, "</div>\n</section>\n");
    }

    emit("/projects/", "Projects", "Projects by Marcos Ashton Iglesias", &b, links);
    buf_free(&b);
}

static void page_about(const struct ini *cv, const struct ini *links)
{
    struct buf b = {0};

    buf_puts(&b, "<div class=main-title><h1>About</h1><span>Experience and skills</span></div>\n<div class=\"meta-data glass wide\">\n");
    for (int i = 0; i < cv->nsec; i++) {
        const struct section *s = &cv->sec[i];
        if (!strcmp(s->name, "sheet")) {
            buf_puts(&b, "<span class=k>Studying</span><span>");
            esc_key(&b, s, "level");
            buf_puts(&b, ", ");
            esc_key(&b, s, "realm");
            buf_puts(&b, "</span>\n");
        } else if (!strcmp(s->name, "attribute")) {
            buf_puts(&b, "<span class=k>");
            esc_key(&b, s, "name");
            buf_puts(&b, "</span><span>");
            esc_key(&b, s, "value");
            buf_puts(&b, "</span>\n");
        }
    }
    buf_puts(&b, "</div>\n<h2>Experience</h2>\n");
    for (int i = 0; i < cv->nsec; i++) {
        const struct section *s = &cv->sec[i];
        if (strcmp(s->name, "deed"))
            continue;
        buf_puts(&b, "<div class=\"project-description glass job\">\n<span class=title>");
        esc_key(&b, s, "title");
        buf_puts(&b, "</span>\n<span class=date>");
        esc_key(&b, s, "where");
        buf_puts(&b, " &middot; ");
        esc_key(&b, s, "when");
        buf_puts(&b, "</span>\n<ul>\n");
        for (int k = 0; k < s->nkv; k++) {
            if (strcmp(s->kv[k].key, "point"))
                continue;
            buf_puts(&b, "<li>");
            buf_esc(&b, s->kv[k].val);
            buf_puts(&b, "</li>\n");
        }
        buf_puts(&b, "</ul>\n</div>\n");
    }
    for (int i = 0; i < cv->nsec; i++) {
        const struct section *s = &cv->sec[i];
        if (strcmp(s->name, "lore"))
            continue;
        buf_puts(&b, "<h2>Publication</h2>\n<div class=\"card glass\"><a href=\"");
        esc_key(&b, s, "href");
        buf_puts(&b, "\">");
        esc_key(&b, s, "title");
        buf_puts(&b, "</a><br><span class=date>");
        esc_key(&b, s, "when");
        buf_puts(&b, "</span></div>\n");
    }

    emit("/about/", "About", "Experience and skills of Marcos Ashton Iglesias", &b, links);
    buf_free(&b);
}

static void page_blog(const struct post *posts, int np, const struct ini *links)
{
    struct buf b = {0};

    buf_puts(&b, "<div class=main-title><h1>Blog</h1><span>Open source, performance and things I build</span></div>\n");
    messages(&b, posts, np, np);
    buf_puts(&b, "<p class=feed><a href=\"/blog/feed.xml\">Follow by RSS</a></p>\n");
    emit("/blog/", "Blog", NULL, &b, links);
    buf_free(&b);
}

static void page_post(const struct post *p, const struct ini *links)
{
    struct buf b = {0}, url = {0};

    buf_puts(&b, "<article class=\"card glass prose post\">\n<span class=date>");
    long_date(&b, p->date);
    buf_printf(&b, " &middot; %d min read</span>\n<h1>", read_minutes(p->body, p->blen));
    buf_esc(&b, p->title);
    buf_puts(&b, "</h1>\n");
    if (p->subtitle && *p->subtitle) {
        buf_puts(&b, "<p class=lede>");
        buf_esc(&b, p->subtitle);
        buf_puts(&b, "</p>\n");
    }
    md_render(&b, p->body, p->blen);
    if (p->originally && url_ok(p->originally, strlen(p->originally))) {
        buf_puts(&b, "<p class=note>First published on <a href=\"");
        buf_esc(&b, p->originally);
        buf_puts(&b, "\">Substack</a>.</p>\n");
    }
    buf_puts(&b, "</article>\n<div class=buttons><a class=\"enter-button glass\" href=\"/blog/\">Back to the blog "
                 "<svg class=go aria-hidden=true><use href=\"#i-go\"/></svg></a></div>\n");

    buf_printf(&url, "/blog/%s/", p->slug);
    emit(url.s, p->title, p->subtitle, &b, links);
    buf_free(&b), buf_free(&url);
}

static void page_lab(const struct ini *links)
{
    struct buf b = {0};

    buf_puts(&b, "<div class=main-title><h1>The Lab</h1><span>Live from the homelab</span></div>\n<div class=\"card glass prose\">\n");
    md_file(&b, "lab.md");
    buf_puts(&b, "</div>\n<div class=\"meta-data glass wide\">\n");
    static const char *rows[][2] = {
        { "nodes", "Nodes ready" }, { "cpu", "CPU in use" }, { "mem", "Memory in use" }, { "stamp", "Last reading" },
    };
    for (size_t i = 0; i < sizeof(rows) / sizeof(rows[0]); i++) {
        buf_printf(&b, "<span class=k>%s</span><span>", rows[i][1]);
        buf_esc(&b, status_get(rows[i][0]));
        buf_puts(&b, i == 1 || i == 2 ? "%" : "");
        buf_puts(&b, "</span>\n");
    }
    buf_puts(&b, "</div>\n");
    emit("/lab/", "The Lab", "Live status of the homelab and benchmarks", &b, links);
    buf_free(&b);
}

static void page_404(const struct ini *links)
{
    struct buf b = {0};

    buf_puts(&b, "<div class=main-title><h1>Page not found</h1><span>Nothing lives at this address</span></div>\n"
                 "<div class=buttons><a class=\"enter-button glass\" href=\"/home/\">Take me home "
                 "<svg class=go aria-hidden=true><use href=\"#i-go\"/></svg></a></div>\n");
    emit("/404.html", "Not found", NULL, &b, links);
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

    layout = read_file(path(tmpl_dir, "layout.html"), NULL);
    icons = read_file(path(tmpl_dir, "icons.svg"), NULL);
    site = ini_load(path(content_dir, "site.ini"));
    struct ini projects = ini_load(path(content_dir, "projects.ini"));
    struct ini cv = ini_load(path(content_dir, "cv.ini"));
    struct ini links = ini_load(path(content_dir, "links.ini"));

    /* The cluster writes status.ini. Without it the gadget reads "?". */
    char *st = path(content_dir, "status.ini");
    if (!access(st, R_OK))
        status = ini_load(st);

    int np;
    struct post *posts = load_posts(&np);

    page_splash();
    page_home(posts, np, &links);
    page_projects(&projects, &links);
    page_about(&cv, &links);
    page_blog(posts, np, &links);
    for (int i = 0; i < np; i++)
        page_post(&posts[i], &links);
    page_lab(&links);
    page_404(&links);
    feed(posts, np);

    printf("forge: %d posts, %d projects -> %s\n", np, projects.nsec - 1, out_dir);
    return 0;
}
