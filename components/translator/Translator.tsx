import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ActivityIndicator, Alert, Modal, FlatList, ScrollView } from 'react-native';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface TranslationResult {
  word: string;
  translation: string;
  sourceLanguage: string;
  targetLanguage: string;
}

interface Language {
  code: string;
  name: string;
}

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

const Translator = () => {
  const [word, setWord] = useState('');
  const [translation, setTranslation] = useState<TranslationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isReversed, setIsReversed] = useState(false);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [isAddFolderModalVisible, setIsAddFolderModalVisible] = useState(false);
  const [isSelectFolderModalVisible, setIsSelectFolderModalVisible] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const OPENAI_API_KEY = 'sk-NuaTm51prqNsgZO3q7n51QHCfD1rknvfP5bx_xXY-lT3BlbkFJ2iA-kJkV8GwS1uaG5s4c46d4AgzmE89SihlF2lr5QA';

  const languages: { [key: string]: Language } = {
    et: { code: 'et', name: 'Estonian' },
    en: { code: 'en', name: 'English' }
  };

  useEffect(() => {
    loadFolders();
  }, []);

  const loadFolders = async () => {
    try {
      const foldersJson = await AsyncStorage.getItem('flashcard_folders');
      const loadedFolders: Folder[] = foldersJson ? JSON.parse(foldersJson) : [];
      setFolders(loadedFolders);
    } catch (error) {
      console.error('Error loading folders:', error);
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

  const addToFlashcards = async (folderId?: string) => {
    if (!translation) return;

    try {
      const existingCardsJson = await AsyncStorage.getItem('flashcards');
      const existingCards: FlashCard[] = existingCardsJson ? JSON.parse(existingCardsJson) : [];

      const cardExists = existingCards.some(
        card => card.word === translation.word && 
               card.translation === translation.translation &&
               card.fromLanguage === translation.sourceLanguage &&
               card.toLanguage === translation.targetLanguage
      );

      if (cardExists) {
        Alert.alert('Already exists', 'This word is already in your flashcards.');
        return;
      }

      const newCard: FlashCard = {
        id: Date.now().toString(),
        word: translation.word,
        translation: translation.translation,
        fromLanguage: translation.sourceLanguage,
        toLanguage: translation.targetLanguage,
        createdAt: new Date().toISOString(),
        folderId,
        isFavorite: false
      };

      const updatedCards = [...existingCards, newCard];
      await AsyncStorage.setItem('flashcards', JSON.stringify(updatedCards));

      if (folderId) {
        const updatedFolders = folders.map(f => {
          if (f.id === folderId) {
            return { ...f, cardCount: f.cardCount + 1 };
          }
          return f;
        });
        await AsyncStorage.setItem('flashcard_folders', JSON.stringify(updatedFolders));
        setFolders(updatedFolders);
      }

      Alert.alert('Success', 'Word added to flashcards!');
      setIsSelectFolderModalVisible(false);
    } catch (err) {
      console.error('Error saving flashcard:', err);
      Alert.alert('Error', 'Failed to save to flashcards');
    }
  };

  const getSourceLanguage = () => isReversed ? languages.en : languages.et;
  const getTargetLanguage = () => isReversed ? languages.et : languages.en;

  const toggleLanguages = () => {
    setIsReversed(!isReversed);
    setWord('');
    setTranslation(null);
    setError('');
  };

  const validateWord = (text: string): boolean => {
    if (text.includes(' ')) {
      setError('Please enter only one word');
      return false;
    }
    
    const validWordRegex = /^[a-zA-ZäöüõÄÖÜÕ-]+$/;
    if (!validWordRegex.test(text)) {
      setError('Please enter a valid word (letters only)');
      return false;
    }

    return true;
  };

  const translateWord = async () => {
    if (!word.trim()) {
      setError('Please enter a word');
      return;
    }

    if (!validateWord(word)) return;

    setLoading(true);
    setError('');
    setTranslation(null);

    const sourceLang = getSourceLanguage();
    const targetLang = getTargetLanguage();

    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: `You are a translator. Respond only with the ${targetLang.name} translation of the ${sourceLang.name} word. The response should be exactly one word, no explanations or additional text.`
            },
            {
              role: "user",
              content: `Translate this ${sourceLang.name} word to ${targetLang.name}: ${word}`
            }
          ],
          temperature: 0.3,
          max_tokens: 50
        },
        {
          headers: {
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const translatedText = response.data.choices[0].message.content.trim();
      
      // Validate that the response is a single word
      if (!validateWord(translatedText)) {
        setError('Invalid translation received. Please try again.');
        return;
      }

      setTranslation({
        word: word,
        translation: translatedText,
        sourceLanguage: sourceLang.code,
        targetLanguage: targetLang.code
      });
    } catch (err) {
      console.error('Translation error:', err);
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error?.message || 'Translation failed');
    }
  } finally {
    setLoading(false);
    }
  };

  const renderTranslation = () => {
    if (!translation) return null;

    return (
      <ScrollView style={styles.translationContainer}>
        <View style={styles.wordContainer}>
          <View style={styles.wordHeader}>
            <Text style={styles.wordText}>{translation.word}</Text>
            <Text style={styles.langText}>{translation.sourceLanguage}</Text>
          </View>
          <View style={styles.meaningContainer}>
            <View style={styles.definitionContainer}>
              <Text style={styles.definitionText}>{translation.translation}</Text>
              <Text style={styles.defLangText}>{translation.targetLanguage}</Text>
            </View>
          </View>
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.actionButton, styles.favoriteButton]}
              onPress={() => addToFlashcards(undefined)}
            >
              <Ionicons name="star-outline" size={24} color={Colors.light.text} />
              <Text style={styles.buttonText}>Add to Favorites</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.folderButton]}
              onPress={() => setIsSelectFolderModalVisible(true)}
            >
              <Ionicons name="folder-outline" size={24} color={Colors.light.text} />
              <Text style={styles.buttonText}>Add to Folder</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    );
  };

  const renderFolderItem = ({ item }: { item: Folder }) => (
    <TouchableOpacity
      style={styles.folderItem}
      onPress={() => addToFlashcards(item.id)}
    >
      <Ionicons name="folder" size={24} color={Colors.light.text} />
      <View style={styles.folderInfo}>
        <Text style={styles.folderName}>{item.name}</Text>
        <Text style={styles.cardCount}>{item.cardCount} cards</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.languageSelector}>
        <Text style={styles.languageText}>{getSourceLanguage().name}</Text>
        <TouchableOpacity onPress={toggleLanguages} style={styles.switchButton}>
          <Ionicons name="swap-horizontal" size={24} color={Colors.light.text} />
        </TouchableOpacity>
        <Text style={styles.languageText}>{getTargetLanguage().name}</Text>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={word}
          onChangeText={setWord}
          placeholder={`Enter ${getSourceLanguage().name} word`}
          placeholderTextColor={Colors.light.tabIconDefault}
        />
        <TouchableOpacity
          style={styles.translateButton}
          onPress={translateWord}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={Colors.light.background} />
          ) : (
            <Text style={styles.translateButtonText}>Translate</Text>
          )}
        </TouchableOpacity>
      </View>

      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        renderTranslation()
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
              <Text style={styles.modalTitle}>Select Folder</Text>
              <TouchableOpacity
                style={styles.addFolderButton}
                onPress={() => {
                  setIsSelectFolderModalVisible(false);
                  setIsAddFolderModalVisible(true);
                }}
              >
                <Ionicons name="add" size={24} color={Colors.light.text} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={folders}
              renderItem={renderFolderItem}
              keyExtractor={item => item.id}
              showsVerticalScrollIndicator={false}
            />
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setIsSelectFolderModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

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
                style={[styles.modalButton, styles.cancelModalButton]}
                onPress={() => setIsAddFolderModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.createModalButton]}
                onPress={addFolder}
              >
                <Text style={styles.modalButtonText}>Create</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
    padding: 20,
  },
  languageSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  languageText: {
    fontSize: 16,
    color: Colors.light.text,
  },
  switchButton: {
    padding: 10,
    backgroundColor: Colors.light.itemsColor,
    borderRadius: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    height: 50,
    borderColor: Colors.light.tabIconDefault,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    color: Colors.light.text,
  },
  translateButton: {
    marginLeft: 10,
    backgroundColor: Colors.light.itemsColor,
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 8,
  },
  translateButtonText: {
    color: Colors.light.background,
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  translationContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: Colors.light.itemsColor,
    borderRadius: 8,
  },
  wordContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: Colors.light.tabIconDefault,
  },
  wordHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  wordText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginRight: 8,
  },
  langText: {
    fontSize: 14,
    color: Colors.light.tabIconDefault,
    fontStyle: 'italic',
  },
  meaningContainer: {
    marginLeft: 10,
    borderLeftWidth: 2,
    borderLeftColor: Colors.light.itemsColor,
    paddingLeft: 10,
  },
  definitionContainer: {
    marginBottom: 8,
  },
  definitionText: {
    fontSize: 16,
    color: Colors.light.text,
    marginBottom: 4,
  },
  defLangText: {
    fontSize: 12,
    color: Colors.light.tabIconDefault,
    fontStyle: 'italic',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    gap: 10,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  favoriteButton: {
    borderColor: Colors.light.itemsColor,
    backgroundColor: Colors.light.background,
  },
  folderButton: {
    backgroundColor: Colors.light.itemsColor,
  },
  buttonText: {
    marginLeft: 8,
    fontSize: 16,
    color: Colors.light.text,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: Colors.light.background,
    borderRadius: 12,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.light.text,
  },
  addFolderButton: {
    padding: 8,
  },
  folderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
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
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
    gap: 10,
  },
  modalButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 6,
    minWidth: 80,
    alignItems: 'center',
  },
  cancelModalButton: {
    backgroundColor: Colors.light.tabIconDefault + '40',
  },
  createModalButton: {
    backgroundColor: Colors.light.itemsColor,
  },
  modalButtonText: {
    color: Colors.light.background,
    fontSize: 16,
    fontWeight: '500',
  },
  cancelButton: {
    marginTop: 15,
    padding: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: Colors.light.text,
    fontSize: 16,
  },
});

export default Translator;