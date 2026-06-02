<!-- Use this file to provide workspace-specific custom instructions to Copilot. -->

## EcoLink Development Guide

### Project Overview
EcoLink is a React Native (Expo) application for managing e-waste responsibly. Phase 1 focuses on the e-waste collection system frontend.

### Architecture
- **State Management:** React Context API
- **Navigation:** React Navigation (Bottom Tabs + Stack)
- **Styling:** React Native StyleSheet (no external CSS framework)
- **Language:** JavaScript (no TypeScript)

### Key Principles
1. **Component-Driven:** Reusable components in `/components`
2. **Feature-Based Screens:** Each screen in `/screens` handles a specific feature
3. **Centralized Data:** User data managed via `UserContext`
4. **Mock Data:** All data in `/mockData` for easy backend integration later

### Adding New Features

**New Screen:**
1. Create in `src/screens/YourScreen.js`
2. Add to navigation in `src/navigation/RootNavigator.js`
3. Import & use Context API if needed

**New Component:**
1. Create in `src/components/YourComponent.js`
2. Export from `src/components/index.js`
3. Use consistent styling patterns

**New Constants:**
1. Add to appropriate file in `src/constants/`
2. Export from `src/constants/index.js`

### Common Tasks

**Access User Data:**
```javascript
import { useUser } from '../context/UserContext';
const { currentUser, addWasteItem, updateUserPoints } = useUser();
```

**Add Points & Badges:**
```javascript
updateUserPoints(10); // Add points
addBadge('first-donation'); // Unlock badge
```

**Navigate Between Screens:**
```javascript
navigation.navigate('VendorDirectory');
navigation.goBack();
```

### File Naming Convention
- Screens: PascalCase (HomeScreen.js)
- Components: PascalCase (Button.js)
- Utilities: camelCase (helpers.js)
- Constants: camelCase (colors.js)

### Color System
Import from `src/constants/colors.js`:
- `colors.primary` - Main green (#10B981)
- `colors.secondary` - Orange accent
- `colors.danger` - Red for errors
- `colors.text` - Main text color
- Use semantic names, avoid hardcoding

### Spacing System
Import from `src/constants/spacing.js`:
- `spacing.xs` (4px) to `spacing.4xl` (40px)
- Always use spacing constants for consistency

### Testing Mock Data
- Vendors: `mockVendors` in `/mockData/vendors.js`
- Leaderboard: `mockLeaderboard` in `/mockData/vendors.js`
- Users: `mockUserProfiles` in `/mockData/users.js`

### Performance Tips
1. Use FlatList for long lists (not ScrollView)
2. Memoize expensive computations with `useMemo`
3. Use `useCallback` for navigation handlers
4. Avoid creating new objects in render

### Next Steps (Future Phases)
- Connect Supabase backend
- Implement real authentication
- Add push notifications
- Build marketplace feature
- Deploy to App Store/Google Play

