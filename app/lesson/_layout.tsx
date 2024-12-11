import { Stack, useRouter } from 'expo-router'
import { StatusBar, View, StyleSheet, Text, TouchableOpacity } from 'react-native'
import Colors from '@/constants/Colors'
import React, { useState } from 'react'
import { FontAwesome } from '@expo/vector-icons'

type RootStackParamList = {
    [id: string]: { id: string } | undefined
}

export default function LevelLayout(): React.JSX.Element {
    const [lives, setLives] = useState(5)
    const router = useRouter()
    const lessonNumber = 5

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
                                onPress={() => router.back()}
                                style={styles.backButton}
                            >
                                <FontAwesome
                                    name="arrow-left"
                                    size={24}
                                    color={Colors.light.color}
                                />
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
                }}
            >
                <Stack.Screen name="[id]" />
            </Stack>
        </>
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
