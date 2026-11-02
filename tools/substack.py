#!/usr/bin/env python3
"""Brings new posts over from Substack (marcosashton.substack.com).

Any public post whose slug isn't in content/posts yet is converted to
Markdown, its images saved under static/chronicle/img. Posts already here
are never touched, so edits made on the site survive. Standard library only,
so it runs in a bare python image in the cluster.
Usage: python3 tools/substack.py [--force DIR]  (--force re-imports everything into DIR, for testing)
"""
import json
import os
import re
import sys
import urllib.request
from html.parser import HTMLParser

SITE = "https://marcosashton.substack.com"
POSTS = "content/posts"
IMAGES = "static/chronicle/img"
UA = {"User-Agent": "marcos-website-import/1.0 (+https://marcos-ashton-personal-portfolio.netlify.app)"}


def fetch(url):
    with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=30) as r:
        return r.read()


class Converter(HTMLParser):
    """The subset of HTML Substack writes, to the Markdown forge reads."""

    SKIP_TAGS = {"script", "style", "button", "svg", "form", "iframe", "source"}
    SKIP_CLASSES = ("subscription-widget", "button-wrapper", "captioned-button", "image-link-expand",
                    "footnote-anchor", "post-ufi", "share")
    # Substack small headings (h4 to h6) read better as plain subheadings here
    HEADINGS = {"h1": "# ", "h2": "## ", "h3": "### ", "h4": "### ", "h5": "### ", "h6": "### "}

    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.blocks = []       # (kind, text)
        self.inline = []
        self.skip = []         # tags we are inside of and ignoring
        self.lists = []        # ["ul"|"ol", counter]
        self.quote = 0
        self.links = []
        self.pre = None
        self.figure = None     # [src, alt, caption parts] while inside <figure>
        self.in_caption = False
        self.images = []

    def emit(self, kind="p"):
        text = re.sub(r"[ \t]+\n", "\n", "".join(self.inline)).strip()
        self.inline = []
        if text and not re.fullmatch(r"(\s*(-|\d+\.)\s*)", text):
            self.blocks.append((kind, "\n".join("> " * self.quote + line for line in text.split("\n"))))

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        cls = a.get("class") or ""
        if self.skip:
            if tag not in ("img", "br", "hr", "source", "input"):
                self.skip.append(tag)
            return
        if tag in self.SKIP_TAGS or any(c in cls for c in self.SKIP_CLASSES):
            if tag not in ("img", "br", "hr", "source", "input"):
                self.skip.append(tag)
            return
        if self.pre is not None:
            return
        if tag in self.HEADINGS:
            self.emit()
            self.inline.append(self.HEADINGS[tag])
        elif tag == "p":
            if not (self.lists and self.inline):
                self.emit()
        elif tag in ("ul", "ol"):
            self.emit("li" if self.lists else "p")
            self.lists.append([tag, 0])
        elif tag == "li":
            self.emit("li")
            kind = self.lists[-1] if self.lists else ["ul", 0]
            kind[1] += 1
            marker = "- " if kind[0] == "ul" else f"{kind[1]}. "
            self.inline.append("  " * (len(self.lists) - 1) + marker)
        elif tag == "blockquote":
            self.emit()
            self.quote += 1
        elif tag == "pre":
            self.emit()
            self.pre = []
        elif tag == "hr":
            self.emit()
            self.blocks.append(("p", "---"))
        elif tag == "br":
            self.inline.append("  \n")
        elif tag in ("strong", "b"):
            self.inline.append("**")
        elif tag in ("em", "i"):
            self.inline.append("*")
        elif tag == "code":
            self.inline.append("`")
        elif tag == "a":
            self.links.append((a.get("href") or "", len(self.inline)))
        elif tag == "figure":
            self.emit()
            self.figure = ["", "", []]
        elif tag == "figcaption":
            self.in_caption = True
        elif tag == "img":
            src = a.get("src") or ""
            if not src:
                return
            self.images.append(src)
            if self.figure is not None:
                if not self.figure[0]:
                    self.figure[0], self.figure[1] = src, a.get("alt") or ""
            else:
                self.inline.append(f"![{(a.get('alt') or '').replace(']', '')}]({src})")

    def handle_endtag(self, tag):
        if self.skip:
            if self.skip[-1] == tag:
                self.skip.pop()
            return
        if self.pre is not None:
            if tag == "pre":
                self.blocks.append(("p", "```\n" + "".join(self.pre).strip("\n") + "\n```"))
                self.pre = None
            return
        if tag in self.HEADINGS or tag == "p":
            if not self.lists:
                self.emit()
        elif tag == "li":
            self.emit("li")
        elif tag in ("ul", "ol"):
            self.emit("li")
            if self.lists:
                self.lists.pop()
        elif tag == "blockquote":
            self.emit()
            self.quote = max(0, self.quote - 1)
        elif tag in ("strong", "b"):
            self.inline.append("**")
        elif tag in ("em", "i"):
            self.inline.append("*")
        elif tag == "code":
            self.inline.append("`")
        elif tag == "a" and self.links:
            href, start = self.links.pop()
            text = "".join(self.inline[start:]).strip()
            del self.inline[start:]
            if href.startswith(("http://", "https://")) and text and not text.startswith("!["):
                self.inline.append(f"[{text}]({href})")
            else:
                self.inline.append(text)
        elif tag == "figcaption":
            self.in_caption = False
        elif tag == "figure" and self.figure is not None:
            src, alt, caption = self.figure
            cap = re.sub(r"\s+", " ", "".join(caption)).strip()
            if src:
                text = f"![{(alt or cap).replace(']', '')}]({src})"
                self.blocks.append(("p", text + (f"\n*{cap}*" if cap else "")))
            self.figure = None

    def handle_data(self, data):
        if self.skip:
            return
        if self.pre is not None:
            self.pre.append(data)
            return
        if self.in_caption and self.figure is not None:
            self.figure[2].append(data)
            return
        text = re.sub(r"\s+", " ", data)
        if self.inline and self.inline[-1].endswith("\n"):
            text = text.lstrip()
        self.inline.append(text.replace("\\", "\\\\").replace("*", "\\*"))

    def markdown(self):
        self.emit()
        out = []
        for i, (kind, text) in enumerate(self.blocks):
            if i:
                out.append("\n" if kind == "li" and self.blocks[i - 1][0] == "li" else "\n\n")
            out.append(text)
        return re.sub(r"\*\*\*\*", "", "".join(out)).strip() + "\n"


