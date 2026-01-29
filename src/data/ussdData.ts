// src/data/ussdData.ts

export interface UssdStep {
  label: string;
  placeholder: string; // The data the user must enter, or a fixed number
  isFixed: boolean; // True if it's a fixed menu number (e.g., '1'), False if it's user input (e.g., '<<AMOUNT>>')
}

export interface UssdFlow {
  id: string;
  name: string;
  bankName: string;
  code: string; // The initial USSD code (e.g., *996#)
  balanceCode?: string; // Optional deep-link for balance
  transferCode?: string; // Optional deep-link for transfer
  color: string; // Brand color
  steps: UssdStep[];
}

export const USSD_FLOWS: UssdFlow[] = [
  // --- COMMERCIAL BANK OF ETHIOPIA (CBE) ---
  {
    id: 'cbe-mobile',
    name: 'CBE Mobile Banking',
    bankName: 'Commercial Bank of Ethiopia',
    code: '*889#',
    balanceCode: '*889*1*1#', // Assumed common path for balance
    color: '#3B2F85',
    steps: [
      { label: 'Enter PIN', placeholder: '<<PIN>>', isFixed: false },
    ],
  },
  {
    id: 'cbe-birr',
    name: 'CBE Birr',
    bankName: 'Commercial Bank of Ethiopia',
    code: '*847#',
    color: '#3B2F85',
    steps: [
      { label: 'Enter PIN', placeholder: '<<PIN>>', isFixed: false },
    ],
  },
  // --- DASHEN BANK ---
  {
    id: 'dashen-mobile-plus',
    name: 'Dashen Mobile Plus (Amole)',
    bankName: 'Dashen Bank',
    code: '*996#',
    balanceCode: '*996*1#',
    color: '#1E40AF',
    steps: [
      { label: 'Enter PIN', placeholder: '<<PIN>>', isFixed: false },
    ],
  },
  {
    id: 'dashen-superapp',
    name: 'Dashen SuperApp',
    bankName: 'Dashen Bank',
    code: '*675#',
    color: '#1E40AF',
    steps: [],
  },
  // --- AWASH BANK ---
  {
    id: 'awash-mobile',
    name: 'Awash Mobile Banking',
    bankName: 'Awash Bank',
    code: '*901#',
    color: '#15803D',
    steps: [
      { label: 'Enter PIN', placeholder: '<<PIN>>', isFixed: false },
    ],
  },
  // --- BANK OF ABYSSINIA ---
  {
    id: 'abyssinia-mobile',
    name: 'Abyssinia Mobile',
    bankName: 'Bank of Abyssinia',
    code: '*815#',
    color: '#B45309',
    steps: [
      { label: 'Enter PIN', placeholder: '<<PIN>>', isFixed: false },
    ],
  },
  // --- ETHIO TELECOM ---
  {
    id: 'telebirr',
    name: 'telebirr',
    bankName: 'Ethio Telecom',
    code: '*127#',
    balanceCode: '*127*0#',
    transferCode: '*127*1*1#',
    color: '#FECE00',
    steps: [
      { label: 'Enter PIN', placeholder: '<<PIN>>', isFixed: false },
    ],
  },
  // --- SAFARICOM ---
  {
    id: 'm-pesa',
    name: 'M-PESA',
    bankName: 'Safaricom Ethiopia',
    code: '*733#',
    color: '#C02626',
    steps: [
      { label: 'Enter PIN', placeholder: '<<PIN>>', isFixed: false },
    ],
  },
  // --- WEGAGEN BANK ---
  {
    id: 'wegagen-mobile',
    name: 'Wegagen Mobile',
    bankName: 'Wegagen Bank',
    code: '*866#',
    color: '#4F46E5',
    steps: [],
  },
  // --- HIBRET BANK ---
  {
    id: 'hibret-mobile',
    name: 'Hibret Mobile',
    bankName: 'Hibret Bank',
    code: '*811#',
    color: '#0891B2',
    steps: [],
  },
  // --- COOPERATIVE BANK OF OROMIA ---
  {
    id: 'coop-mobile',
    name: 'Coopay E-Birr',
    bankName: 'Cooperative Bank of Oromia',
    code: '*841#',
    color: '#0D9488',
    steps: [],
  },
  // --- AMHARA BANK ---
  {
    id: 'amhara-mobile',
    name: 'Amhara Mobile',
    bankName: 'Amhara Bank',
    code: '*690#',
    color: '#9333EA',
    steps: [],
  },
  // --- LION BANK ---
  {
    id: 'lion-mobile',
    name: 'Lion International',
    bankName: 'Lion International Bank',
    code: '*803#',
    color: '#CA8A04',
    steps: [
      { label: 'Enter PIN', placeholder: '<<PIN>>', isFixed: false },
    ],
  },
  // --- BUNNA BANK ---
  {
    id: 'bunna-mobile',
    name: 'Bunna Mobile',
    bankName: 'Bunna International Bank',
    code: '*820#',
    color: '#7C3AED',
    steps: [],
  },
  // --- ENAT BANK ---
  {
    id: 'enat-mobile',
    name: 'Enat Mobile',
    bankName: 'Enat Bank',
    code: '*845#',
    color: '#DB2777',
    steps: [],
  },
  // --- HIJRA BANK ---
  {
    id: 'hijra-mobile',
    name: 'Hijra Mobile',
    bankName: 'Hijra Bank',
    code: '*827#',
    color: '#059669',
    steps: [],
  },
  {
    id: 'halal-pay',
    name: 'HalalPay',
    bankName: 'Hijra Bank',
    code: '*693#',
    color: '#059669',
    steps: [],
  },
  // --- ZEMEN BANK ---
  {
    id: 'zemen-mobile',
    name: 'Zemen Mobile',
    bankName: 'Zemen Bank',
    code: '*884#',
    color: '#2563EB',
    steps: [],
  },
  // --- SINQEE BANK ---
  {
    id: 'sinqee-mobile',
    name: 'Sinqee Mobile',
    bankName: 'Sinqee Bank',
    code: '*871#',
    color: '#EA580C',
    steps: [],
  },
  // --- GADAA BANK ---
  {
    id: 'gadaa-mobile',
    name: 'Gadaa Mobile',
    bankName: 'Gadaa Bank',
    code: '*877#',
    color: '#475569',
    steps: [],
  },
  // --- SHABELLE BANK ---
  {
    id: 'shabelle-mobile',
    name: 'Shabelle Mobile',
    bankName: 'Shabelle Bank',
    code: '*966#',
    color: '#0284C7',
    steps: [],
  },
  // --- AHADU BANK ---
  {
    id: 'ahadu-mobile',
    name: 'Ahadu Mobile',
    bankName: 'Ahadu Bank',
    code: '*755#',
    color: '#4F46E5',
    steps: [],
  },
  // --- TSEDEY BANK ---
  {
    id: 'tsedey-mobile',
    name: 'Tsedey Mobile',
    bankName: 'Tsedey Bank',
    code: '*890#', // Assumed common range
    color: '#16A34A',
    steps: [],
  },
];
