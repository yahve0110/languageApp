import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    Modal,
    FlatList,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Keyboard,
} from 'react-native';
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
    const [isSelectFolderModalVisible, setIsSelectFolderModalVisible] = useState(false);
    const OPENAI_API_KEY = 'sk-NuaTm51prqNsgZO3q7n51QHCfD1rknvfP5bx_xXY-lT3BlbkFJ2iA-kJkV8GwS1uaG5s4c46d4AgzmE89SihlF2lr5QA';

    const languages: { [key: string]: Language } = {
        et: { code: 'et', name: 'Estonian' },
        ru: { code: 'en', name: 'English' },
    };

    useEffect(() => {
        loadFolders();
    }, []);

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

    const clearTranslation = () => {
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
        if (!word.trim() || loading) return;
        
        Keyboard.dismiss();
        setError('');
        setLoading(true);
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

    const getSourceLanguage = () => {
        return isReversed ? languages.ru : languages.et;
    };

    const getTargetLanguage = () => {
        return isReversed ? languages.et : languages.ru;
    };

    const saveToFolder = async (folderId: string) => {
        try {
            if (!translation) return;

            const newCard: FlashCard = {
                id: Date.now().toString(),
                word: translation.word,
                translation: translation.translation,
                fromLanguage: translation.sourceLanguage,
                toLanguage: translation.targetLanguage,
                createdAt: new Date().toISOString(),
                folderId: folderId
            };

            // Get existing cards
            const cardsData = await AsyncStorage.getItem('flashcards');
            const cards: FlashCard[] = cardsData ? JSON.parse(cardsData) : [];
            
            // Add new card
            const updatedCards = [...cards, newCard];
            await AsyncStorage.setItem('flashcards', JSON.stringify(updatedCards));

            // Update folder card count
            const updatedFolders = folders.map(folder => 
                folder.id === folderId 
                    ? { ...folder, cardCount: folder.cardCount + 1 }
                    : folder
            );
            await AsyncStorage.setItem('folders', JSON.stringify(updatedFolders));
            setFolders(updatedFolders);

            setIsSelectFolderModalVisible(false);
            Alert.alert('Success', 'Word saved to folder successfully!');
        } catch (error) {
            console.error('Error saving to folder:', error);
            Alert.alert('Error', 'Failed to save word to folder');
        }
    };

    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <View 
                style={styles.scrollContainer}
            >
                <View style={styles.header}>
                    <View style={styles.languageSelector}>
                        <Text style={styles.languageText}>
                            {getSourceLanguage().name}
                        </Text>
                        <TouchableOpacity 
                            style={styles.switchButton}
                            onPress={() => setIsReversed(!isReversed)}
                        >
                            <Ionicons name="swap-horizontal" size={24} color={Colors.light.itemsColor} />
                        </TouchableOpacity>
                        <Text style={styles.languageText}>
                            {getTargetLanguage().name}
                        </Text>
                    </View>
                </View>

                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        value={word}
                        onChangeText={setWord}
                        placeholder="Enter a word to translate"
                        placeholderTextColor={Colors.light.color}
                        autoCapitalize="none"
                        autoCorrect={false}
                    />
                    {word.length > 0 && (
                        <TouchableOpacity
                            style={styles.clearButton}
                            onPress={clearTranslation}
                        >
                            <Ionicons name="close-circle" size={20} color={Colors.light.color} />
                        </TouchableOpacity>
                    )}
                </View>

                <TouchableOpacity
                    style={[
                        styles.translateButton,
                        (!word.trim() || loading) && styles.translateButtonDisabled
                    ]}
                    onPress={translateWord}
                    disabled={!word.trim() || loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <>
                            <Ionicons name="language" size={24} color="#fff" />
                            <Text style={styles.translateButtonText}>Translate</Text>
                        </>
                    )}
                </TouchableOpacity>

                {error ? (
                    <Text style={styles.errorText}>{error}</Text>
                ) : null}

                {translation && (
                    <View style={styles.resultContainer}>
                        <View style={styles.translationCard}>
                            <View style={styles.translationContent}>
                                <View style={styles.translatedWord}>
                                    <Text style={styles.wordText}>{translation.word}</Text>
                                    <Text style={styles.translationText}>
                                        {translation.translation}
                                    </Text>
                                </View>
                                <View style={styles.languageCodes}>
                                    <Text style={styles.langCode}>{translation.sourceLanguage}</Text>
                                    <Ionicons name="arrow-forward" size={16} color={Colors.light.itemsColor} />
                                    <Text style={styles.langCode}>{translation.targetLanguage}</Text>
                                </View>
                            </View>
                            <View style={styles.divider} />
                            <TouchableOpacity
                                style={styles.saveButton}
                                onPress={() => setIsSelectFolderModalVisible(true)}
                            >
                                <Ionicons name="bookmark-outline" size={24} color={Colors.light.itemsColor} />
                                <Text style={styles.saveButtonText}>Save to Folder</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            </View>
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

                        {folders.length === 0 ? (
                            <View style={styles.emptyState}>
                                <Ionicons name="folder-open-outline" size={48} color={Colors.light.color} />
                                <Text style={styles.emptyStateText}>No folders available</Text>
                                <Text style={styles.emptyStateSubtext}>
                                    Create a folder in the Flashcards tab first
                                </Text>
                            </View>
                        ) : (
                            <FlatList
                                data={folders}
                                keyExtractor={(item) => item.id}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        style={styles.folderItem}
                                        onPress={() => saveToFolder(item.id)}
                                    >
                                        <View style={styles.folderIcon}>
                                            <Ionicons name="folder-outline" size={24} color={Colors.light.itemsColor} />
                                        </View>
                                        <View style={styles.folderInfo}>
                                            <Text style={styles.folderName}>{item.name}</Text>
                                            <Text style={styles.cardCount}>
                                                {item.cardCount} {item.cardCount === 1 ? 'card' : 'cards'}
                                            </Text>
                                        </View>
                                        <Ionicons name="chevron-forward" size={24} color={Colors.light.color} />
                                    </TouchableOpacity>
                                )}
                                contentContainerStyle={styles.folderList}
                            />
                        )}
                    </View>
                </View>
            </Modal>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.light.background,
    },
    scrollContainer: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 100,
    },
    header: {
        paddingTop: 20,
        paddingHorizontal: 20,
        paddingBottom: 10,
    },
    languageSelector: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.light.itemsColor,
        borderRadius: 16,
        padding: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    languageText: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.light.text,
        paddingHorizontal: 16,
    },
    switchButton: {
        padding: 8,
        backgroundColor: Colors.light.background,
        borderRadius: 12,
    },
    inputContainer: {
        marginHorizontal: 20,
        marginTop: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    input: {
        flex: 1,
        backgroundColor: Colors.light.secondaryBackground,
        borderRadius: 12,
        padding: 26,
        fontSize: 16,
        color: Colors.light.text,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    clearButton: {
        position: 'absolute',
        right: 16,
        padding: 4,
    },
    translateButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.light.itemsColor,
        marginHorizontal: 20,
        marginTop: 16,
        padding: 16,
        borderRadius: 12,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    translateButtonDisabled: {
        opacity: 0.6,
    },
    translateButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    },
    errorText: {
        color: '#FF6B6B',
        fontSize: 14,
        marginHorizontal: 20,
        marginTop: 8,
        textAlign: 'center',
    },
    resultContainer: {
        marginBottom: 80, // Increased margin to account for navbar
        paddingHorizontal: 20,
    },
    translationCard: {
        backgroundColor: Colors.light.secondaryBackground,
        borderRadius: 16,
        padding: 20,
        marginTop: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    translationContent: {
        marginBottom: 10,
    },
    translatedWord: {
        marginBottom: 12,
    },
    wordText: {
        fontSize: 24,
        fontWeight: '600',
        color: Colors.light.text,
        marginBottom: 8,
    },
    translationText: {
        fontSize: 24,
        fontWeight: '600',
        color: Colors.light.text,
    },
    languageCodes: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    langCode: {
        fontSize: 14,
        color: Colors.light.itemsColor,
        textTransform: 'uppercase',
    },
    divider: {
        height: 1,
        backgroundColor: Colors.light.itemsColor,
        marginVertical: 16,
    },
    saveButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.light.background,
        marginTop: 16,
        padding: 12,
        borderRadius: 12,
    },
    saveButtonText: {
        color: Colors.light.itemsColor,
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: Colors.light.background,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        minHeight: '50%',
        maxHeight: '80%',
        paddingTop: 20,
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: Colors.light.itemsColor,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.light.text,
    },
    modalCloseButton: {
        padding: 4,
    },
    emptyState: {
        alignItems: 'center',
        padding: 40,
    },
    emptyStateText: {
        fontSize: 18,
        fontWeight: '600',
        color: Colors.light.text,
        marginTop: 16,
        marginBottom: 8,
    },
    emptyStateSubtext: {
        fontSize: 14,
        color: Colors.light.color,
        textAlign: 'center',
    },
    folderList: {
        padding: 20,
    },
    folderItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.light.secondaryBackground,
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
    },
    folderIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: Colors.light.background,
        justifyContent: 'center',
        alignItems: 'center',
    },
    folderInfo: {
        flex: 1,
        marginLeft: 12,
    },
    folderName: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.light.text,
        marginBottom: 4,
    },
    cardCount: {
        fontSize: 14,
        color: Colors.light.color,
    },
});

export default Translator;