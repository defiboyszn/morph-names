import { Address } from "viem"

export const getAddress = (id?: number): Address => {
    return `0x0196507F4cD9b19Fe11371fD0453494284066Dc4`
}
export const roundNumber = (number: number) => {
    const decimalPlaces = Math.max(
      0,
      3 - Math.floor(Math.log10(Math.abs(number)))
    );
    const factor = 10 ** decimalPlaces;
    return Math.round(number * factor) / factor || 0;
  };