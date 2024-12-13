import { MatchingQuestion } from '@/app/types/exercise'
import Colors from '@/constants/Colors'
import { Audio } from 'expo-av'
import React, { useMemo, useState, useEffect } from 'react'
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
    const [errorWord, setErrorWord] = useState<{id: string, side: 'from' | 'to'} | null>(null);

    const shuffleArray = <T extends any>(array: T[]): T[] => {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    };

    const [shuffledWordsFrom, setShuffledWordsFrom] = useState(() => shuffleArray(data[0].wordsFrom));
    const [shuffledWordsTo, setShuffledWordsTo] = useState(() => shuffleArray(data[0].wordsTo));

    useEffect(() => {
        setShuffledWordsFrom(shuffleArray(data[0].wordsFrom));
        setShuffledWordsTo(shuffleArray(data[0].wordsTo));
    }, [data]);

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
            setErrorWord({ id, side })
            setTimeout(() => {
                setErrorWord(null)
                setSelectedWord(null)
            }, 1000)
        }
    }

    const isWordSelected = (id: string, side: 'from' | 'to') =>
        selectedWord?.id === id && selectedWord.side === side

    const renderWord = (word: { id: string; text: string; audio_url?: string }, side: 'from' | 'to') => {
        const isSelected = selectedWord?.id === word.id && selectedWord.side === side
        const isCompleted = completedPairs.has(word.id)
        const isError = errorWord?.id === word.id && errorWord.side === side
        return (
            <View key={`${word.id}-${side}`} style={styles.wordContainer}>
                <TouchableOpacity
                    style={[
                        styles.wordButton,
                        isSelected && styles.selectedWord,
                        isCompleted && styles.completedWord,
                        isError && styles.errorWord,
                    ]}
                    onPress={() => handleWordPress(word.id, side)}
                    disabled={isCompleted}
                >
                    <Text 
                        style={[
                            styles.wordText, 
                            isCompleted && styles.completedWordText,
                            isError && styles.errorText
                        ]} 
                        numberOfLines={2}
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
                    {shuffledWordsFrom.map((word) => renderWord(word, 'from'))}
                </View>
                <View style={styles.column}>
                    {shuffledWordsTo.map((word) => renderWord(word, 'to'))}
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    titleText: {
        fontSize: 22,
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: 20,
        color: Colors.light.text,
    },
    wordsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        width: '100%',
        paddingHorizontal: 2,
    },
    column: {
        flex: 1,
        alignItems: 'center',
        marginHorizontal: 6,
    },
    wordContainer: {
        width: '100%',
        height: 70,
        marginVertical: 4,
    },
    wordButton: {
        width: '100%',
        height: '100%',
        backgroundColor: 'white',
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: Colors.light.itemsColor,
        padding: 6,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.15,
        shadowRadius: 3,
        elevation: 3,
    },
    selectedWord: {
        backgroundColor: '#E3EEFF',
        borderColor: '#007AFF',
        borderWidth: 2,
    },
    completedWord: {
        backgroundColor: '#E8F7EA',
        borderColor: '#34C759',
        borderWidth: 2,
    },
    errorWord: {
        backgroundColor: '#FFF0F0',
        borderColor: '#FF3B30',
        borderWidth: 2,
    },
    wordText: {
        fontSize: 16,
        color: "black",
        textAlign: 'center',
        fontWeight: '500',
        width: '100%',
        lineHeight: 24,
    },
    completedWordText: {
        color: '#34C759',
        fontWeight: '600',
    },
    errorText: {
        color: '#FF3B30',
        fontWeight: '600',
    }
})

export default Matching