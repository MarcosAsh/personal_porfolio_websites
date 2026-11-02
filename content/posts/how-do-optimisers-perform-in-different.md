---
title: "How do optimisers perform in different languages?"
subtitle: "I implemented Adam in C, JAX, and WASM and measured them here's what I found and why it matters."
date: 2026-03-12
originally: "https://marcosashton.substack.com/p/how-do-optimisers-perform-in-different"
---
![](/chronicle/img/how-do-optimisers-perform-in-different-1.png)

### Why did I end up doing this?

I have recently started working on Keras, mostly because I have been having some problems with the PyTorch backend. I delved into the world of open source for the first time. What I found was that the best way to understand why something is slow is to build a smaller version of it yourself.

### What is an optimiser?

An optimiser is an algorithm that tries to find the lowest point on a loss surface. In machine learning, that surface represents how wrong your model is. The optimiser’s job is to navigate it, step by step, until it finds somewhere flat.

The reason there are so many of them is that navigating a high-dimensional surface is hard, and different surfaces reward different strategies. SGD with momentum barrels through valleys but struggles when the terrain is uneven. Adam adapts its step size for each parameter individually, which makes it faster in practice but more expensive per step. L-BFGS uses curvature information to take smarter steps but falls apart at scale. Each one is a different bet on what the loss surface is probably shaped like. Nobody has won yet, which is why the list keeps growing.

### What did I make?

That is what Saddle is. I wanted to see optimisers actually behave, not just read about their convergence properties in a paper. So I picked five loss surfaces, implemented six optimisers, and wired them up to a visualiser where you can watch two of them race in real time.  
But the more interesting question turned out to be underneath the visualisation: what does it actually cost to run an Adam update step? I implemented the same equations four ways, in C, JAX, WebAssembly, and plain Python, and measured them head to head. The results were not what I expected.

The server-side result was not surprising. C ran 10,000 Adam steps in 138 milliseconds. JAX took 1746 milliseconds for the same thing, 12.6 times slower. JAX’s JIT compilation overhead is real, and at this scale, on a simple 2D update step, it never gets the chance to pay for itself. If you are running a toy optimiser on a toy surface, C wins easily.

The client-side result was the one that made me think. I expected WASM to be faster than JavaScript. That is the whole point of compiling C to WASM. Instead JavaScript won, by a factor of two. WASM finished in 4 milliseconds, JavaScript in 2.

It turns out modern JavaScript engines are extraordinarily good at optimising tight numerical loops. V8 will JIT compile a hot loop and produce machine code that is competitive with, and in this case faster than, the WASM runtime overhead. WASM wins in other scenarios, particularly with heavy memory operations and larger workloads, but for a small repeated arithmetic kernel in the browser, the JS engine does not give it room to breathe.

The lesson I took from both results is the same one the Keras codebase kept teaching me: abstractions have costs that only show up at the edges. JAX is a remarkable piece of software. So is V8. But neither of them is free, and knowing when you are paying the price is most of the work.

If you want to see it yourself, the live demo is at [saddle-fawn.vercel.app](https://saddle-fawn.vercel.app). Drop two optimisers on Himmelblau, watch them find different minima, and run the benchmarks in your own browser. The code is on GitHub at [github.com/MarcosAsh/Saddle](https://github.com/MarcosAsh/Saddle). There is more coming, including a stochastic gradient mode and a saddle point escape demo that I think makes the whole thing click. I will write about those when they are done.

P.S. I hope you liked it! This was my first article on Substack.
