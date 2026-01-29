import { NativeModules, NativeEventEmitter, Platform } from 'react-native';

const { USSDModule } = NativeModules;

interface USSDModuleType {
    isAccessibilityEnabled(): Promise<boolean>;
    openAccessibilitySettings(): void;
    addListener(eventName: string): void;
    removeListeners(count: number): void;
}

const USSD: USSDModuleType = USSDModule || {
    isAccessibilityEnabled: async () => {
        console.warn('USSDModule is not available.');
        return false;
    },
    openAccessibilitySettings: () => {
        console.warn('USSDModule is not available.');
    },
    addListener: () => { },
    removeListeners: () => { },
};

// Only create event emitter if the native module is actually present
const eventEmitter = USSDModule ? new NativeEventEmitter(USSDModule) : null;

export const subscribeToUSSD = (callback: (text: string) => void) => {
    if (!eventEmitter) return () => { };
    const subscription = eventEmitter.addListener('onUSSDText', callback);
    return () => subscription.remove();
};

export default USSD;
