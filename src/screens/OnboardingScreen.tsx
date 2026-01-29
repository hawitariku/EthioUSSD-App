import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, useColorScheme } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Spacing, Fonts } from '../../constants/theme';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { i18n } from '../i18n/translations';

const { width, height } = Dimensions.get('window');

interface OnboardingSlideProps {
    title: string;
    description: string;
    icon: string;
    color: string;
}

const Slides: OnboardingSlideProps[] = [
    {
        title: i18n.t('onboarding_title_1'),
        description: i18n.t('onboarding_desc_1'),
        icon: 'wallet-outline',
        color: '#3B82F6',
    },
    {
        title: i18n.t('onboarding_title_2'),
        description: i18n.t('onboarding_desc_2'),
        icon: 'shield-checkmark-outline',
        color: '#10B981',
    },
    {
        title: i18n.t('onboarding_title_3'),
        description: i18n.t('onboarding_desc_3'),
        icon: 'flash-outline',
        color: '#F59E0B',
    },
];

interface Props {
    onComplete: () => void;
}

export const OnboardingScreen: React.FC<Props> = ({ onComplete }) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const colorScheme = useColorScheme() ?? 'light';
    const theme = Colors[colorScheme];

    const handleNext = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        if (currentSlide < Slides.length - 1) {
            setCurrentSlide(currentSlide + 1);
        } else {
            onComplete();
        }
    };

    const slide = Slides[currentSlide];

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <LinearGradient
                colors={[slide.color + '40', theme.background]}
                style={styles.gradient}
            />

            <View style={styles.content}>
                <View style={[styles.iconContainer, { backgroundColor: slide.color + '20' }]}>
                    <Ionicons name={slide.icon as any} size={80} color={slide.color} />
                </View>

                <Text style={[styles.title, { color: theme.text }]}>{slide.title}</Text>
                <Text style={[styles.description, { color: theme.textSecondary }]}>
                    {slide.description}
                </Text>
            </View>

            <View style={styles.footer}>
                <View style={styles.pagination}>
                    {Slides.map((_, index) => (
                        <View
                            key={index}
                            style={[
                                styles.dot,
                                { backgroundColor: index === currentSlide ? slide.color : theme.border },
                            ]}
                        />
                    ))}
                </View>

                <TouchableOpacity
                    style={[styles.button, { backgroundColor: slide.color }]}
                    onPress={handleNext}
                >
                    <Text style={styles.buttonText}>
                        {currentSlide === Slides.length - 1 ? 'Get Started' : 'Next'}
                    </Text>
                    <Ionicons name="arrow-forward" size={20} color="white" style={{ marginLeft: 8 }} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    gradient: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        height: height * 0.4,
    },
    content: {
        flex: 1,
        padding: Spacing.xl,
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconContainer: {
        width: 160,
        height: 160,
        borderRadius: 80,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: Spacing.xl,
    },
    title: {
        fontFamily: Fonts.bold,
        fontSize: 28,
        textAlign: 'center',
        marginBottom: Spacing.md,
    },
    description: {
        fontFamily: Fonts.medium,
        fontSize: 16,
        textAlign: 'center',
        lineHeight: 24,
        paddingHorizontal: Spacing.md,
    },
    footer: {
        padding: Spacing.xl,
        alignItems: 'center',
    },
    pagination: {
        flexDirection: 'row',
        marginBottom: Spacing.xl,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginHorizontal: 4,
    },
    button: {
        width: '100%',
        height: 56,
        borderRadius: 16,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    buttonText: {
        fontFamily: Fonts.bold,
        fontSize: 18,
        color: 'white',
    },
});
