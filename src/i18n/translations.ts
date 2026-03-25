import { I18n } from 'i18n-js';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';

const translations = {
    en: {
        welcome: 'Welcome',
        search_placeholder: 'Search bank...',
        history: 'History',
        settings: 'Settings',
        favorites: 'Favorites',
        all_banks: 'All Banks',
        clear_history: 'Clear History',
        language: 'Language',
        about: 'About',
        security: 'Security',
        biometric_lock: 'Biometric Lock',
        unlock_with_biometrics: 'Unlock with Biometrics',
        unlock_app: 'Unlock App',
        locked: 'Locked',
        authenticate_msg: 'Authenticate to access your bank transactions.',
        dial_root: 'Dial Root Code',
        dial_full: 'Dial Full Code',
        enter_amount: 'Enter Amount',
        enter_account: 'Enter Account No.',
        enter_pin: 'Enter PIN',
        save: 'Save',
        cancel: 'Cancel',
        transaction_saved: 'Transaction Saved',
        history_cleared: 'History Cleared',
        confirm_clear: 'Are you sure you want to clear all history?',
        no_history: 'No transactions yet.',
        no_favorites: 'No favorites yet.',
        version: 'Version',
        developed_by: 'Developed by',
        select_bank: 'Select Bank/Service',
        ready_to_call: 'Ready to dial?',
        launch_button: 'Dial Now',
        total_dials: 'Total Dials',
        most_used: 'Most Used',
        search_history: 'Search transactions...',
        all_filters: 'All',
        reset_onboarding: 'Reset Onboarding',
        onboarding_title_1: 'Welcome to Ethio USSD',
        onboarding_desc_1: 'The premium way to manage your banking and telecom USSD services in Ethiopia.',
        onboarding_title_2: 'Launcher Mode',
        onboarding_desc_2: 'We prioritize your security. Our app prepares the USSD code, and you complete the dial in your secure phone app.',
        onboarding_title_3: 'Simple & Fast',
        onboarding_desc_3: 'No more memorizing codes. Search for your bank, tap launch, and you are ready to go.',
    },
    am: {
        welcome: 'እንኳን ደህና መጡ',
        search_placeholder: 'ባንክ ይፈልጉ...',
        history: 'ታሪክ',
        settings: 'ቅንብሮች',
        favorites: 'የተወደዱ',
        all_banks: 'ሁሉም ባንኮች',
        clear_history: 'ታሪክን አጽዳ',
        language: 'ቋንቋ',
        about: 'ስለ መተግበሪያው',
        security: 'ደህንነት',
        biometric_lock: 'የባዮሜትሪክ መቆለፊያ',
        unlock_with_biometrics: 'በባዮሜትሪክ ክፈት',
        unlock_app: 'መተግበሪያውን ክፈት',
        locked: 'ተቆልፏል',
        authenticate_msg: 'የባንክ ግብይቶችዎን ለማግኘት እባክዎ ማንነትዎን ያረጋግጡ።',
        dial_root: 'ዋና ኮድ ደውል',
        dial_full: 'ሙሉ ኮድ ደውል',
        enter_amount: 'መጠን ያስገቡ',
        enter_account: 'የሂሳብ ቁጥር ያስገቡ',
        enter_pin: 'ፒን ያስገቡ',
        save: 'አስቀምጥ',
        cancel: 'ሰርዝ',
        transaction_saved: 'ግብይት ተቀምጧል',
        history_cleared: 'ታሪክ ተሰርዟል',
        confirm_clear: 'ሁሉንም ታሪክ መሰረዝ ይፈልጋሉ?',
        no_history: 'ገና ምንም ግብይት የለም።',
        no_favorites: 'ገና ምንም የተወደዱ የሉም።',
        version: 'ስሪት',
        developed_by: 'የተሰራው በ',
        select_bank: 'ባንክ ወይም አገልግሎት ይምረጡ',
        ready_to_call: 'ለመደወል ዝግጁ ነዎት?',
        launch_button: 'አሁን ደውል',
        total_dials: 'ጠቅላላ ጥሪዎች',
        most_used: 'በብዛት ጥቅም ላይ የዋለ',
        search_history: 'ግብይቶችን ይፈልጉ...',
        all_filters: 'ሁሉም',
        reset_onboarding: 'መግቢያን እንደገና አስጀምር',
        onboarding_title_1: 'ወደ ኢትዮ USSD እንኳን በደህና መጡ',
        onboarding_desc_1: 'በኢትዮጵያ የባንክ እና የቴሌኮም USSD አገልግሎቶችን ለማስተዳደር ምርጥ መንገድ።',
        onboarding_title_2: 'የማስጀመሪያ ሁነታ',
        onboarding_desc_2: 'ደህንነትዎን እናስቀድማለን። መተግበሪያችን USSD ኮዱን ያዘጋጃል፣ እርስዎም በደህንነት በስልክዎ ውስጥ ይደውላሉ።',
        onboarding_title_3: 'ቀላል እና ፈጣን',
        onboarding_desc_3: 'ኮዶችን ማስታወስ አያስፈልግም። ባንክዎን ይፈልጉ፣ ማስጀመሪያን ይንኩ፣ እና ዝግጁ ነዎት።',
    },
    om: {
        welcome: 'Baga Nagaan Dhuftan',
        search_placeholder: 'Baankii barbaadi...',
        history: 'Seenaa',
        settings: 'Qindaa\'ina',
        favorites: 'Jaallatamaa',
        all_banks: 'Baankiiwwan Hunda',
        clear_history: 'Seenaa Haqii',
        language: 'Afaan',
        about: 'Waa\'ee Appii',
        security: 'Nageenya',
        biometric_lock: 'Cuftuu Baayoomeetrikii',
        unlock_with_biometrics: 'Baayoomeetrikiin Bani',
        unlock_app: 'Appii Bani',
        locked: 'Cufameera',
        authenticate_msg: 'Daldala baankii keessanii argachuuf mirkaneessaa.',
        dial_root: 'Koodii Jalqabaa Bilbili',
        dial_full: 'Koodii Guutuu Bilbili',
        enter_amount: 'Hamma Galchaa',
        enter_account: 'Lakkoofsa Herregaa Galchaa',
        enter_pin: 'PIN Galchaa',
        save: 'Olkaa\'i',
        cancel: 'Haqii',
        transaction_saved: 'Daldalli Olka\'ameera',
        history_cleared: 'Seenaan Haqameera',
        confirm_clear: 'Seenaa hunda haquu barbaadduu?',
        no_history: 'Ammallee daldalli hin jiru.',
        no_favorites: 'Ammallee jaallatamaan hin jiru.',
        version: 'Gosa',
        developed_by: 'Kan Hojjetame',
        select_bank: 'Baankii ykn Tajaajila Filadhu',
        ready_to_call: 'Bilbiluuf qophii dha?',
        launch_button: 'Amma Bilbili',
        total_dials: 'Bilbila Waliigalaa',
        most_used: 'Baay\'ee Kan Itti Fayyadame',
        search_history: 'Daldala barbaadi...',
        all_filters: 'Hunda',
        reset_onboarding: 'Seensa Jalqabaa Deebisii',
        onboarding_title_1: 'Gara Ethio USSD Baga Nagaan Dhuftan',
        onboarding_desc_1: 'Itoophiyaa keessatti tajaajila baankii fi teelekoomii USSD bulchuuf karaa gaarii.',
        onboarding_title_2: 'Haalata Ka\'umsaa',
        onboarding_desc_2: 'Nageenya keessan dursa kennina. Appiin keenya koodii USSD qopheessa, isin immoo bilbila keessan nagaan itti xumurattu.',
        onboarding_title_3: 'Salphaa fi Saffisaa',
        onboarding_desc_3: 'Koodii yaadachuu hin barbaachisu. Baankii keessan barbaadaa, ka\'umsa tuqaa, qophii dha.',
    },
};

const i18n = new I18n(translations);
i18n.enableFallback = true;
i18n.defaultLocale = 'en';

export { i18n };

// Async language loader
export const loadLanguage = async () => {
    try {
        const saved = await AsyncStorage.getItem('user-language');
        if (saved) {
            i18n.locale = saved;
        } else {
            i18n.locale = Localization.locale.split('-')[0] || 'en';
        }
    } catch (e) {
        console.error('Failed to load language:', e);
        i18n.locale = 'en';
    }
};

export const setLanguage = async (lang: string) => {
    i18n.locale = lang;
    await AsyncStorage.setItem('user-language', lang);
};
