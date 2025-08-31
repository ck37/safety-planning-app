# Contributing to Suicide Safety Planning App

We welcome contributions that improve the app's effectiveness in supporting mental health. This document outlines how to contribute to the project and important guidelines to follow.

## How to Contribute

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/improvement`)
3. Commit your changes (`git commit -am 'Add helpful feature'`)
4. Push to the branch (`git push origin feature/improvement`)
5. Create a Pull Request

## Guidelines for Contributors

### Sensitivity and Awareness
- **Remember the Mission**: This app serves people in crisis situations who may be experiencing suicidal thoughts or severe mental health distress
- **User-Centered Design**: Always consider how changes will affect someone in a vulnerable state
- **Crisis-First Approach**: Prioritize features and fixes that improve crisis response and safety
- **Respectful Language**: Use compassionate, non-judgmental language in all code, comments, and documentation

### Accessibility Requirements
- **Universal Design**: Ensure all features are accessible to users with disabilities
- **Screen Reader Compatibility**: Test with screen readers and assistive technologies
- **High Contrast Support**: Maintain readability in high contrast modes
- **Large Text Support**: Ensure UI scales properly with larger text sizes
- **Motor Accessibility**: Design for users with limited motor function
- **Cognitive Accessibility**: Keep interfaces simple and clear for users with cognitive disabilities

### Testing Standards
- **Thorough Testing**: Test all changes extensively, especially crisis-related functionality
- **Edge Case Testing**: Consider how features work in low-battery, poor connectivity, or high-stress situations
- **Cross-Platform Testing**: Verify functionality across iOS, Android, and web platforms
- **Accessibility Testing**: Use accessibility testing tools and manual testing with assistive technologies
- **Crisis Scenario Testing**: Test how features perform during simulated crisis situations

### Code Quality
- **TypeScript**: Use TypeScript for all new code with proper type definitions
- **Testing**: Write unit tests for new functionality
- **Documentation**: Update documentation for any new features or changes
- **Code Style**: Follow the existing code style and linting rules
- **Performance**: Optimize for quick loading times, especially during crisis situations

### Privacy and Security
- **Data Privacy**: Maintain the app's privacy-first approach - no external data transmission
- **Local Storage**: Keep all user data stored locally on the device
- **Security**: Follow security best practices for handling sensitive mental health information
- **Encryption**: Use appropriate encryption for stored data

### Feature Development
- **Evidence-Based**: Base new features on suicide prevention research and best practices
- **User Research**: Consider feedback from mental health professionals and individuals with lived experience
- **Incremental Changes**: Make changes gradually to avoid disrupting existing user workflows
- **Backward Compatibility**: Maintain compatibility with existing safety plans and user data

## Development Setup

### Prerequisites
- Node.js (v18 or later)
- Bun package manager
- Expo CLI
- Git

### Local Development
1. Clone your fork of the repository
2. Install dependencies: `bun install`
3. Start the development server: `bun run start`
4. Run tests: `bun run test`
5. Check code quality: `bun run lint`

### Testing Your Changes
- Run the full test suite: `bun run test`
- Test on multiple platforms (iOS, Android, Web)
- Test with accessibility tools
- Verify offline functionality
- Test crisis scenarios (emergency contacts, hotline access)

## Types of Contributions

### Bug Fixes
- Report bugs through GitHub issues
- Include steps to reproduce
- Specify platform and device information
- Consider the urgency - crisis-related bugs should be marked as high priority

### Feature Requests
- Check the [Feature Wishlist](FEATURE_WISHLIST.md) for planned features
- Open an issue to discuss new feature ideas before implementing
- Consider how the feature aligns with suicide prevention best practices
- Evaluate the feature's impact on users in crisis

### Documentation
- Improve existing documentation
- Add examples and use cases
- Update setup instructions
- Translate documentation (with cultural sensitivity)

### Accessibility Improvements
- Improve screen reader support
- Enhance keyboard navigation
- Add high contrast themes
- Improve text scaling support

## Code Review Process

### What We Look For
- **Safety Impact**: How does this change affect user safety?
- **Accessibility**: Is the change accessible to all users?
- **Privacy**: Does the change maintain user privacy?
- **Performance**: Does the change maintain fast load times?
- **Testing**: Are there adequate tests for the changes?
- **Documentation**: Is the change properly documented?

### Review Timeline
- We aim to review pull requests within 48 hours
- Crisis-related fixes are prioritized
- Complex features may require additional review time
- We may request changes or additional testing

## Community Guidelines

### Respectful Communication
- Use inclusive, respectful language
- Be patient with contributors of all skill levels
- Provide constructive feedback
- Remember that contributors may have personal experience with mental health challenges

### Confidentiality
- Do not share personal mental health information in public forums
- Respect the privacy of all community members
- Use appropriate channels for sensitive discussions

### Support
- If you're struggling with mental health issues while contributing, please prioritize your wellbeing
- Crisis resources are available in the app and README
- Consider taking breaks from development if needed

## Recognition

We value all contributions to this important project. Contributors will be:
- Listed in the project's contributor acknowledgments
- Recognized in release notes for significant contributions
- Invited to participate in project planning discussions

## Questions and Support

- **Technical Questions**: Open a GitHub issue or discussion
- **Feature Ideas**: Check the Feature Wishlist or open an issue
- **Security Concerns**: Email the maintainers directly
- **General Questions**: Use GitHub discussions

## Crisis Resources

If you or someone you know is in immediate danger:
- **Call 911** (US) or your local emergency number
- **Call or text 988** - Suicide & Crisis Lifeline (US)
- **Text "HELLO" to 741741** - Crisis Text Line

Remember: Contributing to this project is meaningful work that can help save lives. Thank you for your dedication to mental health and suicide prevention.
