import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Alert, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import CardsLesson from '@/components/lessons/cardsLesson/cardsLesson';

interface CardsListProps {
  folderId: string;
  folderName: string;
  onBack: () => void;
  onUpdateFolder: (updatedFolder: any) => void;
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
}

export default function CardsList({ folderId, folderName, onBack, onUpdateFolder }: CardsListProps) {
  const [cards, setCards] = useState<FlashCard[]>([]);
  const [isTrainingMode, setIsTrainingMode] = useState(false);
  const [editingCard, setEditingCard] = useState<string | null>(null);
  const [editedWord, setEditedWord] = useState('');
  const [editedTranslation, setEditedTranslation] = useState('');

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
                
                // Call onUpdateFolder after deleting a card
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

  const renderCard = ({ item }: { item: FlashCard }) => {
    const isEditing = editingCard === item.id;

    return (
      <View style={styles.card}>
        <View style={styles.cardContent}>
          <View style={styles.cardRow}>
            {isEditing ? (
              <View style={styles.editContainer}>
                <TextInput
                  style={styles.input}
                  value={editedWord}
                  onChangeText={setEditedWord}
                  placeholder="Enter word"
                  placeholderTextColor={Colors.light.itemsColor}
                />
                <TextInput
                  style={styles.input}
                  value={editedTranslation}
                  onChangeText={setEditedTranslation}
                  placeholder="Enter translation"
                  placeholderTextColor={Colors.light.itemsColor}
                />
                <View style={styles.editActions}>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.saveButton]}
                    onPress={() => saveCardChanges(item.id)}
                  >
                    <Ionicons name="checkmark" size={22} color="#4CAF50" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.cancelButton]}
                    onPress={cancelEditing}
                  >
                    <Ionicons name="close" size={22} color="#FF6B6B" />
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View style={styles.cardRow}>
                <View style={styles.wordContainer}>
                  <Text style={styles.wordText}>{item.word}</Text>
                  <Text style={styles.translationText}>{item.translation}</Text>
                </View>
                <View style={styles.cardActions}>
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
                </View>
              </View>
            )}
          </View>
        </View>
      </View>
    );
  };

  if (isTrainingMode) {
    return (
      <CardsLesson
        cards={cards}
        onFinish={() => setIsTrainingMode(false)}
      />
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
            onPress={() => setIsTrainingMode(true)}
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
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.itemsColor,
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
    padding: 16,
  },
  card: {
    backgroundColor: Colors.light.secondaryBackground,
    borderRadius: 12,
    marginBottom: 12,
    padding: 12,
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
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
});