def save_images(md, slug, image_dir):
    n = 0
    for url in dict.fromkeys(re.findall(r"!\[[^\]]*\]\((https?://[^)\s]+)\)", md)):
        n += 1
        ext = (re.search(r"\.(png|jpe?g|gif|webp|svg)(?=$|[?_/])", url, re.I) or [None, "png"])[1].lower()
        name = f"{slug}-{n}.{ext}"
        try:
            data = fetch(url)
        except OSError as e:
            print(f"  image failed: {url} ({e})")
            continue
        os.makedirs(image_dir, exist_ok=True)
        with open(os.path.join(image_dir, name), "wb") as f:
            f.write(data)
        md = md.replace(url, f"/chronicle/img/{name}")
    return md


def main():
    force = "--force" in sys.argv
    out_dir = sys.argv[sys.argv.index("--force") + 1] if force else POSTS
    image_dir = os.path.join(out_dir, "img") if force else IMAGES
    os.makedirs(out_dir, exist_ok=True)
    have = {f[:-3] for f in os.listdir(POSTS) if f.endswith(".md")}

    archive = json.loads(fetch(f"{SITE}/api/v1/archive?sort=new&offset=0&limit=50"))
    added = 0
    for item in archive:
        slug = item["slug"]
        if item.get("audience") not in (None, "everyone") or (slug in have and not force):
            continue
        post = json.loads(fetch(f"{SITE}/api/v1/posts/{slug}"))
        conv = Converter()
        conv.feed(post.get("body_html") or "")
        body = save_images(conv.markdown(), slug, image_dir)
        front = ["---", f"title: {json.dumps(post['title'].strip())}", f"subtitle: {json.dumps(post.get('subtitle') or '')}",
                 f"date: {post['post_date'][:10]}", f"originally: {json.dumps(post.get('canonical_url') or '')}", "---", ""]
        with open(os.path.join(out_dir, slug + ".md"), "w") as f:
            f.write("\n".join(front) + body)
        added += 1
        print(f"imported {slug}")
    print(f"{added} new post(s)")


if __name__ == "__main__":
    main()
