<script lang="ts">
  import { onMount } from "svelte";
  import { gameBoard } from "../gameboard";
  import { game_is_running } from "./GameStore";
  import BadGuy from "./BadGuy.svelte";
  import { CELL_SIZE } from "../ConfigSettings";

  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D | null;
  let baddies: Date[] = [];

  const SPEED = 0.15;

  function renderLevelMap() {
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let x = 0; x < gameBoard.length; x++) {
      for (let y = 0; y < gameBoard[x].length; y++) {
        const barrier = gameBoard[x][y];
        if (x >= 11 && x <= 16 && y >= 15 && y <= 17) {
          continue; // Skip drawing for points within the bullpen
        }
        if ((x === 13 || x === 14) && y === 18) {
          continue;
        }
        if (barrier) {
          ctx.beginPath();
          ctx.rect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
          ctx.fillStyle = "black";
          ctx.fill();
          ctx.strokeStyle = "rgb(162, 112, 255)";
          ctx.stroke();
        }
      }
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
    renderLevelMap();
  });

  function startGame() {
    game_is_running.set(true);
    baddies = [...baddies, new Date()];
  }

  function stopGame() {
    game_is_running.set(false);
    console.log("game over");
    baddies = [];
  }

  // $: {
  //   console.log($game_is_running);
  // }
</script>

<main>
  <div class="game-container">
    <div class="top-button-row">
      <button on:click={startGame}>Add Bad Guy</button>
      <button on:click={stopGame}>Stop Game</button>
      <div class="stats">
        <div>running: {$game_is_running}</div>
        <div>baddies: {baddies.length}</div>
      </div>
    </div>
    <div class="game-map-container">
      <canvas id="levelMap" class="level-map" bind:this={canvas}> </canvas>
      {#each baddies as id (id)}
        <BadGuy {id} />
      {/each}
    </div>
  </div>
</main>

<style>
  .game-container {
    display: flex;
    flex-direction: column;
  }

  .game-map-container {
    position: relative;
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

  .stats {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
  }

  .level-map {
    border: black;
    border-radius: 20px;
    background-color: black;
    color: rgb(162, 112, 255);
  }
</style>
