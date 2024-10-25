import { get } from "svelte/store";
import { baddiesMapStore } from "./GameStore";

export function checkForBadGuyCollision(x: number, y: number) {
  const baddiesMap = get(baddiesMapStore)
  Object.entries(baddiesMap).forEach(([id, value]) => {
    if (value.x === x && value.y === y) {
      console.clear()
      console.warn("Baddy Collision")
    }
  })
}