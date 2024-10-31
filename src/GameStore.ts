import { writable } from "svelte/store";

export type BaddyType = {
  id: string;
  x: number;
  y: number;
};

export const game_is_running = writable(false)
export const baddiesMapStore = writable<{ [key: string]: BaddyType }>({});
export const mainIntervalStore = writable(0)
export const badGuyInterValStore = writable(0)

export function updateBaddiesMap(baddyObj: BaddyType) {
  baddiesMapStore.update((preVal) => ({
    ...preVal,
    [baddyObj.id]: baddyObj,
  }));
}

export function deleteBaddy(id: string) {
  baddiesMapStore.update((prevMap) => {
    const newMap = { ...prevMap }
    delete newMap[id]
    return newMap
  })
}

export function incrementMainInterval() {
  mainIntervalStore.update((preVal) => (preVal + 1))
}

export function incrementBadGuyInterval() {
  badGuyInterValStore.update((preVal) => preVal + 1)
}