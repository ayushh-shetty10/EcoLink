import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../constants';

// Screens
import HomeScreen from '../screens/HomeScreen';
import AddWasteScreen from '../screens/AddWasteScreen';
import VendorDirectoryScreen from '../screens/VendorDirectoryScreen';
import VendorDetailScreen from '../screens/VendorDetailScreen';
import LeaderboardScreen from '../screens/LeaderboardScreen';
import ProfileScreen from '../screens/ProfileScreen';
import InstitutionDashboardScreen from '../screens/InstitutionDashboardScreen';
import PickupRequestsScreen from '../screens/PickupRequestsScreen';
import RequestDetailScreen from '../screens/RequestDetailScreen';
import InstitutionProfileScreen from '../screens/InstitutionProfileScreen';
import CreateInstitutionProfileScreen from '../screens/CreateInstitutionProfileScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const screenOptions = {
  headerShown: false,
};

const HomeStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: colors.white,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          fontWeight: '600',
        },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name="HomeMain"
        component={HomeScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="AddWaste"
        component={AddWasteScreen}
        options={{
          title: 'Add E-Waste',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="VendorDirectory"
        component={VendorDirectoryScreen}
        options={{
          title: 'Find Vendors',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="VendorDetail"
        component={VendorDetailScreen}
        options={{
          title: 'Vendor Details',
          headerShown: true,
        }}
      />
    </Stack.Navigator>
  );
};

const LeaderboardStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: colors.white,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          fontWeight: '600',
        },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name="LeaderboardMain"
        component={LeaderboardScreen}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

const ProfileStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: colors.white,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          fontWeight: '600',
        },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name="ProfileMain"
        component={ProfileScreen}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'HomeTab') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'LeaderboardTab') {
            iconName = focused ? 'trophy' : 'trophy-outline';
          } else if (route.name === 'ProfileTab') {
            iconName = focused ? 'account' : 'account-outline';
          }

          return (
            <MaterialCommunityIcons
              name={iconName}
              size={size}
              color={color}
            />
          );
        },
      })}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeStack}
        options={{
          title: 'Home',
          tabBarLabel: 'Home',
        }}
      />
      <Tab.Screen
        name="LeaderboardTab"
        component={LeaderboardStack}
        options={{
          title: 'Leaderboard',
          tabBarLabel: 'Leaderboard',
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileStack}
        options={{
          title: 'Profile',
          tabBarLabel: 'Profile',
        }}
      />
    </Tab.Navigator>
  );
};

const RootNavigator = () => {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen
        name="Main"
        component={BottomTabNavigator}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

const InstitutionNavigator = ({ needsProfileSetup = false }) => {
  return (
    <Stack.Navigator
      initialRouteName={needsProfileSetup ? 'CreateInstitutionProfile' : 'InstitutionDashboard'}
      screenOptions={{
        headerStyle: { backgroundColor: colors.white },
        headerTintColor: colors.text,
        headerTitleStyle: { fontWeight: '700' },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name="CreateInstitutionProfile"
        component={CreateInstitutionProfileScreen}
        options={{ title: 'Complete Profile', headerBackVisible: false }}
      />
      <Stack.Screen
        name="InstitutionDashboard"
        component={InstitutionDashboardScreen}
        options={{ title: 'Dashboard' }}
      />
      <Stack.Screen
        name="PickupRequests"
        component={PickupRequestsScreen}
        options={{ title: 'Pickup Requests' }}
      />
      <Stack.Screen
        name="RequestDetail"
        component={RequestDetailScreen}
        options={{ title: 'Request Detail' }}
      />
      <Stack.Screen
        name="InstitutionProfile"
        component={InstitutionProfileScreen}
        options={{ title: 'Institution Profile' }}
      />
    </Stack.Navigator>
  );
};

export { RootNavigator, BottomTabNavigator, InstitutionNavigator };
