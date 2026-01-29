import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Transaction {
    id: string;
    bankName: string;
    amount: string;
    date: string; // ISO string
    type: string; // 'Transfer', 'Airtime', etc.
    status: string; // 'Success', 'Failed'
}

const STORAGE_KEY = 'USSD_HISTORY';

export const saveTransaction = async (transaction: Omit<Transaction, 'id' | 'date'>) => {
    try {
        const newTransaction: Transaction = {
            ...transaction,
            id: Date.now().toString(),
            date: new Date().toISOString(),
        };

        const existingHistoryJson = await AsyncStorage.getItem(STORAGE_KEY);
        const history: Transaction[] = existingHistoryJson ? JSON.parse(existingHistoryJson) : [];

        // Add new transaction to the top
        const updatedHistory = [newTransaction, ...history];

        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
        console.log('Transaction saved:', newTransaction);
    } catch (error) {
        console.error('Failed to save transaction', error);
    }
};

export const getHistory = async (): Promise<Transaction[]> => {
    try {
        const json = await AsyncStorage.getItem(STORAGE_KEY);
        return json ? JSON.parse(json) : [];
    } catch (error) {
        console.error('Failed to fetch history', error);
        return [];
    }
};

export const clearHistory = async () => {
    try {
        await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (error) {
        console.error('Failed to clear history', error);
    }
}

export const exportHistoryToCSV = (history: Transaction[]): string => {
    if (history.length === 0) return '';

    const headers = ['ID', 'Bank Name', 'Type', 'Amount', 'Date', 'Status'];
    const rows = history.map(t => [
        t.id,
        t.bankName,
        t.type,
        t.amount,
        t.date,
        t.status
    ]);

    const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    return csvContent;
};
