import type { UnitsSymbols } from "../data/pieces";

export type TroopType = {
  type: UnitsSymbols;
  total: number;
  player: number;
};