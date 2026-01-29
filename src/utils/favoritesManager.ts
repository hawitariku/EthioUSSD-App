import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITES_KEY = 'USSD_FAVORITES';

export const toggleFavorite = async (flowId: string) => {
    try {
        const favorites = await getFavorites();
        let newFavorites;

        if (favorites.includes(flowId)) {
            newFavorites = favorites.filter(id => id !== flowId);
        } else {
            newFavorites = [...favorites, flowId];
        }

        await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
        return newFavorites;
    } catch (error) {
        console.error('Error toggling favorite:', error);
        return [];
    }
};

export const getFavorites = async (): Promise<string[]> => {
    try {
        const json = await AsyncStorage.getItem(FAVORITES_KEY);
        return json ? JSON.parse(json) : [];
    } catch (error) {
        console.error('Error fetching favorites:', error);
        return [];
    }
};
