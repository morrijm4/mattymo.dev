---
title: One Billion Row Challenge
description: My attempt at the one billion row challenge using the Zig
programming language.
date: 2026-09-26T20:16:41.046Z
tag: 1brc, zig, optimization, performance
category: Programming
author: Matthew Morrison
---

I recently attempted the One Billion Row Challenge (1BRC) using the Zig
programming language. I am new to Zig so, this challenge was a way for me to get
my feet wet with this language. Also, I have heard about this challenge in the
past and wanted to give it a shot! I just finished grad school where I took a
Modern Computer Architecture class and, I wanted to see if my new knowledge of
processors could pay off.

After starting with a baseline implementation that executes in 141 seconds on my
12 core M4 MacBook Pro, I was able to get my program down to 1.17 seconds. With
the help of Apple's fantastic profiler, Instruments, I was able to identify
bottlenecks and make full use of my processor!

As a disclaimer, I used AI chat bots for assistance for learning Zig. I have
provided links to my threads in the appendix. However, all code for the
challenge was written by hand and I used my ideas for optimizations. After
Claude started to pick up I was doing 1BRC, I specifically prompted to *not*
give optimization hints which it did not. Additionally this blog was written
without the help of AI.

# What is the One Billion Row Challenge?

The One Billion Row Challenge was a competition that ran in the month of January
2023 to see who can create the fastest program in Java that could find the
minimum, maximum, and average temperature per weather station based on 1 billion
data points. The challenge has hence spread to other language communities. There
are more specific constraints but I will specify them as necessary.

# Amdahl's Law

My process for tackling this challenge was influenced by Amdahl's Law. The law
states...

> the overall performance improvement gained by optimizing a single part of a
> system is limited by the fraction of time that the improved part is actually
> used.

Therefore, each performance improvement was guided by first identifying which
function contributes to the largest percentage of execution time and then
optimizing that section of code.

I used Apple's profile, Instruments, that is shipped with XCode. This
application is fantastic. Using sampling, it was able to tell me the percentage
of time each function takes in execution time based on heuristics. This is also
thanks to Zig's ability to output DWARF compliant debug symbols.

# Optimizations

Below is a table of each optimization I added chronologically and the impact on
the performance.

|---------------------------|--------------------|---------|
| Optimization              | Execution Time (s) | Speedup |
|---------------------------|--------------------|---------|
| Baseline                  | 141.597            |         |
| Zig implementation        | 27.998             | 5.057   |
| Find semicolon in reverse | 19.172             | 1.460   |
| Static allocation         | 16.044             | 1.195   |
| Custom temperature parser | 13.231             | 1.213   |
| Custom buffered reader    | 9.681              | 1.367   |
| Custom hash map           | 9.277              | 1.044   |
| Multi-threaded            | 1.140              | 8.138   |
|---------------------------|--------------------|---------|

# Takeaways

## Less code is faster. 

Just by implementing my own version of the standard library functions, I was
able to remove extra code unnecessary for my application which reduced the
number of cycles in the hot path. This is apparent in the bespoke buffered
reader, hash map, and temperature parser.

## Use static allocations

If you know the constraints of you application, then you can allocate all of the
memory you need up front. This removes memory allocation from your hot path to
speed up execution. An example of this in practice can be seen with TigerBeetle
and their TigerStyle philosophy.

## Measure first, then optimize.

When I initially started, I thought I would be bottleneck more by the disk.
However, my syscalls to `pread` where only a sliver of the execution time and
therefore I never touched it.

Additionally, I thought I would need to do at least some optimizing for the end
where the stations are sorted and the hash maps are reduced. However, those
section of the code remain basically the same as the baseline implementation.

# Conclusion

This challenge was really fun and rewarding! There were times when it was hard,
like implementing the custom buffered reader, but I didn't give up and it was so
satisfying to see the execution time drop. I am relatively new to performance
engineering and I think this is such a great way to get your feet wet with
profilers.

Furthermore, my love for Zig has only grown. It is such a simple language but
gives you so much power in how you can customize the build system, write
expressive typing, and compute values at comptime. It has been such a joy to
work with.
