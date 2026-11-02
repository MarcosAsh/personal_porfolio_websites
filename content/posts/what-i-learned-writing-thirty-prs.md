---
title: "What I learned writing thirty PRs against a framework I had used for years."
subtitle: "Why doing OSS changed how I think."
date: 2026-05-01
originally: "https://marcosashton.substack.com/p/what-i-learned-writing-thirty-prs"
---
Why did I end up doing this?

I started contributing to Keras because the PyTorch backend was not doing what I expected. I had a model that trained fine on TensorFlow and produced wrong gradients on PyTorch, and I wanted to understand why. The polite version of what happened next is that I filed an issue. The honest version is that I started reading the source instead.

That was thirty merged PRs ago. I have shipped fixes across recurrent layers, attention, linear algebra, ONNX export, conv shape inference, and the CTC decoder. I have also had several PRs closed, which taught me more than the merged ones.

What is Keras 3?

The short version is that Keras is a Python API for building neural networks. The longer version is that Keras 3 is the same API on top of five different numerical backends: JAX, TensorFlow, PyTorch, NumPy, and OpenVINO. You write a model once, you can train it on any of them, and the layers are supposed to behave identically.

That last part is where the work is.

If you write a custom op like `keras.ops.pinv`, it has to lower correctly to JAX, to PyTorch, to TensorFlow, to NumPy, and ideally to OpenVINO too. Each backend has different conventions for dtype promotion, broadcasting, error messages, and dispatch. Each one has subtly different LAPACK bindings. PyTorch’s default least squares driver interprets the rcond argument differently from NumPy’s. JAX’s experimental cuDNN binding only exposes LSTM and not GRU. The Keras layer has to paper over all of that without leaking the seams to the user.

This is what I underestimated when I started. I thought the work would be machine learning. It is mostly plumbing.

What I did not expect

I expected the hard part of contributing to be the algorithms. The first time I sat down to add a CTC beam search decoder for the PyTorch backend, I assumed the difficult work would be the search itself, the log space score accumulation, the blank token handling. It was not. The hard part was that `torch.unique` is slower than I expected, and the bottleneck of the entire decoder turned out to be a deduplication step that happens on every timestep. I rewrote it to use a hash of each path instead of a sort, and the runtime dropped by a factor of three.

That kind of thing kept happening. The most useful PR I have written for Keras was probably the fix to the PyTorch backend’s `lstsq`. The bug was that the test was flaky on torch only when an explicit `rcond` was passed. The reason was that torch defaults to a QR based driver called gelsy, and gelsy’s interpretation of rcond is not the same as NumPy’s SVD based gelsd. On a near rank deficient input, the result could differ from NumPy by an order of magnitude. Pinning the driver to gelsd when rcond is supplied fixed it. The whole patch was three lines plus a comment explaining why.

I had to go read LAPACK documentation to figure that out. I had not expected to read LAPACK documentation.

The review process

The Keras team’s senior reviewer leaves substantive feedback on almost every external PR, and over the course of thirty merges I started to see his patterns. Do not validate inputs in the backend independent ops layer. Trust the backend to raise its own errors. Do not write helper functions that wrap a single backend call. Imports go at the top of the file unless you are working around a circular dependency. Do not put validation only in `compute_output_spec`, because that method does not run in many real call paths.

None of these rules are wrong. All of them are obvious in retrospect. None of them are obvious if you are coming from a codebase where validation lives in the wrapper.

I started keeping a list of his comments after the first few PRs got the same kinds of corrections. By the time I was on the twenty fifth PR, I was checking my own diff against the list before I pushed. The bounce rate dropped noticeably. I would like to note how streamlined and painless the contribution pipeline is in Keras compared to other OSS projects.

The part that made it click

There is a moment when you realise that the interesting work in a framework like Keras is not in the layers. It is at the seams. The seam between the JAX backend and the cuDNN binding, where you discover that the gate ordering for an LSTM has to be transposed before the call. The seam between the symbolic shape inference and the concrete dispatch, where a layer that works fine in eager mode breaks in `tf.function` because one path checks shapes and the other does not. The seam between two backends that handle dtype promotion differently, where a model that trains fine on one produces NaNs on the other.

Most of the bugs I have fixed are at seams. Most of the value of a multi backend framework is that someone else has already absorbed the cost of those seams. Most of the cost of maintaining one is that those seams keep moving.

That is not a clean lesson, and I am not going to pretend it is. What I have instead is a different appreciation for the people who maintain frameworks at this scale. Building a model is a few lines of Python. Making sure those lines do the same thing on five different runtimes, across a decade of accumulated edge cases, is a job.

If you want to look at the project, the Keras repository is at github.com/keras-team/keras. The contribution guide is good. The review bar is high but fair, and the reviewers actually read the code.

More coming, including a writeup on the JAX side once I have shipped a PR there.
