export type Match = "new" | "lit" | "spent";
export type Flame = "out" | "lit";

export type CandleState = {
  match: Match;
  flame: Flame;
};

export const EMPTY_CANDLE: CandleState = { match: "new", flame: "out" };

export function candleLine(state: CandleState): string {
  if (state.flame === "lit") return "The candle is lit.";
  if (state.match === "lit") return "The match is burning.";
  if (state.match === "spent") return "The match is spent.";
  return "The candle is dark.";
}

export function candleStatus(state: CandleState): string {
  if (state.flame === "lit") return "A warm glow.";
  if (state.match === "lit") return "Ready to light.";
  if (state.match === "spent") return "No match left.";
  return "Match is new.";
}

export function hasProgress(state: CandleState): boolean {
  return state.match !== "new" || state.flame === "lit";
}

export function parseCandle(raw: string | null): CandleState {
  if (!raw) return EMPTY_CANDLE;
  try {
    const value = JSON.parse(raw) as { match?: unknown; flame?: unknown };
    if (value.match !== "new" && value.match !== "lit" && value.match !== "spent") return EMPTY_CANDLE;
    if (value.flame !== "out" && value.flame !== "lit") return EMPTY_CANDLE;
    if (value.flame === "lit" && value.match !== "spent") return EMPTY_CANDLE;
    if (value.match === "lit" && value.flame === "lit") return EMPTY_CANDLE;
    return { match: value.match, flame: value.flame };
  } catch {
    return EMPTY_CANDLE;
  }
}

export function strikeMatch(state: CandleState): { state: CandleState; note: string } {
  if (state.match === "spent") return { state, note: "Spent match." };
  if (state.match === "lit") return { state, note: "Already burning." };
  return { state: { match: "lit", flame: "out" }, note: "Match struck." };
}

export function lightCandle(state: CandleState): { state: CandleState; note: string } {
  if (state.flame === "lit") return { state, note: "Already glowing." };
  if (state.match === "new") return { state, note: "Strike it first." };
  if (state.match === "spent") return { state, note: "Spent match." };
  return { state: { match: "spent", flame: "lit" }, note: "Candle lit." };
}

export function blowCandle(state: CandleState): { state: CandleState; note: string } {
  if (state.flame === "out") return { state, note: "Already out." };
  return { state: { match: "spent", flame: "out" }, note: "Candle blown." };
}

export function resetCandle(): { state: CandleState; note: string } {
  return { state: EMPTY_CANDLE, note: "Look at the candle." };
}
