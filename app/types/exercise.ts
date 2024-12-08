export type ExerciseType =
    | 'Learn words with cards'
    | 'Choose the correct translation in your language'
    | 'Choose the correct translation in language you study'
    | 'Matching'
    | 'Build a sentence'

export interface Card {
    id: string
    from: string
    to: string
    image_url: string
    audio_url: string
    description: string
}

export interface MultipleChoiceQuestion {
    word: string
    image_url: string
    audio_url: string
    translations: string[]
    correctWord: string
    type: 'multipleChoice'
}

export interface MatchingQuestion {
    wordsFrom: { id: string; text: string; audio_url: string }[]
    wordsTo: { id: string; text: string; audio_url: string }[]
    image_url?: string
    audio_url: string
}

export interface BuildSentenceQuestion {
    sentence: string
    correctAnswer: string
    options: string[]
    audio_url: string
}

export interface LessonChatProps {
    theme?: string;
    words?: string[];
}

export interface Exercise {
    type: ExerciseType
    data:
        | Card[]
        | MultipleChoiceQuestion[]
        | MatchingQuestion[]
        | BuildSentenceQuestion[]
}

export interface LessonStep {
    title: string
    exercises: Exercise[]
}

export interface Lesson {
    video?: {
        href: string
    }
    steps: (LessonStep & { number: number })[]
}

export interface LessonsData {
    [key: string]: {
        video: { href: string }
        [key: string]: any
    }
}

export interface ExerciseState {
    currentExercise: Exercise | null
    currentExerciseIndex: number
    setCurrentExercise: (exercise: Exercise) => void
    setCurrentExerciseIndex: (index: number) => void
    incrementExerciseIndex: () => void
}
