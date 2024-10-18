export function flipCoin() {
  const random = Math.floor(Math.random() * 2);
  if (random === 0) {
    return false;
  }
  return true;
}