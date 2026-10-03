import AsyncStorage from "@react-native-async-storage/async-storage";
import { parseCandle, type CandleState } from "./candle";

const KEY = "light-the-candle-v1";

export async function loadCandle(): Promise<CandleState> {
  const raw = await AsyncStorage.getItem(KEY);
  return parseCandle(raw);
}

export async function saveCandle(state: CandleState): Promise<void> {
  await AsyncStorage.setItem(KEY, JSON.stringify(state));
}
