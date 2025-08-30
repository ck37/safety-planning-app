# Suicide Safety Planning App

[![CI](https://github.com/ck37/suicide-safety-planning-app/actions/workflows/ci.yml/badge.svg)](https://github.com/ck37/suicide-safety-planning-app/actions/workflows/ci.yml)

A compassionate, evidence-based mobile application designed to help individuals create and maintain personalized safety plans for mental health crisis situations.

<img src="assets/images/app-screenshot.png" alt="App Screenshot" width="200" align="right" />

## 🌟 Overview

This app provides a digital implementation of the Stanley-Brown Safety Planning Intervention, a widely recognized suicide prevention tool used by mental health professionals. It empowers users to create personalized safety plans that can be accessed anytime, helping them navigate through difficult moments and connect with support resources.

## ✨ Features

### Core Safety Plan Components
- **Warning Signs Recognition** - Identify personal warning signs that indicate a crisis may be developing
- **Coping Strategies** - Document healthy coping mechanisms and self-soothing techniques
- **Support Contacts** - Maintain a list of trusted people who can provide help and support
- **Safe Places** - Identify environments that promote safety and well-being
- **Reasons for Living** - Remember personal motivations and values that provide hope

### Emergency Features
- **Crisis Hotline Integration** - One-tap access to the 988 Suicide & Crisis Lifeline
- **Immediate Access** - Quick access to safety plan during crisis situations
- **Offline Functionality** - Safety plan remains accessible without internet connection

### Technical Features
- **Cross-Platform** - Available on iOS, Android, and Web
- **Data Persistence** - Safety plans are securely stored locally on the device
- **Privacy-Focused** - All data remains on the user's device
- **Intuitive Interface** - Clean, accessible design optimized for crisis situations

## 🚀 Future Development

See our [Feature Wishlist](FEATURE_WISHLIST.md) for planned improvements and potential new features that could enhance the app's effectiveness in supporting mental health and suicide prevention.

## 🛠 Technical Stack

- **Framework**: React Native with Expo SDK 53
- **Language**: TypeScript
- **Navigation**: Expo Router
- **State Management**: Zustand
- **Data Storage**: AsyncStorage
- **Styling**: NativeWind (Tailwind CSS for React Native)
- **Icons**: Lucide React Native
- **Package Manager**: Bun

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- [Bun package manager](https://bun.sh/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)

**For Physical Device Testing:**
- [Expo Go app](https://expo.dev/client) on your iOS or Android device

**For Simulator/Emulator Development:**
- [Xcode](https://developer.apple.com/xcode/) (for iOS Simulator on macOS)
- [Android Studio](https://developer.android.com/studio) (for Android Emulator)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ck37/suicide-safety-planning-app.git
   cd suicide-safety-planning-app
   ```

2. **Install dependencies**
   ```bash
   bun install
   ```

3. **Start the development server**
   ```bash
   bun run start
   ```

4. **Run the app**
   
   After starting the development server, you have several options:

   **On Physical Device:**
   - Install [Expo Go](https://expo.dev/client) on your phone
   - Scan the QR code displayed in your terminal with:
     - **iOS**: Camera app or Expo Go app
     - **Android**: Expo Go app
   
   **On Simulator/Emulator:**
   - Press `i` in the terminal to open iOS Simulator
   - Press `a` in the terminal to open Android Emulator
   - Press `w` in the terminal to open in web browser

5. **Platform-specific commands**
   ```bash
   # Web development
   bun run start-web
   
   # Web with debug logs
   bun run start-web-dev
   ```

### Development Commands

- `bun run start` - Start the Expo development server
- `bun run start-web` - Start web development server
- `bun run start-web-dev` - Start web server with debug logging
- `bun run lint` - Run ESLint for code quality checks
- `bun run test` - Run the test suite
- `bun run test:watch` - Run tests in watch mode
- `bun run test:coverage` - Run tests with coverage report
- `bun run test:ci` - Run tests for CI (no watch, with coverage)
- `bun run type-check` - Run TypeScript type checking
- `bun run build-check` - Run full build verification (lint + test + type-check)

### Troubleshooting

**Common Issues:**

- **QR Code not scanning**: Ensure your phone and computer are on the same WiFi network
- **Metro bundler issues**: Try clearing the cache with `bun run start --clear`
- **iOS Simulator not opening**: Make sure Xcode is installed and iOS Simulator is available
- **Android Emulator issues**: Ensure Android Studio is properly configured with an AVD
- **Port conflicts**: The default port is 8081; if occupied, Expo will automatically use another port

## 📱 Usage

### Creating Your Safety Plan

1. **Launch the app** and navigate through the welcome screens
2. **Tap "Edit Plan"** to begin customizing your safety plan
3. **Fill out each section** with personalized information:
   - Add warning signs you've noticed before
   - List coping strategies that work for you
   - Include trusted contacts with phone numbers
   - Identify safe places you can go
   - Write down your reasons for living

### During a Crisis

1. **Open the app** to access your safety plan immediately
2. **Review your coping strategies** and try the techniques you've listed
3. **Contact support people** from your personalized list
4. **Use the Crisis Hotline button** for immediate professional support (988)
5. **Go to a safe place** from your identified locations

## 🏗 Project Structure

```
suicide-safety-planning-app/
├── app/                    # Expo Router pages
│   ├── (tabs)/            # Tab navigation structure
│   │   ├── (home)/        # Home tab (safety plan overview)
│   │   ├── crisis/        # Crisis resources tab
│   │   └── resources/     # Additional resources tab
│   ├── _layout.tsx        # Root layout
│   └── edit-plan.tsx      # Safety plan editing screen
├── providers/             # React context providers
│   └── SafetyPlanProvider.tsx  # Safety plan state management
├── types/                 # TypeScript type definitions
│   └── SafetyPlan.ts      # Safety plan data structures
├── assets/                # Images and static assets
└── app.json              # Expo configuration
```

## 🔒 Privacy & Security

- **Local Storage Only**: All safety plan data is stored locally on the user's device
- **No Data Collection**: The app does not collect, transmit, or store personal information on external servers
- **Offline Functionality**: Safety plans remain accessible without internet connection
- **Secure**: Uses device-level encryption for stored data

## 🤝 Contributing

We welcome contributions that improve the app's effectiveness in supporting mental health. Please see our [Contributing Guidelines](CONTRIBUTORS.md) for detailed information on how to contribute, including important guidelines for working on mental health applications.

## 📞 Crisis Resources

If you or someone you know is in immediate danger:

- **Call 911** (US) or your local emergency number
- **Call or text 988** - Suicide & Crisis Lifeline (US)
- **Text "HELLO" to 741741** - Crisis Text Line

### International Resources

- **Australia**: 13 11 14 (Lifeline Australia)
- **UK**: 116 123 (Samaritans)
- **Canada**: 1-833-456-4566 (Talk Suicide Canada)

## ⚠️ Important Disclaimer

This app is designed to supplement, not replace, professional mental health care. It should be used as part of a comprehensive safety plan developed with a mental health professional. If you are experiencing a mental health crisis, please seek immediate professional help.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

##  Acknowledgments

- Based on the Stanley-Brown Safety Planning Intervention
- Inspired by evidence-based suicide prevention research
- Built with gratitude for mental health advocates and survivors

---

**Remember: You matter. Your life has value. Help is available.**
