import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Colors, Spacing, Fonts, BorderRadius } from '../../constants/theme';
import { useColorScheme } from 'react-native';

interface Props {
    data: { label: string; value: number; color: string }[];
    total: number;
}

const { width } = Dimensions.get('window');

export const UsageVisualizer: React.FC<Props> = ({ data, total }) => {
    const colorScheme = useColorScheme() ?? 'light';
    const theme = Colors[colorScheme];

    if (total === 0) return null;

    return (
        <View style={styles.container}>
            <View style={styles.barContainer}>
                {data.map((item, index) => {
                    const percentage = (item.value / total) * 100;
                    if (percentage === 0) return null;
                    return (
                        <View
                            key={item.label}
                            style={[
                                styles.barSegment,
                                {
                                    width: `${percentage}%`,
                                    backgroundColor: item.color,
                                    borderTopLeftRadius: index === 0 ? 10 : 0,
                                    borderBottomLeftRadius: index === 0 ? 10 : 0,
                                    borderTopRightRadius: index === data.length - 1 ? 10 : 0,
                                    borderBottomRightRadius: index === data.length - 1 ? 10 : 0,
                                }
                            ]}
                        />
                    );
                })}
            </View>
            <View style={styles.legend}>
                {data.map((item) => (
                    <View key={item.label} style={styles.legendItem}>
                        <View style={[styles.dot, { backgroundColor: item.color }]} />
                        <Text style={[styles.legendText, { color: theme.textSecondary }]}>
                            {item.label} ({Math.round((item.value / total) * 100)}%)
                        </Text>
                    </View>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        marginTop: Spacing.md,
    },
    barContainer: {
        flexDirection: 'row',
        height: 12,
        backgroundColor: '#00000010',
        borderRadius: 10,
        overflow: 'hidden',
    },
    barSegment: {
        height: '100%',
    },
    legend: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 10,
        gap: 15,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    legendText: {
        fontSize: 11,
        fontFamily: Fonts.medium,
    },
});
