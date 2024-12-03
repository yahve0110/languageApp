import { Stack, useLocalSearchParams } from 'expo-router'
import { StatusBar, Text, View, StyleSheet } from 'react-native'
import Colors from '@/constants/Colors'
import React, { useState, useCallback } from 'react'

type RootStackParamList = {
    [id: string]: { id: string } | undefined
}

export const ProgressContext = React.createContext<{
    updateProgress: (value: number) => void
}>({ updateProgress: () => {} })

export default function LevelLayout(): React.JSX.Element {
    const { progress } = useLocalSearchParams<{ progress: string }>()

    const initialProgress =
        progress && !isNaN(Number(progress)) ? Number(progress) : 0
    const [currentProgress, setCurrentProgress] =
        useState<number>(initialProgress)

    const updateProgress = useCallback((value: number) => {
        if (!isNaN(value) && value >= 0 && value <= 100) {
            setCurrentProgress(value)
        }
    }, [])

    return (
        <ProgressContext.Provider value={{ updateProgress }}>
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
                    header: () => (
                        <View style={styles.headerContainer}>
                            <View style={styles.progressBarContainer}>
                                <View
                                    style={[
                                        styles.progressBar,
                                        {
                                            width: `${currentProgress}%`,
                                        },
                                    ]}
                                />
                            </View>
                            <Text
                                style={styles.progressText}
                            >{`${currentProgress}% completed`}</Text>
                        </View>
                    ),
                    statusBarTranslucent: false,
                }}
            >
                <Stack.Screen name="[id]" />
            </Stack>
        </ProgressContext.Provider>
    )
}

const styles = StyleSheet.create({
    headerContainer: {
        backgroundColor: Colors.light.secondaryBackground,
        paddingTop: 16,
        paddingBottom: 8,
        paddingHorizontal: 16,
    },
    progressBarContainer: {
        height: 10,
        backgroundColor: '#E0E0E0',
        width: '100%',
        borderRadius: 2,
        overflow: 'hidden',
    },
    progressBar: {
        height: 10,
        backgroundColor: Colors.light.itemsColor,
        borderRadius: 2,
    },
    progressText: {
        marginTop: 8,
        color: Colors.light.color,
        fontSize: 14,
        textAlign: 'center',
    },
})
