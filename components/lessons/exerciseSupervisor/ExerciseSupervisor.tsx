import {
    LessonStep,
    Card,
    MultipleChoiceQuestion,
    MatchingQuestion,
    BuildSentenceQuestion,
} from '@/app/types/exercise'
import React from 'react'
import { View } from 'react-native'
import CardsLesson from '@/components/lessons/cardsLesson/cardsLesson'
import MultipleChoise from '@/components/lessons/multipleChoise/MultipleChoise'
import Matching from '@/components/lessons/matching/Matching'
import BuildSentence from '@/components/lessons/buildSentence/BuildSentence'
import AudioBuildSentence from '../audioBuildSentence/AudioBuildSentence'

type Props = {
    currentLessonType: string
    lessonId: string
    data: LessonStep
    setshowHub: React.Dispatch<React.SetStateAction<boolean>>
    onComplete: () => void
}

const ExerciseSupervisor = (props: Props) => {
    const { currentLessonType, lessonId, data, onComplete } = props
    const exerciseData =
        data.exercises.find((item: any) => item.type === currentLessonType)
            ?.data || []

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
        [
            'Build a sentence',
            <BuildSentence
                data={exerciseData as BuildSentenceQuestion[]}
                onComplete={onComplete}
            />,
        ],
        [
            'Build audioSentence',
            <AudioBuildSentence
                data={exerciseData as BuildSentenceQuestion[]}
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
