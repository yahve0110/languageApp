import { LessonsData } from '@/app/types/exercise'
import { Text } from 'react-native'
import React from 'react'
import { TouchableOpacity, View } from 'react-native'

type Props = {
    setshowHub: React.Dispatch<React.SetStateAction<boolean>>
    data: LessonsData
    currentLessonType: string
    lessonId: string
}

const ExerciseSupervisor = (props: Props) => {
    const { currentLessonType, lessonId } = props
    return (
        <View>
            <TouchableOpacity onPress={() => props.setshowHub(true)}>
                <Text>Back to hub</Text>
            </TouchableOpacity>
            <Text>{currentLessonType}</Text>
            <Text>{lessonId}</Text>
        </View>
    )
}

export default ExerciseSupervisor
