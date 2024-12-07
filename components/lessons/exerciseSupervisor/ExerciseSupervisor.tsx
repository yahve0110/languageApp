import {
    LessonStep,
    Card,
    MultipleChoiceQuestion,
    MatchingQuestion,
} from '@/app/types/exercise'
import React from 'react'
import { View } from 'react-native'
import CardsLesson from '@/components/lessons/cardsLesson/cardsLesson'
import MultipleChoise from '@/components/lessons/multipleChoise/MultipleChoise'
import Matching from '@/components/lessons/matching/Matching'

type Props = {
    setshowHub: React.Dispatch<React.SetStateAction<boolean>>
    data: LessonStep
    currentLessonType: string
    lessonId: string
}

const ExerciseSupervisor = (props: Props) => {
    const { currentLessonType, lessonId, data } = props
    const exerciseData =
        data.exercises.find((item: any) => item.type === currentLessonType)
            ?.data || []

    const onComplete = () => {
        props.setshowHub(true)
    }

    const exerciseMap = new Map([
        [
            'Learn words with cards',
            <CardsLesson
                onComplete={onComplete}
                data={exerciseData as Card[]}
            />,
        ],
        [
            'Choose the correct translation in your language',
            <MultipleChoise
                data={exerciseData as MultipleChoiceQuestion[]}
                onComplete={onComplete}
            />,
        ],
        [
            'Choose the correct translation in language you study',
            <MultipleChoise
                data={exerciseData as MultipleChoiceQuestion[]}
                onComplete={onComplete}
            />,
        ],
        [
            'Matching',
            <Matching
                data={exerciseData as MatchingQuestion[]}
                onComplete={onComplete}
            />,
        ],
    ])

    return (
        <View style={{ flex: 1, padding: 20 }}>
            {exerciseMap.get(currentLessonType)}
        </View>
    )
}

export default ExerciseSupervisor
