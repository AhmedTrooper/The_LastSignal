import { Image } from 'expo-image';
import * as SplashScreen from 'expo-splash-screen';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { Easing, Keyframe } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import { Waveform } from '@/components/Waveform';

const DURATION = 500;

export function AnimatedSplashOverlay() {
  const [animate, setAnimate] = useState(false);
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  const splashKeyframe = new Keyframe({
    0: {
      opacity: 1,
      transform: [{ scale: 1 }],
    },
    70: {
      opacity: 0.8,
      transform: [{ scale: 1.02 }],
    },
    100: {
      opacity: 0,
      transform: [{ scale: 1.04 }],
      easing: Easing.out(Easing.cubic),
    },
  });

  const splashContent = (
    <View style={styles.splashContent}>
      <View style={styles.iconWrapper}>
        <View style={styles.pulseRing} />
        <Image
          style={styles.image}
          source={require('@/assets/images/splash-icon.png')}
          contentFit="contain"
        />
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.splashTitle}>THE LAST SIGNAL</Text>
        <Text style={styles.splashSub}>MARS &amp; LUNAR ROBOTIC MEMORIAL</Text>
      </View>

      <View style={styles.badgePill}>
        <View style={styles.beaconDot} />
        <Text style={styles.badgeText}>8415.5 MHz • CARRIER LOCK</Text>
      </View>

      <Waveform seed="carrier-lock" bars={24} color="#38bdf8" height={16} style={styles.carrierWave} />
    </View>
  );

  return animate ? (
    <Animated.View
      entering={splashKeyframe.duration(DURATION).withCallback((finished) => {
        'worklet';
        if (finished) {
          scheduleOnRN(setVisible, false);
        }
      })}
      style={styles.splashOverlay}>
      {splashContent}
    </Animated.View>
  ) : (
    <View
      onLayout={() => {
        SplashScreen.hideAsync().finally(() => {
          setAnimate(true);
        });
      }}
      style={styles.splashOverlay}>
      {splashContent}
    </View>
  );
}

const styles = StyleSheet.create({
  splashOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#070814',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  splashContent: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    paddingHorizontal: 24,
  },
  iconWrapper: {
    width: 150,
    height: 150,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  pulseRing: {
    position: 'absolute',
    width: 146,
    height: 146,
    borderRadius: 73,
    borderWidth: 1.5,
    borderColor: 'rgba(56, 189, 248, 0.25)',
  },
  image: {
    width: 140,
    height: 140,
  },
  textContainer: {
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  splashTitle: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 4,
    textAlign: 'center',
  },
  splashSub: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
    textAlign: 'center',
  },
  badgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(56, 189, 248, 0.1)',
    borderColor: 'rgba(56, 189, 248, 0.25)',
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
  },
  beaconDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#38bdf8',
  },
  badgeText: {
    color: '#38bdf8',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  carrierWave: {
    marginTop: 8,
    opacity: 0.8,
  },
});

