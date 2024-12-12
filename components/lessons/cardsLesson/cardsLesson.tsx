import { Card } from '@/app/types/exercise'
import ExerciseNavigationBtn from '@/components/shared/ExerciseNavigationBtn'
import FlipCard from '@/components/shared/FlipCard'
import SoundButton from '@/components/shared/SoundButton'
import CustomModal from '@/components/shared/CustomModal'
import Colors from '@/constants/Colors'
import React, { useState, useEffect } from 'react'
import { Dimensions, Text, View, StyleSheet, TouchableOpacity, TextInput, FlatList, Alert } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Animated, { 
    SlideInRight, 
    SlideOutLeft, 
    SlideInLeft, 
    SlideOutRight,
} from 'react-native-reanimated'

interface Props {
    data: Card[]
    onComplete: () => void
}

interface Folder {
    id: string;
    name: string;
}

interface FlashCard {
    id: string;
    word: string;
    translation: string;
    fromLanguage: string;
    toLanguage: string;
    createdAt: string;
    folderId?: string;
    image_url?: string;
    audio_url?: string;
    description?: string;
}

const { width, height } = Dimensions.get('window')

const CardsLesson: React.FC<Props> = (props: Props) => {
    const { data, onComplete } = props
    const [currentCard, setCurrentCard] = useState(0)
    const [isAudioPlaying, setIsAudioPlaying] = useState(false)
    const [cards, setCards] = useState<Card[]>(data)
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [folders, setFolders] = useState<Folder[]>([])
    const [isCreatingFolder, setIsCreatingFolder] = useState(false)
    const [newFolderName, setNewFolderName] = useState('')
    const [savedCards, setSavedCards] = useState<{[key: string]: boolean}>({})
    const [direction, setDirection] = useState<'forward' | 'back'>('forward')
    const [isCardFlipped, setIsCardFlipped] = useState(false)

    useEffect(() => {
        loadFolders()
        loadSavedCards()
    }, [])

    const loadFolders = async () => {
        try {
            const foldersJson = await AsyncStorage.getItem('folders')
            if (foldersJson) {
                setFolders(JSON.parse(foldersJson))
            }
        } catch (error) {
            console.error('Error loading folders:', error)
        }
    }

    const loadSavedCards = async () => {
        try {
            const cardsJson = await AsyncStorage.getItem('flashcards')
            if (cardsJson) {
                const allCards = JSON.parse(cardsJson)
                const savedCardsMap: {[key: string]: boolean} = {}
                allCards.forEach((card: FlashCard) => {
                    savedCardsMap[card.word] = true
                })
                setSavedCards(savedCardsMap)
            }
        } catch (error) {
            console.error('Error loading saved cards:', error)
        }
    }

    const createNewFolder = async () => {
        if (!newFolderName.trim()) {
            Alert.alert('Error', 'Please enter a folder name')
            return
        }

        try {
            const newFolder: Folder = {
                id: Date.now().toString(),
                name: newFolderName.trim(),
            }

            const updatedFolders = [...folders, newFolder]
            await AsyncStorage.setItem('folders', JSON.stringify(updatedFolders))
            setFolders(updatedFolders)
            setNewFolderName('')
            setIsCreatingFolder(false)
        } catch (error) {
            console.error('Error creating folder:', error)
            Alert.alert('Error', 'Failed to create folder')
        }
    }

    const saveToFolder = async (folderId: string) => {
        try {
            const currentCardData = cards[currentCard]
            const cardsJson = await AsyncStorage.getItem('flashcards')
            let allCards = cardsJson ? JSON.parse(cardsJson) : []

            // Check if card already exists in target folder
            const existingInFolder = allCards.find(
                (card: FlashCard) => card.word === currentCardData.to && card.folderId === folderId
            )

            if (existingInFolder) {
                Alert.alert('Warning', 'This card is already in the selected folder')
                setIsModalVisible(false)
                return
            }

            // Create a new card instance for the target folder
            const newCard: FlashCard = {
                id: Date.now().toString(),
                word: currentCardData.to,
                translation: currentCardData.from,
                fromLanguage: 'et',
                toLanguage: 'en',
                createdAt: new Date().toISOString(),
                folderId: folderId,
                image_url: currentCardData.image_url,
                audio_url: currentCardData.audio_url,
                description: currentCardData.description
            }

            // Add to target folder
            allCards.push(newCard)

            // Save changes
            await AsyncStorage.setItem('flashcards', JSON.stringify(allCards))
            setSavedCards(prev => ({ ...prev, [currentCardData.to]: true }))

            setIsModalVisible(false)
            Alert.alert('Success', 'Card saved to folder successfully!')
        } catch (error) {
            console.error('Error saving to folder:', error)
            Alert.alert('Error', 'Failed to save card to folder')
        }
    }

    const removeFromFolder = async () => {
        try {
            const currentCardData = cards[currentCard]
            const cardsJson = await AsyncStorage.getItem('flashcards')
            if (!cardsJson) return

            let allCards = JSON.parse(cardsJson)
            
            // Find the card
            const cardToRemove = allCards.find(
                (card: FlashCard) => card.word === currentCardData.to
            )
            
            if (!cardToRemove) return

            // Remove card from the list
            allCards = allCards.filter((card: FlashCard) => card.word !== currentCardData.to)
            
            // Save changes
            await AsyncStorage.setItem('flashcards', JSON.stringify(allCards))
            
            // Update saved cards state
            const newSavedCards = { ...savedCards }
            delete newSavedCards[currentCardData.to]
            setSavedCards(newSavedCards)

            Alert.alert('Success', 'Card removed from folder successfully!')
        } catch (error) {
            console.error('Error removing from folder:', error)
            Alert.alert('Error', 'Failed to remove card from folder')
        }
    }

    const toggleModal = () => {
        if (savedCards[cards[currentCard].to]) {
            removeFromFolder()
        } else {
            setIsModalVisible(!isModalVisible)
        }
    }

    const nextCard = () => {
        if (isAudioPlaying) return
        if (currentCard === data.length - 1) {
            onComplete()
            return
        }
        setDirection('forward')
        setCurrentCard(currentCard + 1)
    }

    const prevCard = () => {
        if (isAudioPlaying) return
        setDirection('back')
        setCurrentCard(currentCard - 1)
    }

    const getAnimation = (type: 'entering' | 'exiting') => {
        if (type === 'entering') {
            return direction === 'forward' ? SlideInRight : SlideInLeft
        }
        return direction === 'forward' ? SlideOutLeft : SlideOutRight
    }

    const renderModalContent = () => (
        <View>
            {isCreatingFolder ? (
                <View style={styles.createFolderContainer}>
                    <TextInput
                        style={styles.createFolderInput}
                        value={newFolderName}
                        onChangeText={setNewFolderName}
                        placeholder="Enter folder name"
                        placeholderTextColor={Colors.light.color}
                        autoCapitalize="none"
                        autoFocus
                    />
                    <View style={styles.createFolderButtons}>
                        <TouchableOpacity
                            style={[styles.createFolderButton, styles.cancelButton]}
                            onPress={() => {
                                setIsCreatingFolder(false)
                                setNewFolderName('')
                            }}
                        >
                            <Text style={styles.createFolderButtonText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.createFolderButton, styles.confirmButton]}
                            onPress={createNewFolder}
                        >
                            <Text style={styles.createFolderButtonText}>Create</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            ) : (
                <>
                    <TouchableOpacity
                        style={styles.createFolderButton}
                        onPress={() => setIsCreatingFolder(true)}
                    >
                        <Ionicons name="add-circle-outline" size={24} color={Colors.light.itemsColor} />
                        <Text style={styles.createFolderButtonText}>Create New Folder</Text>
                    </TouchableOpacity>

                    <FlatList
                        data={folders}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={styles.folderItem}
                                onPress={() => saveToFolder(item.id)}
                            >
                                <View style={styles.folderInfo}>
                                    <Ionicons name="folder-outline" size={24} color={Colors.light.itemsColor} />
                                    <Text style={styles.folderName}>{item.name}</Text>
                                </View>
                            </TouchableOpacity>
                        )}
                        ListEmptyComponent={
                            <Text style={styles.emptyText}>No folders yet</Text>
                        }
                    />
                </>
            )}
        </View>
    )

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Tap on card to see translation</Text>
            <Animated.View
                entering={getAnimation('entering')}
                exiting={getAnimation('exiting')}
                key={currentCard}
                style={styles.cardContainer}
            >
                <FlipCard
                    frontContent={{
                        imageUrl: cards[currentCard].image_url,
                        text: cards[currentCard].to,
                    }}
                    backContent={{
                        text: cards[currentCard].from,
                        description: cards[currentCard].description,
                    }}
                    width={width * 0.8}
                    height={height * 0.6}
                    onFlip={(flipped) => setIsCardFlipped(flipped)}
                />
            </Animated.View>
            <View style={styles.bottomContainer}>
                <View style={styles.controlsContainer}>
                    <SoundButton
                        audioUrl={cards[currentCard].audio_url}
                        onPlayingStateChange={setIsAudioPlaying}
                    />
                </View>
                
                {!isModalVisible && (
                    <>
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
                    </>
                )}
                <TouchableOpacity
                    style={styles.favoriteButton}
                    onPress={toggleModal}
                    disabled={isAudioPlaying}
                >
                    <Ionicons 
                        name={savedCards[cards[currentCard].to] ? "star" : "star-outline"}
                        size={28} 
                        color={savedCards[cards[currentCard].to] ? "#FFD700" : Colors.light.itemsColor}
                    />
                </TouchableOpacity>
            </View>

            <CustomModal
                isVisible={isModalVisible}
                onClose={toggleModal}
                title="Save to Folder"
                style={{ zIndex: 1000 }}
            >
                {renderModalContent()}
            </CustomModal>
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
    createFolderContainer: {
        marginBottom: 20,
    },
    createFolderInput: {
        backgroundColor: Colors.light.secondaryBackground,
        borderRadius: 10,
        padding: 15,
        color: Colors.light.text,
        marginBottom: 10,
    },
    createFolderButtons: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 10,
    },
    createFolderButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        backgroundColor: Colors.light.secondaryBackground,
    },
    cancelButton: {
        backgroundColor: Colors.light.secondaryBackground,
    },
    confirmButton: {
        backgroundColor: Colors.light.itemsColor,
    },
    createFolderButtonText: {
        color: Colors.light.text,
        marginLeft: 10,
        fontSize: 16,
    },
    folderItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        borderRadius: 10,
        backgroundColor: Colors.light.secondaryBackground,
        marginBottom: 10,
    },
    folderInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    folderName: {
        color: Colors.light.text,
        marginLeft: 10,
        fontSize: 16,
    },
    emptyText: {
        color: Colors.light.color,
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16,
    },
    cardContainer: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
})

export default CardsLesson
