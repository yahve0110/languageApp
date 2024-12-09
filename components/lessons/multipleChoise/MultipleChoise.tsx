import { MultipleChoiceQuestion } from '@/app/types/exercise'
import Button from '@/components/shared/Button'
import Colors from '@/constants/Colors'
import { useEffect, useState } from 'react'
import {
    Dimensions,
    Image,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native'
import Animated, { useSharedValue, withTiming } from 'react-native-reanimated'
import SoundButton from '@/components/shared/SoundButton'
import { Audio } from 'expo-av'

const { width, height } = Dimensions.get('window')

type Props = {
    data: MultipleChoiceQuestion[]
    onComplete: () => void
}

export default function MultipleChoise({
    data: initialData,
    onComplete,
}: Props) {
    const [data, setData] = useState<MultipleChoiceQuestion[]>(initialData)
    const [wordIndex, setWordIndex] = useState(0)
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
    const [isChecked, setIsChecked] = useState(false)
    const [isPlaying, setIsPlaying] = useState(false)
    const [sound, setSound] = useState<Audio.Sound | null>(null)
    const opacity = useSharedValue(1)

    useEffect(() => {
        opacity.value = withTiming(1)
    }, [wordIndex])

    const handleAnswer = (answer: string) => {
        setSelectedAnswer(answer)
    }

    const playSound = async () => {
        try {
            setIsPlaying(true)
            if (sound) {
                await sound.unloadAsync()
            }
            const { sound: newSound } = await Audio.Sound.createAsync(
                { uri: data[wordIndex].audio_url },
                { shouldPlay: true }
            )
            setSound(newSound)

            // Ждем окончания воспроизведения
            newSound.setOnPlaybackStatusUpdate((status) => {
                if (
                    status &&
                    'didJustFinish' in status &&
                    status.didJustFinish
                ) {
                    setIsPlaying(false)
                }
            })
        } catch (error) {
            console.log('Error playing sound:', error)
            setIsPlaying(false)
        }
    }

    const checkAnswer = () => {
        setIsChecked(true)
        playSound()
    }

    const handleNext = () => {
        if (selectedAnswer !== data[wordIndex].correctWord) {
            setData((prevData) => {
                const currentQuestion = { ...prevData[wordIndex] }
                const newData = prevData.filter((_, index) => index !== wordIndex)
                return [...newData, currentQuestion]
            })
        }

        if (wordIndex === data.length - 1) {
            onComplete()
        } else {
            opacity.value = 0
            setWordIndex(wordIndex + 1)
            setSelectedAnswer(null)
            setIsChecked(false)
            opacity.value = withTiming(1)
        }
    }

    useEffect(() => {
        return sound
            ? () => {
                  sound.unloadAsync()
              }
            : undefined
    }, [sound])

    const getVariantStyle = (translation: string) => {
        if (!isChecked) {
            return [
                styles.variant,
                selectedAnswer === translation && styles.selectedVariant,
            ]
        }

        if (translation === data[wordIndex].correctWord) {
            return [styles.variant, styles.correctVariant]
        }

        if (
            translation === selectedAnswer &&
            translation !== data[wordIndex].correctWord
        ) {
            return [styles.variant, styles.incorrectVariant]
        }

        return styles.variant
    }

    const getTextStyle = (translation: string) => {
        if (!isChecked) {
            return [
                styles.variantText,
                selectedAnswer === translation && styles.selectedText,
            ]
        }

        if (translation === data[wordIndex].correctWord) {
            return [
                styles.variantText,
                {
                    color: Colors.light.text,
                },
            ]
        }

        if (
            translation === selectedAnswer &&
            translation !== data[wordIndex].correctWord
        ) {
            return [styles.variantText, styles.incorrectText]
        }

        return styles.variantText
    }

    return (
        <Animated.View style={[styles.container, { opacity }]}>
            <View style={styles.wordContainer}>
                <Image
                    source={{ uri: data[wordIndex].image_url }}
                    style={styles.image}
                />
                <Text style={styles.word}>{data[wordIndex].word}</Text>
            </View>

            <View style={styles.content}>
                <View style={styles.variantsContainer}>
                    {data[wordIndex].translations.map((translation) => (
                        <Pressable
                            key={translation}
                            style={getVariantStyle(translation)}
                            onPress={() =>
                                !isChecked && handleAnswer(translation)
                            }
                        >
                            <Text style={getTextStyle(translation)}>
                                {translation}
                            </Text>
                        </Pressable>
                    ))}
                </View>
                <Button
                    text={isChecked ? 'Далее' : 'Проверить'}
                    onPress={isChecked ? handleNext : checkAnswer}
                    disabled={!selectedAnswer || isPlaying}
                />
            </View>

            {isChecked && selectedAnswer === data[wordIndex].correctWord && (
                <View
                    style={[
                        styles.popup,
                        { backgroundColor: Colors.light.green },
                    ]}
                >
                    <View style={styles.popupContent}>
                        <Text style={styles.popupText}>Правильно!</Text>
                        <SoundButton audioUrl={data[wordIndex].audio_url} />
                    </View>
                </View>
            )}

            {isChecked && selectedAnswer !== data[wordIndex].correctWord && (
                <View
                    style={[
                        styles.popup,
                        { backgroundColor: Colors.light.red },
                    ]}
                >
                    <View style={styles.popupContent}>
                        <Text style={styles.popupText}>Правильный ответ:</Text>
                        <Text style={[styles.popupText, { fontWeight: '600' }]}>
                            {data[wordIndex].correctWord}
                        </Text>
                        <SoundButton audioUrl={data[wordIndex].audio_url} />
                    </View>
                </View>
            )}
        </Animated.View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 20,
    },
    content: {
        width: '100%',
        paddingHorizontal: 20,
        gap: 20,
    },
    image: {
        width: width * 0.5,
        height: width * 0.5,
        borderRadius: 10,
        marginBottom: 10,
    },
    wordContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 5,
        marginBottom: 20,
    },
    word: {
        fontSize: 24,
        fontWeight: '600',
        color: Colors.light.text,
    },
    variantsContainer: {
        width: '100%',
        gap: 10,
    },
    variant: {
        width: '80%',
        alignSelf: 'center',
        padding: 15,
        borderRadius: 10,
        backgroundColor: Colors.light.secondaryLight,
    },
    selectedVariant: {
        backgroundColor: Colors.light.itemsColor,
    },
    correctVariant: {
        backgroundColor: Colors.light.green,
        color: 'white',
    },
    incorrectVariant: {
        backgroundColor: Colors.light.red,
        color: Colors.light.text,
    },
    variantText: {
        fontSize: 16,
        textAlign: 'center',
        color: Colors.light.itemsColor,
    },
    selectedText: {
        color: Colors.light.text,
        fontWeight: '600',
    },
    correctText: {
        color: Colors.light.green,
        fontWeight: '600',
    },
    incorrectText: {
        color: Colors.light.red,
        fontWeight: '600',
    },
    popup: {
        position: 'absolute',
        bottom: 80,
        backgroundColor: Colors.light.itemsColor,
        padding: 25,
        borderRadius: 10,
        width: '90%',
        textAlign: 'center',
    },
    popupContent: {
        alignItems: 'center',
        gap: 10,
    },
    popupText: {
        fontSize: 20,
        textAlign: 'center',
        color: Colors.light.text,
    },
})
