const { withAndroidManifest, withDangerousMod, withProjectBuildGradle } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

/**
 * Expo Config Plugin to inject USSD Automation Native Code
 * This plugin adds:
 * 1. USSDAccessibilityService.java (Listens to USSD overlay)
 * 2. USSDModule.java (Bridge to React Native)
 * 3. USSDPackage.java (React Package)
 * 4. AndroidManifest changes
 */

const JAVA_PACKAGE = 'com.ethioussd.companion';
const PACKAGE_PATH = 'com/ethioussd/companion';

const USSDAccessibilityServiceJava = `package ${JAVA_PACKAGE};

import android.accessibilityservice.AccessibilityService;
import android.accessibilityservice.AccessibilityServiceInfo;
import android.view.accessibility.AccessibilityEvent;
import android.view.accessibility.AccessibilityNodeInfo;
import android.util.Log;
import android.content.Intent;

public class USSDAccessibilityService extends AccessibilityService {
    private static final String TAG = "USSDAccessibility";

    @Override
    public void onAccessibilityEvent(AccessibilityEvent event) {
        Log.d(TAG, "onAccessibilityEvent: " + event.toString());

        if (event.getEventType() == AccessibilityEvent.TYPE_WINDOW_STATE_CHANGED || 
            event.getEventType() == AccessibilityEvent.TYPE_WINDOW_CONTENT_CHANGED) {
            
            AccessibilityNodeInfo source = event.getSource();
            if (source == null) return;

            processNode(source);
        }
    }

    private void processNode(AccessibilityNodeInfo node) {
        if (node == null) return;

        if (node.getClassName().equals("android.widget.TextView") || 
            node.getClassName().equals("android.app.AlertDialog")) {
            
            CharSequence text = node.getText();
            if (text != null && text.length() > 0) {
                String ussdText = text.toString();
                Log.d(TAG, "Captured USSD Text: " + ussdText);
                
                // Broadcast to USSDModule
                Intent intent = new Intent("onUSSDText");
                intent.putExtra("text", ussdText);
                sendBroadcast(intent);
            }
        }

        for (int i = 0; i < node.getChildCount(); i++) {
            processNode(node.getChild(i));
        }
    }

    @Override
    public void onInterrupt() {
        Log.d(TAG, "Service Interrupted");
    }

    @Override
    protected void onServiceConnected() {
        super.onServiceConnected();
        Log.d(TAG, "Service Connected");
        AccessibilityServiceInfo info = new AccessibilityServiceInfo();
        info.eventTypes = AccessibilityEvent.TYPE_WINDOW_STATE_CHANGED | AccessibilityEvent.TYPE_WINDOW_CONTENT_CHANGED;
        info.feedbackType = AccessibilityServiceInfo.FEEDBACK_GENERIC;
        info.notificationTimeout = 100;
        this.setServiceInfo(info);
    }
}
`;

const USSDModuleJava = `package ${JAVA_PACKAGE};

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.provider.Settings;
import android.text.TextUtils;
import androidx.annotation.NonNull;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.modules.core.DeviceEventManagerModule;

public class USSDModule extends ReactContextBaseJavaModule {
    private final ReactApplicationContext reactContext;

    public USSDModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
        
        // Register Broadcast Receiver for USSD text
        IntentFilter filter = new IntentFilter("onUSSDText");
        BroadcastReceiver receiver = new BroadcastReceiver() {
            @Override
            public void onReceive(Context context, Intent intent) {
                String text = intent.getStringExtra("text");
                sendEvent("onUSSDText", text);
            }
        };

        if (android.os.Build.VERSION.SDK_INT >= 33) {
            reactContext.registerReceiver(receiver, filter, Context.RECEIVER_EXPORTED);
        } else {
            reactContext.registerReceiver(receiver, filter);
        }
    }

    @NonNull
    @Override
    public String getName() {
        return "USSDModule";
    }

    @ReactMethod
    public void isAccessibilityEnabled(Promise promise) {
        String service = reactContext.getPackageName() + "/" + USSDAccessibilityService.class.getCanonicalName();
        int accessibilityEnabled = 0;
        try {
            accessibilityEnabled = Settings.Secure.getInt(reactContext.getContentResolver(), android.provider.Settings.Secure.ACCESSIBILITY_ENABLED);
        } catch (Settings.SettingNotFoundException e) {
            promise.reject("ERR", "Settings not found");
            return;
        }

        TextUtils.SimpleStringSplitter mStringColonSplitter = new TextUtils.SimpleStringSplitter(':');
        if (accessibilityEnabled == 1) {
            String settingValue = Settings.Secure.getString(reactContext.getContentResolver(), Settings.Secure.ENABLED_ACCESSIBILITY_SERVICES);
            if (settingValue != null) {
                mStringColonSplitter.setString(settingValue);
                while (mStringColonSplitter.hasNext()) {
                    String accessibilityService = mStringColonSplitter.next();
                    if (accessibilityService.equalsIgnoreCase(service)) {
                        promise.resolve(true);
                        return;
                    }
                }
            }
        }
        promise.resolve(false);
    }

    @ReactMethod
    public void openAccessibilitySettings() {
        Intent intent = new Intent(Settings.ACTION_ACCESSIBILITY_SETTINGS);
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        reactContext.startActivity(intent);
    }

    private void sendEvent(String eventName, String text) {
        reactContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
            .emit(eventName, text);
    }
}
`;

