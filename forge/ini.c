#include <ctype.h>
#include <stdlib.h>
#include <string.h>

#include "forge.h"

static char *trim(char *s, char *end)
{
    while (s < end && isspace((unsigned char)*s))
        s++;
    while (end > s && isspace((unsigned char)end[-1]))
        end--;
    return xstrndup(s, (size_t)(end - s));
}

static struct section *add_section(struct ini *ini, char *name)
{
    ini->sec = realloc(ini->sec, (size_t)(ini->nsec + 1) * sizeof(*ini->sec));
    if (!ini->sec)
        die("out of memory");
    ini->sec[ini->nsec] = (struct section){ .name = name };
    return &ini->sec[ini->nsec++];
}

struct ini ini_load(const char *path)
{
    struct ini ini = {0};
    char *text = read_file(path, NULL);
    struct section *cur = add_section(&ini, xstrndup("", 0));
    int lineno = 0;

    for (char *line = text, *next; line && *line; line = next) {
        char *eol = strchr(line, '\n');
        next = eol ? eol + 1 : NULL;
        if (!eol)
            eol = line + strlen(line);
        lineno++;

        char *p = line;
        while (p < eol && isspace((unsigned char)*p))
            p++;
        if (p == eol || *p == '#' || *p == ';')
            continue;

        if (*p == '[') {
            char *close = memchr(p, ']', (size_t)(eol - p));
            if (!close)
                die("%s:%d: unterminated section header", path, lineno);
            cur = add_section(&ini, trim(p + 1, close));
            continue;
        }

        char *eq = memchr(p, '=', (size_t)(eol - p));
        if (!eq)
            die("%s:%d: expected key = value", path, lineno);
        cur->kv = realloc(cur->kv, (size_t)(cur->nkv + 1) * sizeof(*cur->kv));
        if (!cur->kv)
            die("out of memory");
        cur->kv[cur->nkv++] = (struct kv){ trim(p, eq), trim(eq + 1, eol) };
    }
    free(text);
    return ini;
}

const char *sec_get(const struct section *s, const char *key)
{
    for (int i = 0; i < s->nkv; i++)
        if (!strcmp(s->kv[i].key, key))
            return s->kv[i].val;
    return NULL;
}
