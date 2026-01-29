export interface ParsedUSSD {
    type: 'BALANCE' | 'TRANSFER' | 'UNKNOWN';
    amount?: string;
    currency?: string;
    rawText: string;
}

export const parseUSSDMessage = (text: string): ParsedUSSD => {
    // Basic Normalization
    const cleanText = text.replace(/\s+/g, ' ').trim();

    // 1. Balance Check (e.g. "Your balance is 123.45 ETB")
    // Regex explanation: Look for 'balance', capture digits/dots/commas afterwards
    const balanceRegex = /(?:balance|account|curr).+?([\d,]+\.?\d*)/i;
    const balanceMatch = cleanText.match(balanceRegex);

    if (balanceMatch) {
        return {
            type: 'BALANCE',
            amount: balanceMatch[1],
            currency: 'ETB', // Default Assumption for now
            rawText: text
        };
    }

    // 2. Transfer Success (e.g. "Transferred 500 to...")
    const transferRegex = /(?:transfer|sent|paid).+?([\d,]+\.?\d*)/i;
    const transferMatch = cleanText.match(transferRegex);

    if (transferMatch) {
        return {
            type: 'TRANSFER',
            amount: transferMatch[1],
            currency: 'ETB',
            rawText: text
        };
    }

    return {
        type: 'UNKNOWN',
        rawText: text
    };
};
