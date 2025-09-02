# Changelog

All notable changes to the Suicide Safety Planning App will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- **AI Chat Interface** - Interactive chat tab with contextual AI responses
  - Mobile-optimized chat UI with message bubbles and typing indicators
  - Context-aware AI responses for emotional keywords (sad, anxious, angry, help)
  - Persistent conversation history using AsyncStorage
  - 15+ fallback responses with rotation system
  - Error handling and graceful degradation
  - Safety disclaimer with crisis resource information
  - Clear chat functionality with confirmation dialog
  - Comprehensive test suite with 100% CI pass rate
  - Performance optimizations for faster test execution

### Technical Details
- **New Components**: Chat tab navigation, message interface, AI service integration
- **New Services**: `ChatAIService` for response generation, `ChatStorageService` for persistence
- **New Types**: Complete TypeScript interfaces for chat functionality
- **Testing**: 31 new tests covering AI responses, storage, UI components, and integration scenarios
- **Performance**: Optimized AI response delays for 50%+ faster test suite execution

### Files Added/Modified
- `types/Chat.ts` - TypeScript interfaces for chat system
- `services/ChatAIService.ts` - AI response generation service
- `services/ChatStorageService.ts` - AsyncStorage persistence service
- `app/(tabs)/chat/` - Chat tab implementation
- `app/(tabs)/_layout.tsx` - Navigation integration
- `__tests__/services/` - Business logic tests
- `__tests__/manual/` - UI component tests (manual execution)
- `jest.config.js` - Test configuration updates
- `docs/FEATURE_WISHLIST.md` - Documentation updates

### GitHub Integration
- Implements [GitHub Issue #8](https://github.com/ck37/suicide-safety-planning-app/issues/8)
- Commit: [ca703df](https://github.com/ck37/suicide-safety-planning-app/commit/ca703df)

---

## [1.0.0] - Initial Release

### Added
- Core safety planning functionality
- Crisis resources and emergency contacts
- Mood tracking capabilities
- Smart notifications system
- Biometric authentication
- Voice reader accessibility features
- Comprehensive test suite
- Mobile-responsive design
- Cross-platform compatibility (iOS, Android, Web)

### Technical Foundation
- React Native with Expo Router
- TypeScript for type safety
- AsyncStorage for data persistence
- Jest testing framework
- ESLint code quality
- GitHub Actions CI/CD
- Netlify deployment
