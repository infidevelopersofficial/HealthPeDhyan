# HealthPeDhyan Mobile App 📱

React Native mobile application for HealthPeDhyan, built with Expo.

## 🚀 Quick Start

### Prerequisites

- Node.js 16+
- npm or yarn
- Expo CLI: `npm install -g expo-cli eas-cli`
- For testing: Android Studio (Android) or Xcode (iOS)

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm start

# Run on Android
npm run android

# Run on iOS (macOS only)
npm run ios

# Run on web
npm run web
```

## 📱 Features

- **Home Screen**: Browse featured healthy products
- **Shop Screen**: Filter products by category with search
- **Scanner Screen**: Scan product labels with camera for instant analysis
- **Articles Screen**: Read health and nutrition articles
- **Product Details**: View complete nutritional information and health scores
- **Affiliate Links**: Direct links to purchase products online

## 🛠 Tech Stack

- **React Native** - Cross-platform mobile framework
- **Expo** - Development platform and build service
- **TypeScript** - Type safety
- **React Navigation** - Navigation library
- **Axios** - HTTP client for API calls
- **Expo Camera** - Camera integration for label scanning
- **Expo Image Picker** - Photo selection

## 📁 Project Structure

```
mobile/
├── src/
│   ├── screens/          # App screens
│   │   ├── HomeScreen.tsx
│   │   ├── ShopScreen.tsx
│   │   ├── ProductDetailScreen.tsx
│   │   ├── ScannerScreen.tsx
│   │   ├── ArticlesScreen.tsx
│   │   └── ProfileScreen.tsx
│   │
│   ├── components/       # Reusable components
│   │   ├── ProductCard.tsx
│   │   ├── ArticleCard.tsx
│   │   ├── Loading.tsx
│   │   └── ErrorView.tsx
│   │
│   ├── services/         # API integration
│   │   └── api.ts
│   │
│   ├── types/            # TypeScript types
│   │   └── index.ts
│   │
│   ├── navigation/       # Navigation config
│   │   └── index.tsx
│   │
│   └── constants/        # Theme and config
│       └── theme.ts
│
├── assets/              # Images and icons
├── app.json            # Expo configuration
├── eas.json            # Build configuration
└── package.json
```

## 🎨 Theme

The app uses the HealthPeDhyan brand colors:

- Primary: `#059669` (Green)
- Secondary: `#f59e0b` (Amber)
- Background: `#ffffff`
- Text: `#111827`

## 🔌 API Integration

The app connects to the HealthPeDhyan backend API:

- Base URL: `https://healthpedhyan.com`
- Configured in `app.json` → `extra.apiUrl`

### API Endpoints Used

- `GET /api/products` - Get all products
- `GET /api/products/:slug` - Get product details
- `GET /api/categories` - Get categories
- `GET /api/articles` - Get articles
- `POST /api/label-scan` - Upload label for scanning
- `GET /api/label-scan/:id` - Get scan results

## 📷 Camera Permissions

The app requires camera permissions for the label scanner feature:

- **Android**: Automatically requested on first use
- **iOS**: Permission message configured in `app.json`

## 🏗 Building for Production

### Preview Build (APK for testing)

```bash
# Login to Expo
eas login

# Configure build
eas build:configure

# Build APK
eas build --platform android --profile preview
```

### Production Build (for Play Store)

```bash
# Build AAB (Android App Bundle)
eas build --platform android --profile production

# This creates an .aab file for Play Store submission
```

The build will be available in your Expo dashboard at https://expo.dev

## 📦 Play Store Submission

1. **Create Play Console Account**
   - Visit https://play.google.com/console
   - Pay $25 one-time registration fee

2. **Create App Listing**
   - App name: HealthPeDhyan
   - Category: Health & Fitness
   - Free app

3. **Upload Assets**
   - App icon: 512x512 PNG
   - Feature graphic: 1024x500 PNG
   - Screenshots: 4-8 images

4. **Upload AAB**
   - Download .aab file from EAS Build
   - Upload to Play Console
   - Create release notes

5. **Complete Content Rating**
   - Fill questionnaire
   - Get IARC rating

6. **Submit for Review**
   - Review typically takes 1-7 days

## 🧪 Testing

### Development Testing

```bash
# Start development server
npm start

# Scan QR code with Expo Go app on your device
# OR press 'a' for Android emulator
```

### Physical Device Testing

1. Install Expo Go from Play Store / App Store
2. Run `npm start`
3. Scan QR code with your device
4. App will load and run on your device

## 🐛 Troubleshooting

### Build Errors

```bash
# Clear cache
npx expo start -c

# Clean install
rm -rf node_modules package-lock.json
npm install
```

### Camera Not Working

The camera requires a development build or production build. It won't work in Expo Go for advanced features.

```bash
# Build development client
eas build --profile development --platform android
```

### API Connection Issues

- Check `app.json` → `extra.apiUrl` is correct
- Ensure backend API is accessible from mobile network
- Check if CORS is configured on backend

## 📝 Environment Configuration

The app configuration is in `app.json`:

```json
{
  "expo": {
    "extra": {
      "apiUrl": "https://healthpedhyan.com"
    }
  }
}
```

To change the API URL for development:

```json
{
  "expo": {
    "extra": {
      "apiUrl": "http://your-dev-server:3000"
    }
  }
}
```

## 🔄 Over-The-Air Updates

Expo supports OTA updates for quick bug fixes without app store review:

```bash
# Publish update
eas update --branch production

# Users will receive update automatically
```

## 📚 Documentation

- [Expo Documentation](https://docs.expo.dev/)
- [React Navigation](https://reactnavigation.org/)
- [React Native](https://reactnative.dev/)
- [EAS Build](https://docs.expo.dev/build/introduction/)

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly on Android
4. Submit pull request

## 📄 License

Copyright © 2024 HealthPeDhyan

---

**HealthPeDhyan Mobile** - Make Informed Food Choices 🌿
