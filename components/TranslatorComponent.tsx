import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';

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

const TranslatorComponent = () => {
  const [word, setWord] = useState('');
  const [translation, setTranslation] = useState<TranslationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isReversed, setIsReversed] = useState(false);
  const OPENAI_API_KEY = 'sk-NuaTm51prqNsgZO3q7n51QHCfD1rknvfP5bx_xXY-lT3BlbkFJ2iA-kJkV8GwS1uaG5s4c46d4AgzmE89SihlF2lr5QA';

  const languages: { [key: string]: Language } = {
    et: { code: 'et', name: 'Estonian' },
    en: { code: 'en', name: 'English' }
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

    try {
      const response = await axios.post('https://api.openai.com/v1/engines/davinci-codex/completions', {
        prompt: `Translate the word '${word}' from ${getSourceLanguage().name} to ${getTargetLanguage().name}.`,
        max_tokens: 60,
        temperature: 0.5
      }, {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`
        }
      });

      const translatedText = response.data.choices[0].text.trim();
      setTranslation({
        word,
        translation: translatedText,
        sourceLanguage: getSourceLanguage().name,
        targetLanguage: getTargetLanguage().name
      });
    } catch (error) {
      console.error('Error translating word:', error);
      Alert.alert('Error', 'Failed to translate word');
    } finally {
      setLoading(false);
    }
  };

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
        translation && (
          <View style={styles.translationContainer}>
            <Text style={styles.translationText}>{translation.translation}</Text>
            <Text style={styles.translationLangText}>{translation.targetLanguage}</Text>
          </View>
        )
      )}
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
  translationText: {
    fontSize: 18,
    color: Colors.light.text,
  },
  translationLangText: {
    fontSize: 14,
    color: Colors.light.tabIconDefault,
    marginTop: 5,
  },
});

export default TranslatorComponent;
