import i18n from 'i18n-js';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';

i18n.translations = {
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
        developed_by: 'Developed by Antigravity',
        select_bank: 'Select Bank/Service',
        ready_to_call: 'Ready to dial the service code?',
        launch_button: 'Launch Dialer',
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
        language: 'ቋቋ',
        about: 'ስለ እኛ',
        security: 'ደህንነት',
        biometric_lock: 'ባዮሜትሪክ ቁልፍ',
        unlock_with_biometrics: 'በባዮሜትሪክ ይክፈቱ',
        unlock_app: 'መተግበሪያውን ይክፈቱ',
        locked: 'ተቆልፏል',
        authenticate_msg: 'የባንክ ልውውጦችን ለማግኘት እባክዎ ማንነትዎን ያረጋግጡ።',
        dial_root: 'መነሻ ኮድን ደውል',
        dial_full: 'ሙሉ ኮድን ደውል',
        enter_amount: 'ገንዘብ መጠን ያስገቡ',
        enter_account: 'ሂሳብ ቁጥር ያስገቡ',
        enter_pin: 'ፒን ያስገቡ',
        save: 'አስቀምጥ',
        cancel: 'ሰርዝ',
        transaction_saved: 'ልውውይ ተቀምጧል',
        history_cleared: 'ታሪክ ተሰርዟል',
        confirm_clear: 'ሁሉንም ታሪክ ማጥፋት ይፈልጋሉ?',
        no_history: 'ምንም ታሪክ የለም።',
        no_favorites: 'ምንም የተወደዱ የሉም።',
        version: 'ስሪት',
        developed_by: 'በ Antigravity የተሰራ',
        select_bank: 'ባንክ ወይም አገልግሎት ይምረጡ',
        ready_to_call: 'አገልግሎቱን ለመደወል ዝግጁ ነዎት?',
        launch_button: 'ደውል',
        total_dials: 'ጠቅላላ ሙከራዎች',
        most_used: 'ብዙ ጥቅም ላይ የዋለ',
        search_history: 'ልውውጦችን ይፈልጉ...',
        all_filters: 'ሁሉም',
        reset_onboarding: 'የመጀመሪያ መግቢያን መልስ',
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
        about: 'Waa\'ee Keenya',
        security: 'Nageenya',
        biometric_lock: 'Biometric Lock',
        unlock_with_biometrics: 'Biometric dhaan bani',
        unlock_app: 'Appii Bani',
        locked: 'Cufaa dha',
        authenticate_msg: 'Maaloo, eenyummaa keessan mirkaneessaa.',
        dial_root: 'Koodii Jalqabaa Bilbili',
        dial_full: 'Koodii Guutuu Bilbili',
        enter_amount: 'Hamma Galchi',
        enter_account: 'Lakkoofsa Herregaa Galchi',
        enter_pin: 'PIN Galchi',
        save: 'Olkaa\'i',
        cancel: 'Haqi',
        transaction_saved: 'Daddabran Olka\'aameera',
        history_cleared: 'Seenaan Haqameera',
        confirm_clear: 'Seenaa hunda haquu barbaadduu?',
        no_history: 'Seenaan homaayyuu hin jiru.',
        no_favorites: 'Jaallatamaan homaayyuu hin jiru.',
        version: 'Maxxansa',
        developed_by: 'Antigravity dhaan kan hojjetame',
        select_bank: 'Baankii Filadhu',
        ready_to_call: 'Koodii bilbiluuf qophiidhaa?',
        launch_button: 'Bilbili',
        total_dials: 'Waliigala',
        most_used: 'Baay\'ee kan fayyidame',
        search_history: 'Barbaadi...',
        all_filters: 'Hunda',
        reset_onboarding: 'Onboarding Deebisi',
    },
};

// Set fallback
i18n.fallbacks = true;
i18n.defaultLocale = 'en';

export { i18n };

// Async language loader
export const loadLanguage = async () => {
    const saved = await AsyncStorage.getItem('user-language');
    if (saved) {
        i18n.locale = saved;
    } else {
        i18n.locale = Localization.locale.split('-')[0] || 'en';
    }
};

export const setLanguage = async (lang: string) => {
    i18n.locale = lang;
    await AsyncStorage.setItem('user-language', lang);
};
