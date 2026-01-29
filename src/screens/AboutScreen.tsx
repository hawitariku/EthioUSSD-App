import React from 'react';
import { View, Text, StyleSheet, ScrollView, useColorScheme, Image, TouchableOpacity, Linking, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Spacing, Fonts, BorderRadius } from '../../constants/theme';
import { PremiumCard } from '../components/PremiumCard';
import { Ionicons } from '@expo/vector-icons';
import { i18n } from '../i18n/translations';

const { width } = Dimensions.get('window');

export const AboutScreen: React.FC = () => {
    const colorScheme = useColorScheme() ?? 'light';
    const theme = Colors[colorScheme];

    return (
        <ScrollView style={[styles.container, { backgroundColor: theme.background }]} showsVerticalScrollIndicator={false}>
            <LinearGradient
                colors={[theme.primary + '20', theme.background]}
                style={styles.header}
            >
                <View style={styles.iconContainer}>
                    <Ionicons name="apps" size={60} color={theme.primary} />
                </View>
                <Text style={[styles.title, { color: theme.text }]}>Ethio USSD Companion</Text>
                <Text style={[styles.version, { color: theme.textSecondary }]}>v2.0.0 (Expo SDK 52)</Text>
            </LinearGradient>

            <View style={styles.content}>
                <PremiumCard style={styles.card}>
                    <Text style={[styles.sectionTitle, { color: theme.text }]}>Our Mission</Text>
                    <Text style={[styles.description, { color: theme.textSecondary }]}>
                        We aim to simplify digital finance in Ethiopia by providing a secure,
                        premium interface for banking and telecom USSD services. No more memorizing codes.
                    </Text>
                </PremiumCard>

                <PremiumCard style={styles.card}>
                    <Text style={[styles.sectionTitle, { color: theme.text }]}>Security First</Text>
                    <View style={styles.securityRow}>
                        <Ionicons name="shield-checkmark" size={24} color={theme.success} />
                        <Text style={[styles.securityText, { color: theme.textSecondary }]}>
                            Launcher Mode: Your PIN never leaves the system dialer.
                        </Text>
                    </View>
                    <View style={styles.securityRow}>
                        <Ionicons name="lock-closed" size={24} color={theme.success} />
                        <Text style={[styles.securityText, { color: theme.textSecondary }]}>
                            Biometric Lock: Keep your history private.
                        </Text>
                    </View>
                </PremiumCard>

                <View style={styles.links}>
                    <TouchableOpacity style={styles.linkRow} onPress={() => Linking.openURL('https://github.com/antigravity')}>
                        <Ionicons name="logo-github" size={20} color={theme.textSecondary} />
                        <Text style={[styles.linkText, { color: theme.textSecondary }]}>GitHub</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.linkRow} onPress={() => Linking.openURL('https://example.com/privacy')}>
                        <Ionicons name="document-text-outline" size={20} color={theme.textSecondary} />
                        <Text style={[styles.linkText, { color: theme.textSecondary }]}>Privacy Policy</Text>
                    </TouchableOpacity>
                </View>

                <Text style={[styles.footer, { color: theme.textSecondary + '60' }]}>
                    © 2024 Antigravity AI. All rights reserved.
                </Text>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingTop: 80,
        paddingBottom: 40,
        alignItems: 'center',
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
    },
    iconContainer: {
        width: 100,
        height: 100,
        borderRadius: 30,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 15,
        elevation: 5,
    },
    title: {
        fontSize: 24,
        fontFamily: Fonts.bold,
        textAlign: 'center',
    },
    version: {
        fontSize: 14,
        fontFamily: Fonts.medium,
        marginTop: 5,
    },
    content: {
        padding: Spacing.lg,
    },
    card: {
        marginBottom: Spacing.lg,
        padding: Spacing.lg,
    },
    sectionTitle: {
        fontSize: 18,
        fontFamily: Fonts.bold,
        marginBottom: 10,
    },
    description: {
        fontSize: 15,
        fontFamily: Fonts.medium,
        lineHeight: 22,
    },
    securityRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
        marginTop: 15,
    },
    securityText: {
        fontSize: 14,
        fontFamily: Fonts.medium,
        flex: 1,
    },
    links: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 30,
        marginTop: 20,
    },
    linkRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    linkText: {
        fontSize: 14,
        fontFamily: Fonts.bold,
        textDecorationLine: 'underline',
    },
    footer: {
        textAlign: 'center',
        marginTop: 40,
        fontSize: 12,
        fontFamily: Fonts.medium,
        paddingBottom: 40,
    },
});
