<script lang="ts">
  import { onDestroy } from "svelte";
  import { CELL_SIZE } from "../ConfigSettings";
  import type { GameBoard } from "../gameboard";
  import { checkForBarrierCollision } from "./checkBarrierCollision";
  import { mainIntervalStore } from "./GameStore";
  import { checkForBadGuyCollision } from "./checkForBadGuyCollision";

  export let gameBoard: GameBoard;

  let canTransition = true;
  let x = 13;
  let y = 7;
  let movementInt: number | null;
  const SPEED = 100;
  let direction: string | null = null;

  function moveUp() {
    if (movementInt) clearInterval(movementInt);
    direction = "up";
    movementInt = setInterval(() => {
      y = y + 1;
    }, SPEED);
  }

  function moveDown() {
    if (movementInt) clearInterval(movementInt);
    direction = "down";
    movementInt = setInterval(() => {
      y = y - 1;
    }, SPEED);
  }

  function moveLeft() {
    if (movementInt) clearInterval(movementInt);
    direction = "left";
    movementInt = setInterval(() => {
      if (x === 0) {
        canTransition = false;
        x = 27;
        setTimeout(() => {
          canTransition = true;
        }, SPEED / 3);
      } else {
        x = x - 1;
      }
    }, SPEED);
  }

  function moveRight() {
    if (movementInt) clearInterval(movementInt);
    direction = "right";
    movementInt = setInterval(() => {
      if (x === 27) {
        canTransition = false;
        x = 0;
        setTimeout(() => {
          canTransition = true;
        }, SPEED / 3);
      }
      x = x + 1;
    }, SPEED);
  }

  function isValidMove(desiredPath: string): boolean {
    switch (desiredPath) {
      case "up":
        if (gameBoard[x][y + 1].barrier) {
          return false;
        }
        break;
      case "down":
        if (gameBoard[x][y - 1].barrier) {
          return false;
        }
        break;
      case "left":
        if (gameBoard[x - 1][y].barrier) {
          return false;
        }
        break;
      case "right":
        if (gameBoard[x + 1][y].barrier) {
          return false;
        }
        break;
    }
    return true;
  }

  function handleKeydown(e: KeyboardEvent) {
    e.preventDefault();
    switch (e.key) {
      case "ArrowUp":
        if (!isValidMove("up")) return;
        moveUp();
        break;
      case "ArrowDown":
        if (!isValidMove("down")) return;
        moveDown();
        break;
      case "ArrowLeft":
        if (!isValidMove("left")) return;
        moveLeft();
        break;
      case "ArrowRight":
        if (!isValidMove("right")) return;
        moveRight();
        break;
    }
  }

  $: {
    if (direction && checkForBarrierCollision(x, y, direction)) {
      direction = null;
      if (movementInt) clearInterval(movementInt);
    }
  }

  $: {
    if ($mainIntervalStore) {
      checkForBadGuyCollision(x, y);
    }
  }

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
