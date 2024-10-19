<script lang="ts">
  import { onDestroy } from "svelte";
  import { CELL_SIZE } from "../ConfigSettings";
  import { gameBoard } from "../gameboard";
  import { baddiesMapStore } from "./GameStore";

  let x = 13;
  let y = 7;
  let direction: string | null;
  let canTransition = true;
  const SPEED = 240;

  function handleKeydown(e: KeyboardEvent) {
    e.preventDefault();

    switch (e.key) {
      case "ArrowDown":
        if (badButtonPress(x, y, "ArrowDown")) return;
        direction = "down";
        break;
      case "ArrowUp":
        if (badButtonPress(x, y, "ArrowUp")) return;
        direction = "up";
        break;
      case "ArrowLeft":
        if (badButtonPress(x, y, "ArrowLeft")) return;
        direction = "left";
        break;
      case "ArrowRight":
        if (badButtonPress(x, y, "ArrowRight")) return;
        direction = "right";
        break;
    }
  }

  let moving: number | null;

  function goLeft() {
    if (moving) clearInterval(moving);
    x = x - 1;
    moving = setInterval(() => {
      if (x === 0) {
        x = 28;
        canTransition = false;
      } else {
        canTransition = true;
      }
      x = x - 1;
    }, SPEED);
  }

  function goRight() {
    if (moving) clearInterval(moving);
    x = x + 1;
    moving = setInterval(() => {
      if (x === 27) {
        x = 0;
        canTransition = false;
      } else {
        canTransition = true;
      }
      x = x + 1;
    }, SPEED);
  }

  function goUp() {
    if (moving) clearInterval(moving);
    y = y + 1;
    moving = setInterval(() => {
      y = y + 1;
    }, SPEED);
  }

  function goDown() {
    if (moving) clearInterval(moving);
    y = y - 1;
    moving = setInterval(() => {
      y = y - 1;
    }, SPEED);
  }

  $: {
    switch (direction) {
      case "left":
        goLeft();
        break;
      case "right":
        goRight();
        break;
      case "up":
        goUp();
        break;
      case "down":
        goDown();
        break;
    }
  }

  function badButtonPress(x: number, y: number, keyPress: string) {
    // true return disables a button press -- keeps the character from going off course

    if (
      // Edge Case: the pac-man is switching sides:
      (x === 27 && y === 16) ||
      (x === 0 && y === 16)
    ) {
      return true;
    }

    try {
      if (keyPress === "ArrowUp" && gameBoard[x][y + 1]) {
        return true;
      }
      if (keyPress === "ArrowDown" && gameBoard[x][y - 1]) {
        return true;
      }
      if (keyPress === "ArrowLeft" && gameBoard[x - 1][y]) {
        return true;
      }
      if (keyPress === "ArrowRight" && gameBoard[x + 1][y]) {
        return true;
      }
    } catch (err) {
      console.warn({ x, y });
    }
  }

  function checkForCollision(x: number, y: number): boolean {
    //stops the character from moving if it hits a wall

    //early return if crossing other side of the board:
    if ((x === 0 && y === 16) || (x === 27 && y === 16)) {
      return false;
    }

    if (direction === "right" && gameBoard[x + 1][y]) {
      if (moving) clearInterval(moving);
      direction = null;
      return true;
    }

    if (direction === "left" && gameBoard[x - 1][y]) {
      if (moving) clearInterval(moving);
      direction = null;
      return true;
    }

    if (direction === "up" && gameBoard[x][y + 1]) {
      if (moving) clearInterval(moving);
      direction = null;
      return true;
    }

    if (direction === "down" && gameBoard[x][y - 1]) {
      if (moving) clearInterval(moving);
      direction = null;
      return true;
    }

    return false;
  }

  $: checkForCollision(x, y);

  window.addEventListener("keydown", handleKeydown);

  onDestroy(() => {
    window.removeEventListener("keydown", handleKeydown);
  });
</script>

<div
  style="
  font-size: {CELL_SIZE}px; 
  bottom: {y * CELL_SIZE}px; 
  left: {x * CELL_SIZE}px;
  position: absolute;"
  class:canTransition
>
  😛
</div>

<style>
  .canTransition {
    transition: 0.2s all ease;
  }
</style>
