import {
  useState,
  useEffect,
  useRef,
  useCallback,
  useImperativeHandle,
  type Ref,
} from "react";
import {
  StyleSheet,
  Text,
  Pressable,
  View,
} from "react-native";
import { haptic } from "@/utils/haptics";
import type { Line } from "../story";

export type RadioHandle = {
  say: (
    lines: Line[] | string,
    opts?: { clear?: boolean; hold?: number }
  ) => void;
  clear: () => void;
};

interface RadioProps {
  ref?: Ref<RadioHandle>;
  big?: boolean;
  onIdle?: () => void;
}

export function Radio({ ref, big = false, onIdle }: RadioProps) {
  const queue = useRef<{ line: Line; hold: number }[]>([]);
  const [cur, setCur] = useState<{
    line: Line;
    shown: number;
    hold: number;
  } | null>(null);
  const [visible, setVisible] = useState(false);
  const active = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onIdleRef = useRef(onIdle);

  useEffect(() => {
    onIdleRef.current = onIdle;
  }, [onIdle]);

  const next = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    const n = queue.current.shift();
    if (!n) {
      active.current = false;
      onIdleRef.current?.();
      if (!big) {
        hideTimer.current = setTimeout(() => setVisible(false), 2600);
      }
      return;
    }
    if (hideTimer.current) clearTimeout(hideTimer.current);
    active.current = true;
    setVisible(true);
    setCur({ line: n.line, shown: 0, hold: n.hold });
    haptic.light();
  }, [big]);

  useEffect(() => {
    if (!cur) return;
    const len = cur.line.text.length;
    if (cur.shown < len) {
      timer.current = setTimeout(() => {
        setCur((c) => (c ? { ...c, shown: Math.min(len, c.shown + 2) } : c));
        if (cur.shown % 8 === 0) {
          haptic.selection();
        }
      }, 26);
    } else {
      timer.current = setTimeout(next, cur.hold + len * 22);
    }
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [cur, next]);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
  }, []);

  useImperativeHandle(ref, () => ({
    say(lines, opts) {
      const list =
        typeof lines === "string"
          ? [{ who: "ground" as const, text: lines }]
          : lines;
      if (opts?.clear) queue.current = [];
      queue.current.push(
        ...list.map((line) => ({ line, hold: opts?.hold ?? 1400 }))
      );
      if (!active.current || opts?.clear) next();
    },
    clear() {
      queue.current = [];
      active.current = false;
      if (timer.current) clearTimeout(timer.current);
      setCur(null);
      setVisible(false);
    },
  }));

  if (!cur || !visible) return null;
  const isNote = cur.line.who === "note";

  return (
    <Pressable
      onPress={() => {
        if (cur.shown < cur.line.text.length) {
          setCur({ ...cur, shown: cur.line.text.length });
        } else {
          next();
        }
      }}
      style={[
        styles.box,
        big ? styles.boxBig : styles.boxFloating,
      ]}
    >
      <View style={styles.headerRow}>
        {!isNote && <View style={styles.cyanDot} />}
        <Text style={[styles.senderLabel, isNote && styles.senderLabelNote]}>
          {isNote ? "NOTE" : "GROUND"}
        </Text>
      </View>
      <Text style={[styles.bodyText, big ? styles.bodyTextBig : styles.bodyTextNormal, isNote && styles.bodyTextNote]}>
        {cur.line.text.slice(0, cur.shown)}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  box: {
    overflow: "hidden",
  },
  boxFloating: {
    maxWidth: 380,
    backgroundColor: "rgba(0, 0, 0, 0.65)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  boxBig: {
    width: "100%",
    maxWidth: 600,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    marginBottom: 6,
  },
  cyanDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#67e8f9",
  },
  senderLabel: {
    fontFamily: "monospace",
    fontSize: 11,
    letterSpacing: 1.8,
    color: "#67e8f9",
    fontWeight: "700",
  },
  senderLabelNote: {
    color: "#fde68a",
  },
  bodyText: {
    color: "#ffffff",
    lineHeight: 22,
  },
  bodyTextNormal: {
    fontSize: 14,
    fontWeight: "400",
  },
  bodyTextBig: {
    fontSize: 22,
    lineHeight: 32,
    fontWeight: "500",
  },
  bodyTextNote: {
    color: "rgba(254, 243, 199, 0.9)",
  },
});
