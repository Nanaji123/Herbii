import { Glass } from '@/components/glass';
import { Icon, type IconName } from '@/components/icon';
import { PressableScale } from '@/components/pressable-scale';
import { useTheme } from '@/hooks/use-theme';

/** Round icon button (back, theme toggle, torch...). `overlay` for use on photos/camera. */
export function GlassButton({
  icon,
  onPress,
  label,
  size = 44,
  color,
  active,
  overlay,
}: {
  icon: IconName;
  onPress: () => void;
  label: string;
  size?: number;
  color?: string;
  active?: boolean;
  overlay?: boolean;
}) {
  const theme = useTheme();
  return (
    <PressableScale onPress={onPress} accessibilityLabel={label} accessibilityRole="button">
      <Glass
        radius={size / 2}
        translucent={overlay}
        style={{
          width: size,
          height: size,
          alignItems: 'center',
          justifyContent: 'center',
          ...(active ? { backgroundColor: '#D5F26B', borderColor: '#D5F26B' } : null),
        }}>
        <Icon name={icon} size={size * 0.46} color={active ? '#0E1A12' : (color ?? (overlay ? '#fff' : theme.text))} />
      </Glass>
    </PressableScale>
  );
}
