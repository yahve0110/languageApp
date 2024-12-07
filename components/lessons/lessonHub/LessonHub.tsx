import { Exercise, LessonsData } from '@/app/types/exercise'
import Colors from '@/constants/Colors'
import { FontAwesome } from '@expo/vector-icons'
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
    completedExercises: string[]
}

const LessonHub = (props: Props) => {
    const { setshowHub, setCurrentLessonType, completedExercises } = props
    const [showVideo, setShowVideo] = useState(true)
    const { data, lessonId } = props
    const lessonData = data[lessonId]

    const isExerciseLocked = (currentIndex: number, exercises: Exercise[]) => {
        if (currentIndex === 0) return false
        const previousExercise = exercises[currentIndex - 1]
        return !completedExercises.includes(previousExercise.type)
    }

    const switchToLesson = (type: string, isLocked: boolean) => {
        if (isLocked) return
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
                {lessonData[1].exercises?.map((ex: Exercise, index: number) => {
                    const isLocked = isExerciseLocked(index, lessonData[1].exercises)
                    const isCompleted = completedExercises.includes(ex.type)
                    return (
                        <TouchableOpacity
                            key={ex.type}
                            style={[
                                styles.exerciseButton,
                                isLocked && styles.exerciseButtonLocked
                            ]}
                            onPress={() => switchToLesson(ex.type, isLocked)}
                        >
                            <View style={styles.leftContent}>
                                <View style={[
                                    styles.statusIcon,
                                    isCompleted && styles.completedIcon,
                                    isLocked && styles.lockedIcon
                                ]}>
                                    <FontAwesome 
                                        name={isLocked ? "lock" : (isCompleted ? "check" : "circle")}
                                        size={isLocked ? 14 : 12} 
                                        color={isCompleted ? Colors.light.background : Colors.light.text}
                                    />
                                </View>
                                <Text style={[
                                    styles.exerciseText,
                                    isLocked && styles.exerciseTextLocked
                                ]} numberOfLines={2}>{ex.type}</Text>
                            </View>
                            <View style={styles.arrowContainer}>
                                <FontAwesome 
                                    name="chevron-right" 
                                    size={16} 
                                    color={isLocked ? Colors.light.text + '40' : Colors.light.text}
                                />
                            </View>
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
        paddingHorizontal: 20,
    },
    exercisesFullHeight: {
        height: '100%',
    },
    lessonTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.light.text,
        marginBottom: 20,
    },
    scrollContent: {
        paddingBottom: 30,
    },
    exerciseButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: Colors.light.itemsColor,
        padding: 15,
        paddingHorizontal: 25,
        borderRadius: 10,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        minHeight: 60,
    },
    exerciseButtonLocked: {
        backgroundColor: Colors.light.itemsColor + '40',
        shadowOpacity: 0.1,
        elevation: 2,
    },
    leftContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        flex: 1,
        marginRight: 10,
    },
    arrowContainer: {
        paddingLeft: 10,
    },
    statusIcon: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: Colors.light.text,
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
    },
    completedIcon: {
        backgroundColor: Colors.light.green,
        borderColor: Colors.light.green,
    },
    lockedIcon: {
        backgroundColor: 'transparent',
        borderColor: Colors.light.text + '40',
    },
    exerciseText: {
        color: Colors.light.text,
        fontSize: 16,
        fontWeight: '500',
        flex: 1,
    },
    exerciseTextLocked: {
        color: Colors.light.text + '40',
    },
})
