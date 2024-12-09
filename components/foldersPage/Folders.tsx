import Colors from "@/constants/Colors";
import { StyleSheet, Text, View, TouchableOpacity, FlatList, TextInput, Alert, Modal } from 'react-native';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
interface FlashCard {
    id: string;
    word: string;
    translation: string;
    fromLanguage: string;
    toLanguage: string;
    createdAt: string;
    isFavorite?: boolean;
    folderId?: string;
  }
  
  interface Folder {
    id: string;
    name: string;
    createdAt: string;
    cardCount: number;
  }
  
function FoldersTab() {
    const [folders, setFolders] = useState<Folder[]>([]);
    const [cards, setCards] = useState<FlashCard[]>([]);
    const [favorites, setFavorites] = useState<FlashCard[]>([]);
    const [isAddFolderModalVisible, setIsAddFolderModalVisible] = useState(false);
    const [newFolderName, setNewFolderName] = useState('');
    const [selectedFolder, setSelectedFolder] = useState<Folder | null>(null);
  
    useEffect(() => {
      loadData();
    }, []);
  
    const loadData = async () => {
      try {
        const foldersJson = await AsyncStorage.getItem('flashcard_folders');
        const loadedFolders: Folder[] = foldersJson ? JSON.parse(foldersJson) : [];
        setFolders(loadedFolders);
  
        const cardsJson = await AsyncStorage.getItem('flashcards');
        const loadedCards: FlashCard[] = cardsJson ? JSON.parse(cardsJson) : [];
        setCards(loadedCards);
  
        const favCards = loadedCards.filter(card => card.isFavorite);
        setFavorites(favCards);
      } catch (error) {
        console.error('Error loading data:', error);
        Alert.alert('Error', 'Failed to load flashcards');
      }
    };
  
    const addFolder = async () => {
      if (!newFolderName.trim()) {
        Alert.alert('Error', 'Please enter a folder name');
        return;
      }
  
      try {
        const newFolder: Folder = {
          id: Date.now().toString(),
          name: newFolderName.trim(),
          createdAt: new Date().toISOString(),
          cardCount: 0
        };
  
        const updatedFolders = [...folders, newFolder];
        await AsyncStorage.setItem('flashcard_folders', JSON.stringify(updatedFolders));
        setFolders(updatedFolders);
        setNewFolderName('');
        setIsAddFolderModalVisible(false);
      } catch (error) {
        console.error('Error adding folder:', error);
        Alert.alert('Error', 'Failed to create folder');
      }
    };
  
    const toggleFavorite = async (card: FlashCard) => {
      try {
        const updatedCards = cards.map(c => {
          if (c.id === card.id) {
            return { ...c, isFavorite: !c.isFavorite };
          }
          return c;
        });
  
        await AsyncStorage.setItem('flashcards', JSON.stringify(updatedCards));
        setCards(updatedCards);
        setFavorites(updatedCards.filter(c => c.isFavorite));
      } catch (error) {
        console.error('Error toggling favorite:', error);
        Alert.alert('Error', 'Failed to update favorite status');
      }
    };
  
    const moveCardToFolder = async (card: FlashCard, folderId: string) => {
      try {
        const updatedCards = cards.map(c => {
          if (c.id === card.id) {
            return { ...c, folderId };
          }
          return c;
        });
  
        await AsyncStorage.setItem('flashcards', JSON.stringify(updatedCards));
        setCards(updatedCards);
  
        const updatedFolders = folders.map(f => {
          if (f.id === folderId) {
            return { ...f, cardCount: updatedCards.filter(c => c.folderId === f.id).length };
          }
          return f;
        });
        await AsyncStorage.setItem('flashcard_folders', JSON.stringify(updatedFolders));
        setFolders(updatedFolders);
      } catch (error) {
        console.error('Error moving card:', error);
        Alert.alert('Error', 'Failed to move card to folder');
      }
    };
  
    const renderFolderItem = ({ item }: { item: Folder }) => (
      <TouchableOpacity
        style={styles.folderItem}
        onPress={() => setSelectedFolder(item)}
      >
        <Ionicons name="folder" size={24} color={Colors.light.text} />
        <View style={styles.folderInfo}>
          <Text style={styles.folderName}>{item.name}</Text>
          <Text style={styles.cardCount}>{item.cardCount} cards</Text>
        </View>
      </TouchableOpacity>
    );
  
    const renderCardItem = ({ item }: { item: FlashCard }) => (
      <View style={styles.cardItem}>
        <View style={styles.cardContent}>
          <Text style={styles.wordText}>{item.word}</Text>
          <Text style={styles.translationText}>{item.translation}</Text>
        </View>
        <View style={styles.cardActions}>
          <TouchableOpacity onPress={() => toggleFavorite(item)}>
            <Ionicons
              name={item.isFavorite ? "star" : "star-outline"}
              size={24}
              color={Colors.light.text}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => Alert.alert(
              'Move to Folder',
              'Select a folder',
              folders.map(folder => ({
                text: folder.name,
                onPress: () => moveCardToFolder(item, folder.id)
              }))
            )}
          >
            <Ionicons name="folder-outline" size={24} color={Colors.light.text} />
          </TouchableOpacity>
        </View>
      </View>
    );
  
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Flashcards</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setIsAddFolderModalVisible(true)}
          >
            <Ionicons name="add" size={24} color={Colors.light.text} />
          </TouchableOpacity>
        </View>
  
        <View style={styles.favoritesSection}>
          <TouchableOpacity
            style={styles.favoritesHeader}
            onPress={() => setSelectedFolder(null)}
          >
            <Ionicons name="star" size={24} color={Colors.light.text} />
            <Text style={styles.sectionTitle}>Favorites ({favorites.length})</Text>
          </TouchableOpacity>
        </View>
  
        <View style={styles.foldersSection}>
          <Text style={styles.sectionTitle}>Folders</Text>
          <FlatList
            data={folders}
            renderItem={renderFolderItem}
            keyExtractor={item => item.id}
            horizontal={false}
            showsVerticalScrollIndicator={false}
          />
        </View>
  
        {selectedFolder && (
          <View style={styles.selectedFolderContent}>
            <View style={styles.folderHeader}>
              <TouchableOpacity onPress={() => setSelectedFolder(null)}>
                <Ionicons name="arrow-back" size={24} color={Colors.light.text} />
              </TouchableOpacity>
              <Text style={styles.folderTitle}>{selectedFolder.name}</Text>
            </View>
            <FlatList
              data={cards.filter(card => card.folderId === selectedFolder.id)}
              renderItem={renderCardItem}
              keyExtractor={item => item.id}
              showsVerticalScrollIndicator={false}
            />
          </View>
        )}
  
        <Modal
          visible={isAddFolderModalVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setIsAddFolderModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>New Folder</Text>
              <TextInput
                style={styles.input}
                value={newFolderName}
                onChangeText={setNewFolderName}
                placeholder="Enter folder name"
                placeholderTextColor={Colors.light.tabIconDefault}
              />
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setIsAddFolderModalVisible(false)}
                >
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.createButton]}
                  onPress={addFolder}
                >
                  <Text style={styles.buttonText}>Create</Text>
                </TouchableOpacity>
              </View>
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
      padding: 20,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: Colors.light.text,
    },
    addButton: {
      padding: 8,
    },
    favoritesSection: {
      marginBottom: 20,
    },
    favoritesHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 10,
      backgroundColor: Colors.light.itemsColor + '20',
      borderRadius: 8,
    },
    foldersSection: {
      flex: 1,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: Colors.light.text,
      marginLeft: 10,
    },
    folderItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 15,
      backgroundColor: Colors.light.background,
      borderRadius: 8,
      marginVertical: 5,
      borderWidth: 1,
      borderColor: Colors.light.itemsColor + '40',
    },
    folderInfo: {
      marginLeft: 10,
    },
    folderName: {
      fontSize: 16,
      color: Colors.light.text,
    },
    cardCount: {
      fontSize: 12,
      color: Colors.light.tabIconDefault,
    },
    selectedFolderContent: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: Colors.light.background,
      padding: 20,
      zIndex: 1,
    },
    folderHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 20,
    },
    folderTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: Colors.light.text,
      marginLeft: 15,
    },
    cardItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 15,
      backgroundColor: Colors.light.background,
      borderRadius: 8,
      marginVertical: 5,
      borderWidth: 1,
      borderColor: Colors.light.itemsColor + '40',
    },
    cardContent: {
      flex: 1,
    },
    wordText: {
      fontSize: 16,
      color: Colors.light.text,
      fontWeight: '600',
    },
    translationText: {
      fontSize: 14,
      color: Colors.light.tabIconDefault,
      marginTop: 4,
    },
    cardActions: {
      flexDirection: 'row',
      gap: 15,
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
      width: '80%',
      backgroundColor: Colors.light.background,
      borderRadius: 12,
      padding: 20,
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: Colors.light.text,
      marginBottom: 15,
    },
    input: {
      borderWidth: 1,
      borderColor: Colors.light.itemsColor + '40',
      borderRadius: 8,
      padding: 12,
      marginBottom: 20,
      color: Colors.light.text,
    },
    modalButtons: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      gap: 10,
    },
    modalButton: {
      paddingVertical: 8,
      paddingHorizontal: 15,
      borderRadius: 6,
      minWidth: 80,
      alignItems: 'center',
    },
    cancelButton: {
      backgroundColor: Colors.light.tabIconDefault + '40',
    },
    createButton: {
      backgroundColor: Colors.light.itemsColor,
    },
    buttonText: {
      color: Colors.light.background,
      fontSize: 16,
      fontWeight: '500',
    },
  });

  export default FoldersTab;