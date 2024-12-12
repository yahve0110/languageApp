import { MatchingQuestion } from '@/app/types/exercise'
import Colors from '@/constants/Colors'
import { Audio } from 'expo-av'
import React, { useMemo, useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

interface Props {
    data: MatchingQuestion[]
    onComplete: () => void
}

const Matching = (props: Props) => {
    const { data, onComplete } = props
    const [selectedWord, setSelectedWord] = useState<{
        id: string
        side: 'from' | 'to'
    } | null>(null)
    const [completedPairs, setCompletedPairs] = useState<Set<string>>(new Set())
    const [isError, setIsError] = useState(false)

    const wordsFrom = useMemo(() => {
        return data[0].wordsFrom
    }, [data])

    const wordsTo = useMemo(() => {
        return data[0].wordsTo
    }, [data])

    const playAudio = async (audioUrl: string) => {
        try {
            const { sound: newSound } = await Audio.Sound.createAsync({
                uri: audioUrl,
            })
            await newSound.playAsync()
            newSound.setOnPlaybackStatusUpdate(async (status) => {
                if (status.isLoaded && status.didJustFinish) {
                    await newSound.unloadAsync()
                }
            })
        } catch (error) {
            console.error('Ошибка воспроизведения:', error)
        }
    }

    const handleWordPress = (id: string, side: 'from' | 'to') => {
        if (completedPairs.has(id)) return

        if (!selectedWord) {
            setSelectedWord({ id, side })
            return
        }

        if (selectedWord.side === side) {
            setSelectedWord({ id, side })
            return
        }

        if (selectedWord.id === id) {
            setCompletedPairs((prev) => new Set([...prev, id]))
            setSelectedWord(null)

            const matchedWord = data[0].wordsTo.find((word) => word.id === id)
            if (matchedWord?.audio_url) {
                playAudio(matchedWord.audio_url)
            }

            if (completedPairs.size + 1 === data[0].wordsFrom.length) {
                setTimeout(onComplete, 500)
            }
        } else {
            setIsError(true)
            setTimeout(() => {
                setIsError(false)
                setSelectedWord(null)
            }, 2000)
        }
    }

    const isWordSelected = (id: string, side: 'from' | 'to') =>
        selectedWord?.id === id && selectedWord.side === side

    const renderWord = (
        word: { id: string; text: string },
        side: 'from' | 'to'
    ) => {
        const isCompleted = completedPairs.has(word.id)
        const isSelected = isWordSelected(word.id, side)

        return (
            <View
                key={`${side}-${word.id}`}
                style={styles.wordContainer}
            >
                <TouchableOpacity
                    onPress={() => handleWordPress(word.id, side)}
                    style={[
                        styles.wordButton,
                        isSelected && styles.selectedWord,
                        isCompleted && styles.completedWord,
                        isError && isSelected && styles.errorWord,
                    ]}
                    disabled={isCompleted}
                >
                    <Text
                        style={[
                            styles.wordText,
                            isCompleted && styles.completedWordText,
                        ]}
                        numberOfLines={1}
                    >
                        {word.text}
                    </Text>
                </TouchableOpacity>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <Text style={styles.titleText}>Подберите пару</Text>
            <View style={styles.wordsContainer}>
                <View style={styles.column}>
                    {wordsFrom.map((word) => renderWord(word, 'from'))}
                </View>
                <View style={styles.column}>
                    {wordsTo.map((word) => renderWord(word, 'to'))}
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        paddingBottom: 100,
    },
    titleText: {
        fontSize: 20,
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: 20,
        color: Colors.light.text,
    },
    wordsContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    column: {
        flex: 1,
        marginHorizontal: 8,
    },
    wordContainer: {
        width: '100%',
        marginVertical: 5,
    },
    wordButton: {
        backgroundColor: Colors.light.background,
        borderRadius: 10,
        padding: 10,
        minWidth: '80%',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: Colors.light.itemsColor,
    },
    selectedWord: {
        backgroundColor: '#E3EEFF',
        borderColor: '#007AFF',
    },
    completedWord: {
        backgroundColor: '#E8F7EA',
        borderColor: '#34C759',
    },
    errorWord: {
        backgroundColor: '#FFE5E5',
        borderColor: '#FF3B30',
    },
    wordText: {
        fontSize: 16,
        color: '#000',
        fontWeight: '500',
        textAlign: 'center',
        flex: 1,
    },
    completedWordText: {
        color: '#34C759',
        fontWeight: '600',
    },
})

export default Matching
