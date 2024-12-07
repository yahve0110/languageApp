import ExerciseSupervisor from '@/components/lessons/exerciseSupervisor/ExerciseSupervisor'
import LessonHub from '@/components/lessons/lessonHub/LessonHub'
import Colors from '@/constants/Colors'
import { dataNew } from '@/data'
import { useLocalSearchParams } from 'expo-router'
import { useEffect, useState } from 'react'
import { BackHandler, StyleSheet, View } from 'react-native'
import { LessonStep } from '../types/exercise'

export default function LessonScreen() {
    const params = useLocalSearchParams()
    const [showHub, setshowHub] = useState(true)
    const [currentLessonType, setCurrentLessonType] = useState('')

    const id = params.id
    const lessonData = dataNew[id as keyof typeof dataNew]
    const currentStep = '1'
    const data = lessonData[
        currentStep as keyof typeof lessonData
    ] as LessonStep

    useEffect(() => {
        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            () => {
                if (!showHub) {
                    setshowHub(true)
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
                    setshowHub={setshowHub}
                    setCurrentLessonType={setCurrentLessonType}
                    lessonId={id as string}
                />
            ) : (
                <ExerciseSupervisor
                    data={data}
                    currentLessonType={currentLessonType}
                    setshowHub={setshowHub}
                    lessonId={id as string}
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
