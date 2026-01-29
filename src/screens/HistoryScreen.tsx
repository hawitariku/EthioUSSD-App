import React, { useCallback, useState, useMemo } from 'react';
import { View, Text, FlatList, StyleSheet, RefreshControl, ScrollView, TouchableOpacity, Share } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { getHistory, clearHistory, Transaction, exportHistoryToCSV } from '../../src/utils/historyManager';
import { PremiumCard } from '../../src/components/PremiumCard';
import { PremiumButton } from '../../src/components/PremiumButton';
import { PremiumInput } from '../../src/components/PremiumInput';
import { Colors, Spacing, Fonts, BorderRadius } from '../../constants/theme';
import { useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { i18n } from '../i18n/translations';
import { UsageVisualizer } from '../components/UsageVisualizer';

const FILTER_TYPES = ['All', 'Transfer', 'Balance', 'Airtime'];

const HistoryScreen = () => {
    const colorScheme = useColorScheme() ?? 'light';
    const theme = Colors[colorScheme];

    const [history, setHistory] = useState<Transaction[]>([]);
    const [refreshing, setRefreshing] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('All');

    const loadHistory = async () => {
        const data = await getHistory();
        setHistory(data);
    };

    useFocusEffect(
        useCallback(() => {
            loadHistory();
        }, [])
    );

    const filteredHistory = useMemo(() => {
        return history.filter(item => {
            const matchesSearch = item.bankName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.type.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesFilter = activeFilter === 'All' || item.type.includes(activeFilter);
            return matchesSearch && matchesFilter;
        });
    }, [history, searchQuery, activeFilter]);

    const stats = useMemo(() => {
        const total = history.length;
        const mostUsed = history.reduce((acc, curr) => {
            acc[curr.bankName] = (acc[curr.bankName] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const topBank = Object.entries(mostUsed).sort((a, b) => b[1] - a[1])[0]?.[0] || 'None';

        return { total, topBank };
    }, [history]);

    const handleShareCSV = async () => {
        const csv = exportHistoryToCSV(history);
        if (!csv) return;
        try {
            await Share.share({
                message: csv,
                title: 'Ethio USSD History Export',
            });
        } catch (error) {
            console.error(error);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await loadHistory();
        setRefreshing(false);
    };

    const handleClear = async () => {
        await clearHistory();
        await loadHistory();
    }

    const renderItem = ({ item }: { item: Transaction }) => {
        const isSuccess = item.status === 'Success';
        return (
            <PremiumCard style={styles.card}>
                <View style={styles.row}>
                    <View style={styles.leftContent}>
                        <View style={[styles.statusIndicator, { backgroundColor: isSuccess ? theme.success : theme.error }]} />
                        <View>
                            <Text style={[styles.bankName, { color: theme.text }]}>{item.bankName}</Text>
                            <Text style={[styles.type, { color: theme.icon }]}>{item.type}</Text>
                            <Text style={[styles.date, { color: theme.icon }]}>{new Date(item.date).toLocaleString()}</Text>
                        </View>
                    </View>
                    <View style={styles.rightContent}>
                        <Text style={[styles.amount, { color: theme.tint }]}>{item.amount} ETB</Text>
                        <View style={[styles.statusBadge, { backgroundColor: isSuccess ? theme.success + '20' : theme.error + '20' }]}>
                            <Text style={[styles.statusText, { color: isSuccess ? theme.success : theme.error }]}>
                                {item.status || 'Success'}
                            </Text>
                        </View>
                    </View>
                </View>
            </PremiumCard>
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={styles.headerContainer}>
                <Text style={[styles.header, { color: theme.text }]}>History</Text>
                <View style={styles.headerActions}>
                    {history.length > 0 && (
                        <>
                            <TouchableOpacity onPress={handleShareCSV} style={[styles.iconButton, { backgroundColor: theme.card }]}>
                                <Ionicons name="share-outline" size={20} color={theme.tint} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleClear} style={[styles.iconButton, { backgroundColor: theme.card }]}>
                                <Ionicons name="trash-outline" size={20} color={theme.error} />
                            </TouchableOpacity>
                        </>
                    )}
                </View>
            </View>

            <ScrollView stickyHeaderIndices={[2]} showsVerticalScrollIndicator={false}>
                {/* Stats Dashboard */}
                <View style={styles.dashboardContainer}>
                    <PremiumCard style={styles.dashboardCard}>
                        <View style={styles.statsRow}>
                            <View style={styles.statItem}>
                                <Text style={[styles.statValue, { color: theme.text }]}>{stats.total}</Text>
                                <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Total Dials</Text>
                            </View>
                            <View style={styles.divider} />
                            <View style={styles.statItem}>
                                <Text style={[styles.statValue, { color: theme.text }]} numberOfLines={1}>{stats.topBank}</Text>
                                <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Most Used</Text>
                            </View>
                        </View>
                        <UsageVisualizer
                            total={stats.total}
                            data={[
                                { label: 'Transfer', value: history.filter(t => t.type.includes('Transfer')).length, color: theme.primary },
                                { label: 'Balance', value: history.filter(t => t.type.includes('Balance')).length, color: theme.success },
                                { label: 'Airtime', value: history.filter(t => t.type.includes('Airtime')).length, color: '#F59E0B' },
                            ]}
                        />
                    </PremiumCard>
                </View>

                {/* Search */}
                <View style={styles.searchSection}>
                    <PremiumInput
                        placeholder="Search transactions..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        icon="search"
                        containerStyle={styles.searchInput}
                    />
                </View>

                {/* Filters */}
                <View style={[styles.filterWrapper, { backgroundColor: theme.background }]}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterContainer}>
                        {FILTER_TYPES.map(filter => (
                            <TouchableOpacity
                                key={filter}
                                onPress={() => setActiveFilter(filter)}
                                style={[
                                    styles.filterChip,
                                    { backgroundColor: activeFilter === filter ? theme.tint : theme.card },
                                    activeFilter === filter && styles.activeFilterChip
                                ]}
                            >
                                <Text style={[
                                    styles.filterText,
                                    { color: activeFilter === filter ? '#FFF' : theme.textSecondary }
                                ]}>
                                    {filter}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* List */}
                <View style={styles.listSection}>
                    {filteredHistory.length === 0 ? (
                        <View style={styles.emptyContainer}>
                            <Ionicons name="receipt-outline" size={64} color={theme.icon + '40'} />
                            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
                                {searchQuery || activeFilter !== 'All' ? 'No matching results.' : 'Your transaction history will appearing here.'}
                            </Text>
                        </View>
                    ) : (
                        filteredHistory.map(item => (
                            <React.Fragment key={item.id}>
                                {renderItem({ item })}
                            </React.Fragment>
                        ))
                    )}
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: Spacing.lg,
        paddingTop: 60,
        paddingBottom: Spacing.md,
    },
    header: {
        fontSize: 28,
        fontFamily: Fonts.bold,
    },
    headerActions: {
        flexDirection: 'row',
        gap: 10,
    },
    iconButton: {
        width: 40,
        height: 40,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.05)',
    },
    dashboardContainer: {
        paddingHorizontal: Spacing.lg,
        marginBottom: Spacing.md,
    },
    dashboardCard: {
        padding: Spacing.lg,
    },
    statsRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    statValue: {
        fontSize: 20,
        fontFamily: Fonts.bold,
    },
    statLabel: {
        fontSize: 12,
        fontFamily: Fonts.medium,
        marginTop: 4,
    },
    divider: {
        width: 1,
        height: 30,
        backgroundColor: 'rgba(0,0,0,0.1)',
        marginHorizontal: 10,
    },
    searchSection: {
        paddingHorizontal: Spacing.lg,
        marginBottom: Spacing.sm,
    },
    searchInput: {
        height: 45,
    },
    filterWrapper: {
        paddingVertical: Spacing.sm,
    },
    filterContainer: {
        paddingHorizontal: Spacing.lg,
        gap: 10,
    },
    filterChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        minWidth: 70,
        alignItems: 'center',
    },
    activeFilterChip: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    filterText: {
        fontSize: 14,
        fontFamily: Fonts.bold,
    },
    listSection: {
        paddingHorizontal: Spacing.lg,
        paddingBottom: 40,
    },
    card: {
        marginBottom: Spacing.md,
        padding: Spacing.md,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    leftContent: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    statusIndicator: {
        width: 4,
        height: 40,
        borderRadius: 2,
        marginRight: 12,
    },
    rightContent: {
        alignItems: 'flex-end',
    },
    bankName: {
        fontSize: 16,
        fontFamily: Fonts.bold,
    },
    type: {
        fontSize: 13,
        fontFamily: Fonts.medium,
        marginTop: 2,
    },
    date: {
        fontSize: 11,
        fontFamily: Fonts.regular,
        marginTop: 4,
        opacity: 0.7,
    },
    amount: {
        fontSize: 17,
        fontFamily: Fonts.bold,
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        marginTop: 6,
    },
    statusText: {
        fontSize: 10,
        fontFamily: Fonts.bold,
        textTransform: 'uppercase',
    },
    emptyContainer: {
        paddingTop: 60,
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 16,
        fontFamily: Fonts.medium,
        textAlign: 'center',
        marginTop: 20,
        paddingHorizontal: 40,
    },
});

export default HistoryScreen;
