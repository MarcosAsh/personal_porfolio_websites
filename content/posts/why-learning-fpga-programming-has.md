---
title: "Why learning FPGA programming has helped me understand the limitations of LLMs"
subtitle: "I am currently taking part in a competition by Jane Street to build an ASIC protocol emulator and trying to use LLMs to help me with this has opened my eyes to its true limitations."
date: 2026-11-02
originally: "https://marcosashton.substack.com/p/why-learning-fpga-programming-has"
---
As its well known coding is a solved issue. I would be saying that if I stuck with my usual work. Recently I have started to delve into low level design of chips and how computers work at a fundamental level. This all started at a work placement in which I was performance testing an LTM (Large transaction model) on AWS. The latency numbers where great for the smaller model but in a stand-up with the rest of the team someone said “What if we ran this on an FPGA?” Since I had pretty much finished my work and I had some spare time left I did what any junior does now-a-days and asked Claude: “Hey can we run this on an FPGA?” Claude proceeded to call me stupid and I decided to try to find an onnx to verilog open source project but i couldn’t find one that worked. With complete arrogance I said “this looks easy!”

**Why it looked easy**

From a software point of view it really does look easy. An ONNX file is a graph of layers. A compiler walks the graph and emits code for each node. Swap “code” for “Verilog” and you have an FPGA accelerator. One hardware unit per layer, wire them together, done.

That is roughly what onnx2fpga, the project that came out of this, does. It reads the ONNX protobuf with its own decoder, builds one streaming unit per layer and joins them with handshaked streams. The plan fits in a paragraph. Making it correct took far longer.

**Where it stopped being easy**

The first thing I had to unlearn is that code runs one line after another. In hardware everything happens at once, on every clock edge. A convolution is not a loop. It is a sliding window generator, a row of multipliers, an adder tree and a lot of registers, all working on different pixels in the same cycle.

The second is that the units have to talk to each other. Every stream has a valid and a ready signal. If a layer further down is busy, it pulls ready low, and everything before it has to wait without dropping or duplicating a single value. That is backpressure. A design can give the right answer in a clean simulation and then hang forever once one layer stalls at the wrong moment, because two buffers are each waiting for the other. Skip connections make it worse, because the shortcut has to hold its data until the long branch catches up.

The third is numbers. Weights are quantised integers, every wire has a width you choose, and if an accumulator is one bit too narrow it silently wraps around. In the end I check the MLP and CNN examples bit for bit against an integer reference under randomised backpressure, 21 runs each, and sweep the sliding window generators over 18 geometries. A clean simulation proves very little.

**Then I entered a competition**

That project is what gave me the confidence to enter Jane Street’s protocol emulator ASIC competition. My entry is a small chip that bit-bangs protocols like UART, SPI and I2C from firmware. It has two cores and runs at 48 MHz on six by four Tiny Tapeout tiles of IHP’s 130 nm process. In a protocol, a byte sent one cycle late is a wrong byte. So before a program is loaded, a small kernel checks a certificate of its timing, and if it accepts the program, that program never misses a deadline. That last claim is proved against each core’s RTL, not just tested.

I used AI a lot on this, far more than on onnx2fpga. Agents wrote firmware, models, checkers, proof harnesses and reviews. The rule I set early was that nothing an agent writes counts until it passes a gate, and a finding only counts if it comes with a reproducer that fails on the code.

**What the LLM was good at**

The biggest time saver was testing the new routing. Every time I added a feature, the whole chip had to be placed and routed again, and that can break in ways that have nothing to do with the feature. An agent could run the harden, read the timing, DRC and LVS reports and tell me what had moved, which saved me hours of watching runs.

It was also a good reviewer. I planted 27 bugs in a copy of the code and asked an agent to review it blind. It found 22, and along the way it found 10 real bugs on main that I had missed. It even found a bug in someone else’s code. Raspberry Pi’s example I2C program holds a start condition for 3.125 microseconds, where the I2C spec needs 4.0. I captured all 1,356 starts on my bench, and every one was short, so I filed it upstream.

**Where it fell over**

I had agents write firmware for three protocols, DShot600, SENT and CEC, straight from the specs. Four of the eight drafts were refused, all of them SENT. The assembler caught one and my timing kernel caught three. Two of those three had already been passed by the static analyser. The kernel also accepted three protocol bugs it cannot see by design, because they are about what the bits mean, not when they arrive. A decoder caught one of those and review caught the other two.

I also turned agents against my own claims. Ten rounds of attacks in one day produced 76 confirmed problems, 9 of them high severity. Every one was in code that was only tested. None was in code that was proved. A self-check I trusted had passed 1,000 randomised trials with eight holes in it. And earlier rounds, before I added a second agent whose only job was to refute each finding, found 37 places where the proof work claimed more than it actually proved. Even the checker that found the Raspberry Pi bug had three high severity soundness bugs, in each of two rounds, before it was right.

I think the reason is simple. A language model predicts what plausible code looks like, and plausible hardware code and correct hardware code look the same on the page. The difference only shows up across thousands of cycles, with the right stall or the right edge in the right place, and the model never sees that. It also has far less public hardware code to learn from than Python or JavaScript. The places it fails are exactly the places where being right depends on time.

**What I took away**

Coding is not solved. Typing code is the cheap part, and LLMs have made it cheaper. Knowing the code is right was always the hard part, and hardware makes that impossible to ignore. There is no stack trace and no “try it and see” once a design is on silicon.

That has changed how I use these tools in software too. I treat the model like a very fast junior who has read everything and run nothing. It is great at a first draft, a review or a long boring test run. The gates, the reference models and the proofs are my job.

And for the record, Claude was right. Running that model on an FPGA was much harder than I thought. It was also the project I have learned the most from.
