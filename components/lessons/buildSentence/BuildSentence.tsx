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
        [...(data[0].options || [])].sort(() => Math.random() - 0.5)
    )
    const [wordSlots, setWordSlots] = useState<(string | null)[]>(
        [...(data[0].options || [])].sort(() => Math.random() - 0.5).map(word => word)
    )
    const [incorrectWords, setIncorrectWords] = useState<string[]>([])
    const [isCorrect, setIsCorrect] = useState(false)
    const [playAudioAutomatically, setPlayAudioAutomatically] = useState(false)

    const handleWordPress = (word: string, isFromSentence: boolean) => {
        if (isFromSentence) {
            setSelectedWords((prev) => prev.filter((w) => w !== word))
            setWordSlots(prev => {
                const newSlots = [...prev]
                const emptyIndex = newSlots.findIndex(slot => slot === null)
                newSlots[emptyIndex] = word
                return newSlots
            })
        } else {
            setSelectedWords((prev) => [...prev, word])
            setWordSlots(prev => {
                const newSlots = [...prev]
                const index = newSlots.findIndex(slot => slot === word)
                newSlots[index] = null
                return newSlots
            })
        }
        setIncorrectWords([])
        setIsCorrect(false)
        setPlayAudioAutomatically(false)
    }

    const moveToNextQuestion = () => {
        if (currentQuestionIndex < data.length - 1) {
            const nextWords = [...(data[currentQuestionIndex + 1].options || [])].sort(() => Math.random() - 0.5)
            setCurrentQuestionIndex((prev) => prev + 1)
            setSelectedWords([])
            setWordSlots(nextWords)
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
            // Mark all selected words as incorrect
            setIncorrectWords(selectedWords)

            // Wait for 1 second to show the red highlight
            setTimeout(() => {
                // Return all words to the bottom container
                selectedWords.forEach(word => {
                    setWordSlots(prev => {
                        const newSlots = [...prev]
                        const emptyIndex = newSlots.findIndex(slot => slot === null)
                        if (emptyIndex !== -1) {
                            newSlots[emptyIndex] = word
                        }
                        return newSlots
                    })
                })
                
                // Clear selected words and incorrect words state
                setSelectedWords([])
                setIncorrectWords([])
            }, 1000)
        }
    }

    useEffect(() => {
        const correctAnswerWordCount = data[currentQuestionIndex].correctAnswer.split(' ').length
        if (selectedWords.length === correctAnswerWordCount) {
            checkAnswer()
        }
    }, [selectedWords])

    const currentQuestion = data[currentQuestionIndex]

    return (
        <View style={styles.container}>
            <Text style={styles.title}>
                Соберите предложение из данных слов
            </Text>
            <View style={styles.topContainer}>
                <Text style={styles.questionText}>
                    {currentQuestion.sentence}
                </Text>

                <View style={styles.sentenceContainer}>
                    {selectedWords.map((word, index) => (
                        <TouchableOpacity
                            key={`selected-${index}`}
                            style={[
                                styles.wordButton,
                                styles.selectedWordButton,
                                incorrectWords.includes(word) && styles.incorrectWord,
                                isCorrect && styles.correctWord,
                            ]}
                            onPress={() => handleWordPress(word, true)}
                            disabled={isCorrect}
                        >
                            <Text
                                style={[
                                    styles.wordText,
                                    incorrectWords.includes(word) && styles.incorrectWordText,
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
                <View style={styles.wordsContainer}>
                    {wordSlots.map((word, index) => (
                        word && (
                            <TouchableOpacity
                                key={`slot-${index}`}
                                style={[
                                    styles.wordButton,
                                    !word && styles.emptySlot,
                                    incorrectWords.includes(word) && styles.incorrectWord,
                                ]}
                                onPress={() => word && handleWordPress(word, false)}
                                disabled={isCorrect || !word}
                            >
                                <Text style={[
                                    styles.wordText,
                                    incorrectWords.includes(word) && styles.incorrectWordText
                                ]}>
                                    {word}
                                </Text>
                            </TouchableOpacity>
                        )
                    ))}
                </View>

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
        padding: 5,
    },
    bottomContainer: {
        padding: 10,
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
    emptySlot: {
        opacity: 0,
    },
})

export default BuildSentence