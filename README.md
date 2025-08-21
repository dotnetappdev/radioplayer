# Radio Player 📻

A comprehensive radio player app built with React Native (Expo) that replicates the Radioplayer UK experience with full cross-platform support for iOS, Android, Web, and automotive platforms including CarPlay and Android Auto.

## ✨ Features

### 🎵 Core Radio Player Experience
- **6-tab navigation**: Home, UK Stations, World Stations, Genres, Search, and Manage
- **Modern UI design** with station cards, logos, and responsive layout
- **Player screen** with full controls and station metadata display
- **Now Playing bar** that appears persistently when audio is streaming
- **Dark/light theme support** with proper theming across all components
- **CarPlay & Android Auto support** with A-Z keyboard navigation

### 📡 Comprehensive Station Library (37 Total)
- **BBC Network Coverage (9 stations)**: Radio 1/2/3/4/5 Live/6 Music plus regional BBC Scotland/Wales/Ulster
- **UK Commercial Stations (12 stations)**: Capital FM, Heart FM, Cool FM (Northern Ireland), Kiss FM, Magic FM, Classic FM, Smooth Radio, Jazz FM, TalkSport, LBC, Absolute Radio, Planet Rock
- **International Broadcasters (10 stations)**: NPR, KCRW, WNYC (US), CBC Radio One/Music (Canada), RTÉ Radio 1/2fm (Ireland), France Inter, Radio 538 (Netherlands), Triple J (Australia)
- **Specialist & Genre Stations (6 stations)**: Soma FM collections, WWOZ New Orleans jazz, KEXP alternative, FIP France, Radio Paradise

### 🎯 Enhanced Genre System
- **12 music categories**: Pop, Rock, News, Classical, Jazz, Electronic, Country, Hip-Hop, R&B, Alternative, Folk, Dance
- **Genre-based filtering** for easy station discovery
- **Country-based categorization** separating UK and international content

### 💾 Data Management & Storage
- **SQLite database integration** using expo-sqlite for native platforms
- **Enhanced database schema** with `streamType` and `isUserAdded` fields
- **Automatic database migration** handles schema updates seamlessly
- **Cross-platform compatibility** with web fallback using comprehensive mock data

### 🔊 Audio Streaming & Playback
- **Multi-protocol support**: HTTP, HTTPS, HLS, DASH, and ICY stream formats
- **Real-time audio streaming** via expo-av for live radio playback
- **Full playback controls** with visual feedback and background audio support
- **Station metadata display** showing current playing status

### ⚙️ Advanced CRUD Station Management
- **"Manage" tab** - Dedicated interface for custom station management
- **Add Station screen** with comprehensive form including:
  - Station name and description with validation
  - Stream URL with protocol validation
  - Logo URL (optional)
  - Genre and country selection dropdowns
  - **Stream type selection** (HTTP, HTTPS, HLS, DASH, ICY)
- **Edit Station screen** for modifying user-added stations
- **Delete functionality** with confirmation dialogs and history cleanup
- **Data protection** - users cannot modify built-in stations

### 🔍 Search & Discovery
- **Real-time search** with debounced input across station names, genres, and descriptions
- **Genre filtering** for browsing by music category
- **Recently played tracking** with automatic history management
- **Favorites system** with persistent storage and heart icon toggles

### 🚗 Automotive Integration
- **CarPlay support** with optimized interface for in-car use
- **Android Auto compatibility** with voice commands and steering wheel controls
- **A-Z keyboard navigation** with numbers for easy station search while driving
- **Large touch targets** and simplified UI for automotive safety

## 🏗️ Technical Architecture

### Database Schema
```typescript
interface RadioStation {
  id: number;
  name: string;
  streamUrl: string;
  logoUrl?: string;
  genre: string;
  country: string;
  description?: string;
  isFavorite: boolean;
  lastPlayed?: Date;
  streamType: StreamType; // HTTP, HTTPS, HLS, DASH, ICY
  isUserAdded: boolean;   // Distinguishes user vs built-in stations
}

enum StreamType {
  HTTP = 'http',
  HTTPS = 'https',
  HLS = 'hls',
  DASH = 'dash',
  ICY = 'icy'
}
```

