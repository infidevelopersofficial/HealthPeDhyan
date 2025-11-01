# 📱 React Native App Setup Guide

Complete guide to build and deploy HealthPeDhyan mobile app to Play Store.

---

## 🎯 Project Overview

**Technology Stack:**
- React Native (via Expo)
- TypeScript
- React Navigation
- Expo Camera (for label scanner)
- Expo Image Picker
- AsyncStorage (for offline storage)

**Why Expo:**
- ✅ Easiest Play Store deployment
- ✅ Built-in camera, image picker
- ✅ Push notifications
- ✅ Over-the-air updates
- ✅ Managed build service (EAS)

---

## 📁 Project Structure

```
Health/
├── web/                    # Next.js web app (existing)
│   ├── src/
│   ├── prisma/
│   └── package.json
│
├── mobile/                 # React Native app (new)
│   ├── src/
│   │   ├── screens/        # App screens
│   │   │   ├── HomeScreen.tsx
│   │   │   ├── ShopScreen.tsx
│   │   │   ├── ProductScreen.tsx
│   │   │   ├── ScannerScreen.tsx
│   │   │   ├── ArticlesScreen.tsx
│   │   │   └── ProfileScreen.tsx
│   │   │
│   │   ├── components/     # Reusable components
│   │   │   ├── ProductCard.tsx
│   │   │   ├── ArticleCard.tsx
│   │   │   └── Scanner.tsx
│   │   │
│   │   ├── services/       # API integration
│   │   │   └── api.ts
│   │   │
│   │   ├── types/          # TypeScript types
│   │   │   └── index.ts
│   │   │
│   │   ├── navigation/     # Navigation config
│   │   │   └── index.tsx
│   │   │
│   │   └── constants/      # Colors, config
│   │       └── theme.ts
│   │
│   ├── assets/            # Images, icons
│   │   ├── icon.png
│   │   ├── splash.png
│   │   └── adaptive-icon.png
│   │
│   ├── app.json           # Expo config
│   ├── eas.json           # Build config
│   ├── package.json
│   └── tsconfig.json
│
└── shared/                # Shared types (optional)
    └── types.ts
```

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
# Install Expo CLI globally
npm install -g expo-cli eas-cli

# Create mobile directory
cd Health
mkdir mobile
cd mobile

# Initialize Expo project
npx create-expo-app@latest . --template blank-typescript

# Install dependencies
npm install @react-navigation/native @react-navigation/bottom-tabs @react-navigation/native-stack
npm install react-native-screens react-native-safe-area-context
npm install expo-camera expo-image-picker
npm install @react-native-async-storage/async-storage
npm install axios

# Install Expo dependencies
npx expo install expo-status-bar
```

---

### 2. Configure app.json

```json
{
  "expo": {
    "name": "HealthPeDhyan",
    "slug": "healthpedhyan",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#059669"
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.healthpedhyan.app"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#059669"
      },
      "package": "com.healthpedhyan.app",
      "versionCode": 1,
      "permissions": [
        "CAMERA",
        "READ_EXTERNAL_STORAGE",
        "WRITE_EXTERNAL_STORAGE"
      ]
    },
    "web": {
      "favicon": "./assets/favicon.png"
    },
    "plugins": [
      [
        "expo-camera",
        {
          "cameraPermission": "Allow HealthPeDhyan to access your camera to scan product labels."
        }
      ],
      [
        "expo-image-picker",
        {
          "photosPermission": "Allow HealthPeDhyan to access your photos to upload product labels."
        }
      ]
    ],
    "extra": {
      "apiUrl": "https://healthpedhyan.com",
      "eas": {
        "projectId": "your-project-id"
      }
    }
  }
}
```

---

### 3. Configure EAS Build (eas.json)

```json
{
  "cli": {
    "version": ">= 5.9.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "android": {
        "buildType": "aab"
      }
    }
  },
  "submit": {
    "production": {
      "android": {
        "serviceAccountKeyPath": "./service-account.json",
        "track": "internal"
      }
    }
  }
}
```

---

## 🔌 API Integration

### Environment Configuration

Create `.env`:
```
API_BASE_URL=https://healthpedhyan.com
API_TIMEOUT=30000
```

### API Service

```typescript
// src/services/api.ts
import axios from 'axios';
import Constants from 'expo-constants';

const API_BASE_URL = Constants.expoConfig?.extra?.apiUrl || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Products
export const getProducts = async () => {
  const response = await api.get('/api/products');
  return response.data;
};

export const getProduct = async (slug: string) => {
  const response = await api.get(`/api/products/${slug}`);
  return response.data;
};

// Articles
export const getArticles = async () => {
  const response = await api.get('/api/articles');
  return response.data;
};

