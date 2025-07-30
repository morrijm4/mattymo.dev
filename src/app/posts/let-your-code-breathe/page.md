---
title: Let your code breathe
description: Why I think you should add plenty of whitespace to your code.
date: 2025-07-28T16:51:34.404Z
tag: code, code-style, opinion
category: Programming
author: Matthew Morrison
---

Do you ever look at code and think "wow this is ugly". Same, we've all been there. In this blog
post, I want to discuss one of my pet peeves. Bunched together code. Rather than trying to explain
this with words, let me show you. This is my top level function for my [snake](../snake) game, except
I smashed it all together.

```ts
setHighScore(getHighScore());
initButtons();
const root = document.getElementById('root');
assert(root, 'Cannot find root node');
const grid = initGrid(root);
const playButton = document.getElementById('play-button');
assert(playButton, 'Cannot find play button');
playButton.addEventListener('click', () => run(initGameState(grid)));
```

Yuck! Oh my eyes. This is an example where I think you should let your code "breathe". Separate it
out into logical chunks to break it up.

```ts
setHighScore(getHighScore());
initButtons();

const root = document.getElementById('root');
assert(root, 'Cannot find root node');

const grid = initGrid(root);

const playButton = document.getElementById('play-button');
assert(playButton, 'Cannot find play button');

playButton.addEventListener('click', () => run(initGameState(grid)));
```

Ah, much better.

This of course is just my humble and honest opinion but, I'm curious if others feel passionate about
this like me. Thanks for reading and remember to let your code breathe!
