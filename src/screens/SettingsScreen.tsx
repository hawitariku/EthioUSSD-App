import React from 'react';
import { View, Text, StyleSheet, Alert, ScrollView, useColorScheme } from 'react-native';
import { clearHistory } from '../utils/historyManager';
import { PremiumButton } from '../components/PremiumButton';
import { PremiumCard } from '../components/PremiumCard';
import { Colors, Spacing } from '../../constants/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { i18n, setLanguage } from '../i18n/translations';
import USSDModule, { subscribeToUSSD } from '../modules/USSDModule';
import { useFocusEffect } from 'expo-router';
import { ReceiptModal } from '../components/ReceiptModal';
import { parseUSSDMessage, ParsedUSSD } from '../utils/ussdParser';
import { useRouter } from 'expo-router';

const SettingsScreen = () => {
    const router = useRouter();
    const colorScheme = useColorScheme() ?? 'light';
    const theme = Colors[colorScheme];
    const [accessibilityEnabled, setAccessibilityEnabled] = React.useState(false);
    const [receiptData, setReceiptData] = React.useState<ParsedUSSD | null>(null);
    const [showReceipt, setShowReceipt] = React.useState(false);

    const checkAccessibility = async () => {
        try {
            const enabled = await USSDModule.isAccessibilityEnabled();
            setAccessibilityEnabled(enabled);
        } catch (e) {
            console.warn(e);
        }
    };

    React.useEffect(() => {
        const unsubscribe = subscribeToUSSD((text) => {
            console.log("USSD received:", text);
            const parsed = parseUSSDMessage(text);
            setReceiptData(parsed);
            setShowReceipt(true);
        });
        return unsubscribe;
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            checkAccessibility();
        }, [])
    );

    const handleOpenAccessibility = () => {
        USSDModule.openAccessibilitySettings();
    };

    const changeLanguage = async (lang: string) => {
        await setLanguage(lang);
        // Alert user to restart since we removed expo-updates
        Alert.alert(
            i18n.t('language'),
            'Please restart the app to apply changes completely.',
            [{ text: 'OK' }]
        );
    };

    const handleClearHistory = () => {
        Alert.alert(
            i18n.t('clear_history'),
            i18n.t('confirm_clear'),
            [
                { text: i18n.t('cancel'), style: 'cancel' },
                {
                    text: i18n.t('save'), // Using 'save' as confirm for now, or fallback to English 'Delete'
                    style: 'destructive',
                    onPress: async () => {
                        await clearHistory();
                        Alert.alert('Success', i18n.t('history_cleared'));
                    }
                }
            ]
        );
    };

    const handleClearFavorites = () => {
        Alert.alert(
            'Reset Favorites',
            'Are you sure you want to clear all favorites?',
            [
                { text: i18n.t('cancel'), style: 'cancel' },
                {
                    text: 'Clear',
                    style: 'destructive',
                    onPress: async () => {
                        await AsyncStorage.removeItem('USSD_FAVORITES');
                        Alert.alert('Success', 'Favorites reset.');
                    }
                }
            ]
        );
    };

    return (
        <ScrollView style={[styles.container, { backgroundColor: theme.background }]} contentContainerStyle={styles.content}>
            <Text style={[styles.header, { color: theme.text }]}>{i18n.t('settings')}</Text>

            <PremiumCard style={styles.section}>
                <Text style={[styles.sectionTitle, { color: theme.text }]}>{i18n.t('language')}</Text>
                <View style={{ flexDirection: 'row', gap: 10 }}>
                    <PremiumButton
                        title="English"
                        onPress={() => changeLanguage('en')}
                        variant={i18n.locale.startsWith('en') ? 'primary' : 'secondary'}
                        style={{ flex: 1 }}
                    />
                    <PremiumButton
                        title="አማርኛ"
                        onPress={() => changeLanguage('am')}
                        variant={i18n.locale.startsWith('am') ? 'primary' : 'secondary'}
                        style={{ flex: 1 }}
                    />
                    <PremiumButton
                        title="Af. Oromoo"
                        onPress={() => changeLanguage('om')}
                        variant={i18n.locale.startsWith('om') ? 'primary' : 'secondary'}
                        style={{ flex: 1 }}
                    />
                </View>
            </PremiumCard>

            <PremiumCard style={styles.section}>
                <Text style={[styles.sectionTitle, { color: theme.text }]}>Advanced Automation</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                    <Text style={{ color: theme.icon, flex: 1, marginRight: 10 }}>
                        {accessibilityEnabled ? 'Service Enabled' : 'Enable Accessibility Service for auto-dialing'}
                    </Text>
                    <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: accessibilityEnabled ? theme.success : theme.error }} />
                </View>
                <PremiumButton
                    title={accessibilityEnabled ? "Manage Settings" : "Enable Service"}
                    onPress={handleOpenAccessibility}
                    variant={accessibilityEnabled ? "secondary" : "primary"}
                    style={styles.button}
                />
            </PremiumCard>

            <PremiumCard style={styles.section}>
                <Text style={[styles.sectionTitle, { color: theme.text }]}>Data Management</Text>
                <PremiumButton
                    title={i18n.t('clear_history')}
                    onPress={handleClearHistory}
                    variant="secondary"
                    style={styles.button}
                />
                <PremiumButton
                    title="Reset Favorites"
                    onPress={handleClearFavorites}
                    variant="secondary"
                    style={styles.button}
                />
                <PremiumButton
                    title="Reset Onboarding"
                    onPress={async () => {
                        await AsyncStorage.removeItem('has_onboarded');
                        Alert.alert('Success', 'Onboarding will show on next restart.');
                    }}
                    variant="secondary"
                    style={styles.button}
                />
            </PremiumCard>

            <PremiumCard style={styles.section}>
                <Text style={[styles.sectionTitle, { color: theme.text }]}>{i18n.t('about')}</Text>
                <PremiumButton
                    title="Learn More About App"
                    onPress={() => router.push('/about' as any)}
                    variant="secondary"
                />
                <View style={{ marginTop: 10, padding: 10, backgroundColor: theme.inputBackground, borderRadius: 8 }}>
                    <Text style={{ fontSize: 11, color: theme.textSecondary }}>
                        Security Note: This app prepared USSD codes for the system dialer. We do not store or transmit your balance or PIN.
                    </Text>
                </View>
            </PremiumCard>

            <ReceiptModal
                visible={showReceipt}
                onClose={() => setShowReceipt(false)}
                data={receiptData}
            />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        padding: Spacing.lg,
        paddingTop: 60,
    },
    header: {
        fontSize: 28,
        fontWeight: '800',
        marginBottom: Spacing.xl,
    },
    section: {
        marginBottom: Spacing.lg,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: Spacing.md,
    },
    button: {
        marginBottom: Spacing.sm,
    },
    aboutText: {
        fontSize: 16,
        marginBottom: Spacing.xs,
    },
});

export default SettingsScreen;
