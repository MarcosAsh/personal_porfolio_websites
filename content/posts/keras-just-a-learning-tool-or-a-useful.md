---
title: "Keras: just a learning tool, or a useful layer of abstraction?"
subtitle: "How working with Google and Apple has made me question whether what I am building is worth the time."
date: 2026-11-11
originally: "https://marcosashton.substack.com/p/keras-just-a-learning-tool-or-a-useful"
---
As an open source developer I find myself constantly questioning whether my work serves a purpose to anyone. Recently I have spearheaded the keras-mlx repository, which brings the wonderful work Apple has done with MLX on their M-series silicon to the Keras community, but I have to ask: is what I am working on actually useful?

The world of ML frameworks is largely one built by large companies that open sourced their software to try to lock you into their hardware or ecosystems. You don’t have to look far. When I was working on an inference benchmarking tool at my previous job I determined that the best inference tool was TensorRT by NVIDIA. Of course my recommendation to use this dependency came with the massive asterisk of the entire serving stack being locked to NVIDIA GPUs. It’s the same with Google and JAX being optimized for their TPUs, and there are many other examples.

I started to work on Keras because it was what I used and where I thought the most impact was. Pick up any book or course teaching the basics of machine learning and you are bound to see Keras named. It is a great tool and its creator François Chollet did a great job. Since his departure the Keras team has kept doing great work.

But being in every book is where my doubt comes from. The story people tell is that you learn on Keras and then move to PyTorch when the work gets serious. My entire university uses Keras for coursework, which fits that story well, and I doubt a faster backend changes much for my classmates.

I also didn’t make anything possible that wasn’t before. You can already run any Keras model on a Mac with the existing backends. What keras-mlx changes is how fast it runs. On my Mac mini, training ResNet50 goes at 42 images a second with the MLX backend and 23 with PyTorch on the same GPU. Generating text with a model the size of Llama 3.2 1B goes at 32 tokens a second against 10. It is not the fastest at everything, and JAX still beats it at inference on some of the smaller models.

So my question comes down to whether making Keras faster on a Mac is worth the time when the people around me who use Keras don’t need it to be.

The work has been useful in a direction I did not expect, though. To add MLX to Keras I had to implement every Keras operation on top of it and then pass the same test suite that the JAX, PyTorch and TensorFlow backends pass, which is more than fifteen thousand tests. Along the way I found bugs in MLX, some of which only show up on the GPU, and a few of the fixes I sent to Apple’s repository have been merged. On the other side, every change I make to keras-mlx is reviewed by the Keras team at Google. So I have Google engineers reviewing code written to make Apple hardware a better place to run models, and Apple engineers merging fixes that came out of a Google framework’s tests.

That is what I think the layer of abstraction is for. Each of these companies has a reason to keep you on their hardware, and Keras is one of the few places where none of them gets to decide. The model code I timed on the Mac is the same code that runs on an NVIDIA card with another backend.

I don’t have an answer yet. I have a backend that generates text three times faster than the alternative on my Mac mini, and no idea how many people wanted that.
