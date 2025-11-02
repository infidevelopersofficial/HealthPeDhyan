# Windows Setup Guide

## Quick Install (Recommended)

**Step 1: Delete old files**
```cmd
cd C:\Users\chand\Health\mobile
rmdir /s /q node_modules
del package-lock.json
```

**Step 2: Install dependencies (this will take 5-10 minutes)**
```cmd
npm install
```

**Step 3: Start the app**
```cmd
npm start
```

## Alternative: Use Yarn (Faster)

If npm is too slow, use yarn instead:

**Install yarn:**
```cmd
npm install -g yarn
```

**Install dependencies with yarn:**
```cmd
cd C:\Users\chand\Health\mobile
yarn install
```

**Start with yarn:**
```cmd
yarn start
```

## Testing Options

### Option 1: Test on Your Phone (Easiest)

1. Install **Expo Go** app from Play Store on your Android phone
2. Run `npm start` on your computer
3. Scan the QR code that appears with Expo Go app
4. App will load on your phone over WiFi

### Option 2: Test on Android Emulator

1. Install Android Studio
2. Create an Android Virtual Device (AVD)
3. Run `npm start`
4. Press `a` to open in Android emulator

### Option 3: Test in Web Browser

```cmd
npm start
# Press 'w' to open in web browser
```

## Common Issues

### Issue: "expo is not recognized"
**Solution:** Dependencies not installed. Run `npm install` first.

### Issue: Installation taking too long
**Solutions:**
1. Use yarn instead of npm (faster)
2. Check your internet connection
3. Use `npm install --verbose` to see progress
4. Clear npm cache: `npm cache clean --force`

### Issue: Port already in use
**Solution:**
```cmd
# Kill process on port 8081
netstat -ano | findstr :8081
taskkill /PID <PID_NUMBER> /F
```

### Issue: Metro bundler errors
**Solution:**
```cmd
# Clear cache and restart
npm start -- --clear
```

## Build for Testing (APK)

Once the app works locally, create an APK:

```cmd
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Build APK (takes 10-20 minutes on Expo servers)
eas build --platform android --profile preview
```

## Expected Timeline

- ✅ Install dependencies: 5-10 minutes
- ✅ First start: 2-3 minutes
- ✅ Testing on phone: Instant (after first start)
- 🔨 Build APK: 10-20 minutes (on Expo servers, not your PC)
- 📦 Play Store submission: 2-3 hours setup + 1-7 days review

## Next Steps

1. Test app on your phone with Expo Go
2. Fix any bugs or issues
3. Create app icons and screenshots
4. Build production APK
5. Submit to Play Store

## Need Help?

Check the main README.md for detailed documentation.
