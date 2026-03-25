// src/utils/updateChecker.ts
import { Alert, Linking, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

const GITHUB_REPO = 'hawitariku/EthioUSSD-App';
const GITHUB_API_URL = `https://api.github.com/repos/${GITHUB_REPO}/releases/latest`;
const LAST_CHECK_KEY = 'last_update_check';
const DISMISSED_VERSION_KEY = 'dismissed_update_version';
const CHECK_INTERVAL = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

interface GitHubRelease {
  tag_name: string;
  name: string;
  body: string;
  html_url: string;
  assets: Array<{
    name: string;
    browser_download_url: string;
  }>;
  published_at: string;
}

/**
 * Get current app version from app.json
 */
export const getCurrentVersion = (): string => {
  return Constants.expoConfig?.version || '1.0.0';
};

/**
 * Compare version strings (e.g., "1.0.0" vs "1.1.0")
 * Returns true if newVersion is greater than currentVersion
 */
const isNewerVersion = (currentVersion: string, newVersion: string): boolean => {
  const current = currentVersion.replace(/^v/, '').split('.').map(Number);
  const latest = newVersion.replace(/^v/, '').split('.').map(Number);

  for (let i = 0; i < 3; i++) {
    if (latest[i] > current[i]) return true;
    if (latest[i] < current[i]) return false;
  }
  return false;
};

/**
 * Check if enough time has passed since last check
 */
const shouldCheckForUpdate = async (): Promise<boolean> => {
  try {
    const lastCheck = await AsyncStorage.getItem(LAST_CHECK_KEY);
    if (!lastCheck) return true;

    const timeSinceLastCheck = Date.now() - parseInt(lastCheck, 10);
    return timeSinceLastCheck > CHECK_INTERVAL;
  } catch (error) {
    console.error('Error checking last update time:', error);
    return true;
  }
};

/**
 * Check if user has dismissed this version update
 */
const hasUserDismissedVersion = async (version: string): Promise<boolean> => {
  try {
    const dismissedVersion = await AsyncStorage.getItem(DISMISSED_VERSION_KEY);
    return dismissedVersion === version;
  } catch (error) {
    console.error('Error checking dismissed version:', error);
    return false;
  }
};

/**
 * Mark this version as dismissed by user
 */
export const dismissUpdateForVersion = async (version: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(DISMISSED_VERSION_KEY, version);
  } catch (error) {
    console.error('Error saving dismissed version:', error);
  }
};

/**
 * Fetch latest release from GitHub
 */
const fetchLatestRelease = async (): Promise<GitHubRelease | null> => {
  try {
    const response = await fetch(GITHUB_API_URL, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
      },
    });

    if (!response.ok) {
      console.warn('Failed to fetch latest release:', response.status);
      return null;
    }

    const data: GitHubRelease = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching latest release:', error);
    return null;
  }
};

/**
 * Get download URL for APK from release assets
 */
const getApkDownloadUrl = (release: GitHubRelease): string | null => {
  const apkAsset = release.assets.find(asset => 
    asset.name.toLowerCase().endsWith('.apk')
  );
  return apkAsset ? apkAsset.browser_download_url : release.html_url;
};

/**
 * Show update available alert to user
 */
const showUpdateAlert = (release: GitHubRelease, currentVersion: string): void => {
  const downloadUrl = getApkDownloadUrl(release);
  const releaseNotes = release.body ? `\n\nWhat's New:\n${release.body.substring(0, 200)}${release.body.length > 200 ? '...' : ''}` : '';

  Alert.alert(
    '🎉 Update Available!',
    `A new version (${release.tag_name}) is available!\nYour version: ${currentVersion}${releaseNotes}`,
    [
      {
        text: 'Later',
        style: 'cancel',
        onPress: () => dismissUpdateForVersion(release.tag_name),
      },
      {
        text: 'View Release',
        onPress: () => Linking.openURL(release.html_url),
      },
      {
        text: 'Download',
        style: 'default',
        onPress: () => {
          if (downloadUrl) {
            Linking.openURL(downloadUrl);
          }
        },
      },
    ],
    { cancelable: true }
  );
};

/**
 * Main function to check for updates
 * @param forceCheck - If true, bypasses time interval check
 * @param silent - If true, doesn't show "no updates" message
 */
export const checkForUpdates = async (
  forceCheck: boolean = false,
  silent: boolean = true
): Promise<void> => {
  try {
    // Check if we should perform the check
    if (!forceCheck && !(await shouldCheckForUpdate())) {
      console.log('Skipping update check - checked recently');
      return;
    }

    // Update last check timestamp
    await AsyncStorage.setItem(LAST_CHECK_KEY, Date.now().toString());

    // Fetch latest release
    const latestRelease = await fetchLatestRelease();
    if (!latestRelease) {
      if (!silent) {
        Alert.alert('Update Check', 'Unable to check for updates. Please try again later.');
      }
      return;
    }

    const currentVersion = getCurrentVersion();
    const latestVersion = latestRelease.tag_name;

    // Check if user already dismissed this version
    if (await hasUserDismissedVersion(latestVersion)) {
      console.log('User dismissed this version update');
      return;
    }

    // Compare versions
    if (isNewerVersion(currentVersion, latestVersion)) {
      showUpdateAlert(latestRelease, currentVersion);
    } else {
      if (!silent) {
        Alert.alert(
          'You\'re Up to Date!',
          `You have the latest version (${currentVersion}) installed.`,
          [{ text: 'OK' }]
        );
      }
    }
  } catch (error) {
    console.error('Error checking for updates:', error);
    if (!silent) {
      Alert.alert('Update Check Failed', 'Unable to check for updates. Please try again later.');
    }
  }
};

/**
 * Clear update check cache (useful for testing)
 */
export const clearUpdateCache = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(LAST_CHECK_KEY);
    await AsyncStorage.removeItem(DISMISSED_VERSION_KEY);
    console.log('Update cache cleared');
  } catch (error) {
    console.error('Error clearing update cache:', error);
  }
};

/**
 * Get update check status
 */
export const getUpdateCheckStatus = async (): Promise<{
  lastCheck: Date | null;
  dismissedVersion: string | null;
}> => {
  try {
    const lastCheck = await AsyncStorage.getItem(LAST_CHECK_KEY);
    const dismissedVersion = await AsyncStorage.getItem(DISMISSED_VERSION_KEY);

    return {
      lastCheck: lastCheck ? new Date(parseInt(lastCheck, 10)) : null,
      dismissedVersion,
    };
  } catch (error) {
    console.error('Error getting update status:', error);
    return { lastCheck: null, dismissedVersion: null };
  }
};
