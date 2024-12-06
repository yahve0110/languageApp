import { Exercise, LessonsData } from '@/app/types/exercise'
import Colors from '@/constants/Colors'
import React, { useState } from 'react'
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native'
import VideoLesson from '@/components/lessons/videoLesson/VideoLesson'

type Props = {
    setshowHub: React.Dispatch<React.SetStateAction<boolean>>
    setCurrentLessonType: React.Dispatch<React.SetStateAction<string>>
    data: LessonsData
    lessonId: string
}

const LessonHub = (props: Props) => {
    const { setshowHub, setCurrentLessonType } = props
    const [showVideo, setShowVideo] = useState(true)
    const { data, lessonId } = props
    const lessonData = data[lessonId]

    const switchToLesson = (type: string) => {
        setCurrentLessonType(type)
        setshowHub(false)
    }
    return (
        <View style={styles.container}>
            {showVideo && (
                <View style={styles.videoSection}>
                    <View style={styles.videoContainer}>
                        <VideoLesson href={lessonData.video.href} />
                    </View>
                    <TouchableOpacity onPress={() => setShowVideo(!showVideo)}>
                        <Text style={styles.videoText}>Hide video</Text>
                    </TouchableOpacity>
                </View>
            )}

            {!showVideo && (
                <TouchableOpacity onPress={() => setShowVideo(!showVideo)}>
                    <Text style={[styles.videoText, { marginTop: 20 }]}>
                        Show video
                    </Text>
                </TouchableOpacity>
            )}

            <ScrollView
                style={[
                    styles.exercisesContainer,
                    !showVideo && styles.exercisesFullHeight,
                ]}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <Text style={styles.lessonTitle}>{lessonData[1].title}</Text>
                <TouchableOpacity
                    onPress={() => setshowHub(false)}
                ></TouchableOpacity>
                {lessonData[1].exercises?.map((ex: Exercise) => {
                    return (
                        <TouchableOpacity
                            key={ex.type}
                            style={styles.exerciseButton}
                            onPress={() => switchToLesson(ex.type)}
                        >
                            <Text style={styles.exerciseText}>{ex.type}</Text>
                        </TouchableOpacity>
                    )
                })}
            </ScrollView>
        </View>
    )
}

export default LessonHub

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.light.background,
    },
    videoSection: {
        height: '45%',
        width: '100%',
    },
    videoContainer: {
        flex: 1,
        borderRadius: 10,
        backgroundColor: Colors.light.background,
    },
    videoText: {
        fontSize: 18,
        marginTop: 10,
        color: Colors.light.itemsColor,
        textAlign: 'center',
        marginBottom: 20,
        opacity: 0.8,
    },
    exercisesContainer: {
        flex: 1,
    },
    exercisesFullHeight: {
        height: '90%',
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 30,
    },
    exerciseButton: {
        backgroundColor: Colors.light.itemsColor,
        padding: 16,
        borderRadius: 8,
        marginBottom: 12,
    },
    exerciseText: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center',
    },
    lessonTitle: {
        fontSize: 24,
        color: Colors.light.color,
        textAlign: 'center',
        marginBottom: 20,
        alignContent: 'center',
    },
})
