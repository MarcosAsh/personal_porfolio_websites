#ifndef FORGE_H
#define FORGE_H

#include <stddef.h>

struct buf {
    char  *s;
    size_t len, cap;
};

void buf_putn(struct buf *b, const char *s, size_t n);
void buf_puts(struct buf *b, const char *s);
void buf_putc(struct buf *b, char c);
void buf_printf(struct buf *b, const char *fmt, ...)
    __attribute__((format(printf, 2, 3)));
/* HTML-escaped copy of s[0..n), safe in text and in double-quoted attributes. */
void buf_escn(struct buf *b, const char *s, size_t n);
void buf_esc(struct buf *b, const char *s);
void buf_free(struct buf *b);

_Noreturn void die(const char *fmt, ...) __attribute__((format(printf, 1, 2)));
void *xmalloc(size_t n);
char *xstrndup(const char *s, size_t n);

char *read_file(const char *path, size_t *len);
/* Writes path, creating any missing parent directories. */
void write_file(const char *path, const struct buf *b);

struct kv {
    char *key, *val;
};

struct section {
    char      *name;
    struct kv *kv;
    int        nkv;
};

struct ini {
    struct section *sec;
    int             nsec;
};

/* Sections and keys may repeat; both keep file order. Keys before the
 * first header go into a section with an empty name. */
struct ini ini_load(const char *path);
const char *sec_get(const struct section *s, const char *key);

/* Markdown to HTML. Raw HTML in the source is escaped, never passed through. */
void md_render(struct buf *out, const char *src, size_t len);
/* True if url is safe to put in href/src: http(s), mailto, or site-relative. */
int url_ok(const char *url, size_t n);

#endif
