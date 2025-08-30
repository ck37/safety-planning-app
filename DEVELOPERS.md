# Developer Documentation

This document contains technical information for developers working on the Suicide Safety Planning App.

## 🛠 Technical Stack

- **Framework**: React Native with Expo SDK 53
- **Language**: TypeScript
- **Navigation**: Expo Router
- **State Management**: Zustand
- **Data Storage**: AsyncStorage
- **Styling**: NativeWind (Tailwind CSS for React Native)
- **Icons**: Lucide React Native
- **Package Manager**: Bun
- **Testing**: Jest with React Native Testing Library
- **Linting**: ESLint with Expo configuration
- **Authentication**: Expo Local Authentication (biometric security)

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

## 📋 Development Commands

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

## 🏗 Project Structure

```
suicide-safety-planning-app/
├── app/                    # Expo Router pages
│   ├── (tabs)/            # Tab navigation structure
│   │   ├── (home)/        # Home tab (safety plan overview)
│   │   ├── crisis/        # Crisis resources tab
│   │   └── resources/     # Additional resources tab
│   ├── _layout.tsx        # Root layout
│   ├── edit-plan.tsx      # Safety plan editing screen
│   └── security-settings.tsx  # Security and privacy settings
├── components/            # Reusable React components
│   ├── BiometricAuth.tsx  # Biometric authentication component
│   ├── MoodTracker.tsx    # Mood tracking and crisis detection
│   ├── QuickCrisisButton.tsx  # Emergency crisis access button
│   └── VoiceReader.tsx    # Voice-activated safety plan reading
├── providers/             # React context providers
│   ├── SafetyPlanProvider.tsx     # Safety plan state management
│   └── MoodTrackingProvider.tsx   # Mood tracking state management
├── types/                 # TypeScript type definitions
│   ├── SafetyPlan.ts      # Safety plan data structures
│   └── MoodTracking.ts    # Mood tracking data structures
├── __tests__/             # Test files
│   ├── basic.test.ts      # Basic functionality tests
│   └── lint.test.ts       # Code quality linting tests
├── assets/                # Images and static assets
├── app.json              # Expo configuration
├── jest.config.js        # Jest testing configuration
├── eslint.config.js      # ESLint configuration
└── tsconfig.json         # TypeScript configuration
```

## 🔧 Troubleshooting

### Common Issues

**QR Code not scanning:**
- Ensure your phone and computer are on the same WiFi network
- Try using the tunnel connection: `bun run start --tunnel`

**Metro bundler issues:**
- Clear the cache: `bun run start --clear`
- Reset Metro cache: `npx expo start --clear`

**iOS Simulator not opening:**
- Make sure Xcode is installed and iOS Simulator is available
- Check that Xcode Command Line Tools are installed: `xcode-select --install`

**Android Emulator issues:**
- Ensure Android Studio is properly configured with an AVD
- Check that Android SDK and platform tools are installed
- Verify ANDROID_HOME environment variable is set

**Port conflicts:**
- The default port is 8081; if occupied, Expo will automatically use another port
- You can specify a custom port: `bun run start --port 8082`

**Dependency issues:**
- Clear node_modules and reinstall: `rm -rf node_modules && bun install`
- Clear Bun cache: `bun pm cache rm`

**TypeScript errors:**
- Run type checking: `bun run type-check`
- Restart TypeScript server in your IDE
- Check for missing type definitions

**Test failures:**
- Run tests with verbose output: `bun run test --verbose`
- Check for missing test dependencies
- Ensure test environment is properly configured

### Development Tips

**Hot Reloading:**
- Press `r` in the terminal to reload the app
- Press `Shift + r` to reload and clear cache
- Enable Fast Refresh in your development environment

**Debugging:**
- Use React Native Debugger for advanced debugging
- Enable remote debugging in the Expo development menu
- Use console.log statements for quick debugging (remove before production)

