<script lang="ts">
  import { onMount } from "svelte";
  import { gameBoard, initGameBoard } from "../gameboard";
  import {
    baddiesMapStore,
    game_is_running,
    incremembetBadGuyInterval,
    incrementMainInterval,
    mainIntervalStore,
  } from "./GameStore";
  import {
    BAD_GUY_INTERVAL,
    CELL_SIZE,
    MAIN_INTERVAL,
  } from "../ConfigSettings";
  import BadGuyComponent from "./BadGuyComponent.svelte";
  import uniqid from "uniqid";
  import { updateBaddiesMap } from "./GameStore";
  import GoodGuyComponent from "./GoodGuyComponent.svelte";
  import type { GameBoard } from "../gameboard";
  import { flipCoin } from "./utils/flipCoin";
  import GoodGuy2 from "./GoodGuy2.svelte";

  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D | null;
  let initializedGameBoard: GameBoard | null = null;
  let mainInterval: number | null;
  let badGuyInterval: number | null;

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
    ctx.scale(1, -1); //<--- flip canvas upside down
    renderLevelMap();
    initializedGameBoard = initGameBoard();

    // checks colision and also move the pacman
    mainInterval = setInterval(() => {
      incrementMainInterval();
    }, MAIN_INTERVAL);

    // updates bad guy postiion in global state and move the bad guy
    badGuyInterval = setInterval(() => {
      incremembetBadGuyInterval();
    }, BAD_GUY_INTERVAL);
  });

  function addBaddy() {
    game_is_running.set(true);
    const newId = uniqid();

    updateBaddiesMap({
      id: newId,
      x: flipCoin() ? 14 : 13,
      y: 0,
    });
  }

  function stopGame() {
    game_is_running.set(false);
    console.log("game over");
    baddiesMapStore.set({});
    if (mainInterval) clearInterval(mainInterval);
    mainIntervalStore.set(0);
  }
</script>

<main>
  <!-- prettier-ignore -->
  <div class="game-container">


    <!-- ---debugging container--- -->
    <div class="top-button-row">
      <button on:click={addBaddy}> Add Enemy </button>
      <button on:click={stopGame}> Clear </button>

      <div class="stats">
        <div>running: {$game_is_running}</div>
        <div>baddies: {Object.values($baddiesMapStore).length}</div>
      </div>
    </div>

    <!-- ---game canvas--- -->
    <div class="game-map-container">
      <canvas id="levelMap" class="level-map" bind:this={canvas}> </canvas>
      {#if initializedGameBoard}
        {#each Object.values($baddiesMapStore) as baddy (baddy.id)}
          <BadGuyComponent id={baddy.id} gameBoard={initializedGameBoard}/>
        {/each}
        <!-- <GoodGuyComponent gameBoard={initializedGameBoard}/> -->
        <GoodGuy2 gameBoard={initializedGameBoard}/>
      {/if}
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
