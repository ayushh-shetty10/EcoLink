import React, { useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import { UserContextProvider } from './src/context/UserContext';
import { InstitutionNavigator, RootNavigator } from './src/navigation/RootNavigator';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WelcomeScreen from './src/screens/WelcomeScreen';
import RoleSelectionScreen from './src/screens/RoleSelectionScreen';
import AuthScreen from './src/screens/AuthScreen';
import LoginScreen from './src/screens/LoginScreen';
import SignupScreen from './src/screens/SignupScreen';

SplashScreen.preventAutoHideAsync();

const Stack = createNativeStackNavigator();

const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Welcome" component={WelcomeScreen} />
    <Stack.Screen name="RoleSelection" component={RoleSelectionScreen} />
    <Stack.Screen name="Auth" component={AuthScreen} />
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Signup" component={SignupScreen} />
  </Stack.Navigator>
);

function AppInner() {
  const { user, role, loading, needsInstitutionProfile, needsUserProfile } = useAuth();

  if (loading) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <UserContextProvider>
        <SafeAreaProvider>
          <NavigationContainer>
            {user ? role === 'institution' ? <InstitutionNavigator needsProfileSetup={needsInstitutionProfile} /> : <RootNavigator needsProfileSetup={needsUserProfile} /> : <AuthStack />
            }
          </NavigationContainer>
        </SafeAreaProvider>
      </UserContextProvider>
    </GestureHandlerRootView>
  );
}

export default function App() {
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        await new Promise((resolve) => setTimeout(resolve, 400));
      } catch (e) {
        console.warn(e);
      } finally {
        setAppReady(true);
        SplashScreen.hideAsync();
      }
    }

    prepare();
  }, []);

  if (!appReady) return null;

  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  );
}
