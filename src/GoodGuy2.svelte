<script lang="ts">
  import { onDestroy } from "svelte";
  import { CELL_SIZE, PACMAN_SPEED } from "../ConfigSettings";
  import type { GameBoard } from "../gameboard";
  import { checkForBarrierCollision } from "./checkBarrierCollision";
  import { mainIntervalStore } from "./GameStore";
  import { checkForBadGuyCollision } from "./checkForBadGuyCollision";

  export let gameBoard: GameBoard;

  let canTransition = true; // toggles CSS movement
  let x = 13; // start position of PacMan
  let y = 7; // start position of Pacman

  let movementInt: number | null;

  let direction: string | null = null;

  function moveUp() {
    if (movementInt) clearInterval(movementInt);
    direction = "up";
    movementInt = setInterval(() => {
      y = y + 1;
    }, PACMAN_SPEED);
  }

  function moveDown() {
    if (movementInt) clearInterval(movementInt);
    direction = "down";
    movementInt = setInterval(() => {
      y = y - 1;
    }, PACMAN_SPEED);
  }

  function moveLeft() {
    if (movementInt) clearInterval(movementInt);
    direction = "left";
    movementInt = setInterval(() => {
      // Wrapping around the game board
      if (x === 0) {
        canTransition = false;
        x = 27;
        setTimeout(() => {
          canTransition = true;
        }, PACMAN_SPEED / 3);
      } else {
        x = x - 1;
      }
    }, PACMAN_SPEED);
  }

  function moveRight() {
    if (movementInt) clearInterval(movementInt);
    direction = "right";
    movementInt = setInterval(() => {
      // Wrapping around the game board
      if (x === 27) {
        canTransition = false;
        x = 0;
        setTimeout(() => {
          canTransition = true;
        }, PACMAN_SPEED / 3);
      }
      x = x + 1;
    }, PACMAN_SPEED);
  }

  // Checks if the keypress would hit a wall
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
    // checks for collision with wall when moving
    if (direction && checkForBarrierCollision(x, y, direction)) {
      direction = null;
      if (movementInt) clearInterval(movementInt);
    }
  }

  // checks for collision with bad guy on global interval
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
    transition: 0.4s all ease;
  }
</style>
