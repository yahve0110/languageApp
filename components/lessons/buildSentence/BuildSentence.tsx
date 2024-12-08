import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import SoundButton from '@/components/shared/SoundButton'
import Colors from '@/constants/Colors'
import { BuildSentenceQuestion } from '@/app/types/exercise'

interface Props {
    data: BuildSentenceQuestion[]
    onComplete: () => void
}

const BuildSentence = (props: Props) => {
    const { data, onComplete } = props
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
    const [selectedWords, setSelectedWords] = useState<string[]>([])
    const [availableWords, setAvailableWords] = useState<string[]>(
        data[0].options || []
    )
    const [incorrectWords, setIncorrectWords] = useState<string[]>([])
    const [isCorrect, setIsCorrect] = useState(false)
    const [playAudioAutomatically, setPlayAudioAutomatically] = useState(false)

    const handleWordPress = (word: string, isFromSentence: boolean) => {
        if (isFromSentence) {
            setSelectedWords((prev) => prev.filter((w) => w !== word))
            setAvailableWords((prev) => [...prev, word])
        } else {
            setSelectedWords((prev) => [...prev, word])
            setAvailableWords((prev) => prev.filter((w) => w !== word))
        }
        setIncorrectWords([])
        setIsCorrect(false)
        setPlayAudioAutomatically(false)
    }

    const moveToNextQuestion = () => {
        if (currentQuestionIndex < data.length - 1) {
            setCurrentQuestionIndex((prev) => prev + 1)
            setSelectedWords([])
            setAvailableWords(data[currentQuestionIndex + 1].options || [])
            setIncorrectWords([])
            setIsCorrect(false)
            setPlayAudioAutomatically(false)
        } else {
            onComplete()
        }
    }

    const checkAnswer = () => {
        const currentAnswer = selectedWords.join(' ')
        if (currentAnswer === data[currentQuestionIndex].correctAnswer) {
            setIsCorrect(true)
            setPlayAudioAutomatically(true)
        } else {
            const correctWords =
                data[currentQuestionIndex].correctAnswer.split(' ')
            const wrongWords = selectedWords.filter(
                (word, index) => word !== correctWords[index]
            )
            setIncorrectWords(wrongWords)

            setTimeout(() => {
                setAvailableWords((prev) => [...prev, ...selectedWords])
                setSelectedWords([])
                setIncorrectWords([])
            }, 2000)
        }
    }

    // Automatically check answer when the correct number of words is selected
    useEffect(() => {
        const correctAnswerWordCount =
            data[currentQuestionIndex].correctAnswer.split(' ').length
        
        if (selectedWords.length === correctAnswerWordCount) {
            checkAnswer()
        }
    }, [selectedWords])

    const currentQuestion = data[currentQuestionIndex]
    const correctAnswerWordCount =
        currentQuestion.correctAnswer.split(' ').length

    return (
        <View style={styles.container}>
            <Text style={styles.title}>
                Соберите предложение из данных слов
            </Text>
            <View style={styles.topContainer}>
                <Text style={styles.questionText}>
                    {currentQuestion.sentence}
                </Text>

                {/* Built sentence area */}
                <View style={styles.sentenceContainer}>
                    {selectedWords.map((word, index) => (
                        <TouchableOpacity
                            key={`selected-${index}`}
                            style={[
                                styles.wordButton,
                                styles.selectedWordButton,
                                incorrectWords.includes(word) &&
                                    styles.incorrectWord,
                                isCorrect && styles.correctWord,
                            ]}
                            onPress={() => handleWordPress(word, true)}
                            disabled={isCorrect || incorrectWords.length > 0}
                        >
                            <Text
                                style={[
                                    styles.wordText,
                                    incorrectWords.includes(word) &&
                                        styles.incorrectWordText,
                                    isCorrect && styles.correctWordText,
                                ]}
                            >
                                {word}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            <View style={styles.bottomContainer}>
                {/* Available words */}
                <View style={styles.wordsContainer}>
                    {availableWords.map((word, index) => (
                        <TouchableOpacity
                            key={`available-${index}`}
                            style={styles.wordButton}
                            onPress={() => handleWordPress(word, false)}
                            disabled={isCorrect || incorrectWords.length > 0}
                        >
                            <Text style={styles.wordText}>{word}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Conditionally render SoundButton only when correct and ready to play audio */}
                {isCorrect && playAudioAutomatically && (
                    <SoundButton
                        autoPlay={true}
                        hide={true}
                        audioUrl={currentQuestion.audio_url}
                        onPlayingStateChange={(isPlaying) => {
                            if (!isPlaying) {
                                moveToNextQuestion()
                            }
                        }}
                    />
                )}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
    },
    topContainer: {
        padding: 20,
    },
    bottomContainer: {
        padding: 20,
        paddingBottom: 40,
        backgroundColor: Colors.light.background,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    questionText: {
        paddingBottom: 10,
        color: Colors.light.text,
        textAlign: 'center',
        fontSize: 26,
    },
    title: {
        fontSize: 14,
        color: 'gray',
        marginBottom: 20,
        textAlign: 'center',
    },
    sentenceContainer: {
        minHeight: 100,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: 10,
        borderRadius: 10,
        backgroundColor: Colors.light.background,
        marginVertical: 20,
        width: '100%',
        gap: 5,
    },
    wordsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 10,
        marginBottom: 40,
    },
    wordButton: {
        backgroundColor: Colors.light.white,
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
        margin: 5,
    },
    selectedWordButton: {
        margin: 2,
        borderRadius: 10,
    },
    incorrectWord: {
        backgroundColor: Colors.light.red,
    },
    correctWord: {
        backgroundColor: '#4ade80',
    },
    wordText: {
        color: 'black',
        fontSize: 16,
    },
    incorrectWordText: {
        color: 'white',
    },
    correctWordText: {
        color: 'white',
    },
})

export default BuildSentence