**Performance:**
- Use React DevTools Profiler to identify performance bottlenecks
- Monitor bundle size with `npx expo bundle-analyzer`
- Test on physical devices for accurate performance metrics

## 🧪 Testing

### Test Structure

The project uses Jest with React Native Testing Library for testing:

- **Unit Tests**: Test individual components and functions
- **Integration Tests**: Test component interactions and data flow
- **Linting Tests**: Ensure code quality and consistency
- **Build Verification**: Validate that the app builds successfully

### Running Tests

```bash
# Run all tests
bun run test

# Run tests in watch mode
bun run test:watch

# Run tests with coverage
bun run test:coverage

# Run specific test file
bun run test __tests__/basic.test.ts

# Run tests matching pattern
bun run test --testNamePattern="safety plan"
```

### Writing Tests

When adding new features, please include appropriate tests:

1. **Component Tests**: Test component rendering and user interactions
2. **Provider Tests**: Test state management and context providers
3. **Utility Tests**: Test helper functions and utilities
4. **Integration Tests**: Test feature workflows end-to-end

Example test structure:
```typescript
describe('ComponentName', () => {
  it('should render correctly', () => {
    // Test implementation
  });

  it('should handle user interaction', () => {
    // Test implementation
  });
});
```

## 🔒 Security Considerations

### Data Privacy
- All user data is stored locally using AsyncStorage
- No personal information is transmitted to external servers
- Biometric authentication data is handled by the device's secure enclave

### Code Security
- Regular dependency updates to address security vulnerabilities
- ESLint rules to prevent common security issues
- TypeScript for type safety and reduced runtime errors

### Testing Security Features
- Test biometric authentication flows
- Verify data encryption and storage
- Test security settings and privacy controls

## 🤝 Contributing

### Development Workflow

1. **Fork the repository** and create a feature branch
2. **Install dependencies** and set up the development environment
3. **Make your changes** following the coding standards
4. **Write tests** for new functionality
5. **Run the test suite** to ensure nothing is broken
6. **Submit a pull request** with a clear description

### Coding Standards

- **TypeScript**: Use strict type checking
- **ESLint**: Follow the configured linting rules
- **Formatting**: Use consistent code formatting
- **Comments**: Document complex logic and mental health considerations
- **Naming**: Use descriptive variable and function names

### Mental Health Considerations

When working on this mental health application:

- **Sensitivity**: Be mindful of language and user experience
- **Accessibility**: Ensure features work for users with disabilities
- **Crisis Situations**: Design with crisis scenarios in mind
- **Evidence-Based**: Follow established mental health best practices
- **Privacy**: Prioritize user privacy and data security

### Pull Request Guidelines

- **Clear Description**: Explain what the PR does and why
- **Test Coverage**: Include tests for new functionality
- **Documentation**: Update documentation as needed
- **Small Changes**: Keep PRs focused and manageable
- **Review Ready**: Ensure code is ready for review

### Code Review Process

- **Functionality**: Does the code work as intended?
- **Security**: Are there any security concerns?
- **Performance**: Is the code efficient?
- **Accessibility**: Is the feature accessible to all users?
- **Mental Health**: Is the implementation appropriate for mental health contexts?

## 📚 Additional Resources

### Expo Documentation
- [Expo Router](https://docs.expo.dev/router/introduction/)
- [Expo SDK](https://docs.expo.dev/versions/latest/)
- [Expo Local Authentication](https://docs.expo.dev/versions/latest/sdk/local-authentication/)

### React Native Resources
- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [React Native Testing Library](https://callstack.github.io/react-native-testing-library/)

### Mental Health Resources for Developers
- [Stanley-Brown Safety Planning Intervention](https://suicidesafetyplan.com/)
- [Suicide Prevention Best Practices](https://www.sprc.org/)
- [Mental Health First Aid](https://www.mentalhealthfirstaid.org/)

---

For questions about development, please open an issue on GitHub or refer to the main [README.md](README.md) for general project information.
