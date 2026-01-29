import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, useColorScheme } from 'react-native';
import { Colors, Spacing, BorderRadius } from '../../constants/theme';
import { ParsedUSSD } from '../utils/ussdParser';

interface ReceiptModalProps {
    visible: boolean;
    onClose: () => void;
    data: ParsedUSSD | null;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ visible, onClose, data }) => {
    const colorScheme = useColorScheme() ?? 'light';
    const theme = Colors[colorScheme];

    if (!data) return null;

    const getIcon = () => {
        if (data.type === 'BALANCE') return '💰';
        if (data.type === 'TRANSFER') return '✅';
        return '📱';
    };

    const getTitle = () => {
        if (data.type === 'BALANCE') return 'Balance Inquiry';
        if (data.type === 'TRANSFER') return 'Transfer Complete';
        return 'USSD Response';
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={[styles.modal, { backgroundColor: theme.card }]}>
                    <Text style={styles.icon}>{getIcon()}</Text>
                    <Text style={[styles.title, { color: theme.text }]}>{getTitle()}</Text>

                    {data.amount && (
                        <View style={styles.amountContainer}>
                            <Text style={[styles.amount, { color: theme.primary }]}>
                                {data.amount} {data.currency || 'ETB'}
                            </Text>
                        </View>
                    )}

                    <View style={[styles.messageBox, { backgroundColor: theme.background }]}>
                        <Text style={[styles.message, { color: theme.textSecondary }]}>
                            {data.rawText}
                        </Text>
                    </View>

                    <TouchableOpacity
                        style={[styles.button, { backgroundColor: theme.primary }]}
                        onPress={onClose}
                    >
                        <Text style={styles.buttonText}>Close</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: Spacing.xl,
    },
    modal: {
        width: '100%',
        maxWidth: 400,
        borderRadius: BorderRadius.xl,
        padding: Spacing.xl,
        alignItems: 'center',
    },
    icon: {
        fontSize: 60,
        marginBottom: Spacing.md,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        marginBottom: Spacing.lg,
    },
    amountContainer: {
        marginBottom: Spacing.lg,
    },
    amount: {
        fontSize: 36,
        fontWeight: '800',
    },
    messageBox: {
        width: '100%',
        borderRadius: BorderRadius.md,
        padding: Spacing.md,
        marginBottom: Spacing.lg,
    },
    message: {
        fontSize: 14,
        lineHeight: 20,
        textAlign: 'center',
    },
    button: {
        paddingHorizontal: Spacing.xl * 2,
        paddingVertical: Spacing.md,
        borderRadius: BorderRadius.lg,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
    },
});
