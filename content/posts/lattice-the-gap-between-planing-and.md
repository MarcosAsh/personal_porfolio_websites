---
title: "Lattice - The gap between planing and implementing"
subtitle: "I built a wind tunnel that runs on a cloud GPU. Here is what I learned about the gap between writing a simulation and making it usable."
date: 2026-03-13
originally: "https://marcosashton.substack.com/p/lattice-the-gap-between-planing-and"
---
**Why did I end up doing this?**

I have been thinking about fluid dynamics for a while, mostly because I wanted to understand why some CFD software costs as much as a car. The answer, I suspected, was not the physics. The physics is settled. The answer was the engineering around it, the pipeline from equations to something a person can actually interact with.

So I built Lattice. It is a GPU-accelerated wind tunnel that simulates airflow around 3D objects and computes drag coefficients in real time. You give it a model, it gives you a Cd readout and a visualisation. The code is on GitHub at github.com/MarcosAsh/3dFluidDynamicsInC. There is a live version at fluid-sim-frontend.vercel.app.

**What is a Lattice Boltzmann simulation?**

Most CFD solvers work by discretising the Navier-Stokes equations directly. That works, but it is hard to parallelise and hard to handle complex geometry with. Lattice Boltzmann takes a different approach. Instead of tracking the macroscopic fluid as a continuous field, you track the statistical behaviour of imaginary particles bouncing between nodes on a grid. At each timestep, particles collide and stream to neighbouring nodes according to a simple local rule. The macroscopic quantities you care about, velocity and pressure, emerge from the averages.

The reason this matters for GPU computing is that the collision and streaming steps are local. Each node only needs to know about its immediate neighbours. That is exactly the kind of workload that maps cleanly onto thousands of shader invocations running in parallel. A Navier-Stokes solver has global pressure solves that are hard to vectorise. A D3Q19 LBM grid is embarrassingly parallel at every step.

**What did I build?**

The simulation runs entirely on the GPU via OpenGL 4.3 compute shaders. The LBM solver runs the collision and streaming steps on the grid. A separate shader advects hundreds of thousands of particles through the resulting velocity field and detects collisions against arbitrary OBJ meshes. The drag coefficient is computed from the momentum transfer at each timestep and displayed in real time.

For desktop use, the binary runs with SDL2, a camera you can orbit, and keyboard shortcuts for switching between seven visualisation modes including velocity magnitude, vorticity, and turbulence regions. That part was straightforward.

The interesting part was making it usable without asking someone to compile a C binary.

**The cloud pipeline**

I wanted the project to have a web frontend where you could configure a simulation, hit run, and get a rendered video back without installing anything. The way I ended up doing this was to deploy the C binary as a Modal worker: a Python script that spins up a cloud GPU container, runs the simulation headlessly using EGL rather than SDL2, encodes the output to video, and uploads it to S3. The Next.js frontend sends a POST request with the simulation parameters and eventually gets back a presigned URL.

What surprised me was how much of the work in that pipeline was not the simulation itself. The simulation is fast. A trained renderer on modern hardware can push the LBM timesteps and the particle system at a rate that feels instant. The cost is in the container cold start, the video encoding, the S3 upload, and the round trip latency. Most of the time a user spends waiting has nothing to do with the physics.

That is a version of the same lesson I keep running into. In the Saddle project, the slow path was never the arithmetic, it was JAX’s compilation overhead and the WASM runtime boundary. Here, the slow path is never the GPU kernel, it is everything around it. The interesting engineering is almost always in the plumbing.

**What I would do differently**

The current architecture spins up a fresh container for each render request. That is fine for occasional use but expensive and slow for anything interactive. The right approach would be a persistent warm container with a stateful session model, so the GPU stays hot between requests and only the parameter delta gets sent over the wire. I have not built that yet because the current version is good enough to demonstrate the project, but it is the obvious next step.

The other thing I want to add is a stochastic turbulence mode that makes the particle injection noisy in a physically plausible way. Right now the turbulence visualisation is derived from the velocity field but the particles themselves are deterministic. Making them stochastic would make the vorticity regions much more legible.

**The part that made it click for me**

The visualisation mode I find most useful is not velocity magnitude or vorticity. It is flow progress, a rainbow gradient by X position that shows how far downstream a particle has travelled. When you put an Ahmed body in the tunnel and switch to flow progress, you can see the wake cavity behind the car immediately. The region where flow stalls and recirculates is obvious in a way that a pressure plot is not. That is the moment where the project stopped feeling like a benchmark and started feeling like a tool.

If you want to try it, the live demo is at fluid-sim-frontend.vercel.app. Upload an OBJ, pick a wind speed, and watch the Cd readout settle. The code is at github.com/MarcosAsh/3dFluidDynamicsInC.

More coming, including the persistent session model and the stochastic turbulence mode. I will write about those when they are done.
