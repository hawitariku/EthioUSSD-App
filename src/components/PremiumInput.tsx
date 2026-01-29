import { StyleSheet, TextInput, View, Text, TextInputProps, useColorScheme, StyleProp, ViewStyle } from 'react-native';
import { Colors, Spacing, BorderRadius, Shadows } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';

interface PremiumInputProps extends TextInputProps {
    label?: string;
    error?: string;
    icon?: string;
    containerStyle?: StyleProp<ViewStyle>;
}

export const PremiumInput: React.FC<PremiumInputProps> = ({
    label,
    error,
    icon,
    style,
    containerStyle,
    onFocus,
    onBlur,
    ...props
}) => {
    const [isFocused, setIsFocused] = useState(false);

    const colorScheme = useColorScheme() ?? 'light';
    const theme = Colors[colorScheme];

    const handleFocus = (e: any) => {
        setIsFocused(true);
        onFocus?.(e);
    };

    const handleBlur = (e: any) => {
        setIsFocused(false);
        onBlur?.(e);
    };

    return (
        <View style={styles.container}>
            {label && <Text style={[styles.label, { color: theme.text }]}>{label}</Text>}
            <View
                style={[
                    styles.inputContainer,
                    { backgroundColor: theme.card, borderColor: theme.border },
                    isFocused && { borderColor: theme.tint },
                    !!error && styles.errorContainer,
                    containerStyle,
                ]}
            >
                {icon && (
                    <Ionicons
                        name={icon as any}
                        size={20}
                        color={isFocused ? theme.tint : theme.icon}
                        style={{ marginRight: 10 }}
                    />
                )}
                <TextInput
                    style={[styles.input, style, { color: theme.text }]}
                    placeholderTextColor={theme.icon}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    {...props}
                />
            </View>
            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: Spacing.sm,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.light.text,
        marginBottom: Spacing.xs,
        marginLeft: Spacing.xs,
    },
    inputContainer: {
        backgroundColor: Colors.light.inputBackground,
        borderRadius: BorderRadius.md,
        borderWidth: 1,
        borderColor: Colors.light.border,
        paddingHorizontal: Spacing.md,
        height: 50,
        justifyContent: 'center',
    },
    focusedContainer: {
        borderColor: Colors.light.tint,
        backgroundColor: Colors.light.card,
        ...Shadows.sm,
    },
    errorContainer: {
        borderColor: Colors.light.error,
    },
    input: {
        fontSize: 16,
        color: Colors.light.text,
        height: '100%',
    },
    errorText: {
        fontSize: 12,
        color: Colors.light.error,
        marginTop: Spacing.xs,
        marginLeft: Spacing.xs,
    },
});
