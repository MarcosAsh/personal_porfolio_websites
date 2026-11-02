---
title: "FFmpeg is everywhere. Almost no one knows what it is."
subtitle: "The most important piece of software you have never heard of, and what I learned trying to contribute to it."
date: 2026-03-23
originally: "https://marcosashton.substack.com/p/ffmpeg-is-everywhere-almost-no-one"
---
![](/chronicle/img/ffmpeg-is-everywhere-almost-no-one-1.png)

**Why did I end up doing this?**

I started working on FFmpeg because I wanted to qualify for Google Summer of Code. The task was to add FATE test coverage for a decoder that had none. I figured it would take a weekend.

It took considerably longer than a weekend. But what surprised me was not the difficulty. It was what I found when I started reading the codebase. FFmpeg is not a tool. It is infrastructure. The kind that sits underneath everything and gets noticed by nobody.

**What is FFmpeg?**

FFmpeg is a collection of libraries for encoding, decoding, muxing, demuxing, filtering, and streaming audio and video. It handles hundreds of codecs. It has been in active development since 2000. The command line tool is the part most people have touched, if they have touched it at all, usually to convert a video file with a command they copied from Stack Overflow and did not fully understand.

That description undersells it badly.

When you upload a video to YouTube, FFmpeg is involved in transcoding it. When you watch something on a streaming platform, the player almost certainly links against libavcodec or something built on top of it. VLC is built on it. Chrome uses it. Blender uses it. Kodi uses it. Most of the video infrastructure on the internet either is FFmpeg or depends on something that is. There is a famous line in the project’s documentation that says it plays “everything”. That is not quite true, but it is closer than it sounds.

The codebase has been accumulating since before most current contributors were in secondary school. There are codecs in there for formats that no longer have any hardware to play them. There are comments in languages the primary maintainer does not speak. The git history is a geological record.

**What is FATE?**

FFmpeg has a test suite called FATE, which stands for FFmpeg Automated Testing Environment. The way it works is simple. You run a decode or encode operation on a known input, compute a checksum of the output, and compare it against a stored reference. If the checksum matches, the behaviour is correct. If it does not, something changed.

The problem is coverage. FATE has thousands of tests, but they are not evenly distributed. Some codecs have dense coverage. Others have none. A decoder can be in the codebase for years without a single test to verify it behaves correctly after a refactor.

That is what I was working on. Finding decoders with no FATE coverage, locating or generating suitable sample files, writing the test entries, and submitting them for review.

**What I did not expect**

I expected the hard part to be the codec internals. It was not. The hard part was the infrastructure around the tests themselves.

FATE tests are not checked into the repository. The sample files live on a separate server at samples.ffmpeg.org, accessed via rsync. Each test entry references a file by path and expected checksum. Writing the test means finding a valid sample, verifying the decoder produces consistent output across platforms, computing the reference checksums, and formatting everything correctly before sending a patch.

The review process is similarly careful. My first patch came back with formatting corrections. My second came back with a question about whether the sample was the smallest file that exercised the relevant code path. Both pieces of feedback were correct. The bar is high because the test suite runs on a lot of machines and a bad entry is expensive to fix later.

What I kept noticing was how much of the work was not the code. It was the archaeology. Understanding why a codec works the way it does often means reading a spec from the 1990s, tracing back through commit history, or cross-referencing with a format that no longer has a Wikipedia page. The codebase is a record of every weird decision the video industry made over twenty-five years, preserved in C.

**The part that made it click**

There is a moment when you realise that software this old and this widely used is still being actively improved by volunteers. Not maintained. Improved. New codecs, new optimisations, new hardware interfaces, new test coverage for things that have been untested for a decade.

Most open source projects at this scale become ossified. The contributors burn out, the bus factor drops to one or two, and the project enters a slow maintenance phase until someone forks it. FFmpeg has not done that. The mailing list is active. The commit rate is high. Michael Niedermayer has reviewed more patches than I have written lines of code in my life.

I do not have a clean lesson to wrap this up with. The project is too large and too old for a neat conclusion. What I have instead is a patch in the tree and a better understanding of what it means for software to be load-bearing. Most of the code that matters is code you never think about. FFmpeg is the clearest example of that I have found.

If you want to look at it, the FFmpeg repository is at git.ffmpeg.org. The FATE documentation is sparse but functional. The mailing list archives are surprisingly readable.
