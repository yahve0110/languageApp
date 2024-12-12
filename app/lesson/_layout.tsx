import { Stack, useRouter, useLocalSearchParams } from 'expo-router'
import { StatusBar, View, StyleSheet, Text, TouchableOpacity } from 'react-native'
import Colors from '@/constants/Colors'
import React, { useState } from 'react'
import { FontAwesome } from '@expo/vector-icons'
import { LessonProvider, useLessonContext } from '@/context/LessonContext'

type RootStackParamList = {
    [id: string]: { id: string } | undefined
}

function LevelLayoutContent(): React.JSX.Element {
    const [lives, setLives] = useState(5)
    const router = useRouter()
    const { id } = useLocalSearchParams()
    const lessonNumber = 5
    const { showHub, setShowHub } = useLessonContext()

    const handleBack = () => {
        if (!showHub) {
            setShowHub(true)
        } else {
            const currentPath = router.canGoBack()
            if (currentPath) {
                router.back()
            } else {
                router.push(`/levels/${id}`)
            }
        }
    }

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
                    header: () => (
                        <View style={styles.headerContainer}>
                            <TouchableOpacity 
                                onPress={handleBack}
                                style={styles.backButton}
                            >
                                <FontAwesome
                                    name="angle-left"
                                    size={24}
                                    color={Colors.light.color}
                                />
                                <Text style={styles.backText}>Back</Text>
                            </TouchableOpacity>
                            <View style={styles.rightContainer}>
                                <Text style={styles.lessonNumber}>
                                    {lessonNumber}
                                </Text>
                                <FontAwesome
                                    name="heart"
                                    size={24}
                                    color={Colors.light.red}
                                    style={styles.heartIcon}
                                />
                            </View>
                        </View>
                    ),
                    presentation: 'modal',
                    animation: 'slide_from_bottom',
                }}
            >
                <Stack.Screen 
                    name="[id]"
                    options={{
                        presentation: 'card'
                    }}
                />
            </Stack>
        </>
    )
}

export default function LevelLayout(): React.JSX.Element {
    return (
        <LessonProvider>
            <LevelLayoutContent />
        </LessonProvider>
    )
}

const styles = StyleSheet.create({
    headerContainer: {
        backgroundColor: Colors.light.secondaryBackground,
        paddingTop: 16,
        paddingBottom: 8,
        paddingHorizontal: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    backButton: {
        padding: 8,
        flexDirection: 'row',
        alignItems: 'center',
    },
    backText: {
        color: Colors.light.color,
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 8,
    },
    rightContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    lessonNumber: {
        color: Colors.light.color,
        fontSize: 18,
        fontWeight: 'bold',
        marginRight: 8,
    },
    heartIcon: {
        marginLeft: 4,
    },
})
