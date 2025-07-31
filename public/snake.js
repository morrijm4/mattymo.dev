// src/scripts/snake.ts
var COLUMNS = 13;
var ROWS = 13;
var INITIAL_SPEED = 300;
function getSnakeSpeed(state) {
  return Math.max(INITIAL_SPEED - Math.log(state.score + 1) * 60, 100);
}
function assert(condition, msg) {
  if (!condition)
    throw new Error(msg);
}
function assertSnakeNode(node, msg) {
  assert(node.type === "snake", msg);
}
function getHighScore() {
  const highScore = window.localStorage.getItem("high-score");
  if (highScore == null)
    return 0;
  return parseInt(highScore);
}
function setHighScore(score) {
  window.localStorage.setItem("high-score", score.toString());
  const element = document.getElementById("high-score");
  assert(element, "Cannot find high score dom node");
  element.innerHTML = score.toString();
}
function createRandomPoint() {
  return {
    col: Math.floor(Math.random() * COLUMNS),
    row: Math.floor(Math.random() * ROWS)
  };
}
function getGridNode(grid, point) {
  return grid[point.col]?.[point.row];
}
function initButtons() {
  const up = document.getElementById("up");
  const left = document.getElementById("left");
  const right = document.getElementById("right");
  const down = document.getElementById("down");
  assert(up);
  assert(left);
  assert(right);
  assert(down);
  up.addEventListener("click", () => {
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowUp" }));
  });
  left.addEventListener("click", () => {
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowLeft" }));
  });
  right.addEventListener("click", () => {
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight" }));
  });
  down.addEventListener("click", () => {
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown" }));
  });
}
function initGrid(root) {
  return Array.from({ length: COLUMNS }, (_, i) => {
    const col = document.createElement("div");
    root.appendChild(col);
    return Array.from({ length: ROWS }, (_2, j) => {
      const row = document.createElement("div");
      col.appendChild(row);
      row.classList.add("custom-border");
      row.classList.add("lg:p-4");
      row.classList.add("p-3");
      return row;
    });
  });
}
function initGridState(grid) {
  return grid.map((col) => col.map((row) => ({
    type: "empty",
    element: row
  })));
}
function createFoodPoint(grid) {
  const point = createRandomPoint();
  const node = getGridNode(grid, point);
  assert(node, "Unable to find point in createFoodPoint");
  return node.type !== "empty" ? createFoodPoint(grid) : point;
}
function createKeyDownHandler(state) {
  return async (event) => {
    event.preventDefault();
    switch (event.key) {
      case "ArrowUp":
      case "w":
        if (state.direction === "down")
          return;
        state.pendingDirection = "up";
        break;
      case "ArrowDown":
      case "s":
        if (state.direction === "up")
          return;
        state.pendingDirection = "down";
        break;
      case "ArrowLeft":
      case "a":
        if (state.direction === "right")
          return;
        state.pendingDirection = "left";
        break;
      case "ArrowRight":
      case "d":
        if (state.direction === "left")
          return;
        state.pendingDirection = "right";
        break;
    }
    const headNode = getGridNode(state.grid, state.head);
    assert(headNode, "Cannot find head node");
    assertSnakeNode(headNode);
    headNode.direction = state.direction;
  };
}
function initGameState(grid) {
  setHighScore(getHighScore());
  const gridState = initGridState(grid);
  const head = {
    col: Math.floor(COLUMNS / 2) - 2,
    row: Math.floor(ROWS / 2)
  };
  const tail = {
    col: head.col - 2,
    row: head.row
  };
  const direction = "right";
  const s1 = getGridNode(gridState, head);
  const s2 = getGridNode(gridState, { col: head.col - 1, row: head.row });
  const s3 = getGridNode(gridState, tail);
  assert(s1, "Cannot find snake node");
  assert(s2, "Cannot find snake node");
  assert(s3, "Cannot find snake node");
  s1.type = "snake";
  s2.type = "snake";
  s3.type = "snake";
  assertSnakeNode(s1);
  assertSnakeNode(s2);
  assertSnakeNode(s3);
  s1.direction = direction;
  s2.direction = direction;
  s3.direction = direction;
  const food = {
    col: head.col + 6,
    row: head.row
  };
  const foodNode = getGridNode(gridState, food);
  assert(foodNode, "Cannot find food node");
  foodNode.type = "food";
  const state = {
    direction,
    pendingDirection: direction,
    grid: gridState,
    score: 0,
    pause: false,
    controller: new AbortController,
    food,
    head,
    tail,
    gameOver: false,
    title: ""
  };
  document.addEventListener("keydown", createKeyDownHandler(state), {
    signal: state.controller.signal
  });
  return state;
}
function render(state) {
  const playButton = document.getElementById("play-button");
  assert(playButton, "play button not found");
  if (state.gameOver) {
    state.controller.abort();
    playButton.classList.remove("invisible");
    const highScore = getHighScore();
    if (highScore < state.score) {
      setHighScore(state.score);
    }
  } else {
    playButton.classList.add("invisible");
  }
  const title = document.getElementById("title");
  assert(title, "Could not find title");
  title.innerText = state.title;
  for (const col of state.grid) {
    for (const row of col) {
      row.element.classList.remove("bg-red-500", "bg-yellow-500");
      switch (row.type) {
        case "empty":
          break;
        case "food":
          row.element.classList.add("bg-red-500");
          break;
        case "snake":
          row.element.classList.add("bg-yellow-500");
          break;
      }
    }
  }
  const score = document.getElementById("score");
  assert(score, "Could not find score");
  score.innerHTML = state.score.toString();
}
function updatePoint(direction, point) {
  switch (direction) {
    case "down":
      point.row += 1;
      break;
    case "left":
      point.col -= 1;
      break;
    case "right":
      point.col += 1;
      break;
    case "up":
      point.row -= 1;
      break;
  }
}
function update(state) {
  state.direction = state.pendingDirection;
  const oldHead = getGridNode(state.grid, state.head);
  assert(oldHead, "Cannot find old head node");
  assertSnakeNode(oldHead);
  oldHead.direction = state.direction;
  if (state.pause)
    return;
  updatePoint(state.direction, state.head);
  const head = getGridNode(state.grid, state.head);
  if (head == null || head.type === "snake") {
    state.gameOver = true;
    state.title = "Game over!";
    return;
  }
  if (head.type === "food") {
    state.score += 1;
    state.food = createFoodPoint(state.grid);
    const foodNode = getGridNode(state.grid, state.food);
    assert(foodNode, "Cannot find food node");
    foodNode.type = "food";
  } else {
    const tail = getGridNode(state.grid, state.tail);
    assert(tail, "Could not find tail");
    const snake = tail;
    assertSnakeNode(snake);
    tail.type = "empty";
    updatePoint(snake.direction, state.tail);
  }
  head.type = "snake";
  assertSnakeNode(head);
  head.direction = state.direction;
}
async function wait(ms) {
  return new Promise((res) => setTimeout(res, ms));
}
async function nextFrame(state, speed) {
  await wait(speed);
  update(state);
  render(state);
}
async function run(state) {
  render(state);
  while (!state.controller.signal.aborted) {
    await nextFrame(state, getSnakeSpeed(state));
  }
}
function main() {
  setHighScore(getHighScore());
  initButtons();
  const root = document.getElementById("root");
  assert(root, "Cannot find root node");
  const grid = initGrid(root);
  const playButton = document.getElementById("play-button");
  assert(playButton, "Cannot find play button");
  playButton.addEventListener("click", () => run(initGameState(grid)));
}
main();
