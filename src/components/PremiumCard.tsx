import React from 'react';
import { View, StyleSheet, ViewStyle, useColorScheme, StyleProp } from 'react-native';
import { Colors, Spacing, BorderRadius, Shadows } from '../../constants/theme';

interface PremiumCardProps {
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
}

export const PremiumCard: React.FC<PremiumCardProps> = ({ children, style }) => {
    const colorScheme = useColorScheme() ?? 'light';
    const theme = Colors[colorScheme];

    return (
        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }, style]}>
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        borderRadius: BorderRadius.lg,
        padding: Spacing.lg,
        marginVertical: Spacing.sm,
        borderWidth: 1,
        borderColor: Colors.light.border,
        ...Shadows.sm,
    },
});
