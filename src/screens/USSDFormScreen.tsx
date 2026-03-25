// src/screens/USSDFormScreen.tsx
import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, Alert, ScrollView, StyleSheet, useColorScheme, TouchableOpacity, Image } from 'react-native';
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
import { Ionicons } from '@expo/vector-icons';
import { getBankLogoInfo } from '../utils/bankLogos';

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
            <TouchableOpacity
              onPress={() => setSelectedFlow(null)}
              style={styles.backButton}
            >
              <Ionicons name="arrow-back" size={24} color="#fff" />
              <Text style={styles.backText}>Back</Text>
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: '#fff' }]}>{selectedFlow.bankName}</Text>
          </View>
        </LinearGradient>

        <ScrollView contentContainerStyle={styles.content}>
          <PremiumCard style={styles.launchCard}>
            {(() => {
              const logoInfo = getBankLogoInfo(selectedFlow.id);
              if (logoInfo.hasImage && logoInfo.image) {
                return (
                  <View style={styles.bankLogoLargeContainer}>
                    <Image 
                      source={logoInfo.image} 
                      style={styles.bankLogoImageLarge}
                      resizeMode="contain"
                    />
                  </View>
                );
              } else {
                return (
                  <View style={[styles.bankLogoLarge, { backgroundColor: logoInfo.color }]}>
                    <Text style={styles.logoTextLarge}>{logoInfo.letter}</Text>
                  </View>
                );
              }
            })()}
            <Text style={[styles.launchText, { color: theme.textSecondary }]}>
              {i18n.t('ready_to_call')}
            </Text>
            <Text style={[styles.codeText, { color: theme.text }]}>{selectedFlow.code}</Text>
            <TouchableOpacity
              onPress={() => handleDial(selectedFlow.code)}
              style={[styles.dialButton, { backgroundColor: selectedFlow.color }]}
            >
              <Ionicons name="call" size={24} color="#fff" />
              <Text style={styles.dialButtonText}>{i18n.t('launch_button')}</Text>
            </TouchableOpacity>
          </PremiumCard>
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
          {sortedFlows.map(flow => {
            const logoInfo = getBankLogoInfo(flow.id);
            return (
              <PremiumCard key={flow.id} style={styles.gridCard}>
                {logoInfo.hasImage && logoInfo.image ? (
                  <View style={styles.bankLogoContainer}>
                    <Image 
                      source={logoInfo.image} 
                      style={styles.bankLogoImage}
                      resizeMode="contain"
                    />
                  </View>
                ) : (
                  <View style={[styles.bankLogo, { backgroundColor: logoInfo.color }]}>
                    <Text style={styles.logoText}>{logoInfo.letter}</Text>
                  </View>
                )}
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
            );
          })}
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
  backButton: { flexDirection: 'row', alignItems: 'center', padding: 10, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 12, marginBottom: 10 },
  backText: { color: '#fff', fontSize: 16, fontFamily: Fonts.bold, marginLeft: 5 },
  content: { padding: Spacing.lg },
  launchCard: { alignItems: 'center', padding: 30 },
  launchText: { fontSize: 18, fontFamily: Fonts.medium, textAlign: 'center', marginBottom: 10 },
  codeText: { fontSize: 32, fontFamily: Fonts.bold, marginBottom: 20 },
  dialButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%', height: 55, borderRadius: 16, gap: 10 },
  dialButtonText: { color: '#fff', fontSize: 18, fontFamily: Fonts.bold },
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
  bankLogo: { width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  logoText: { color: '#fff', fontSize: 28, fontFamily: Fonts.bold },
  bankLogoContainer: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', marginBottom: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  bankLogoImage: { width: 50, height: 50 },
  bankLogoLarge: { width: 80, height: 80, borderRadius: 40, justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  logoTextLarge: { color: '#fff', fontSize: 36, fontFamily: Fonts.bold },
  bankLogoLargeContainer: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', marginBottom: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 8, elevation: 5 },
  bankLogoImageLarge: { width: 70, height: 70 },
  bankNameGrid: { fontSize: 14, fontFamily: Fonts.bold, textAlign: 'center', marginBottom: 2 },
  bankCodeGrid: { fontSize: 10, fontFamily: Fonts.medium, marginBottom: 10 },
  gridLaunchBtn: { width: '100%', height: 32, padding: 0, borderRadius: 8 },
  favBtn: { position: 'absolute', top: 5, right: 5, width: 30, height: 30, padding: 0, backgroundColor: 'transparent', borderColor: 'transparent' },
});

export default USSDFormScreen;
