import { DefaultTheme, ThemeProvider, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { StatusBar as RNStatusBar, Platform } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { useAppBarTheme } from '@/hooks/use-appbar-theme';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const appbar = useAppBarTheme();

  return (
    <ThemeProvider value={DefaultTheme}>
      <StatusBar style={appbar.statusBarStyle} />
      {Platform.OS === 'android' && (
        <RNStatusBar
          translucent
          backgroundColor={appbar.backgroundColor}
          barStyle={appbar.statusBarStyle === 'light' ? 'light-content' : 'dark-content'}
        />
      )}
      <AnimatedSplashOverlay />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: appbar.backgroundColor },
          headerTintColor: appbar.tintColor,
          headerTitleStyle: { color: appbar.textColor },
          contentStyle: { backgroundColor: '#ffffff' },
          headerShadowVisible: false,
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="heroes/[slug]"
          options={{
            headerShown: true,
            headerTitle: '',
            headerBackTitle: 'Back',
            headerTintColor: appbar.tintColor,
          }}
        />
        <Stack.Screen
          name="favorites"
          options={{
            headerShown: true,
            headerTitle: 'Saved',
            headerBackTitle: 'Back',
            headerTintColor: appbar.tintColor,
          }}
        />
        <Stack.Screen
          name="about"
          options={{
            headerShown: true,
            headerTitle: 'About',
            headerBackTitle: 'Back',
            headerTintColor: appbar.tintColor,
          }}
        />
        <Stack.Screen
          name="gallery"
          options={{
            headerShown: true,
            headerTitle: 'Archive Gallery',
            headerBackTitle: 'Back',
            headerTintColor: appbar.tintColor,
          }}
        />
        <Stack.Screen
          name="games"
          options={{
            headerShown: true,
            headerTitle: 'Games',
            headerBackTitle: 'Back',
            headerTintColor: appbar.tintColor,
          }}
        />
      </Stack>
    </ThemeProvider>
  );
}
