<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import { gameBoard } from "../gameboard";

  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D | null;
  let pacMan = { direction: "stopped", x: 11, y: 19 };
  let intervalId: number | null;

  const CELL_SIZE = 35;
  const SPEED = 0.15;

  function startGame() {
    intervalId = setInterval(() => {
      movePacMan();
    }, 30);
  }

  function stopGame() {
    if (intervalId) clearInterval(intervalId);
  }

  function setupLevel() {
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let x = 0; x < gameBoard.length; x++) {
      for (let y = 0; y < gameBoard[x].length; y++) {
        const barrier = gameBoard[x][y];
        if (barrier) {
          ctx.beginPath();
          ctx.rect(
            x * CELL_SIZE,
            y * CELL_SIZE,
            CELL_SIZE - 15,
            CELL_SIZE - 15
          );
          ctx.fillStyle = "black";
          ctx.fill();
          ctx.strokeStyle = "rgb(162, 112, 255)";
          ctx.stroke();
        }
      }
    }
  }

  function isValidMove(x: number, y: number): boolean {
    const trueX = Math.round(x);
    const trueY = Math.round(y);
    return gameBoard[trueX][trueY] !== 1;
  }

  function movePacMan() {
    if (!ctx) return;

    let newX = pacMan.x;
    let newY = pacMan.y;

    switch (pacMan.direction) {
      case "right":
        newX += SPEED;
        break;
      case "left":
        newX -= SPEED;
        break;
      case "up":
        newY += SPEED;
        break;
      case "down":
        newY -= SPEED;
        break;
    }

    // Check if the new position is valid
    if (isValidMove(newX, newY)) {
      pacMan.x = newX;
      pacMan.y = newY;
    } else {
      pacMan.direction = "stopped";
    }

    // Wrap around the canvas
    pacMan.x = (pacMan.x + gameBoard.length) % gameBoard.length;
    pacMan.y = (pacMan.y + gameBoard[0].length) % gameBoard[0].length;

    // Redraw the game
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setupLevel();
    ctx.font = "35px Arial";
    ctx.fillText("😁", pacMan.x * CELL_SIZE, (pacMan.y + 0.8) * CELL_SIZE);
  }

  function handleKeydown(event: KeyboardEvent) {
    event.preventDefault();
    const newDirection = event.key.replace("Arrow", "").toLowerCase();

    let newX = pacMan.x;
    let newY = pacMan.y;

    switch (newDirection) {
      case "right":
        newX += SPEED;
        break;
      case "left":
        newX -= SPEED;
        break;
      case "up":
        newY += SPEED;
        break;
      case "down":
        newY -= SPEED;
        break;
      default:
        return; // Invalid key pressed
    }

    // Check if the new direction is valid
    if (isValidMove(newX, newY)) {
      pacMan.direction = newDirection as "right" | "left" | "up" | "down";
      movePacMan();
    }
  }

  onMount(() => {
    canvas.width = gameBoard.length * CELL_SIZE;
    canvas.height = gameBoard[0].length * CELL_SIZE;
    ctx = canvas.getContext("2d");

    if (!ctx) return;
    ctx.save();
    ctx.translate(0, canvas.height);
    ctx.scale(1, -1);
    setupLevel();

    if (!ctx) return;
    ctx.font = "35px Arial";
    ctx.fillText("😁", 12.2 * CELL_SIZE, 12.65 * CELL_SIZE);

    window.addEventListener("keydown", handleKeydown);
  });

  onDestroy(() => {
    if (intervalId) {
      clearInterval(intervalId);
    }

    window.removeEventListener("keydown", handleKeydown);
  });
</script>

<main>
  <div class="game-container">
    <div class="top-button-row">
      <button on:click={startGame}>Start Game</button>
      <button on:click={stopGame}>Stop Game</button>
      <div class="stat">{pacMan.direction}</div>
    </div>
    <canvas class="main-canvas" bind:this={canvas}></canvas>
  </div>
</main>

<style>
  .game-container {
    display: flex;
    flex-direction: column;
  }

  .top-button-row {
    display: flex;
    align-items: center;
    gap: 1em;
    margin-bottom: 1em;
    border-radius: 10px;
    border: 1px solid lightblue;
    background-color: lightblue;
    padding: 1em;
  }

  .stat {
    background-color: white;
    padding: 0.5em 2em;
    border-radius: 8px;
  }

  .main-canvas {
    border: black;
    border-radius: 20px;
    background-color: black;
    color: rgb(162, 112, 255);
  }
</style>
