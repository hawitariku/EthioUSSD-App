// src/utils/ussdDialer.ts
import { Linking, Platform } from 'react-native';

export const initiateUssdCall = async (ussdCode: string): Promise<void> => {
  // USSD codes need to be URI-encoded, especially the '#' symbol.
  // The 'tel:' scheme automatically opens the native dialer/phone app.
  const code = ussdCode.replace(/#/g, encodeURIComponent('#'));
  const url = `tel:${code}`;

  const supported = await Linking.canOpenURL(url);

  if (supported) {
    // This is the core action: automatically dialing the number.
    await Linking.openURL(url);
  } else {
    console.error('Dialer not supported or USSD code error.');
    // Alert the user on the screen if the phone doesn't support dialing
    throw new Error('Cannot open phone dialer. Check permissions or device settings.');
  }
};