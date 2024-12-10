import Colors from "@/constants/Colors";
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, TextInput, Alert, Modal, Dimensions } from 'react-native';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import CardsList from '../cardsList/CardsList';

interface Folder {
  id: string;
  name: string;
  cardCount: number;
}
interface CardsListProps {
  folderId: string;
  folderName: string;
  onBack: () => void;
  onUpdateFolder: (updatedFolder: Folder) => void; // Add this line
}
export default function FoldersTab() {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [selectedFolder, setSelectedFolder] = useState<Folder | null>(null);
  const [isGridView, setIsGridView] = useState(false);
  const [cards, setCards] = useState([]); // Add this line

  const loadFolders = async () => {
    try {
      const foldersData = await AsyncStorage.getItem('folders');
      if (foldersData) {
        setFolders(JSON.parse(foldersData));
      }
    } catch (error) {
      console.error('Error loading folders:', error);
    }
  };

  useEffect(() => {
    loadFolders();
  }, []);

  const addFolder = async () => {
    if (!newFolderName.trim()) {
      Alert.alert('Error', 'Please enter a folder name');
      return;
    }

    const newFolder = {
      id: Date.now().toString(),
      name: newFolderName.trim(),
      cardCount: 0,
    };

    try {
      const updatedFolders = [...folders, newFolder];
      await AsyncStorage.setItem('folders', JSON.stringify(updatedFolders));
      setFolders(updatedFolders);
      setModalVisible(false);
      setNewFolderName('');
    } catch (error) {
      console.error('Error saving folder:', error);
      Alert.alert('Error', 'Failed to create folder');
    }
  };

  const deleteFolder = async (folderId: string) => {
    Alert.alert(
      'Delete Folder',
      'Are you sure you want to delete this folder and all its cards?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const updatedFolders = folders.filter(folder => folder.id !== folderId);
              await AsyncStorage.setItem('folders', JSON.stringify(updatedFolders));
              setFolders(updatedFolders);
            } catch (error) {
              console.error('Error deleting folder:', error);
              Alert.alert('Error', 'Failed to delete folder');
            }
          },
        },
      ]
    );
  };

  const FolderItem = ({ item }: { item: Folder }) => {
    return (
      <View style={[
        styles.folderItem,
        isGridView && styles.gridFolderItem
      ]}>
        <TouchableOpacity
          style={[
            styles.folderContent,
            isGridView && styles.gridFolderContent
          ]}
          onPress={() => setSelectedFolder(item)}
        >
          <View style={[
            styles.folderInfo,
            isGridView && styles.gridFolderInfo
          ]}>
            <Ionicons 
              name="folder-open" 
              size={isGridView ? 40 : 30} 
              color={Colors.light.itemsColor} 
            />
            <View style={[
              styles.folderText,
              isGridView && styles.gridFolderText
            ]}>
              <Text style={[
                styles.folderName,
                isGridView && styles.gridFolderName
              ]}>{item.name}</Text>
              <Text style={styles.cardCount}>
                {item.cardCount} {item.cardCount === 1 ? 'card' : 'cards'}
              </Text>
            </View>
          </View>
          {!isGridView && (
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => deleteFolder(item.id)}
            >
              <Ionicons name="trash-outline" size={22} color="#FF6B6B" />
            </TouchableOpacity>
          )}
        </TouchableOpacity>
      </View>
    );
  };

  const handleBack = () => {
    setSelectedFolder(null);
  };

  const handleUpdateFolder = (updatedFolder: Folder) => {
    const updatedFolders = folders.map(f =>
      f.id === updatedFolder.id ? updatedFolder : f
    );
    setFolders(updatedFolders);
    setSelectedFolder(updatedFolder);
  };

  if (selectedFolder) {
    return (
      <CardsList
        folderId={selectedFolder.id}
        onBack={handleBack}
        onUpdateFolder={handleUpdateFolder}
        folderName={selectedFolder.name}
        cards={cards} // Pass the cards prop here
      />
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setModalVisible(true)}
        >
          <Ionicons name="add-circle-outline" size={24} color={Colors.light.itemsColor} />
          <Text style={styles.addButtonText}>New Collection</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.viewToggle}
          onPress={() => setIsGridView(!isGridView)}
        >
          <Ionicons 
            name={isGridView ? "list" : "grid"} 
            size={24} 
            color={Colors.light.itemsColor} 
          />
        </TouchableOpacity>
      </View>

      {folders.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="folder-open-outline" size={48} color={Colors.light.itemsColor} />
          <Text style={styles.emptyStateText}>No collections yet</Text>
          <Text style={styles.emptyStateSubtext}>
            Create your first collection to start saving cards
          </Text>
        </View>
      ) : (
        <ScrollView
          style={styles.folderList}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.folderListContent,
            isGridView && styles.gridContainer
          ]}
        >
          {folders.map((item) => (
            <View key={item.id} style={[
              isGridView ? styles.gridItem : styles.listItem,
            ]}>
              <FolderItem item={item} />
            </View>
          ))}
        </ScrollView>
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>New Collection</Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color={Colors.light.text} />
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.input}
              placeholder="Enter collection name"
              placeholderTextColor={Colors.light.color}
              value={newFolderName}
              onChangeText={setNewFolderName}
              autoFocus
            />
            <TouchableOpacity
              style={[
                styles.createButton,
                !newFolderName.trim() && styles.createButtonDisabled,
              ]}
              onPress={addFolder}
              disabled={!newFolderName.trim()}
            >
              <Text style={styles.createButtonText}>Create</Text>
            </TouchableOpacity>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  viewToggle: {
    padding: 8,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addButtonText: {
    color: Colors.light.itemsColor,
    marginLeft: 4,
    fontSize: 20,
    fontWeight: '600',
  },
  folderList: {
    flex: 1,
  },
  folderListContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  listItem: {
    width: '100%',
    marginBottom: 12,
  },
  gridItem: {
    width: '48%',
    marginBottom: 12,
  },
  folderItem: {
    backgroundColor: Colors.light.secondaryBackground,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  gridFolderItem: {
    height: 160,
  },
  folderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  gridFolderContent: {
    flexDirection: 'column',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  folderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  gridFolderInfo: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  folderText: {
    marginLeft: 12,
    flex: 1,
  },
  gridFolderText: {
    marginLeft: 0,
    marginTop: 12,
    alignItems: 'center',
  },
  folderName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 4,
  },
  gridFolderName: {
    textAlign: 'center',
  },
  cardCount: {
    fontSize: 14,
    color: Colors.light.itemsColor,
  },
  deleteButton: {
    padding: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyStateText: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.light.text,
    marginTop: 16,
    textAlign: 'center',
  },
  emptyStateSubtext: {
    fontSize: 16,
    color: Colors.light.itemsColor,
    textAlign: 'center',
    marginTop: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: Colors.light.background,
    borderRadius: 20,
    padding: 20,
    width: '90%',
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.light.text,
  },
  closeButton: {
    padding: 4,
  },
  input: {
    backgroundColor: Colors.light.secondaryBackground,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: Colors.light.text,
    marginBottom: 20,
  },
  createButton: {
    backgroundColor: Colors.light.itemsColor,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  createButtonDisabled: {
    opacity: 0.5,
  },
  createButtonText: {
    color: Colors.light.background,
    fontSize: 16,
    fontWeight: '600',
  },
});