const USSDPackageJava = `package ${JAVA_PACKAGE};

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class USSDPackage implements ReactPackage {
    @Override
    public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
        return Collections.emptyList();
    }

    @Override
    public List<NativeModule> createNativeModules(ReactApplicationContext reactContext) {
        List<NativeModule> modules = new ArrayList<>();
        modules.add(new USSDModule(reactContext));
        return modules;
    }
}
`;

const accessibilityConfigXml = `<?xml version="1.0" encoding="utf-8"?>
<accessibility-service xmlns:android="http://schemas.android.com/apk/res/android"
    android:accessibilityEventTypes="typeWindowStateChanged|typeWindowContentChanged"
    android:accessibilityFeedbackType="feedbackGeneric"
    android:accessibilityFlags="flagDefault"
    android:canRetrieveWindowContent="true"
    android:description="@string/accessibility_description" />
`;

/**
 * 1. Inject Java Source Files
 */
const withUSSDJavaFiles = (config) => {
    return withDangerousMod(config, [
        'android',
        async (config) => {
            const rootPath = path.join(config.modRequest.projectRoot, 'android/app/src/main/java', PACKAGE_PATH);

            // Ensure directory exists
            if (!fs.existsSync(rootPath)) {
                fs.mkdirSync(rootPath, { recursive: true });
            }

            fs.writeFileSync(path.join(rootPath, 'USSDAccessibilityService.java'), USSDAccessibilityServiceJava);
            fs.writeFileSync(path.join(rootPath, 'USSDModule.java'), USSDModuleJava);
            fs.writeFileSync(path.join(rootPath, 'USSDPackage.java'), USSDPackageJava);

            return config;
        },
    ]);
};

/**
 * 2. Inject XML Resource Files
 */
const withUSSDResources = (config) => {
    return withDangerousMod(config, [
        'android',
        async (config) => {
            const xmlDir = path.join(config.modRequest.projectRoot, 'android/app/src/main/res/xml');
            if (!fs.existsSync(xmlDir)) {
                fs.mkdirSync(xmlDir, { recursive: true });
            }
            fs.writeFileSync(path.join(xmlDir, 'accessibility_service_config.xml'), accessibilityConfigXml);

            // Add string resource for description
            const stringsPath = path.join(config.modRequest.projectRoot, 'android/app/src/main/res/values/strings.xml');
            if (fs.existsSync(stringsPath)) {
                let strings = fs.readFileSync(stringsPath, 'utf8');
                if (!strings.includes('accessibility_description')) {
                    strings = strings.replace('</resources>', '    <string name="accessibility_description">Automate and read USSD responses safely.</string>\n</resources>');
                    fs.writeFileSync(stringsPath, strings);
                }
            }

            return config;
        },
    ]);
};

/**
 * 3. Modify AndroidManifest.xml
 */
const withUSSDManifest = (config) => {
    return withAndroidManifest(config, async (config) => {
        const mainApplication = config.modResults.manifest.application[0];

        // Add Accessibility Service
        if (!mainApplication.service) mainApplication.service = [];

        const serviceExists = mainApplication.service.some(
            (s) => s.$['android:name'] === '.USSDAccessibilityService'
        );

        if (!serviceExists) {
            mainApplication.service.push({
                $: {
                    'android:name': '.USSDAccessibilityService',
                    'android:permission': 'android.permission.BIND_ACCESSIBILITY_SERVICE',
                    'android:exported': 'false',
                },
                'intent-filter': [
                    {
                        action: [{ $: { 'android:name': 'android.accessibilityservice.AccessibilityService' } }],
                    },
                ],
                'meta-data': [
                    {
                        $: {
                            'android:name': 'android.accessibilityservice',
                            'android:resource': '@xml/accessibility_service_config',
                        },
                    },
                ],
            });
        }

        return config;
    });
};

/**
 * 4. Register Package in MainApplication.kt
 */
const withUSSDPackageRegistration = (config) => {
    return withDangerousMod(config, [
        'android',
        async (config) => {
            const projectRoot = config.modRequest.projectRoot;
            const mainAppPath = path.join(projectRoot, 'android/app/src/main/java', PACKAGE_PATH, 'MainApplication.kt');

            if (fs.existsSync(mainAppPath)) {
                let mainApp = fs.readFileSync(mainAppPath, 'utf8');

                // Add import
                if (!mainApp.includes('import com.ethioussd.companion.USSDPackage')) {
                    mainApp = mainApp.replace(/package com.ethioussd.companion/, `package com.ethioussd.companion\n\nimport com.ethioussd.companion.USSDPackage`);
                }

                // Add to packages list (heuristic for Expo projects)
                if (!mainApp.includes('USSDPackage()')) {
                    // Find the packages list
                    const packagesMatch = mainApp.match(/val packages = PackageList\(this\)\.packages/);
                    if (packagesMatch) {
                        mainApp = mainApp.replace(
                            /val packages = PackageList\(this\)\.packages/,
                            'val packages = PackageList(this).packages.toMutableList()\n      packages.add(USSDPackage())\n      packages'
                        );
                    }
                }

                fs.writeFileSync(mainAppPath, mainApp);
            }
            return config;
        },
    ]);
}

module.exports = (config) => {
    config = withUSSDJavaFiles(config);
    config = withUSSDResources(config);
    config = withUSSDManifest(config);
    config = withUSSDPackageRegistration(config);
    return config;
};
