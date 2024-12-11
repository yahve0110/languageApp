import { Card } from '@/app/types/exercise'
import ExerciseNavigationBtn from '@/components/shared/ExerciseNavigationBtn'
import FlipCard from '@/components/shared/FlipCard'
import SoundButton from '@/components/shared/SoundButton'
import Colors from '@/constants/Colors'
import React, { useState, useEffect } from 'react'
import { Dimensions, Text, View, StyleSheet, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'

interface Props {
    data: Card[]
    onComplete: () => void
}

const { width, height } = Dimensions.get('window')

const CardsLesson: React.FC<Props> = (props: Props) => {
    const { data, onComplete } = props
    const [currentCard, setCurrentCard] = useState(0)
    const [isAudioPlaying, setIsAudioPlaying] = useState(false)
    const [cards, setCards] = useState<Card[]>(data)

    // Check if cards are in favorites when component mounts
    useEffect(() => {
        const checkFavorites = async () => {
            try {
                const cardsJson = await AsyncStorage.getItem('flashcards')
                if (cardsJson) {
                    const allCards = JSON.parse(cardsJson)
                    // Update favorite status for each card
                    const updatedCards = cards.map(card => ({
                        ...card,
                        isFavorite: allCards.some((fc: any) => 
                            fc.id === card.id && fc.folderId === 'favorites'
                        )
                    }))
                    setCards(updatedCards)
                }
            } catch (error) {
                console.error('Error checking favorites:', error)
            }
        }
        checkFavorites()
    }, [])

    const toggleFavorite = async () => {
        try {
            const currentCardData = cards[currentCard]
            // Get all flashcards
            const cardsJson = await AsyncStorage.getItem('flashcards')
            let allCards = cardsJson ? JSON.parse(cardsJson) : []
            
            // Create a new flashcard if it doesn't exist in favorites
            const newCard = {
                id: currentCardData.id,
                word: currentCardData.to,
                translation: currentCardData.from,
                fromLanguage: 'en',
                toLanguage: 'et',
                createdAt: new Date().toISOString(),
                folderId: 'favorites',
                isFavorite: true,
                image_url: currentCardData.image_url,
                audio_url: currentCardData.audio_url,
                description: currentCardData.description
            }

            // Check if card already exists in favorites
            const existingFavoriteIndex = allCards.findIndex(
                (card: any) => card.id === currentCardData.id && card.folderId === 'favorites'
            )

            if (existingFavoriteIndex === -1) {
                // Add to favorites
                allCards.push(newCard)
                // Update local state
                const updatedCards = [...cards]
                updatedCards[currentCard] = { ...currentCardData, isFavorite: true }
                setCards(updatedCards)
            } else {
                // Remove from favorites
                allCards.splice(existingFavoriteIndex, 1)
                // Update local state
                const updatedCards = [...cards]
                updatedCards[currentCard] = { ...currentCardData, isFavorite: false }
                setCards(updatedCards)
            }

            // Save updated cards
            await AsyncStorage.setItem('flashcards', JSON.stringify(allCards))
        } catch (error) {
            console.error('Error toggling favorite:', error)
        }
    }

    const nextCard = () => {
        if (isAudioPlaying) return
        if (currentCard === data.length - 1) {
            onComplete()
            return
        }
        setCurrentCard(currentCard + 1)
    }

    const prevCard = () => {
        if (isAudioPlaying) return
        setCurrentCard(currentCard - 1)
    }

    return (
        <View style={styles.container}>
            <Text style={styles.text}>cards</Text>
            <FlipCard
                frontContent={{
                    imageUrl: cards[currentCard].image_url,
                    text: cards[currentCard].to,
                }}
                backContent={{
                    text: cards[currentCard].from,
                    description: cards[currentCard].description,
                }}
            />
            <View style={styles.bottomContainer}>
                <View style={styles.controlsContainer}>
                    <SoundButton
                        audioUrl={cards[currentCard].audio_url}
                        onPlayingStateChange={setIsAudioPlaying}
                    />
                 
                </View>
                
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
                   <TouchableOpacity
                        style={styles.favoriteButton}
                        onPress={toggleFavorite}
                        disabled={isAudioPlaying}
                    >
                        <Ionicons 
                            name={cards[currentCard].isFavorite ? "star" : "star-outline"} 
                            size={28} 
                            color={cards[currentCard].isFavorite ? "#FFD700" : Colors.light.itemsColor} 
                        />
                    </TouchableOpacity>
            </View>
            
        </View>
    )
}

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
    bottomContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center', 
        paddingHorizontal: 5,
        gap: 10,
        marginTop: 20,
    },
    controlsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    favoriteButton: {
        padding: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
})

export default CardsLesson
