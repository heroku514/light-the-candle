import { useEffect, useState } from "react";
import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
import {
  blowCandle,
  candleLine,
  candleStatus,
  EMPTY_CANDLE,
  hasProgress,
  lightCandle,
  resetCandle,
  strikeMatch,
  type CandleState,
} from "./src/candle";
import { loadCandle, saveCandle } from "./src/store";

export default function App() {
  const [state, setState] = useState<CandleState>(EMPTY_CANDLE);
  const [note, setNote] = useState("Look at the candle.");
  const [ready, setReady] = useState(false);
  const [confirmNew, setConfirmNew] = useState(false);

  useEffect(() => {
    let alive = true;
    loadCandle()
      .then((loaded) => {
        if (!alive) return;
        setState(loaded);
        setNote(hasProgress(loaded) ? "Saved candle loaded." : "Look at the candle.");
        setReady(true);
      })
      .catch(() => {
        if (alive) setNote("Could not read the candle.");
      });
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    if (!ready) return;
    saveCandle(state).catch(() => setNote("Could not save the candle."));
  }, [ready, state]);

  if (!ready && note === "Look at the candle.") {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <Text style={styles.loading}>Loading the candle</Text>
        </View>
      </SafeAreaView>
    );
  }

  function apply(result: { state: CandleState; note: string }) {
    setState(result.state);
    setConfirmNew(false);
    setNote(result.note);
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.body}>
        <Text style={styles.title}>Light the Candle</Text>
        <Text style={styles.note}>{note}</Text>
        <Text style={styles.count}>{candleStatus(state)}</Text>
        <Text style={styles.line}>{candleLine(state)}</Text>
        <View style={styles.row}>
          <BigButton label="Strike the match" inRow onPress={() => apply(strikeMatch(state))} />
          <BigButton label="Light the candle" inRow onPress={() => apply(lightCandle(state))} />
        </View>
        <View style={styles.row}>
          <BigButton label="Blow it out" inRow onPress={() => apply(blowCandle(state))} />
          {confirmNew ? (
            <BigButton label="Cancel new" inRow onPress={onCancelNew} />
          ) : (
            <BigButton label="New candle" inRow onPress={() => setConfirmNew(true)} />
          )}
        </View>
        {confirmNew ? <BigButton label="Confirm new" filled onPress={onConfirmNew} /> : null}
      </View>
    </SafeAreaView>
  );

  function onConfirmNew() {
    const result = resetCandle();
    setState(result.state);
    setConfirmNew(false);
    setNote(result.note);
  }

  function onCancelNew() {
    setConfirmNew(false);
    setNote("New candle canceled.");
  }
}

function BigButton({
  label,
  onPress,
  filled,
  inRow,
}: {
  label: string;
  onPress: () => void;
  filled?: boolean;
  inRow?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={[styles.button, inRow && styles.buttonRow, filled && styles.buttonFilled]}
    >
      <Text style={[styles.buttonText, filled && styles.buttonTextFilled]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F6EBD8" },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  loading: { fontSize: 28, fontWeight: "800", color: "#2C2118" },
  body: { flex: 1, paddingHorizontal: 16, paddingTop: 8, gap: 8 },
  title: { fontSize: 32, fontWeight: "800", color: "#2C2118" },
  note: { fontSize: 18, color: "#6A4A32", minHeight: 24 },
  count: { fontSize: 22, fontWeight: "700", color: "#2C2118" },
  line: { fontSize: 34, fontWeight: "800", color: "#C45C26", lineHeight: 40 },
  row: { flexDirection: "row", gap: 8 },
  button: {
    minHeight: 64,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#2C2118",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
    backgroundColor: "#FFFFFF",
  },
  buttonRow: { flex: 1 },
  buttonFilled: { backgroundColor: "#2C2118" },
  buttonText: { fontSize: 18, fontWeight: "800", color: "#2C2118", textAlign: "center" },
  buttonTextFilled: { color: "#FFFFFF" },
});
