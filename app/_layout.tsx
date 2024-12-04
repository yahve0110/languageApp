import React, { useEffect } from 'react'
import { StatusBar } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { useColorScheme } from '@/components/useColorScheme'
import {
    DarkTheme,
    DefaultTheme,
    NavigationContainer,
    ThemeProvider,
} from '@react-navigation/native'
import { Stack } from 'expo-router'
import { useFonts } from 'expo-font'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import * as SplashScreen from 'expo-splash-screen'
import Colors from '@/constants/Colors'

SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
    const [loaded, error] = useFonts({
        SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
        ...FontAwesome.font,
    })

    useEffect(() => {
        if (loaded) {
            SplashScreen.hideAsync()
        }
    }, [loaded])

    if (!loaded) {
        return null
    }

    return (
        <SafeAreaProvider>
            <GestureHandlerRootView
                style={{
                    flex: 1,
                    backgroundColor: Colors.light.secondaryBackground,
                }}
            >
                <RootLayoutNav />
            </GestureHandlerRootView>
        </SafeAreaProvider>
    )
}

function RootLayoutNav() {
    const colorScheme = useColorScheme() || 'light'

    return (
        <ThemeProvider
            value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
        >
            <StatusBar
                barStyle={
                    colorScheme === 'dark' ? 'light-content' : 'dark-content'
                }
                backgroundColor={Colors.light.secondaryBackground}
            />
            <Stack
                screenOptions={{
                    headerShown: false,
                    navigationBarColor: Colors.light.secondaryBackground,
                    animation: 'fade',
                }}
            >
                <Stack.Screen name="(tabs)" />
                <Stack.Screen
                    name="levels"
                    options={{
                        animation: 'slide_from_right',
                    }}
                />
                <Stack.Screen
                    name="lesson"
                    options={{
                        animation: 'slide_from_right',
                        gestureEnabled: true,
                    }}
                />
                <Stack.Screen
                    name="modal"
                    options={{
                        presentation: 'modal',
                    }}
                />
            </Stack>
        </ThemeProvider>
    )
}
