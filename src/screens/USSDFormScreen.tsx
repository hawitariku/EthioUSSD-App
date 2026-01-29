// src/screens/USSDFormScreen.tsx
import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, Alert, ScrollView, StyleSheet, useColorScheme } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { USSD_FLOWS, UssdFlow } from '../data/ussdData';
import { initiateUssdCall } from '../utils/ussdDialer';
import { saveTransaction } from '../utils/historyManager';
import { getFavorites, toggleFavorite } from '../utils/favoritesManager';
import { PremiumButton } from '../components/PremiumButton';
import { PremiumInput } from '../components/PremiumInput';
import { PremiumCard } from '../components/PremiumCard';
import { Colors, Spacing, Fonts } from '../../constants/theme';
import { LinearGradient } from 'expo-linear-gradient';
import { i18n } from '../i18n/translations';
import { subscribeToUSSD } from '../modules/USSDModule';
import { parseUSSDMessage, ParsedUSSD } from '../utils/ussdParser';
import { ReceiptModal } from '../components/ReceiptModal';
import { useEffect } from 'react';

const USSDFormScreen: React.FC = () => {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  const isDark = colorScheme === 'dark';

  const [selectedFlow, setSelectedFlow] = useState<UssdFlow | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [receiptData, setReceiptData] = useState<ParsedUSSD | null>(null);
  const [showReceipt, setShowReceipt] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeToUSSD((text) => {
      console.log("USSD captured in FormScreen:", text);
      const parsed = parseUSSDMessage(text);
      setReceiptData(parsed);
      setShowReceipt(true);
    });
    return unsubscribe;
  }, []);

  // Load favorites on focus
  useFocusEffect(
    useCallback(() => {
      getFavorites().then(setFavorites);
    }, [])
  );

  const sortedFlows = useMemo(() => {
    let flows = [...USSD_FLOWS];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      flows = flows.filter(f =>
        f.name.toLowerCase().includes(query) ||
        f.bankName.toLowerCase().includes(query)
      );
    }

    return flows.sort((a, b) => {
      const isAFav = favorites.includes(a.id);
      const isBFav = favorites.includes(b.id);
      if (isAFav && !isBFav) return -1;
      if (!isAFav && isBFav) return 1;
      return 0;
    });
  }, [favorites, searchQuery]);

  const handleDial = (code: string) => {
    initiateUssdCall(code);
    saveTransaction({
      bankName: selectedFlow?.bankName || 'Unknown Bank',
      type: 'USSD Launch',
      amount: '0',
      status: 'Success'
    });
  };

  const handleToggleFavorite = async (id: string) => {
    const newFavs = await toggleFavorite(id);
    setFavorites(newFavs);
  };

  if (selectedFlow) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <LinearGradient
          colors={[selectedFlow.color, theme.background]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <PremiumButton
              title="← Back"
              onPress={() => setSelectedFlow(null)}
              variant="secondary"
              style={{ width: 80, backgroundColor: 'rgba(255,255,255,0.1)', borderColor: 'rgba(255,255,255,0.2)' }}
            />
            <Text style={[styles.headerTitle, { color: '#fff' }]}>{selectedFlow.bankName}</Text>
          </View>
        </LinearGradient>

        <ScrollView contentContainerStyle={styles.content}>
          <PremiumCard style={styles.launchCard}>
            <Text style={[styles.launchText, { color: theme.textSecondary }]}>
              {i18n.t('ready_to_call')}
            </Text>
            <Text style={[styles.codeText, { color: theme.text }]}>{selectedFlow.code}</Text>
            <PremiumButton
              title={i18n.t('launch_button')}
              onPress={() => handleDial(selectedFlow.code)}
              variant="primary"
              style={[styles.launchButton, { backgroundColor: selectedFlow.color }]}
            />
          </PremiumCard>

          <View style={{ marginTop: 30 }}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Quick Shortcuts</Text>
            <View style={styles.shortcutsGrid}>
              <PremiumButton
                title="💰 Balance"
                onPress={() => handleDial(selectedFlow.balanceCode || `${selectedFlow.code.replace('#', '')}*1#`)}
                variant="secondary"
                style={styles.shortcutBtn}
              />
              <PremiumButton
                title="💸 Transfer"
                onPress={() => handleDial(selectedFlow.transferCode || `${selectedFlow.code.replace('#', '')}*2#`)}
                variant="secondary"
                style={styles.shortcutBtn}
              />
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.searchContainer}>
        <Text style={[styles.mainTitle, { color: theme.text }]}>{i18n.t('select_bank')}</Text>
        <PremiumInput
          placeholder={i18n.t('search_placeholder')}
          value={searchQuery}
          onChangeText={setSearchQuery}
          icon="search"
        />
      </View>

      <ScrollView contentContainerStyle={styles.listContent}>
        <View style={styles.gridContainer}>
          {sortedFlows.map(flow => (
            <PremiumCard key={flow.id} style={styles.gridCard}>
              <View style={[styles.bankLogo, { backgroundColor: flow.color }]}>
                <Text style={styles.logoText}>{flow.bankName.charAt(0)}</Text>
              </View>
              <Text style={[styles.bankNameGrid, { color: theme.text }]} numberOfLines={1}>
                {flow.bankName}
              </Text>
              <Text style={[styles.bankCodeGrid, { color: theme.textSecondary }]}>
                {flow.code}
              </Text>
              <PremiumButton
                title="Launch"
                onPress={() => setSelectedFlow(flow)}
                variant="primary"
                style={[styles.gridLaunchBtn, { backgroundColor: flow.color }]}
                textStyle={{ fontSize: 12 }}
              />
              <PremiumButton
                title={favorites.includes(flow.id) ? "★" : "☆"}
                onPress={() => handleToggleFavorite(flow.id)}
                variant="secondary"
                style={styles.favBtn}
                textStyle={{ color: favorites.includes(flow.id) ? '#ffb300' : theme.icon }}
              />
            </PremiumCard>
          ))}
        </View>
      </ScrollView>

      <ReceiptModal
        visible={showReceipt}
        onClose={() => setShowReceipt(false)}
        data={receiptData}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: Spacing.lg, paddingTop: 60, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
  headerContent: {},
  headerTitle: { fontSize: 24, fontFamily: Fonts.bold, marginTop: 10 },
  content: { padding: Spacing.lg },
  launchCard: { alignItems: 'center', padding: 30 },
  launchText: { fontSize: 18, fontFamily: Fonts.medium, textAlign: 'center', marginBottom: 10 },
  codeText: { fontSize: 32, fontFamily: Fonts.bold, marginBottom: 20 },
  launchButton: { width: '100%', height: 55 },
  sectionTitle: { fontSize: 18, fontFamily: Fonts.bold, marginBottom: 10 },

  searchContainer: { padding: Spacing.lg, paddingTop: 60 },
  mainTitle: { fontSize: 28, fontFamily: Fonts.bold, marginBottom: 20 },
  listContent: { padding: Spacing.lg, paddingTop: 0 },
  bankCard: { marginBottom: 15 },
  bankHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  bankName: { fontSize: 18, fontFamily: Fonts.bold },
  bankCode: { fontSize: 14, fontFamily: Fonts.medium, marginTop: 4 },

  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  gridCard: { width: '48%', marginBottom: 15, alignItems: 'center', padding: 15 },
  bankLogo: { width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  logoText: { color: '#fff', fontSize: 24, fontFamily: Fonts.bold },
  bankNameGrid: { fontSize: 14, fontFamily: Fonts.bold, textAlign: 'center', marginBottom: 2 },
  bankCodeGrid: { fontSize: 10, fontFamily: Fonts.medium, marginBottom: 10 },
  gridLaunchBtn: { width: '100%', height: 32, padding: 0, borderRadius: 8 },
  favBtn: { position: 'absolute', top: 5, right: 5, width: 30, height: 30, padding: 0, backgroundColor: 'transparent', borderColor: 'transparent' },
  shortcutsGrid: { flexDirection: 'row', justifyContent: 'space-between' },
  shortcutBtn: { flex: 1, marginHorizontal: 5, height: 80 },
});

export default USSDFormScreen;
