# User Interface Documentation - Suicide Safety Planning App

This document provides a comprehensive overview of the app's user interface design, navigation structure, and key components.

## 🎨 Design Philosophy

The app follows a **crisis-optimized design** approach with these core principles:

- **Accessibility First**: Large buttons, clear navigation, high contrast colors
- **Crisis-Ready**: Quick access to essential features during distressing moments
- **Compassionate Design**: Warm, supportive visual language with encouraging messaging
- **Privacy-Focused**: Clean, non-clinical appearance to reduce stigma
- **Cross-Platform Consistency**: Unified experience across iOS, Android, and Web

## 🏗️ App Architecture

### Navigation Structure
```
Root Layout
├── Tab Navigation (Bottom Tabs)
│   ├── My Plan (Home) - Heart icon
│   ├── Crisis Help - Phone icon
│   └── Resources - BookOpen icon
├── Edit Plan (Modal/Screen)
├── Security Settings
└── Notification Settings
```

### Screen Hierarchy
- **Main App**: Tab-based navigation with 3 primary sections
- **Modal Screens**: Edit Plan, Crisis Support, Mood Check-in
- **Settings Screens**: Security, Notifications (accessible from home)

## 📱 Core Screens

### 1. Home Screen (My Plan)
**Purpose**: Central hub displaying the user's safety plan and providing quick access to all features.

