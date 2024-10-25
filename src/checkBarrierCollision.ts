import { gameBoard } from "../gameboard"

export function checkForBarrierCollision(x: number, y: number, direction: string | null): boolean {
  console.log("checking", { x, y })
  //stops the character from moving if it hits a wall
  if (!direction) return true
  //early return if crossing other side of the board:
  if ((x === 0 && y === 16) || (x === 27 && y === 16)) {
    return false;
  }

  if (direction === "right" && gameBoard[x + 1][y]) {
    return true;
  }

  if (direction === "left" && gameBoard[x - 1][y]) {
    return true;
  }

  if (direction === "up" && gameBoard[x][y + 1]) {
    return true;
  }

  if (direction === "down" && gameBoard[x][y - 1]) {
    return true;
  }

  return false;
}