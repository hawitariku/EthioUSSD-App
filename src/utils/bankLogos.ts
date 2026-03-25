// src/utils/bankLogos.ts
import { ImageSourcePropType } from 'react-native';

// Bank logo image mapping
// When you add logo files to assets/images/banks/, they will be used automatically
// If a logo file is missing, the app falls back to letter-based logos

// Uncomment these lines as you add logo files:
const bankLogoImages: Record<string, ImageSourcePropType> = {
  // 'cbe-mobile': require('../../assets/images/banks/cbe.png'),
  // 'cbe-birr': require('../../assets/images/banks/cbe.png'),
  // 'dashen-mobile-plus': require('../../assets/images/banks/dashen.png'),
  // 'dashen-superapp': require('../../assets/images/banks/dashen.png'),
  // 'awash-mobile': require('../../assets/images/banks/awash.png'),
  // 'abyssinia-mobile': require('../../assets/images/banks/abyssinia.png'),
  // 'telebirr': require('../../assets/images/banks/telebirr.png'),
  // 'm-pesa': require('../../assets/images/banks/mpesa.png'),
  // 'wegagen-mobile': require('../../assets/images/banks/wegagen.png'),
  // 'hibret-mobile': require('../../assets/images/banks/hibret.png'),
  // 'coop-mobile': require('../../assets/images/banks/coop.png'),
  // 'amhara-mobile': require('../../assets/images/banks/amhara.png'),
  // 'lion-mobile': require('../../assets/images/banks/lion.png'),
  // 'bunna-mobile': require('../../assets/images/banks/bunna.png'),
  // 'enat-mobile': require('../../assets/images/banks/enat.png'),
  // 'hijra-mobile': require('../../assets/images/banks/hijra.png'),
  // 'halal-pay': require('../../assets/images/banks/hijra.png'),
  // 'zemen-mobile': require('../../assets/images/banks/zemen.png'),
  // 'sinqee-mobile': require('../../assets/images/banks/sinqee.png'),
  // 'gadaa-mobile': require('../../assets/images/banks/gadaa.png'),
  // 'shabelle-mobile': require('../../assets/images/banks/shabelle.png'),
  // 'ahadu-mobile': require('../../assets/images/banks/ahadu.png'),
  // 'tsedey-mobile': require('../../assets/images/banks/tsedey.png'),
};

// Default logo for banks without specific logos
// const defaultLogo = require('../../assets/images/banks/default.png');

// Letter-based logo data (fallback when images not available)
const bankLogoData: Record<string, { letter: string; color: string }> = {
  'cbe-mobile': { letter: 'C', color: '#3B2F85' },
  'cbe-birr': { letter: 'C', color: '#3B2F85' },
  'dashen-mobile-plus': { letter: 'D', color: '#1E40AF' },
  'dashen-superapp': { letter: 'D', color: '#1E40AF' },
  'awash-mobile': { letter: 'A', color: '#15803D' },
  'abyssinia-mobile': { letter: 'B', color: '#B45309' },
  'telebirr': { letter: 'T', color: '#FECE00' },
  'm-pesa': { letter: 'M', color: '#C02626' },
  'wegagen-mobile': { letter: 'W', color: '#4F46E5' },
  'hibret-mobile': { letter: 'H', color: '#0891B2' },
  'coop-mobile': { letter: 'C', color: '#0D9488' },
  'amhara-mobile': { letter: 'A', color: '#9333EA' },
  'lion-mobile': { letter: 'L', color: '#CA8A04' },
  'bunna-mobile': { letter: 'B', color: '#7C3AED' },
  'enat-mobile': { letter: 'E', color: '#DB2777' },
  'hijra-mobile': { letter: 'H', color: '#059669' },
  'halal-pay': { letter: 'H', color: '#059669' },
  'zemen-mobile': { letter: 'Z', color: '#2563EB' },
  'sinqee-mobile': { letter: 'S', color: '#EA580C' },
  'gadaa-mobile': { letter: 'G', color: '#475569' },
  'shabelle-mobile': { letter: 'S', color: '#0284C7' },
  'ahadu-mobile': { letter: 'A', color: '#4F46E5' },
  'tsedey-mobile': { letter: 'T', color: '#16A34A' },
};

/**
 * Get bank logo image source
 * Returns the image source if available, otherwise null
 */
export const getBankLogoImage = (bankId: string): ImageSourcePropType | null => {
  return bankLogoImages[bankId] || null;
};

/**
 * Check if bank has a real logo image
 */
export const hasBankLogoImage = (bankId: string): boolean => {
  return !!bankLogoImages[bankId];
};

/**
 * Get bank logo data (letter and color) for fallback
 * This is used when no image logo is available
 */
export const getBankLogo = (bankId: string): { letter: string; color: string } => {
  return bankLogoData[bankId] || { letter: 'B', color: '#6B7280' };
};

/**
 * Get complete bank logo info
 * Returns both image (if available) and fallback data
 */
export const getBankLogoInfo = (bankId: string): {
  image: ImageSourcePropType | null;
  letter: string;
  color: string;
  hasImage: boolean;
} => {
  const image = getBankLogoImage(bankId);
  const fallback = getBankLogo(bankId);
  
  return {
    image,
    letter: fallback.letter,
    color: fallback.color,
    hasImage: !!image,
  };
};

