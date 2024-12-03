import { View, StyleSheet, Text, TouchableOpacity } from 'react-native'
import VideoLesson from '@/components/lessons/videoLesson/VideoLesson'
import Colors from '@/constants/Colors'
import { dataNew } from '@/data'
import { router } from 'expo-router'

import { useState, useEffect, useContext } from 'react'
import { useLocalSearchParams, useNavigation } from 'expo-router'

import { ProgressContext } from './_layout'
import React from 'react'

type LessonType =
    | 'cards'
    | 'multipleChoice'
    | 'matching'
    | 'buildSentence'
    | 'finish'

export default function LessonScreen() {
    const { id } = useLocalSearchParams<{ id: string }>()
    const { updateProgress } = useContext(ProgressContext)
    const [dataNr, setDataNr] = useState(1)
    const [showVideo, setShowVideo] = useState(true)
    const navigation = useNavigation()

    const data = dataNew

    const toggleVideo = () => {
        setShowVideo(!showVideo)
    }

    useEffect(() => {
        //@ts-ignore
        const lessonData = data[id] as any[]
        if (!lessonData) return

        const totalSteps = lessonData.length
        const currentProgress = Math.min(
            Math.round(((dataNr + 1) / totalSteps) * 100),
            100
        )

        updateProgress(currentProgress)
    }, [dataNr, id, updateProgress])

    return (
        <View style={styles.container}>
            {showVideo && <VideoLesson href={data[id].video.href} />}

            <TouchableOpacity
                onPress={toggleVideo}
                style={styles.toggleVideoButton}
            >
                <Text style={styles.toggleVideoText}>
                    {showVideo ? 'Hide Video' : 'Show Video'}
                </Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,

        backgroundColor: Colors.light.background,
    },
    toggleVideoButton: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 10,
        textAlign: 'center',
    },
    toggleVideoText: {
        fontSize: 16,
        color: Colors.light.itemsColor,
    },
    exerciseContainer: {
        backgroundColor: Colors.light.itemsColor,
        padding: 10,
        borderRadius: 10,
        marginBottom: 10,
    },
})
