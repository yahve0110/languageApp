import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Alert, TextInput, Dimensions, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import FlipCard from '@/components/shared/FlipCard';
import Animated, { 
    SlideInRight, 
    SlideOutLeft, 
    SlideInLeft, 
    SlideOutRight,
    ZoomIn,
    ZoomOut,
    FadeIn,
    FadeOut,
    FlipInEasyX,
    FlipOutEasyX
} from 'react-native-reanimated';

interface CardsListProps {
  folderId: string;
  folderName: string;
  onBack: () => void;
  onUpdateFolder: (updatedFolder: Folder) => void;
  onTrainingModeChange: (isTraining: boolean) => void;
  isTrainingMode: boolean;
}

interface FlashCard {
  cardCount: number;
  id: string;
  word: string;
  translation: string;
  fromLanguage: string;
  toLanguage: string;
  createdAt: string;
  folderId?: string;
  isFavorite?: boolean;
  image_url?: string;
  description?: string;
}

interface Folder {
  id: string;
  name: string;
  createdAt: string;
}

const standartCardImg = "https://firebasestorage.googleapis.com/v0/b/keelefy.appspot.com/o/lesson1%2Fquestion.png?alt=media&token=c938f0ca-0bc8-4654-a0b4-66a6bd746a67"

export default function CardsList({ folderId, folderName, onBack, onUpdateFolder, onTrainingModeChange, isTrainingMode }: CardsListProps) {
  const [cards, setCards] = useState<FlashCard[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [editingCard, setEditingCard] = useState<string | null>(null);
  const [editedWord, setEditedWord] = useState('');
  const [editedTranslation, setEditedTranslation] = useState('');
  const [currentTrainingCard, setCurrentTrainingCard] = useState(0);
  const [direction, setDirection] = useState<'forward' | 'back'>('forward');
  const [animationType, setAnimationType] = useState<'slide' | 'zoom' | 'flip' | 'fade'>('slide');
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [isSelectFolderModalVisible, setIsSelectFolderModalVisible] = useState(false);
  const [selectedCard, setSelectedCard] = useState<FlashCard | null>(null);
  const [newFolderName, setNewFolderName] = useState('');
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const width = Dimensions.get('window').width;
  const height = Dimensions.get('window').height;

  useEffect(() => {
    loadCards();
    loadFolders();
  }, []);

  const loadCards = async () => {
    try {
      const cardsJson = await AsyncStorage.getItem('flashcards');
      if (cardsJson) {
        const allCards: FlashCard[] = JSON.parse(cardsJson);
        const folderCards = allCards.filter(card => card.folderId === folderId);
        setCards(folderCards);
      }
    } catch (error) {
      console.error('Error loading cards:', error);
    }
  };

  const loadFolders = async () => {
    try {
      const foldersJson = await AsyncStorage.getItem('folders');
      if (foldersJson) {
        setFolders(JSON.parse(foldersJson));
      }
    } catch (error) {
      console.error('Error loading folders:', error);
    }
  };

  const deleteCard = async (cardId: string) => {
    Alert.alert(
      'Delete Card',
      'Are you sure you want to delete this card?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const cardsJson = await AsyncStorage.getItem('flashcards');
              const foldersJson = await AsyncStorage.getItem('folders');
              
              if (cardsJson && foldersJson) {
                const allCards: FlashCard[] = JSON.parse(cardsJson);
                const allFolders: Folder[] = JSON.parse(foldersJson);
                
                // Remove the card
                const updatedCards = allCards.filter(card => card.id !== cardId);
                await AsyncStorage.setItem('flashcards', JSON.stringify(updatedCards));
                
                // Update folder count
                const currentFolder = allFolders.find(folder => folder.id === folderId);
                if (currentFolder) {
                  const updatedFolder = { ...currentFolder };
                  const updatedFolders = allFolders.map(folder => 
                    folder.id === folderId ? updatedFolder : folder
                  );
                  await AsyncStorage.setItem('folders', JSON.stringify(updatedFolders));
                  onUpdateFolder(updatedFolder);
                }
                
                setCards(cards.filter(card => card.id !== cardId));
              }
            } catch (error) {
              console.error('Error deleting card:', error);
              Alert.alert('Error', 'Failed to delete card');
            }
          }
        }
      ]
    );
  };

  const startEditing = (card: FlashCard) => {
    setEditingCard(card.id);
    setEditedWord(card.word);
    setEditedTranslation(card.translation);
  };

  const cancelEditing = () => {
    setEditingCard(null);
    setEditedWord('');
    setEditedTranslation('');
  };

  const saveCardChanges = async (cardId: string) => {
    if (!editedWord.trim() || !editedTranslation.trim()) {
      Alert.alert('Error', 'Word and translation cannot be empty');
      return;
    }

    try {
      const cardsJson = await AsyncStorage.getItem('flashcards');
      if (cardsJson) {
        const allCards: FlashCard[] = JSON.parse(cardsJson);
        const updatedCards = allCards.map(card => 
          card.id === cardId 
            ? { ...card, word: editedWord.trim(), translation: editedTranslation.trim() }
            : card
        );
        await AsyncStorage.setItem('flashcards', JSON.stringify(updatedCards));
        setCards(cards.map(card => 
          card.id === cardId 
            ? { ...card, word: editedWord.trim(), translation: editedTranslation.trim() }
            : card
        ));
        setEditingCard(null);
      }
    } catch (error) {
      console.error('Error updating card:', error);
      Alert.alert('Error', 'Failed to update card');
    }
  };

  const nextTrainingCard = () => {
    if (currentTrainingCard < cards.length - 1) {
      setDirection('forward');
      setCurrentTrainingCard(currentTrainingCard + 1);
    }
  };

  const prevTrainingCard = () => {
    if (currentTrainingCard > 0) {
      setDirection('back');
      setCurrentTrainingCard(currentTrainingCard - 1);
    }
  };

  const startTrainingFromCard = (index: number) => {
    setCurrentTrainingCard(index);
    onTrainingModeChange(true);
  };

  const exitTrainingMode = () => {
    setCurrentTrainingCard(0);
    onTrainingModeChange(false);
  };

  const toggleFavorite = async (card: FlashCard) => {
    setSelectedCard(card);
    setIsSelectFolderModalVisible(true);
  };

  const saveToFolder = async (targetFolderId: string) => {
    try {
      if (!selectedCard) return;

      const cardsJson = await AsyncStorage.getItem('flashcards');
      const foldersJson = await AsyncStorage.getItem('folders');
      
      if (cardsJson && foldersJson) {
        const allCards: FlashCard[] = JSON.parse(cardsJson);
        const allFolders: Folder[] = JSON.parse(foldersJson);
        
        // Update card's folder
        const updatedCards = allCards.map(card => 
          card.id === selectedCard.id 
            ? { ...card, folderId: targetFolderId }
            : card
        );
        
        // Update old folder count (decrease)
        if (selectedCard.folderId) {
          const oldFolder = allFolders.find(f => f.id === selectedCard.folderId);
          if (oldFolder) {
            allFolders.forEach(folder => {
            
            });
          }
        }
        
        // Update new folder count (increase)
        const newFolder = allFolders.find(f => f.id === targetFolderId);
        if (newFolder) {
          allFolders.forEach(folder => {
          
          });
        }
        
        await AsyncStorage.setItem('flashcards', JSON.stringify(updatedCards));
        await AsyncStorage.setItem('folders', JSON.stringify(allFolders));
        
        // Update UI
        setCards(updatedCards.filter(card => card.folderId === folderId));
        setFolders(allFolders);
        
        // Update parent component
        const currentFolder = allFolders.find(f => f.id === folderId);
        if (currentFolder) {
          onUpdateFolder(currentFolder);
        }
        
        setIsSelectFolderModalVisible(false);
        Alert.alert('Success', 'Card saved to folder successfully!');
      }
    } catch (error) {
      console.error('Error saving to folder:', error);
      Alert.alert('Error', 'Failed to save card to folder');
    }
  };

  const createNewFolder = async () => {
    if (!newFolderName.trim()) {
      Alert.alert('Error', 'Please enter a folder name');
      return;
    }

    try {
      const newFolder: Folder = {
        id: Date.now().toString(),
        name: newFolderName.trim(),
        createdAt: new Date().toISOString(),
       
      };

      const updatedFolders = [...folders, newFolder];
      await AsyncStorage.setItem('folders', JSON.stringify(updatedFolders));
      setFolders(updatedFolders);
      setNewFolderName('');
      setIsCreatingFolder(false);
    } catch (error) {
      console.error('Error creating folder:', error);
      Alert.alert('Error', 'Failed to create folder');
    }
  };

  const renderCard = ({ item, index }: { item: FlashCard; index: number }) => {
    const isEditing = editingCard === item.id;
    const isFavoritesFolder = folderId === 'favorites';

    if (isEditing) {
      return (
        <View style={styles.card}>
          <View style={styles.editContainer}>
            <TextInput
              style={styles.input}
              value={editedWord}
              onChangeText={setEditedWord}
              placeholder="Word"
              placeholderTextColor={Colors.light.itemsColor}
            />
            <TextInput
              style={styles.input}
              value={editedTranslation}
              onChangeText={setEditedTranslation}
              placeholder="Translation"
              placeholderTextColor={Colors.light.itemsColor}
            />
            <View style={styles.editActions}>
              <TouchableOpacity
                style={[styles.actionButton, styles.saveButton]}
                onPress={() => saveCardChanges(item.id)}
              >
                <Ionicons name="checkmark" size={22} color={Colors.light.green} />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.cancelButton]}
                onPress={cancelEditing}
              >
                <Ionicons name="close" size={22} color="#FF6B6B" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.card}>
        <View style={styles.cardContent}>
          <View style={styles.cardRow}>
            <View style={styles.wordContainer}>
              <Text style={styles.wordText}>{item.word}</Text>
              <Text style={styles.translationText}>{item.translation}</Text>
            </View>
            <View style={styles.cardActions}>
              <TouchableOpacity
                style={[styles.actionButton, styles.playButton]}
                onPress={() => startTrainingFromCard(index)}
              >
                <Ionicons name="play-circle" size={22} color={Colors.light.itemsColor} />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton]}
                onPress={() => startEditing(item)}
              >
                <Ionicons name="pencil" size={22} color={Colors.light.itemsColor} />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.deleteButton]}
                onPress={() => deleteCard(item.id)}
              >
                <Ionicons name="trash" size={22} color="#FF6B6B" />
              </TouchableOpacity>
              {isFavoritesFolder && (
                <TouchableOpacity
                  style={[styles.actionButton, styles.favoriteButton]}
                  onPress={() => toggleFavorite(item)}
                >
                  <Ionicons 
                    name={item.isFavorite ? "star" : "star-outline"} 
                    size={22} 
                    color={item.isFavorite ? "#FFD700" : Colors.light.itemsColor} 
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </View>
    );
  };

  const shuffleCards = () => {
    const shuffledCards = [...cards].sort(() => Math.random() - 0.5);
    setCards(shuffledCards);
  };

  const getAnimation = (type: 'entering' | 'exiting') => {
    switch (animationType) {
      case 'slide':
        return type === 'entering' 
          ? (direction === 'forward' ? SlideInRight : SlideInLeft).duration(300)
          : (direction === 'forward' ? SlideOutLeft : SlideOutRight).duration(300);
      case 'zoom':
        return type === 'entering' 
          ? ZoomIn.duration(300)
          : ZoomOut.duration(300);
      case 'flip':
        return type === 'entering'
          ? FlipInEasyX.duration(300)
          : FlipOutEasyX.duration(300);
      case 'fade':
        return type === 'entering'
          ? FadeIn.duration(300)
          : FadeOut.duration(300);
      default:
        return type === 'entering' ? FadeIn : FadeOut;
    }
  };

  const changeAnimation = () => {
    const types: ('slide' | 'zoom' | 'flip' | 'fade')[] = ['slide', 'zoom', 'flip', 'fade'];
    const currentIndex = types.indexOf(animationType);
    setAnimationType(types[(currentIndex + 1) % types.length]);
  };

  if (isTrainingMode && cards.length > 0) {
    const isFavoritesFolder = folderId === 'favorites';
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={exitTrainingMode}>
            <Ionicons name="arrow-back" size={24} color={Colors.light.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Training Mode</Text>
          <View style={styles.headerButtons}>
          
            <TouchableOpacity style={styles.headerButton} onPress={shuffleCards}>
              <Ionicons name="shuffle" size={24} color={Colors.light.text} />
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.trainingContainer}>
          <Animated.View 
            entering={getAnimation('entering')}
            exiting={getAnimation('exiting')}
            key={currentTrainingCard}
          >
            <FlipCard
              frontContent={{
                imageUrl: cards[currentTrainingCard].image_url || standartCardImg,
                text: cards[currentTrainingCard].word,
              }}
              backContent={{
                text: cards[currentTrainingCard].translation,
                description: cards[currentTrainingCard].description,
              }}
              width={width * 0.7}
              height={height * 0.6}
            />
          </Animated.View>
          
          <View style={styles.navigationContainer}>
            <View style={styles.navigationButton}>
              {currentTrainingCard > 0 && (
                <TouchableOpacity
                  style={styles.navigationButtonInner}
                  onPress={prevTrainingCard}
                >
                  <Ionicons name="arrow-back-circle" size={32} color={Colors.light.itemsColor} />
                  <Text style={styles.navigationText}>Prev</Text>
                </TouchableOpacity>
              )}
            </View>
            
            <View style={styles.progressText}>
              <Text style={styles.cardCount}>
                {currentTrainingCard + 1} / {cards.length}
              </Text>
            </View>

            <View style={styles.navigationRight}>
              <View style={styles.navigationButton}>
                {currentTrainingCard < cards.length - 1 ? (
                  <TouchableOpacity
                    style={styles.navigationButtonInner}
                    onPress={nextTrainingCard}
                  >
                    <Text style={styles.navigationText}>Next</Text>
                    <Ionicons name="arrow-forward-circle" size={32} color={Colors.light.itemsColor} />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={styles.navigationButtonInner}
                    onPress={exitTrainingMode}
                  >
                    <Text style={styles.navigationText}>Finish</Text>
                    <Ionicons name="checkmark-circle" size={32} color={Colors.light.green} />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.light.text} />
        </TouchableOpacity>
        <Text style={styles.title}>{folderName}</Text>
        {cards.length > 0 && (
          <View style={styles.headerButtons}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={shuffleCards}
            >
              <Ionicons name="shuffle" size={24} color={Colors.light.itemsColor} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => startTrainingFromCard(0)}
            >
              <Ionicons name="play-circle-outline" size={24} color={Colors.light.itemsColor} />
            </TouchableOpacity>
          </View>
        )}
      </View>
      
      {cards.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No cards in this folder yet</Text>
          <Text style={styles.emptyStateSubtext}>Add cards from the translator to start learning</Text>
        </View>
      ) : (
        <FlatList
          data={cards}
          renderItem={renderCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
        />
      )}
      <Modal
        visible={isSelectFolderModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsSelectFolderModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Save to Folder</Text>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setIsSelectFolderModalVisible(false)}
              >
                <Ionicons name="close" size={24} color={Colors.light.text} />
              </TouchableOpacity>
            </View>

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
                      setIsCreatingFolder(false);
                      setNewFolderName('');
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
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.itemsColor,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text,
  },
  backButton: {
    marginRight: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.light.text,
    flex: 1,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionButton: {
    padding: 8,
  },
  listContainer: {
    paddingVertical: 16,
    
  },
  card: {
    backgroundColor: Colors.light.secondaryBackground,
    borderRadius: 12,
    marginBottom: 12,
    padding: 12,
    width: "90%",
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
  },
  cardContent: {
    padding: 0,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  wordContainer: {
    flex: 1,
    marginRight: 12,
  },
  wordText: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.light.text,
    marginBottom: 4,
  },
  translationText: {
    fontSize: 14,
    color: Colors.light.itemsColor,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  editContainer: {
    gap: 12,
  },
  input: {
    fontSize: 16,
    color: Colors.light.text,
    borderWidth: 1,
    borderColor: Colors.light.itemsColor,
    borderRadius: 8,
    padding: 8,
    backgroundColor: Colors.light.background,
  },
  editActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
    gap: 8,
  },

  deleteButton: {
   
  },
  saveButton: {
   
    borderColor: '#E8F5E9',
  },
  cancelButton: {
 
    borderColor: '#FFE5E5',
  },
  playButton: {
    marginRight: 8,
  },
  favoriteButton: {
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 16,
    color: Colors.light.itemsColor,
    textAlign: 'center',
  },
  trainingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  navigationButton: {
    width: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navigationRight: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 15,
  },
  navigationButtonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  navigationText: {
    color: Colors.light.itemsColor,
    fontSize: 16,
    marginHorizontal: 8,
  },
  progressText: {
    alignItems: 'center',
    width: 80,
  },
  cardCount: {
    color: Colors.light.text,
    fontSize: 16,
    fontWeight: '500',
  },
  headerButton: {
    padding: 4,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.light.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.light.text,
  },
  modalCloseButton: {
    padding: 5,
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
  },
  createFolderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },

  confirmButton: {
    backgroundColor: Colors.light.itemsColor,
  },
  createFolderButtonText: {
    color: Colors.light.text,
    marginLeft: 10,
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
  },
});