### CRUD Operations
```typescript
// Create custom station with stream type validation
await databaseService.createStation({
  name: 'My Custom Station',
  streamUrl: 'https://example.com/stream',
  genre: 'pop',
  country: 'UK',
  streamType: StreamType.HTTPS,
  isUserAdded: true
});

// Update existing user-added stations only
await databaseService.updateStation(id, { name: 'Updated Name' });

// Delete with automatic history cleanup
await databaseService.deleteStation(id);
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Expo CLI** (`npm install -g @expo/cli`)

### Platform-Specific Requirements

#### iOS Development
- **macOS** with Xcode 14 or higher
- **iOS Simulator** or physical iOS device
- **Apple Developer Account** (for device testing and App Store deployment)

#### Android Development
- **Android Studio** with Android SDK
- **Android Emulator** or physical Android device
- **Java Development Kit (JDK)** 11 or higher

#### Windows Development
- **Windows 10/11** with Visual Studio 2019 or higher
- **React Native Windows** development environment
- **.NET Framework** 4.7.2 or higher

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/dotnetappdev/radioplayer.git
   cd radioplayer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npx expo start
   ```

## 📱 Building for Different Platforms

### iOS Build

#### Development Build (Simulator)
```bash
# Start iOS simulator
npx expo start --ios

# Or run directly in simulator
npm run ios
```

#### Production Build
```bash
# Create iOS build
npx expo build:ios

# Or using EAS Build (recommended)
npx eas build --platform ios
```

#### CarPlay Setup
1. Enable CarPlay capability in Xcode project settings
2. Add CarPlay entitlement to your app
3. Configure Info.plist with audio background modes

### Android Build

#### Development Build (Emulator)
```bash
# Start Android emulator
npx expo start --android

# Or run directly in emulator
npm run android
```

#### Production Build
```bash
# Create Android APK
npx expo build:android

# Create Android App Bundle (recommended for Play Store)
npx expo build:android --type app-bundle

# Or using EAS Build
npx eas build --platform android
```

#### Android Auto Setup
1. Add Android Auto capability to AndroidManifest.xml
2. Configure automotive.xml descriptor
3. Test with Android Auto Desktop Head Unit

### Windows Build

#### Prerequisites
```bash
# Install React Native Windows CLI
npm install -g react-native-windows-init

# Initialize Windows project
npx react-native-windows-init --overwrite
```

#### Development Build
```bash
# Run on Windows
npx react-native run-windows
```

#### Production Build
```bash
# Build Windows package
npx react-native run-windows --release
```

### Web Build

#### Development
```bash
# Start web development server
npx expo start --web

# Or use dedicated web command
npm run web
```

#### Production Build
```bash
# Build for production
npx expo export:web

# The built files will be in the 'dist' directory
```

## 🧪 Testing

### Run Tests
```bash
# Run unit tests
npm test

# Run with coverage
npm test -- --coverage

# Run in watch mode
npm test -- --watch
```

### Linting
```bash
# Run ESLint
npm run lint

# Fix automatically fixable issues
npm run lint -- --fix
```

## 📦 Deployment

### iOS App Store
1. Build production iOS app: `npx eas build --platform ios`
2. Test with TestFlight
3. Submit to App Store via App Store Connect

### Google Play Store
1. Build production Android app: `npx eas build --platform android`
2. Test with internal testing
3. Submit to Google Play Console

### Microsoft Store (Windows)
1. Build Windows package: `npx react-native run-windows --release`
2. Create MSIX package
3. Submit to Microsoft Store

### Web Deployment
1. Build web app: `npx expo export:web`
2. Deploy `dist` folder to hosting service (Vercel, Netlify, etc.)

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:
```env
# Optional: Custom API endpoints
RADIO_API_URL=https://your-api.com
ANALYTICS_KEY=your-analytics-key
```

### App Configuration
Modify `app.json` for platform-specific settings:
```json
{
  "expo": {
    "name": "Radio Player",
    "slug": "radioplayer",
    "platforms": ["ios", "android", "web"],
    "ios": {
      "bundleIdentifier": "com.yourcompany.radioplayer",
      "supportsTablet": true,
      "infoPlist": {
        "UIBackgroundModes": ["audio"]
      }
    },
    "android": {
      "package": "com.yourcompany.radioplayer",
      "permissions": ["INTERNET", "ACCESS_NETWORK_STATE"]
    }
  }
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Issues**: Report bugs and request features via [GitHub Issues](https://github.com/dotnetappdev/radioplayer/issues)
- **Documentation**: Check [Expo Documentation](https://docs.expo.dev/) for framework-specific help
- **Community**: Join the [Expo Discord](https://chat.expo.dev) for community support

## 🙏 Acknowledgments

- **BBC** for radio stream inspiration
- **Expo team** for the amazing development framework
- **React Native community** for excellent libraries and tools
