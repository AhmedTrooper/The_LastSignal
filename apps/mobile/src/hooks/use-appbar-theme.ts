import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';

export function useAppBarTheme() {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  return {
    isDark,
    backgroundColor: isDark ? '#0d0b26' : '#ffffff',
    statusBarStyle: (isDark ? 'light' : 'dark') as 'light' | 'dark',
    textColor: isDark ? '#ffffff' : Colors.light.text,
    tintColor: isDark ? '#ffffff' : Colors.light.violet,
  };
}
