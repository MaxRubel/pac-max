<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import { CELL_SIZE } from "../ConfigSettings";

  import { badGuyInterValStore, updateBaddiesMap } from "./GameStore";
  import type { GameBoard } from "../gameboard";

  export let id: string;
  export let gameBoard: GameBoard;

  let ctx: CanvasRenderingContext2D;
  let direction = "up";
  let x = 14;
  let y = 18;
  let oldMovement = "up";
  let count = 0;
  let canTransition = true;

  function goRandomDirection() {
    const possibilities = [];
    if (!gameBoard[x][y + 1].barrier && oldMovement !== "down") {
      possibilities.push("up");
    }
    if (!gameBoard[x][y - 1].barrier && oldMovement !== "up") {
      possibilities.push("down");
    }
    if (!gameBoard[x + 1][y].barrier && oldMovement !== "left") {
      possibilities.push("right");
    }
    if (!gameBoard[x - 1][y].barrier && oldMovement !== "right") {
      possibilities.push("left");
    }

    // If no valid moves, allow doubling back
    if (possibilities.length === 0) {
      if (!gameBoard[x][y + 1].barrier) possibilities.push("up");
      if (!gameBoard[x][y - 1].barrier) possibilities.push("down");
      if (!gameBoard[x + 1][y].barrier) possibilities.push("right");
      if (!gameBoard[x - 1][y].barrier) possibilities.push("left");
    }

    if (possibilities.length > 0) {
      const randomIndex = Math.floor(Math.random() * possibilities.length);
      direction = possibilities[randomIndex];
      oldMovement = direction;
    }
  }

  function flipCoin() {
    const random = Math.floor(Math.random() * 2);
    if (random === 0) {
      return false;
    }
    return true;
  }

  function possibleHorizontalTurn() {
    if (flipCoin() && !gameBoard[x - 1][y].barrier) {
      direction = "left";
    }
    if (flipCoin() && !gameBoard[x + 1][y].barrier) {
      direction = "right";
    }
  }

  function possibleVerticalTurn() {
    if (flipCoin() && !gameBoard[x][y + 1].barrier) {
      direction = "up";
    }
    if (flipCoin() && !gameBoard[x][y - 1].barrier) {
      direction = "down";
    }
  }

  function checkNextMove() {
    switch (direction) {
      case "up":
        if (gameBoard[x][y + 1].barrier) {
          direction = "stopped";
        }
        possibleHorizontalTurn();
        break;

      case "down":
        if (gameBoard[x][y - 1].barrier) {
          direction = "stopped";
        }
        possibleHorizontalTurn();
        break;

      case "left":
        if (x === 0) {
          x = 27; // wrap around
          canTransition = false;
          setTimeout(() => {
            canTransition = true;
          }, 50);
          return;
        }
        if (gameBoard[x - 1][y].barrier) {
          direction = "stopped";
        }
        possibleVerticalTurn();
        break;

      case "right":
        if (x === 27) {
          x = 0; //wrap around
          canTransition = false;
          setTimeout(() => {
            canTransition = true;
          }, 50);
          return;
        }
        if (gameBoard[x + 1][y].barrier) {
          direction = "stopped";
        }
        possibleVerticalTurn();
        break;
    }

    if (oldMovement === direction) {
      count = count + 1;
    } else {
      count = 0;
    }

    if (count > 15) {
      goRandomDirection();
    } else {
      return;
    }
  }

  $: if ($badGuyInterValStore) {
    switch (direction) {
      case "stopped":
        goRandomDirection();
        break;
      case "up":
        y = y + 1;
        checkNextMove();
        break;
      case "down":
        y = y - 1;
        checkNextMove();
        break;
      case "left":
        x = x - 1;
        checkNextMove();
        break;
      case "right":
        x = x + 1;
        checkNextMove();
        break;
    }
    updateBaddiesMap({ id, x, y }); //send position to global hashmap
  }

  onMount(() => {
    const canvas = document.getElementById("levelMap") as HTMLCanvasElement;
    ctx = canvas.getContext("2d")!;

    flipCoin() ? (direction = "right") : (direction = "left");
  });
</script>

<div
  class="baddy"
  style="
  bottom:{y * CELL_SIZE}px; 
  left: {x * CELL_SIZE}px"
  class:canTransition
>
  👻
</div>

<style>
  .baddy {
    font-size: 20px;
    position: absolute;
  }

  .canTransition {
    transition: all ease 0.4s;
  }
</style>
