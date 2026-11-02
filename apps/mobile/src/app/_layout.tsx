import { useEffect } from 'react';
import { View, StyleSheet, Platform, StatusBar as RNStatusBar } from 'react-native';
import { DefaultTheme, ThemeProvider, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import * as Linking from 'expo-linking';
import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { useAppBarTheme } from '@/hooks/use-appbar-theme';
import { BottomNavBar } from '@/components/BottomNavBar';
import { useAuthStore } from '@/stores/use-auth-store';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const appbar = useAppBarTheme();

  useEffect(() => {
    // Listen for the deep link that the web auth bridge redirects back with
    // the Firebase `id_token`. Fires when the app is already in the
    // foreground (the normal case: `openAuthSessionAsync` already resolved,
    // this is a belt-and-suspenders path for OS-level cold/warm relaunches).
    const subscription = Linking.addEventListener('url', ({ url }) => {
      if (url) {
        useAuthStore.getState().handleAuthUrl(url);
      }
    });

    // Check the initial URL on cold launch (e.g. the user tapped the redirect
    // link after the app had been killed).
    Linking.getInitialURL().then((url) => {
      if (url) {
        useAuthStore.getState().handleAuthUrl(url);
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

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
      <View style={styles.root}>
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
          <Stack.Screen name="book" options={{ headerShown: false }} />
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
          <Stack.Screen
            name="login"
            options={{
              headerShown: true,
              headerTitle: 'Account & Sign In',
              headerBackTitle: 'Back',
              headerTintColor: appbar.tintColor,
            }}
          />
          <Stack.Screen
            name="privacy"
            options={{
              headerShown: true,
              headerTitle: 'Privacy Policy',
              headerBackTitle: 'Back',
              headerTintColor: appbar.tintColor,
            }}
          />
          <Stack.Screen
            name="terms"
            options={{
              headerShown: true,
              headerTitle: 'Terms of Service',
              headerBackTitle: 'Back',
              headerTintColor: appbar.tintColor,
            }}
          />
          <Stack.Screen
            name="delete-account"
            options={{
              headerShown: true,
              headerTitle: 'Delete Account & Data',
              headerBackTitle: 'Back',
              headerTintColor: appbar.tintColor,
            }}
          />
        </Stack>
        <BottomNavBar />
      </View>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
});
