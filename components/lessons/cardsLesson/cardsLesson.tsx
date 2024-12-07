import { Card } from '@/app/types/exercise'
import ExerciseNavigationBtn from '@/components/shared/ExerciseNavigationBtn'
import SoundButton from '@/components/shared/SoundButton'
import Colors from '@/constants/Colors'
import React, { useState } from 'react'
import {
    Dimensions,
    Image,
    PixelRatio,
    StyleSheet,
    Text,
    TouchableWithoutFeedback,
    View,
} from 'react-native'
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated'

interface Props {
    data: Card[]
    onComplete: () => void
}

const { width, height } = Dimensions.get('window')
const scale = PixelRatio.get()

const ITEM_WIDTH = width * 0.7
const ITEM_HEIGHT = height * 0.6

const CardsLesson: React.FC<Props> = (props: Props) => {
    const { data, onComplete } = props
    const [flipped, setFlipped] = useState(false)
    const rotation = useSharedValue(0)
    const [currentCard, setCurrentCard] = useState(0)
    const [isAudioPlaying, setIsAudioPlaying] = useState(false)

    console.log(JSON.stringify(data))

    const nextCard = () => {
        if (isAudioPlaying) return
        if (currentCard === data.length - 1) {
            onComplete()
            return
        }
        setCurrentCard(currentCard + 1)
        rotation.value = withTiming(0, { duration: 500 })
    }

    const prevCard = () => {
        if (isAudioPlaying) return
        setCurrentCard(currentCard - 1)
    }

    const flipCard = () => {
        if (flipped) {
            rotation.value = withTiming(0, { duration: 500 })
        } else {
            rotation.value = withTiming(180, { duration: 500 })
        }
        setFlipped(!flipped)
    }

    const frontAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{ rotateY: `${rotation.value}deg` }],
        opacity: rotation.value < 90 ? 1 : 0,
    }))

    const backAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{ rotateY: `${rotation.value - 180}deg` }],
        opacity: rotation.value >= 90 ? 1 : 0,
    }))

    return (
        <View style={styles.container}>
            <Text style={styles.text}>cards</Text>
            <TouchableWithoutFeedback onPress={flipCard}>
                <View style={styles.cardsContainer}>
                    {/* Front Side */}
                    <Animated.View style={[styles.card, frontAnimatedStyle]}>
                        <Image
                            source={{ uri: data[currentCard].image_url }}
                            style={styles.image}
                            onError={(error) =>
                                console.error('Error loading image:', error)
                            }
                        />
                        <Text style={styles.word}>{data[currentCard].to}</Text>
                    </Animated.View>

                    {/* Back Side */}
                    <Animated.View
                        style={[
                            styles.card,
                            styles.backCard,
                            backAnimatedStyle,
                        ]}
                    >
                        <Text style={styles.word}>
                            {data[currentCard].from}
                        </Text>
                        <View style={styles.divider}></View>
                        <Text style={styles.description}>
                            {data[currentCard].description}
                        </Text>
                    </Animated.View>
                </View>
            </TouchableWithoutFeedback>
            <View style={styles.bottomContainer}>
                <SoundButton
                    audioUrl={data[currentCard].audio_url}
                    onPlayingStateChange={setIsAudioPlaying}
                />
                {currentCard === data.length - 1 ? (
                    <>
                        {currentCard > 0 && (
                            <ExerciseNavigationBtn
                                onPress={prevCard}
                                text={'prev'}
                                disabled={isAudioPlaying}
                            />
                        )}
                        <ExerciseNavigationBtn
                            onPress={() => nextCard()}
                            text="Finish"
                            disabled={isAudioPlaying}
                        />
                    </>
                ) : (
                    <>
                        {currentCard > 0 && (
                            <ExerciseNavigationBtn
                                onPress={prevCard}
                                text="prev"
                                disabled={isAudioPlaying}
                            />
                        )}
                        <ExerciseNavigationBtn
                            onPress={() => nextCard()}
                            text={'next'}
                            disabled={isAudioPlaying}
                        />
                    </>
                )}
            </View>
        </View>
    )
}

export default CardsLesson

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.light.background,
    },
    text: {
        fontSize: 18,
        color: Colors.light.text,
        textAlign: 'center',
        marginBottom: 20,
        opacity: 0.8,
    },
    cardsContainer: {
        width: ITEM_WIDTH,
        height: ITEM_HEIGHT,
        alignSelf: 'center',
        perspective: '1000px',
    },
    card: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'space-around',
        backgroundColor: Colors.light.cardsBackground,
        backfaceVisibility: 'hidden',
        borderRadius: 20,
        borderWidth: 2,
        borderColor: 'gray',
        padding: 20,
    },
    backCard: {
        backgroundColor: Colors.light.cardsBackground,
        transform: [{ rotateY: '180deg' }],
        justifyContent: 'center',
    },
    image: {
        width: 220,
        aspectRatio: 1,
        resizeMode: 'contain',
        borderRadius: 10,
    },
    word: {
        fontSize: 24,
        color: Colors.light.text,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    divider: {
        width: '60%',
        height: 2,
        backgroundColor: Colors.light.itemsColor,
        marginVertical: 10,
    },
    description: {
        fontSize: 18,
        textAlign: 'center',
        paddingHorizontal: 10,
        color: Colors.light.itemsColor,
    },
    buttonContainer: {
        marginTop: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    starIcon: {
        color: Colors.light.gold,
    },
    starButton: {
        padding: 10,
        borderRadius: 10,
    },
    nextButton: {
        alignSelf: 'flex-end',
        padding: 15,
        paddingHorizontal: 25,
        borderRadius: 10,
        backgroundColor: Colors.light.itemsColor,
        marginTop: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    nextText: {
        color: Colors.light.text,
        fontSize: 16,
        fontWeight: '600',
    },
    bottomContainer: {
        marginTop: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
})
