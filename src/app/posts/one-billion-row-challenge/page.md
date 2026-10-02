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
my feet wet with this language. Also, this challenge has peaked my interest in
the past and wanted to give it a shot! I just finished grad school where I took
Modern Computer Architecture and, I wanted to test my new found knowledge.

The provided Java baseline implementation executed in 141 seconds on my 12 core
M4 MacBook Pro, and optimizing my program, the final execution time was **1.14**
seconds. That is a 124x speedup! Leveraging Apple's fantastic profiler,
Instruments, I was able to identify bottlenecks and make full use of my
processor! From this experience, I was able to take away invaluable lessons
about performance engineering.

As a disclaimer, I used AI chat bots for assistance for learning Zig. I have
provided links to my threads in the appendix. However, all code for the
challenge was written by hand and I used my ideas for optimizations. After
Claude started to pick up I was doing 1BRC, I specifically prompted to *not*
give optimization hints which it did not. Additionally this blog was written
without the help of AI.

You can find all the code [here](https://github.com/morrijm4/1brc-zig),
including the code for each iteration by checking out the branches prefixed with
`N-`.

# What is the One Billion Row Challenge?

1BRC started as competition in the Java community that ran in the month of
January 2023 to see who can create the fastest program that could compute the
minimum, maximum, and average temperature per weather station based on 1 billion
data points. This translates to roughly 13GB of data! The challenge has hence
spread across other language communities and continues as a fun challenge
recreational programmers.

Here are the important constraints specified by the challenge.

- At most there are 10,000 unique weather stations.
- A station name is a UTF-8 string with a max length of 100 bytes.
- Temperatures range between -99.0 to 99.0 (inclusive).

Here is an example of how the data is structured.

```
Hamburg;12.0
Bulawayo;8.9
Palembang;38.8
Hamburg;-34.2
```

# Amdahl's Law

My methodology for this challenge was influenced by Amdahl's Law. The law
states...

> the overall performance improvement gained by optimizing a single part of a
> system is limited by the fraction of time that the improved part is actually
> used.

Formally it is described as.

```math
S = 1 / (1 - p) + (p / s)
```

Where `S` is overall speedup, `p` is a proportion of a program, and `s` is the
speedup of that proportion.

Therefore, for each iteration I first identified the largest proportion of my
program's execution then optimizing that section of code.

I utilized Apple's profiler that ships with XCode, Instruments, as my way to
measure the proportion of execution time for each function. By sampling a
program's stack trace every 1 millisecond it can provide accurate estimations.
Combined with Zig's ability to output DWARF compliant debug symbols, this was a
fantastic user experience.

# Optimizations

Below is a table of each optimization I added chronologically and its
performance impact.

| N | Optimization               | Execution Time (s) | Speedup |
|---|----------------------------|--------------------|---------|
| - | Baseline                   | 141.597            |         |
| 0 | Zig implementation         | 27.998             | 5.057   |
| 1 | Find semicolon in reverse  | 19.172             | 1.460   |
| 2 | Static hash map allocation | 16.044             | 1.195   |
| 3 | Custom temperature parser  | 13.231             | 1.213   |
| 4 | Custom buffered reader     | 9.681              | 1.367   |
| 5 | Custom hash map            | 9.277              | 1.044   |
| 6 | Multi-threaded             | **1.140**          | 8.138   |

0. Just by implementing a naive solution with Zig and setting the flag
   `-Doptimize=ReleaseFast`, I was able to get a 5x speedup. Way to go Zig and
   LLVM teams!

1. The naive Zig implementation parsed each station and temperature first by
   getting a slice of each line in the file then linearly searching for a
   semicolon. This accounted for 33.0% of the execution time! By starting the
   search from the end of the slice and jumping back 3 characters to account for
   the smallest possible temperature, it produced a 1.46x speedup and the
   proportion of execution dropped to 5.5%.

2. The next bottleneck was the `getOrPut` method on our hash map. In total it
   accounted for 32.7% of program execution. Drilling in further, an internal
   method, `isTombstone`, accounted for 13.7%. So, I preallocated the hash map
   to support 10,000 entries. This dropped `getOrPut` to 20.4% execution time
   and `isTombstone` to 0.4%!

3. Next `parseFloat` became the bottleneck with a proportion of 31.3% of
   execution time. With a custom implementation which also switched to using
   integers before converting them to floats, this drop the proportion to 3.6%.

4. Next was the buffered reader, and this was the one I was dreading the most.
   It took me multiple implementation attempts but I finally landed on one that
   out performed the Zig standard library. The original buffered reader
   accounted for 32.8% but measuring the new one was hard to do because it is
   now baked into the `main` function where it gets drowned out.

5. Then it was back to the hash map. It continued to take up 32.7% of the
   program. So, I rolled up my sleeves and implemented my own. I used the same
   hash function as the standard library `StringHashMap`, `Wyhash`, and used
   linear probing. The implementation was relatively simple because I had an
   upper bound on the number of entries (10,000). So, I did not have to think
   about resizing arrays or implementing linked lists. This drop the proportion
   to 19.1%.

6. Finally, I implemented multi-threading. I used a map-reduce like technique
   where I split my input evenly by row and each worker had their own hash map
   to populated. After all workers finished then the maps were reduced into the
   final result.

# Unsuccessful Optimizations

- In the final program `findScalarPos` continues to be a large bottleneck and
  over the course of this challenge I took a stab at implementing my own. I
  tried to combine SIMD instructions and loop unrolling but, that drove up my
  processor backend bottleneck counters way up and slowed down execution time.
  I concluded the Zig standard library has one hellava implementation so
  shout outs to them!

- Before I went with a map-reduce implementation for the multi-threaded
  approach. I tried using one hash map with a mutex however, this resulted in
  poor performance and it was also caused a lot bugs (skill issue I know).

- I tried multiple `parseTemp` implementations which included using pattern
  matching, and branching based on slice length. However, nothing beat my
  original implementation. I concluded to really optimize this piece you would
  have to get down to the assembly.

- The buffered reader was HARD but in the back of my mind I thought an
  application specific implementation has to beat a generic one. Eventually,
  that thought was proven correct.

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

# Math For Nerds

Does Amdhal's Law match up to empirical data? Here are the results.

| N | Optimization              | Execution Proportion (*p*) | Proportion Speedup (*s*) | Theoretical Speedup (*S*) | Actual Speedup (*S'*) |
|---|---------------------------|----------------------------|--------------------------|---------------------------|-----------------------|
| 1 | Find semicolon in reverse | 33%                        | 8.951                    | 1.529                     | 1.460                 |
| 2 | Static allocation         |                            |                          |                           |                       |
| 3 | Custom temperature parser |                            |                          |                           |                       |
| 4 | Custom buffered reader    |                            |                          |                           |                       |
| 5 | Custom hash map           |                            |                          |                           |                       |
| 6 | Multi-threaded            

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

# Machine

```
CPU: Apple M4 Pro
RAM: 48 GB
MacOS: 26.6.2 (25G83)
Zig: 0.16.0
```