// Label Scanner
export const uploadLabel = async (imageUri: string) => {
  const formData = new FormData();
  formData.append('image', {
    uri: imageUri,
    type: 'image/jpeg',
    name: 'label.jpg',
  } as any);

  const response = await api.post('/api/label-scan', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const getScanResult = async (scanId: string) => {
  const response = await api.get(`/api/label-scan/${scanId}`);
  return response.data;
};
```

---

## 🎨 Theme Configuration

```typescript
// src/constants/theme.ts
export const theme = {
  colors: {
    primary: '#059669',
    primaryDark: '#047857',
    primaryLight: '#10b981',
    secondary: '#f59e0b',
    background: '#ffffff',
    surface: '#f9fafb',
    text: '#111827',
    textSecondary: '#6b7280',
    border: '#e5e7eb',
    error: '#ef4444',
    success: '#10b981',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
  },
  typography: {
    h1: {
      fontSize: 32,
      fontWeight: '700',
    },
    h2: {
      fontSize: 24,
      fontWeight: '600',
    },
    h3: {
      fontSize: 20,
      fontWeight: '600',
    },
    body: {
      fontSize: 16,
      fontWeight: '400',
    },
    caption: {
      fontSize: 14,
      fontWeight: '400',
    },
  },
};
```

---

## 📱 Build & Deploy

### Development Build (Test on Device)

```bash
# Start development server
npx expo start

# Scan QR code with Expo Go app
# OR press 'a' for Android emulator
```

### Preview Build (APK for testing)

```bash
# Login to Expo
eas login

# Configure project
eas build:configure

# Build APK for testing
eas build --platform android --profile preview

# Download APK and install on device
```

### Production Build (Play Store)

```bash
# Build AAB (Android App Bundle)
eas build --platform android --profile production

# This creates an .aab file for Play Store
# Download when complete
```

---

## 🏪 Play Store Submission

### 1. Create Play Console Account

1. Go to https://play.google.com/console
2. Pay $25 one-time fee
3. Create developer account

### 2. Create App Listing

1. Click "Create app"
2. Fill in details:
   - **App name:** HealthPeDhyan
   - **Default language:** English
   - **App type:** Application
   - **Free or paid:** Free

### 3. Prepare Store Listing

**Required assets:**
- App icon (512x512 PNG)
- Feature graphic (1024x500 PNG)
- Screenshots (2-8 images)
- Short description (80 chars)
- Full description (4000 chars)
- Privacy policy URL

**Screenshots needed:**
- Phone: 16:9 or 9:16 ratio
- Minimum 2 screenshots
- Recommended: 4-8 screenshots

### 4. Upload AAB

1. Go to "Production" → "Create new release"
2. Upload .aab file from EAS Build
3. Add release notes
4. Review and rollout

### 5. Content Rating

1. Fill questionnaire
2. Get IARC rating
3. Apply to app

### 6. Submit for Review

1. Complete all sections
2. Submit for review
3. Wait 1-7 days for approval

---

## 🎯 Pre-Launch Checklist

### App Requirements
- [ ] App icon (512x512)
- [ ] Splash screen
- [ ] Feature graphic
- [ ] 4-8 screenshots
- [ ] Privacy policy
- [ ] Terms of service

### Technical Requirements
- [ ] Camera permission working
- [ ] API integration tested
- [ ] Offline handling
- [ ] Error handling
- [ ] Loading states
- [ ] Image optimization

### Store Listing
- [ ] App name
- [ ] Short description
- [ ] Full description
- [ ] Category (Health & Fitness)
- [ ] Content rating
- [ ] Contact email

---

## 📊 Timeline Estimate

| Task | Time |
|------|------|
| Setup project | 2 hours |
| API integration | 4 hours |
| Build screens | 2-3 days |
| Navigation | 4 hours |
| Camera/Scanner | 6 hours |
| Testing | 1 day |
| Assets (icons, screenshots) | 4 hours |
| Build & upload | 2 hours |
| Play Store listing | 2 hours |
| **Total** | **4-5 days** |

---

## 🚀 Fast Track (Minimum Viable App)

To get on Play Store ASAP, build these screens first:

**Phase 1 (Day 1-2):**
1. ✅ Home screen (product list)
2. ✅ Product detail screen
3. ✅ Basic navigation
4. ✅ API integration

**Phase 2 (Day 3):**
1. ✅ Label scanner (camera)
2. ✅ Scanner results
3. ✅ Articles list

**Phase 3 (Day 4):**
1. ✅ Polish UI
2. ✅ Add loading states
3. ✅ Error handling
4. ✅ Testing

**Phase 4 (Day 5):**
1. ✅ Create assets
2. ✅ Build APK/AAB
3. ✅ Create store listing
4. ✅ Submit!

---

## 🔧 Troubleshooting

### Build Errors
```bash
# Clear cache
npx expo start -c

# Clean install
rm -rf node_modules package-lock.json
npm install
```

### Camera Not Working
```bash
# Rebuild with development client
eas build --profile development --platform android
```

### API Connection Issues
```bash
# Check API URL in app.json extra.apiUrl
# Ensure API is accessible from mobile network
```

---

## 📞 Next Steps

1. I'll create the mobile app structure
2. Build key screens
3. Integrate with your APIs
4. Test on Android
5. Build AAB for Play Store
6. Guide you through submission

**Ready to start building?** Let's create the React Native app! 🚀

---

**HealthPeDhyan™** - From Web to Mobile in Days
