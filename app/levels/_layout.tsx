import { Stack } from 'expo-router'
import { StatusBar, Text } from 'react-native'
import Colors from '@/constants/Colors'
import React from 'react'

type RootStackParamList = {
    [id: string]: { id: string } | undefined
}

export default function LevelLayout(): React.JSX.Element {
    return (
        <>
            <StatusBar
                backgroundColor={Colors.light.secondaryBackground}
                barStyle="light-content"
                translucent={false}
            />
            <Stack
                screenOptions={{
                    headerStyle: {
                        backgroundColor: Colors.light.secondaryBackground,
                    },
                    headerTintColor: Colors.light.color,
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                    animation: 'none',
                    statusBarTranslucent: false,
                }}
            >
                <Stack.Screen
                    name="[id]"
                    options={{
                        animation: 'fade',
                        headerTitle: 'level',
                        headerStyle: {
                            backgroundColor: Colors.light.background,
                        },
                        headerTitleStyle: {
                            color: Colors.light.color,
                            fontSize: 20,
                            fontWeight: 'bold',
                        },
                    }}
                />
            </Stack>
        </>
    )
}
