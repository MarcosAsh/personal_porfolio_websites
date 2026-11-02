#include <errno.h>
#include <stdarg.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/stat.h>

#include "forge.h"

void die(const char *fmt, ...)
{
    va_list ap;

    va_start(ap, fmt);
    fputs("forge: ", stderr);
    vfprintf(stderr, fmt, ap);
    va_end(ap);
    fputc('\n', stderr);
    exit(1);
}

void *xmalloc(size_t n)
{
    void *p = malloc(n);

    if (!p)
        die("out of memory");
    return p;
}

char *xstrndup(const char *s, size_t n)
{
    char *p = xmalloc(n + 1);

    memcpy(p, s, n);
    p[n] = '\0';
    return p;
}

static void grow(struct buf *b, size_t need)
{
    if (b->len + need + 1 <= b->cap)
        return;
    size_t cap = b->cap ? b->cap : 256;
    while (cap < b->len + need + 1)
        cap *= 2;
    b->s = realloc(b->s, cap);
    if (!b->s)
        die("out of memory");
    b->cap = cap;
}

void buf_putn(struct buf *b, const char *s, size_t n)
{
    grow(b, n);
    memcpy(b->s + b->len, s, n);
    b->len += n;
    b->s[b->len] = '\0';
}

void buf_puts(struct buf *b, const char *s)
{
    buf_putn(b, s, strlen(s));
}

void buf_putc(struct buf *b, char c)
{
    buf_putn(b, &c, 1);
}

void buf_printf(struct buf *b, const char *fmt, ...)
{
    va_list ap;

    va_start(ap, fmt);
    int n = vsnprintf(NULL, 0, fmt, ap);
    va_end(ap);
    if (n < 0)
        die("bad format: %s", fmt);

    grow(b, (size_t)n);
    va_start(ap, fmt);
    vsnprintf(b->s + b->len, (size_t)n + 1, fmt, ap);
    va_end(ap);
    b->len += (size_t)n;
}

void buf_escn(struct buf *b, const char *s, size_t n)
{
    for (size_t i = 0; i < n; i++) {
        switch (s[i]) {
        case '&': buf_puts(b, "&amp;");  break;
        case '<': buf_puts(b, "&lt;");   break;
        case '>': buf_puts(b, "&gt;");   break;
        case '"': buf_puts(b, "&quot;"); break;
        case '\'': buf_puts(b, "&#39;"); break;
        default:  buf_putc(b, s[i]);
        }
    }
}

void buf_esc(struct buf *b, const char *s)
{
    buf_escn(b, s, strlen(s));
}

void buf_free(struct buf *b)
{
    free(b->s);
    *b = (struct buf){0};
}

char *read_file(const char *path, size_t *len)
{
    FILE *f = fopen(path, "rb");
    struct buf b = {0};
    char chunk[8192];
    size_t n;

    if (!f)
        die("%s: %s", path, strerror(errno));
    while ((n = fread(chunk, 1, sizeof(chunk), f)) > 0)
        buf_putn(&b, chunk, n);
    if (ferror(f))
        die("%s: read error", path);
    fclose(f);
    if (!b.s)
        buf_putn(&b, "", 0);
    if (len)
        *len = b.len;
    return b.s;
}

static void mkdirs(char *path)
{
    for (char *p = path + 1; *p; p++) {
        if (*p != '/')
            continue;
        *p = '\0';
        if (mkdir(path, 0755) && errno != EEXIST)
            die("mkdir %s: %s", path, strerror(errno));
        *p = '/';
    }
}

void write_file(const char *path, const struct buf *b)
{
    char *dir = xstrndup(path, strlen(path));
    FILE *f;

    mkdirs(dir);
    free(dir);
    if (!(f = fopen(path, "wb")))
        die("%s: %s", path, strerror(errno));
    if (fwrite(b->s, 1, b->len, f) != b->len || fclose(f))
        die("%s: write error", path);
}
