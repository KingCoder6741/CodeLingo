# CodeLingo Mobile App

## Tech Stack
- **Framework**: React Native (Expo)
- **Navigation**: React Navigation
- **State**: Async Storage + Axios
- **Charts**: react-native-chart-kit
- **Build**: Expo Managed Workflow

## Setup

### Prerequisites
```bash
npm install -g eas-cli
npm install -g expo-cli
```

### Install Dependencies
```bash
cd mobile
npm install
```

### Start Development
```bash
# iOS
npm run ios

# Android
npm run android

# Web
npm run web
```

### Configure API Connection
Edit `screens/*.js` and update `API_URL`:

**Local Machine (iOS/Android)**:
```javascript
const API_URL = 'http://10.0.2.2:5000/api'; // Android emulator
const API_URL = 'http://127.0.0.1:5000/api'; // iOS simulator
```

**Production**:
```javascript
const API_URL = 'https://your-api.railway.app/api';
```

## Build for Production

### Apple App Store
```bash
npm run build -- --platform ios
npm run submit -- --platform ios
```

### Google Play Store
```bash
npm run build -- --platform android
npm run submit -- --platform android
```

## Features Included

✅ **Home Screen**: User profile, streak, quick stats  
✅ **Analytics Dashboard**: Charts, progress tracking  
✅ **Code Sandbox**: Run JavaScript on mobile  
✅ **OAuth**: Discord/GitHub login (via backend)  
✅ **Offline Support**: AsyncStorage for caching  
✅ **Responsive Design**: Optimized for all screen sizes  

## Environment Variables

Create `mobile/.env` (Expo reads from app.json):

```json
{
  "expo": {
    "extra": {
      "API_URL": "https://your-api.railway.app/api"
    }
  }
}
```

## Troubleshooting

**Can't connect to backend?**
- Ensure backend is running on correct port
- Check firewall settings
- Verify API_URL matches your setup

**Build errors?**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Emulator issues?**
```bash
rm -rf $ANDROID_HOME/emulator/avds/*
npm run android -- --create-android
```

## Next Steps

- [ ] Push notifications
- [ ] Offline lesson caching
- [ ] Camera integration (photo submissions)
- [ ] Voice chat for language learning
- [ ] Apple Watch companion app
