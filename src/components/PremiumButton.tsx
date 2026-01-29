import { StyleSheet, Text, TouchableOpacity, ActivityIndicator, ViewStyle, TextStyle, StyleProp } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Colors, Spacing, BorderRadius, Shadows, Fonts } from '../../constants/theme';

interface PremiumButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'danger';
    disabled?: boolean;
    loading?: boolean;
    style?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
}

export const PremiumButton: React.FC<PremiumButtonProps> = ({
    title,
    onPress,
    variant = 'primary',
    disabled = false,
    loading = false,
    style,
    textStyle,
}) => {
    const isPrimary = variant === 'primary';
    const isDanger = variant === 'danger';

    // Gradient colors based on variant
    const getGradientColors = () => {
        if (disabled) return [Colors.light.icon, Colors.light.icon]; // Gray for disabled
        if (isDanger) return [Colors.light.error, '#DC2626']; // Red
        if (isPrimary) return [Colors.light.tint, '#4338CA']; // Indigo
        return [Colors.light.card, Colors.light.card]; // White for secondary
    };

    const Content = (
        <TouchableOpacity
            onPress={() => {
                if (!disabled && !loading) {
                    Haptics.selectionAsync();
                    onPress();
                }
            }}
            disabled={disabled || loading}
            style={[
                styles.button,
                !isPrimary && !isDanger && styles.secondaryButton,
                style,
            ]}
            activeOpacity={0.8}
        >
            {loading ? (
                <ActivityIndicator color={isPrimary || isDanger ? '#FFF' : Colors.light.tint} />
            ) : (
                <Text
                    style={[
                        styles.text,
                        !isPrimary && !isDanger && styles.secondaryText,
                        disabled && styles.disabledText,
                        textStyle,
                    ]}
                >
                    {title}
                </Text>
            )}
        </TouchableOpacity>
    );

    if (isPrimary || isDanger) {
        return (
            <LinearGradient
                colors={getGradientColors() as any}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[styles.gradientContainer, disabled && styles.disabledContainer]}
            >
                {Content}
            </LinearGradient>
        );
    }

    return Content;
};

const styles = StyleSheet.create({
    gradientContainer: {
        borderRadius: BorderRadius.lg,
        ...Shadows.md,
        marginVertical: Spacing.sm,
    },
    disabledContainer: {
        opacity: 0.6,
        ...Shadows.sm,
    },
    button: {
        paddingVertical: Spacing.md,
        paddingHorizontal: Spacing.xl,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: BorderRadius.lg,
    },
    secondaryButton: {
        backgroundColor: Colors.light.card,
        borderWidth: 1,
        borderColor: Colors.light.border,
        ...Shadows.sm,
    },
    text: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    secondaryText: {
        color: Colors.light.tint,
    },
    disabledText: {
        color: '#FFF',
    },
});
