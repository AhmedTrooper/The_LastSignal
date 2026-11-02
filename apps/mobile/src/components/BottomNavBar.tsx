import { Pressable, StyleSheet, Text, View } from 'react-native';
import { usePathname, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/constants/theme';
import { haptic } from '@/utils/haptics';

interface TabItem {
  key: 'home' | 'resting' | 'story' | 'timeline' | 'tributes';
  title: string;
  route: string;
  iconActive: keyof typeof Ionicons.glyphMap;
  iconInactive: keyof typeof Ionicons.glyphMap;
}

const TABS: TabItem[] = [
  {
    key: 'home',
    title: 'Home',
    route: '/',
    iconActive: 'home',
    iconInactive: 'home-outline',
  },
  {
    key: 'resting',
    title: 'Map',
    route: '/resting',
    iconActive: 'map',
    iconInactive: 'map-outline',
  },
  {
    key: 'story',
    title: 'Story',
    route: '/story',
    iconActive: 'book',
    iconInactive: 'book-outline',
  },
  {
    key: 'timeline',
    title: 'Timeline',
    route: '/timeline',
    iconActive: 'time',
    iconInactive: 'time-outline',
  },
  {
    key: 'tributes',
    title: 'Tributes',
    route: '/tributes',
    iconActive: 'heart',
    iconInactive: 'heart-outline',
  },
];

function getActiveTab(pathname: string): 'home' | 'resting' | 'story' | 'timeline' | 'tributes' {
  if (pathname.includes('/resting')) return 'resting';
  if (pathname.includes('/timeline')) return 'timeline';
  if (pathname.includes('/tributes')) return 'tributes';
  if (pathname === '/story' || (pathname.endsWith('/story') && !pathname.includes('/heroes/'))) {
    return 'story';
  }
  return 'home';
}

export function BottomNavBar() {
  const pathname = usePathname() || '/';
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const bottomInset = insets.bottom > 0 ? insets.bottom : 8;

  // Hide on the book reader (which has its own full-screen page navigation controls)
  // and on full-screen cinematic story player so touch controls are unobstructed
  if (
    pathname.includes('/book') ||
    (pathname.includes('/heroes/') && pathname.endsWith('/story'))
  ) {
    return null;
  }

  const activeTab = getActiveTab(pathname);

  const handlePress = (tab: TabItem) => {
    haptic.light();
    if (activeTab === tab.key && (pathname === tab.route || (tab.key === 'home' && pathname === '/'))) {
      return;
    }
    router.push(tab.route as any);
  };

  return (
    <View style={[styles.container, { paddingBottom: bottomInset, height: 52 + bottomInset }]}>
      {TABS.map((tab) => {
        const isActive = activeTab === tab.key;
        const color = isActive ? Colors.light.violet : Colors.light.textSecondary;

        return (
          <Pressable
            key={tab.key}
            onPress={() => handlePress(tab)}
            style={styles.tabButton}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
            accessibilityLabel={tab.title}
          >
            <Ionicons
              name={isActive ? tab.iconActive : tab.iconInactive}
              size={22}
              color={color}
            />
            <Text style={[styles.tabLabel, { color }]}>
              {tab.title}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderTopColor: Colors.light.line,
    borderTopWidth: 1,
    paddingTop: 6,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 4,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
});
