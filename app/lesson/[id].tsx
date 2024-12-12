import ExerciseSupervisor from '@/components/lessons/exerciseSupervisor/ExerciseSupervisor'
import LessonHub from '@/components/lessons/lessonHub/LessonHub'
import Colors from '@/constants/Colors'
import { dataNew } from '@/data'
import { useLocalSearchParams } from 'expo-router'
import { useEffect, useState } from 'react'
import { BackHandler, StyleSheet, View } from 'react-native'
import { LessonStep } from '../types/exercise'
import { useLessonContext } from '@/context/LessonContext'

export default function LessonScreen() {
    const params = useLocalSearchParams()
    const { showHub, setShowHub } = useLessonContext()
    const [currentLessonType, setCurrentLessonType] = useState('')
    const [completedExercises, setCompletedExercises] = useState<string[]>([])

    const id = params.id
    const lessonData = dataNew[id as keyof typeof dataNew]
    const currentStep = '1'
    const data = lessonData[
        currentStep as keyof typeof lessonData
    ] as LessonStep

    const handleExerciseComplete = (type: string) => {
        setCompletedExercises(prev => {
            if (!prev.includes(type)) {
                return [...prev, type]
            }
            return prev
        })
        setShowHub(true)
        setCurrentLessonType('')
    }

    useEffect(() => {
        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            () => {
                if (!showHub) {
                    setShowHub(true)
                    setCurrentLessonType('')
                    return true // Prevent default back button behavior
                }
                return false
            }
        )

        return () => backHandler.remove()
    }, [showHub])

    return (
        <View style={styles.container}>
            {showHub ? (
                <LessonHub
                    data={dataNew}
                    setShowHub={setShowHub}
                    setCurrentLessonType={setCurrentLessonType}
                    lessonId={id as string}
                    completedExercises={completedExercises}
                />
            ) : (
                <ExerciseSupervisor
                    data={data}
                    currentLessonType={currentLessonType}
                    setShowHub={setShowHub}
                    lessonId={id as string}
                    onComplete={() => handleExerciseComplete(currentLessonType)}
                />
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.light.background,
    },
})