#### Visual Design
- **Header**: Purple gradient background (#6B46C1 to #9333EA)
  - Title: "You Matter" (28pt, bold, white)
  - Subtitle: "Your safety plan is here when you need it" (16pt, light purple)
  - Emergency button: "Crisis Hotline: 988" with phone icon

#### Key Components
- **Action Buttons Row**: Floating above content
  - Edit Plan button (white background, purple text)
  - Security button (white background, purple text)
  - Voice Reader component (large size)

- **Crisis Button**: Large red button (#DC2626) with alert triangle icon
  - Text: "Crisis Support"
  - Prominent shadow for visibility
  - Shows alert badge when mood alerts are active

- **Mood Tracker**: Interactive mood check-in component
  - Shows today's mood if logged (colored circle with number)
  - "Check In" button if no mood logged today
  - Trend indicators (improving/declining/stable)
  - Pattern insights display

- **Safety Plan Sections**: 5 main sections displayed as cards
  1. **Warning Signs** (Red, AlertCircle icon)
  2. **Coping Strategies** (Green, Shield icon)
  3. **Support Contacts** (Blue, Users icon)
  4. **Safe Places** (Orange, MapPin icon)
  5. **Reasons for Living** (Pink, Heart icon)

#### Section Card Design
- White background with subtle shadow
- Colored icon container (36x36px, rounded)
- Section title (18pt, semibold)
- Items list with sparkle icons
- Empty state text when no items
- Edit indicator (pencil icon)
- Tappable to navigate to edit mode

#### Footer
- Encouraging message: "Remember: This too shall pass"
- Subtitle: "You've survived 100% of your worst days"
- Purple accent color (#6B46C1)

### 2. Edit Plan Screen
**Purpose**: Comprehensive form for creating and editing safety plan content.

#### Visual Design
- Light gray background (#F9FAFB)
- Scrollable content with sections
- Web-optimized with max-width container (800px)

#### Header
- Instructional text explaining safety plan purpose
- Contextual guidance for each section

#### Section Components
Each section includes:
- **Icon Container**: Colored background matching section theme
- **Title & Subtitle**: Clear labeling with explanatory text
- **Items List**: Existing entries with remove buttons (X icon)
- **Input Field**: Text input with placeholder guidance
- **Add Button**: Colored button matching section theme

#### Special Features
- **Contact Section**: Separate fields for name and phone number
- **Auto-scroll**: Jumps to specific section when linked from home
- **Highlighting**: Sections glow with purple border when focused
- **Save Button**: Large purple button at bottom with save icon

#### Input Design
- Clean white backgrounds
- Gray borders (#E5E7EB)
- Rounded corners (8px)
- Proper keyboard handling
- Multi-line support for longer entries

### 3. Crisis Support Modal
**Purpose**: Immediate access to crisis resources and safety plan components.

#### Modal Design
- Full-screen modal with slide animation
- White header with close button
- Scrollable content area

#### Content Sections
1. **Active Alerts** (if present)
   - Color-coded alert cards (yellow/orange/red)
   - Alert level and trigger information

2. **Emergency Hotline**
   - Large red button (#DC2626)
   - Phone icon and "Call Crisis Hotline" text
   - "988 - Available 24/7" subtitle

3. **Quick Coping Strategies**
   - Top 3 strategies from safety plan
   - Green left border accent
   - Clean card design

4. **Support Contacts**
   - Top 3 contacts with phone icons
   - Tappable to initiate calls
   - Name and phone number display

5. **Reasons for Living**
   - Top 3 reasons in italic text
   - Pink left border accent
   - Inspirational presentation

#### Footer Message
- "You matter. This crisis will pass."
- Purple accent color
- Centered, encouraging typography

### 4. Mood Tracker Component
**Purpose**: Daily mood logging with comprehensive tracking features.

#### Main Display
- **Today's Mood**: Colored circle (1-10 scale) with mood number
- **Trend Indicator**: Arrow icons showing mood direction
- **Update Button**: Purple button to modify today's entry
- **Check-In Button**: Purple button with plus icon for new entries

#### Mood Check-In Modal
Comprehensive form including:

1. **Mood Scale**: 10 colored circles (1-10)
   - Color coding: Red (1-3), Yellow (4-5), Green (6-10)
   - Selected state with dark border
   - Clear numerical labels

2. **Warning Signs**: Chip-based selection
   - Gray chips that turn purple when selected
   - Based on user's safety plan warning signs
   - Multi-select capability

3. **Coping Strategies**: Similar chip interface
   - Track which strategies were used
   - Visual feedback for selections

4. **Notes Section**: Multi-line text input
   - Optional additional context
   - Placeholder guidance text

5. **Photo Upload**: Optional mood documentation
   - Camera/library selection on mobile
   - File picker on web
   - Image preview with remove option
   - Size and type validation

#### Insights Display
- Pattern recognition results
- Trend analysis
- Actionable recommendations
- Risk level indicators

## 🎨 Visual Design System

### Color Palette
- **Primary Purple**: #6B46C1 (buttons, accents, branding)
- **Crisis Red**: #DC2626 (emergency buttons, alerts)
- **Success Green**: #10B981 (positive indicators, coping strategies)
- **Warning Orange**: #F59E0B (moderate alerts, safe places)
- **Info Blue**: #3B82F6 (support contacts, informational elements)
- **Accent Pink**: #EC4899 (reasons for living, emotional content)

### Typography
- **Headers**: 28pt bold for main titles, 20pt for modal titles
- **Section Titles**: 18pt semibold for content sections
- **Body Text**: 14-16pt for readable content
- **Buttons**: 16pt semibold for primary actions, 14pt for secondary
- **Captions**: 12-13pt for subtitles and helper text

### Spacing & Layout
- **Container Max Width**: 800px for web optimization
- **Padding**: 20px horizontal, 16px for cards
- **Margins**: 16px between major sections, 8px between items
- **Border Radius**: 12-16px for cards, 8px for inputs, 20-25px for buttons
- **Shadows**: Subtle elevation with 0.05-0.1 opacity

### Iconography
- **Lucide React Native**: Consistent icon library
- **Sizes**: 24px for tabs, 20px for sections, 16-18px for actions
- **Colors**: Match section themes or neutral gray (#6B7280)
- **Usage**: Functional icons that enhance understanding

## 🔧 Interactive Components

### Quick Crisis Button
- **Large Version**: 16px vertical padding, prominent shadow
- **Small Version**: 8px vertical padding, compact design
- **States**: Normal, active (darker red), with alert badge
- **Behavior**: Opens crisis support modal with safety plan content

### Voice Reader
- **Sizes**: Small and large variants
- **Functionality**: Text-to-speech for safety plan content
- **Integration**: Available on home screen and throughout app
- **Accessibility**: Essential for users with reading difficulties

### Biometric Authentication
- **Integration**: Security settings and app launch
- **Fallback**: PIN/password options
- **Platforms**: Face ID/Touch ID on iOS, Fingerprint on Android
- **Privacy**: Local authentication only

### Mood Tracker
- **Daily Logging**: One entry per day with update capability
- **Visual Feedback**: Color-coded mood circles and trend arrows
- **Data Collection**: Mood, notes, warning signs, coping strategies, photos
- **Analytics**: Pattern recognition and insights generation

## 📐 Responsive Design

### Mobile (iOS/Android)
- **Full Width**: Components use full screen width
- **Touch Targets**: Minimum 44px for accessibility
- **Scrolling**: Vertical scroll with proper keyboard handling
- **Navigation**: Bottom tab bar for primary navigation

### Web
- **Centered Layout**: 800px max width container
- **Responsive**: Adapts to different screen sizes
- **Keyboard Navigation**: Full keyboard accessibility
- **Mouse Interactions**: Hover states and click feedback

### Cross-Platform Considerations
- **Platform-Specific**: Native UI elements where appropriate
- **Consistent Core**: Same functionality across all platforms
- **Performance**: Optimized for each platform's capabilities
- **Accessibility**: Screen reader support and keyboard navigation

## ♿ Accessibility Features

### Visual Accessibility
- **High Contrast**: Strong color contrasts for readability
- **Large Text**: Scalable typography that respects system settings
- **Color Independence**: Information not conveyed by color alone
- **Focus Indicators**: Clear visual focus states for navigation

### Motor Accessibility
- **Large Touch Targets**: Minimum 44px for easy interaction
- **Gesture Alternatives**: Multiple ways to access features
- **Voice Control**: Voice reader for hands-free operation
- **Keyboard Navigation**: Full keyboard support on web

### Cognitive Accessibility
- **Simple Language**: Clear, non-clinical terminology
- **Consistent Layout**: Predictable interface patterns
- **Progress Indicators**: Clear feedback for user actions
- **Error Prevention**: Validation and confirmation dialogs

### Screen Reader Support
- **Semantic HTML**: Proper heading structure and landmarks
- **Alt Text**: Descriptive text for images and icons
- **ARIA Labels**: Enhanced accessibility information
- **Focus Management**: Logical tab order and focus handling

## 🎯 Crisis-Optimized Design

### Emergency Access
- **Crisis Button**: Always visible, large, and prominent
- **Quick Actions**: One-tap access to emergency resources
- **Offline Support**: Core features work without internet
- **Simple Navigation**: Minimal cognitive load during crisis

### Visual Hierarchy
- **Emergency First**: Crisis resources prominently displayed
- **Safety Plan**: Easy access to personalized coping strategies
- **Support Network**: Quick contact with trusted individuals
- **Encouragement**: Positive messaging throughout interface

### Performance Optimization
- **Fast Loading**: Minimal startup time for crisis situations
- **Smooth Scrolling**: Responsive interface even under stress
- **Battery Efficient**: Optimized for extended use
- **Memory Management**: Stable performance on older devices

## 🔄 User Flow Examples

### First-Time User
1. App launch → Home screen with empty safety plan
2. Tap "Edit Plan" → Guided form with section explanations
3. Fill out sections → Save confirmation
4. Return to home → Populated safety plan display
5. Mood check-in prompt → Complete first mood entry

### Crisis Situation
1. Open app → Immediate home screen access
2. Large crisis button → Crisis support modal
3. Emergency hotline → Direct 988 call
4. Or browse coping strategies → Quick reference
5. Contact support person → Direct phone call

### Daily Use
1. Open app → Check mood tracker
2. Tap "Check In" → Mood logging modal
3. Select mood and notes → Save entry
4. View insights → Pattern recognition
5. Update safety plan → Edit specific sections

This UI documentation serves as a comprehensive guide for understanding the app's interface design, ensuring consistency in future development and providing context for user experience decisions.
