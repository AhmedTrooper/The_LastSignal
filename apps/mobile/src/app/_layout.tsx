import { DefaultTheme, ThemeProvider, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { Colors } from '@/constants/theme';
import { AnimatedSplashOverlay } from '@/components/animated-icon';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return (
    <ThemeProvider value={DefaultTheme}>
      <StatusBar style="dark" />
      <AnimatedSplashOverlay />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: '#ffffff' },
          headerTintColor: Colors.light.violet,
          headerTitleStyle: { color: Colors.light.text },
          contentStyle: { backgroundColor: '#ffffff' },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="heroes/[slug]"
          options={{
            headerShown: true,
            headerTitle: '',
            headerBackTitle: 'Memorial',
            headerTintColor: Colors.light.violet,
          }}
        />
      </Stack>
    </ThemeProvider>
  );
}
