# EcoLink - E-Waste Management Platform

A modern React Native app for managing e-waste responsibly. EcoLink helps individuals and institutions track their e-waste contributions, connect with vendors, and participate in a gamified eco-friendly community.

## 🌱 Features

### Phase 1: E-Waste Collection System (Current)

**👥 User Types:**
- Individual users
- Institutional users (offices, schools, organizations)

**📸 Core Features:**
- Capture/upload images of e-waste items
- Fill item details (title, category, condition)
- Condition-based actions:
  - **Working items:** Sell or Donate
  - **Not working items:** Recycle
- Smart vendor matching for recycling

**🏪 Vendor Directory:**
- Searchable list of certified e-waste collectors
- Vendor details (contact, location, ratings, accepted categories)
- One-tap pickup request functionality

**🎮 Gamification:**
- Points system (10 pts for donation, 5 pts for recycling)
- Dynamic leaderboard with top eco-warriors
- Badge system (unlockable achievements)

**📱 Screens:**
- Home: Quick actions & stats
- Add E-Waste: Capture & detail form
- Vendor Directory: Searchable collector list
- Leaderboard: Global rankings
- Profile: Stats, badges, settings

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- Expo CLI (`npm install -g expo-cli`)
- Expo Go app on your phone

### Installation

```bash
# Navigate to the project
cd EcoLink

# Install dependencies
npm install

# Start the Expo development server
npm start

# Scan QR code with Expo Go on your phone
```

### Development

```bash
# iOS development
npm run ios

# Android development
npm run android

# Web (experimental)
npm run web
```

## 📁 Project Structure

```
EcoLink/
├── src/
│   ├── screens/          # All app screens
│   │   ├── HomeScreen.js
│   │   ├── AddWasteScreen.js
│   │   ├── VendorDirectoryScreen.js
│   │   ├── VendorDetailScreen.js
│   │   ├── LeaderboardScreen.js
│   │   ├── ProfileScreen.js
│   │   └── OnboardingScreen.js
│   ├── components/       # Reusable UI components
│   │   ├── Button.js
│   │   ├── Cards.js
│   │   ├── Layout.js
│   │   ├── Input.js
│   │   ├── Icon.js
│   │   └── index.js
│   ├── navigation/       # React Navigation setup
│   │   └── RootNavigator.js
│   ├── context/          # Global state (User data)
│   │   └── UserContext.js
│   ├── constants/        # App constants
│   │   ├── colors.js
│   │   ├── typography.js
│   │   ├── spacing.js
│   │   └── index.js
│   ├── mockData/         # Mock data for vendors, users, leaderboard
│   │   ├── vendors.js
│   │   └── users.js
│   └── utils/            # Utility functions (for future use)
├── App.js                # Root component
├── app.json              # Expo configuration
├── package.json          # Dependencies
└── README.md             # This file
```

## 🎨 Design System

**Colors:**
- Primary Green: `#10B981` (eco-friendly)
- Secondary: `#F59E0B` (accent)
- Success: `#10B981`, Danger: `#EF4444`
- Neutral grays for text and backgrounds

**Components:**
- Reusable Cards, Buttons, Inputs
- Consistent spacing & typography
- Clean, modern UI with shadows and rounded corners

## 🔧 Tech Stack

- **React Native** - Core framework
- **Expo** - Development & deployment platform
- **React Navigation** - Bottom tab + stack navigation
- **React Context API** - State management
- **Expo Camera & Image Picker** - Media handling
- **Material Community Icons** - Icon library
- **React Native Paper** - Optional UI components

## 📊 Data Flow

1. **User Context:** Manages current user data, points, badges
2. **Screens:** Render UI based on context
3. **Mock Data:** Vendors, leaderboard, user profiles
4. **Navigation:** Handles screen transitions and deep linking

## 🎯 Future Enhancements (Phase 2)

- Supabase backend integration
- User authentication (email/social)
- Real-time notifications
- Marketplace for second-hand electronics
- Advanced analytics
- Social sharing features
- Push notifications

## 📝 Key Features Implementation

### Condition-Based Logic
```javascript
// If Working → Show: Sell, Donate
// If Not Working → Show: Recycle (redirects to vendors)
```

### Points & Badges System
```javascript
// Donate → +10 points + First Device Donated badge
// Recycle → +5 points + First Device Recycled badge
// 5+ items → Eco Warrior Level 1
// 10+ items → Eco Warrior Level 2
```

### Vendor Search
- Real-time filtering by name or location
- Category matching
- Pickup availability status

## 🧪 Testing Features

The app comes with mock data pre-populated:
- 5 vendor listings
- 8+ users on leaderboard
- Sample user profile with badges
- Mock pickup requests

## 🛠 Troubleshooting

**Dependencies not installing?**
```bash
npm cache clean --force
rm -rf node_modules
npm install
```

**Expo connection issues?**
```bash
expo doctor --fix-dependencies
npm start -- --clear
```

**Permission errors?**
Check `app.json` for proper plugin configuration.

## 📄 License

MIT License - feel free to use and modify for your projects.

## 👥 Author

Created with ♻️ for the environment.

---

**Ready to make a difference?** Start the app and contribute to e-waste management! 🌍
