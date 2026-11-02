import { Colors } from '@/constants/theme';

export function useAppBarTheme() {
  return {
    isDark: false,
    backgroundColor: '#ffffff',
    statusBarStyle: 'dark' as 'light' | 'dark',
    textColor: Colors.light.text,
    tintColor: Colors.light.violet,
    borderColor: '#e8e6f2',
  };
}
