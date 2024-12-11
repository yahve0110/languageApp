import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Alert, TextInput, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import FlipCard from '@/components/shared/FlipCard';

interface CardsListProps {
  folderId: string;
  folderName: string;
  onBack: () => void;
  onUpdateFolder: (updatedFolder: any) => void;
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

const standartCardImg = "https://firebasestorage.googleapis.com/v0/b/keelefy.appspot.com/o/lesson1%2Fquestion.png?alt=media&token=c938f0ca-0bc8-4654-a0b4-66a6bd746a67"

export default function CardsList({ folderId, folderName, onBack, onUpdateFolder, onTrainingModeChange, isTrainingMode }: CardsListProps) {
  const [cards, setCards] = useState<FlashCard[]>([]);
  const [editingCard, setEditingCard] = useState<string | null>(null);
  const [editedWord, setEditedWord] = useState('');
  const [editedTranslation, setEditedTranslation] = useState('');
  const [currentTrainingCard, setCurrentTrainingCard] = useState(0);
  const width = Dimensions.get('window').width;
  const height = Dimensions.get('window').height;

  useEffect(() => {
    loadCards();
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
              if (cardsJson) {
                const allCards: FlashCard[] = JSON.parse(cardsJson);
                const updatedCards = allCards.filter(card => card.id !== cardId);
                await AsyncStorage.setItem('flashcards', JSON.stringify(updatedCards));
                
                const folder = allCards.find(card => card.folderId === folderId);
                if (folder) {
                  onUpdateFolder({ ...folder, cardCount: folder.cardCount - 1 });
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
      setCurrentTrainingCard(currentTrainingCard + 1);
    }
  };

  const prevTrainingCard = () => {
    if (currentTrainingCard > 0) {
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
    try {
      const cardsJson = await AsyncStorage.getItem('flashcards');
      if (cardsJson) {
        const allCards: FlashCard[] = JSON.parse(cardsJson);
        const cardIndex = allCards.findIndex(c => c.id === card.id);
        
        if (cardIndex !== -1) {
          // Toggle the favorite status
          allCards[cardIndex].isFavorite = !allCards[cardIndex].isFavorite;
          
          // If card is now favorite, add it to Favorites folder
          if (allCards[cardIndex].isFavorite) {
            const favCard = { ...allCards[cardIndex] };
            favCard.folderId = 'favorites';
            allCards.push(favCard);
          } else {
            // Remove from favorites folder
            const favIndex = allCards.findIndex(c => c.id === card.id && c.folderId === 'favorites');
            if (favIndex !== -1) {
              allCards.splice(favIndex, 1);
            }
          }
          
          // Save updated cards
          await AsyncStorage.setItem('flashcards', JSON.stringify(allCards));
          
          // Update local state
          const updatedCards = allCards.filter(c => c.folderId === folderId);
          setCards(updatedCards);
          
          // Update folder card count if we're in favorites folder
          if (folderId === 'favorites') {
            onUpdateFolder({
              id: 'favorites',
              name: 'Favorites',
              cardCount: updatedCards.length
            });
          }
        }
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
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
                style={[styles.actionButton, styles.editButton]}
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

  if (isTrainingMode && cards.length > 0) {
    const isFavoritesFolder = folderId === 'favorites';
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={exitTrainingMode}>
            <Ionicons name="arrow-back" size={24} color={Colors.light.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Training Mode</Text>
          <View style={{ width: 24 }} />
        </View>
        
        <View style={styles.trainingContainer}>
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
          <TouchableOpacity
            style={styles.trainButton}
            onPress={() => startTrainingFromCard(0)}
          >
            <Text style={styles.emptyStateSubtext}>Play</Text>

            <Ionicons name="play-circle-outline" size={24} color={Colors.light.itemsColor} />
          </TouchableOpacity>
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
  trainButton: {
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
  actionButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: Colors.light.background,
  },
  editButton: {
    borderWidth: 1,
  },
  deleteButton: {
    borderWidth: 1,
  },
  saveButton: {
    borderWidth: 1,
    borderColor: '#E8F5E9',
  },
  cancelButton: {
    borderWidth: 1,
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
});