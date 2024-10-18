import { writable } from "svelte/store";

export type BaddyType = {
  id: string;
  x: number;
  y: number;
};

export const game_is_running = writable(false)

export const baddiesMapStore = writable<{ [key: string]: BaddyType }>({});

export function updateBaddiesMap(baddyObj: BaddyType) {
  baddiesMapStore.update((preVal) => ({
    ...preVal,
    [baddyObj.id]: baddyObj,
  }));
}
