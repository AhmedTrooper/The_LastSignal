import { StyleSheet, View } from "react-native";
import { Image } from "expo-image";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/theme";
import { SIGNATURES, assetUrl, type Hero } from "@thelastsignal/data";

interface Props {
  hero: Hero;
}

export function HeroSignature({ hero }: Props) {
  const sig = SIGNATURES[hero.slug];
  if (!sig) return null;

  return (
    <View style={styles.card}>
      <ThemedText style={styles.eyebrow} type="small">HIGHLIGHT</ThemedText>
      <ThemedText style={styles.title} type="subtitle">{sig.title}</ThemedText>
      <ThemedText style={styles.intro} type="small">{sig.intro}</ThemedText>

      {/* 1. Frames Signature */}
      {sig.kind === "frames" && (
        <View style={styles.framesGrid}>
          {sig.frames.map((f, i) => (
            <View key={f.label} style={styles.frameItem}>
              {f?.image ? (
                <View style={styles.frameImgWrap}>
                  <Image source={{ uri: assetUrl(`images/${f.image}.jpg`) }} style={styles.frameImg} contentFit="cover" />
                </View>
              ) : (
                <View style={[styles.frameImgWrap, styles.framePlaceholder]}>
                  <ThemedText style={styles.framePlaceholderText} type="small">Final Frame</ThemedText>
                </View>
              )}
              <ThemedText style={styles.frameLabel}>{f.label}</ThemedText>
              {f.sub && <ThemedText style={styles.frameSub} type="small">{f.sub}</ThemedText>}
            </View>
          ))}
        </View>
      )}

      {/* 2. Clock Signature */}
      {sig.kind === "clock" && (
        <View style={styles.clockTimeline}>
          {sig.events.map((ev, i) => (
            <View key={ev.t} style={styles.clockRow}>
              <View style={[styles.timeBadge, ev.big && styles.timeBadgeBig]}>
                <ThemedText style={[styles.timeText, ev.big && styles.timeTextBig]}>{ev.t}</ThemedText>
              </View>
              <View style={styles.clockContent}>
                <ThemedText style={[styles.clockText, ev.big && styles.clockTextBig]}>{ev.text}</ThemedText>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* 3. Bars Signature */}
      {sig.kind === "bars" && (
        <View style={styles.barsContainer}>
          {sig.bars.map((b) => {
            const maxVal = Math.max(...sig.bars.map((item) => item.value));
            const pct = Math.max(12, Math.round((b.value / maxVal) * 100));
            return (
              <View key={b.label} style={styles.barGroup}>
                <View style={styles.barHeader}>
                  <ThemedText style={styles.barLabel}>{b.label}</ThemedText>
                  <ThemedText style={styles.barValText}>
                    {b.value} <ThemedText style={styles.unitText} type="small">{sig.unit}</ThemedText>
                  </ThemedText>
                </View>
                <View style={styles.barTrack}>
                  <View style={[styles.barFill, { width: `${pct}%` }, b.muted && styles.barFillMuted]} />
                </View>
                {b.note && <ThemedText style={styles.barNote} type="small">{b.note}</ThemedText>}
              </View>
            );
          })}
        </View>
      )}

      {/* 4. Stats Signature */}
      {sig.kind === "stats" && (
        <View style={styles.statsContainer}>
          <View style={styles.statsGrid}>
            {sig.items.map((it) => (
              <View key={it.label} style={styles.statBox}>
                <ThemedText style={styles.statVal}>{it.value}</ThemedText>
                <ThemedText style={styles.statLbl} type="small">{it.label}</ThemedText>
              </View>
            ))}
          </View>
          {sig.compare?.map((c) => (
            <View key={c.label} style={styles.compareCard}>
              <ThemedText style={styles.compareLabel}>{c.label}</ThemedText>
              <View style={styles.compareBar}>
                <View style={[styles.compareFill, { width: `${Math.min(100, Math.round((c.actual / (c.actual + c.planned)) * 100))}%` }]} />
              </View>
              <View style={styles.compareLabels}>
                <ThemedText style={styles.compareNote} type="small">{c.plannedText}</ThemedText>
                <ThemedText style={[styles.compareNote, styles.compareActual]} type="small">{c.actualText}</ThemedText>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* 5. Sequence Signature */}
      {sig.kind === "sequence" && (
        <View style={styles.sequenceContainer}>
          {sig.steps.map((st, i) => (
            <View key={st.label} style={styles.sequenceRow}>
              <View style={styles.sequenceDotCol}>
                <View style={styles.sequenceDot} />
                {i < sig.steps.length - 1 && <View style={styles.sequenceLine} />}
              </View>
              <View style={styles.sequenceTextCol}>
                <ThemedText style={styles.sequenceLabel}>{st.label}</ThemedText>
                <ThemedText style={styles.sequenceText}>{st.text}</ThemedText>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* 6. Seismo Signature */}
      {sig.kind === "seismo" && (
        <View style={styles.seismoGrid}>
          {sig.items.map((it) => (
            <View key={it.label} style={styles.seismoBox}>
              <ThemedText style={styles.seismoVal}>{it.value}</ThemedText>
              <ThemedText style={styles.seismoLbl} type="small">{it.label}</ThemedText>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.light.line,
    gap: 8,
  },
  eyebrow: {
    color: Colors.light.violet,
    fontWeight: "700",
    letterSpacing: 1.5,
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
  },
  intro: {
    color: Colors.light.textSecondary,
    lineHeight: 18,
    marginBottom: 8,
  },
  framesGrid: {
    gap: 12,
  },
  frameItem: {
    gap: 4,
  },
  frameImgWrap: {
    width: "100%",
    aspectRatio: 16 / 9,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: Colors.light.backgroundElement,
  },
  frameImg: {
    width: "100%",
    height: "100%",
  },
  framePlaceholder: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0c0a22",
  },
  framePlaceholderText: {
    color: "#ffffff",
    fontFamily: "monospace",
  },
  frameLabel: {
    fontWeight: "700",
    fontSize: 14,
    color: Colors.light.text,
    marginTop: 2,
  },
  frameSub: {
    color: Colors.light.textSecondary,
    lineHeight: 16,
  },
  clockTimeline: {
    gap: 12,
  },
  clockRow: {
    flexDirection: "row",
    gap: 12,
    alignItems: "flex-start",
  },
  timeBadge: {
    backgroundColor: Colors.light.backgroundElement,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.light.line,
    minWidth: 70,
    alignItems: "center",
  },
  timeBadgeBig: {
    backgroundColor: Colors.light.violet,
    borderColor: Colors.light.violet,
  },
  timeText: {
    fontFamily: "monospace",
    fontSize: 12,
    fontWeight: "700",
    color: Colors.light.text,
  },
  timeTextBig: {
    color: "#ffffff",
  },
  clockContent: {
    flex: 1,
    paddingTop: 2,
  },
  clockText: {
    fontSize: 13,
    lineHeight: 18,
    color: Colors.light.text,
  },
  clockTextBig: {
    fontWeight: "700",
    color: Colors.light.text,
  },
  barsContainer: {
    gap: 12,
  },
  barGroup: {
    gap: 4,
  },
  barHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
  },
  barLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.light.text,
  },
  barValText: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.light.violet,
  },
  unitText: {
    fontSize: 11,
    fontWeight: "400",
    color: Colors.light.textSecondary,
  },
  barTrack: {
    height: 8,
    backgroundColor: Colors.light.backgroundElement,
    borderRadius: 4,
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    backgroundColor: Colors.light.violet,
    borderRadius: 4,
  },
  barFillMuted: {
    backgroundColor: "#a78bfa",
  },
  barNote: {
    color: Colors.light.textSecondary,
    fontSize: 11,
  },
  statsContainer: {
    gap: 12,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  statBox: {
    flex: 1,
    minWidth: "45%",
    backgroundColor: Colors.light.backgroundElement,
    padding: 12,
    borderRadius: 14,
  },
  statVal: {
    fontSize: 18,
    fontWeight: "800",
    color: Colors.light.violet,
  },
  statLbl: {
    color: Colors.light.textSecondary,
    marginTop: 2,
  },
  compareCard: {
    backgroundColor: Colors.light.backgroundElement,
    padding: 12,
    borderRadius: 14,
    gap: 6,
  },
  compareLabel: {
    fontWeight: "700",
    fontSize: 13,
  },
  compareBar: {
    height: 8,
    backgroundColor: Colors.light.line,
    borderRadius: 4,
    overflow: "hidden",
  },
  compareFill: {
    height: "100%",
    backgroundColor: Colors.light.violet,
    borderRadius: 4,
  },
  compareLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  compareNote: {
    fontSize: 11,
    color: Colors.light.textSecondary,
  },
  compareActual: {
    fontWeight: "700",
    color: Colors.light.violet,
  },
  sequenceContainer: {
    gap: 12,
  },
  sequenceRow: {
    flexDirection: "row",
    gap: 12,
  },
  sequenceDotCol: {
    alignItems: "center",
    width: 14,
  },
  sequenceDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.light.violet,
    marginTop: 4,
  },
  sequenceLine: {
    flex: 1,
    width: 2,
    backgroundColor: Colors.light.line,
    marginTop: 4,
  },
  sequenceTextCol: {
    flex: 1,
    paddingBottom: 8,
    gap: 2,
  },
  sequenceLabel: {
    fontWeight: "700",
    fontSize: 13,
    color: Colors.light.text,
  },
  sequenceText: {
    fontSize: 13,
    color: Colors.light.textSecondary,
    lineHeight: 18,
  },
  seismoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  seismoBox: {
    flex: 1,
    minWidth: "45%",
    backgroundColor: Colors.light.backgroundElement,
    padding: 14,
    borderRadius: 14,
  },
  seismoVal: {
    fontSize: 20,
    fontWeight: "800",
    color: Colors.light.violet,
  },
  seismoLbl: {
    color: Colors.light.textSecondary,
    marginTop: 2,
  },
});
