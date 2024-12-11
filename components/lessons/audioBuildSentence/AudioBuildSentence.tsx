import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import SoundButton from '@/components/shared/SoundButton';
import Colors from '@/constants/Colors';
import { BuildSentenceQuestion } from '@/app/types/exercise';

interface Props {
    data: BuildSentenceQuestion[];
    onComplete: () => void;
}

const AudioBuildSentence: React.FC<Props> = ({ data, onComplete }) => {
    const shuffleArray = <T,>(array: T[]): T[] => {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    };

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedWords, setSelectedWords] = useState<string[]>([]);
    const [wordSlots, setWordSlots] = useState<(string | null)[]>(() => 
        shuffleArray(data[0].options || [])
    );
    const [incorrectWords, setIncorrectWords] = useState<string[]>([]);
    const [isCorrect, setIsCorrect] = useState(false);
    const [playAudioAutomatically, setPlayAudioAutomatically] = useState(false);

    const handleWordPress = (word: string, isFromSentence: boolean) => {
        if (isFromSentence) {
            setSelectedWords((prev) => prev.filter((w) => w !== word));
            // Возвращаем слово на его оригинальную позицию
            setWordSlots(prev => {
                const newSlots = [...prev];
                const originalIndex = newSlots.findIndex(slot => slot === null);
                newSlots[originalIndex] = word;
                return newSlots;
            });
        } else {
            setSelectedWords((prev) => [...prev, word]);
            // Помечаем позицию слова как пустую
            setWordSlots(prev => {
                const newSlots = [...prev];
                const index = newSlots.findIndex(slot => slot === word);
                newSlots[index] = null;
                return newSlots;
            });
        }
        setIncorrectWords([]);
        setIsCorrect(false);
        setPlayAudioAutomatically(false);
    };

    const moveToNextQuestion = () => {
        if (currentQuestionIndex < data.length - 1) {
            const nextWords = shuffleArray(data[currentQuestionIndex + 1].options || []);
            setCurrentQuestionIndex((prev) => prev + 1);
            setSelectedWords([]);
            setWordSlots(nextWords);
            setIncorrectWords([]);
            setIsCorrect(false);
            setPlayAudioAutomatically(false);
        } else {
            onComplete();
        }
    };

    const checkAnswer = () => {
        const currentAnswer = selectedWords.join(' ');
        if (currentAnswer === data[currentQuestionIndex].correctAnswer) {
            setIsCorrect(true);
            setPlayAudioAutomatically(true);
        } else {
            const correctWords = data[currentQuestionIndex].correctAnswer.split(' ');
            const wrongWords = selectedWords.filter(
                (word, index) => word !== correctWords[index]
            );
            setIncorrectWords(wrongWords);

            setTimeout(() => {
                // Возвращаем слова на их оригинальные позиции
                setWordSlots(prev => {
                    const newSlots = [...prev];
                    selectedWords.forEach(word => {
                        const emptyIndex = newSlots.findIndex(slot => slot === null);
                        if (emptyIndex !== -1) {
                            newSlots[emptyIndex] = word;
                        }
                    });
                    return newSlots;
                });
                setSelectedWords([]);
                setIncorrectWords([]);
            }, 2000);
        }
    };

    useEffect(() => {
        const correctAnswerWordCount = data[currentQuestionIndex].correctAnswer.split(' ').length;
        if (selectedWords.length === correctAnswerWordCount) {
            checkAnswer();
        }
    }, [selectedWords]);

    const currentQuestion = data[currentQuestionIndex];

    return (
        <View style={styles.container}>
            <Text style={styles.title}>
                Прослушайте предложение и соберите из данных слов
            </Text>
            <SoundButton size={100} audioUrl={currentQuestion.audio_url} />
            <View style={styles.sentenceContainer}>
                {selectedWords.map((word, index) => (
                    <TouchableOpacity
                        key={`selected-${index}`}
                        style={[
                            styles.wordButton,
                            incorrectWords.includes(word) && styles.incorrectWord,
                            isCorrect && styles.correctWord
                        ]}
                        onPress={() => handleWordPress(word, true)}
                        disabled={isCorrect || incorrectWords.length > 0}
                    >
                        <Text style={[
                            styles.wordText,
                            incorrectWords.includes(word) && styles.incorrectWordText,
                            isCorrect && styles.correctWordText
                        ]}>
                            {word}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <View style={styles.wordsContainer}>
                {wordSlots.map((word, index) => (
                    word && (
                        <TouchableOpacity
                            key={`slot-${index}`}
                            style={[
                                styles.wordButton,
                                !word && styles.emptySlot
                            ]}
                            onPress={() => word && handleWordPress(word, false)}
                            disabled={isCorrect || incorrectWords.length > 0 || !word}
                        >
                            <Text style={styles.wordText}>{word}</Text>
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
                            moveToNextQuestion();
                        }
                    }}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.light.background,
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
});

export default AudioBuildSentence;