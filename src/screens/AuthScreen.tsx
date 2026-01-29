import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, Image } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Spacing, Fonts, BorderRadius } from '../../constants/theme';
import { PremiumButton } from '../components/PremiumButton';
import { useColorScheme } from 'react-native';
import { i18n } from '../i18n/translations';

interface AuthScreenProps {
    onAuthenticated: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onAuthenticated }) => {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const theme = isDark ? Colors.dark : Colors.light;

    const [isBiometricSupported, setIsBiometricSupported] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        (async () => {
            const compatible = await LocalAuthentication.hasHardwareAsync();
            setIsBiometricSupported(compatible);

            // Auto-prompt on mount if supported
            if (compatible) {
                authenticate();
            }
        })();
    }, []);

    const authenticate = async () => {
        setLoading(true);
        try {
            const hasBiometrics = await LocalAuthentication.isEnrolledAsync();
            if (!hasBiometrics) {
                // If no biometrics are set up, fallback or warn. 
                Alert.alert("Security Notice", "No biometrics found on this device. Would you like to proceed without protection?", [
                    { text: "Cancel", style: 'cancel' },
                    { text: "Proceed", onPress: onAuthenticated }
                ]);
                return;
            }

            const result = await LocalAuthentication.authenticateAsync({
                promptMessage: 'Unlock Ethio USSD Companion',
                fallbackLabel: 'Enter Passcode',
                disableDeviceFallback: false,
            });

            if (result.success) {
                onAuthenticated();
            } else {
                // Auth failed (user cancelled or wrong face/finger)
                if (result.error === 'user_cancel') {
                    // Do nothing, let them press the button again
                } else {
                    Alert.alert('Authentication Failed', 'Please try again.');
                }
            }
        } catch (error: any) {
            console.error('Biometric Auth Error:', error);
            Alert.alert(
                'Authentication Error',
                `Could not verify identity: ${error?.message || 'Unknown Error'}. Would you like to enter anyway?`,
                [
                    { text: 'Try Again', onPress: authenticate },
                    { text: 'Bypass (Internal Error)', onPress: onAuthenticated, style: 'destructive' }
                ]
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={styles.content}>
                <Text style={[styles.title, { color: theme.text }]}>{i18n.t('locked')}</Text>
                <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
                    {i18n.t('authenticate_msg')}
                </Text>

                <View style={styles.lockIconContainer}>
                    <Text style={{ fontSize: 60 }}>🔒</Text>
                </View>

                <View style={styles.buttonContainer}>
                    <PremiumButton
                        title={isBiometricSupported ? i18n.t('unlock_with_biometrics') : i18n.t('unlock_app')}
                        onPress={authenticate}
                        loading={loading}
                        containerStyle={{ marginBottom: Spacing.md }}
                    />

                    {/* Fallback button if something is technically wrong */}
                    <PremiumButton
                        title="Skip for Now"
                        onPress={onAuthenticated}
                        variant="secondary"
                        style={{ opacity: 0.6 }}
                    />
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: Spacing.xl,
    },
    content: {
        alignItems: 'center',
        width: '100%',
        maxWidth: 400,
    },
    title: {
        fontSize: 32,
        fontFamily: Fonts.bold,
        marginBottom: Spacing.sm,
    },
    subtitle: {
        fontSize: 16,
        fontFamily: Fonts.regular,
        textAlign: 'center',
        marginBottom: Spacing.xl * 2,
        opacity: 0.8,
    },
    lockIconContainer: {
        marginBottom: Spacing.xl * 2,
        padding: Spacing.xl,
        backgroundColor: 'rgba(0,0,0,0.05)',
        borderRadius: 50,
    },
    buttonContainer: {
        width: '100%',
    }
});
