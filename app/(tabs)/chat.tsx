import React, { useState, useEffect } from 'react'
import {
    StyleSheet,
    TextInput,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    View,
    Text,
} from 'react-native'
import axios from 'axios'
import Colors from '@/constants/Colors'
import { OPENAI_API_KEY } from '@/config'
import AsyncStorage from '@react-native-async-storage/async-storage'

interface Message {
    role: 'user' | 'assistant'
    content: string
}

const STORAGE_KEY = '@chat_history'

export default function LessonsScreen() {
    const [messages, setMessages] = useState<Message[]>([
        {
            role: 'assistant',
            content:
                "Hello! How can I assist you today? Type 'teach me' to start learning Estonian.",
        },
    ])
    const [inputText, setInputText] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        loadChatHistory()
    }, [])

    const loadChatHistory = async () => {
        try {
            const savedMessages = await AsyncStorage.getItem(STORAGE_KEY)
            if (savedMessages) {
                setMessages(JSON.parse(savedMessages))
            }
        } catch (error) {
            console.error('Error loading chat history:', error)
        }
    }

    const saveChatHistory = async (newMessages: Message[]) => {
        try {
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newMessages))
        } catch (error) {
            console.error('Error saving chat history:', error)
        }
    }

    const updateMessages = (newMessages: Message[]) => {
        setMessages(newMessages)
        saveChatHistory(newMessages)
    }

    const handleSendMessage = async () => {
        if (!inputText.trim()) return

        const newMessage = { role: 'user' as const, content: inputText }
        const updatedMessages = [...messages, newMessage]
        updateMessages(updatedMessages)
        setInputText('')

        if (inputText.toLowerCase() === 'teach me') {
            updateMessages([
                ...updatedMessages,
                {
                    role: 'assistant',
                    content:
                        "Let's start with a basic phrase! 'Tere' means 'Hello' in Estonian. Try saying it!",
                },
            ])
            return
        }

        if (inputText.toLowerCase() === "what's my first lesson?") {
            updateMessages([
                ...updatedMessages,
                {
                    role: 'assistant',
                    content:
                        "Your first lesson is about greetings! 'Tere' is 'Hello', 'Head aega' means 'Goodbye', and 'Kuidas sul läheb?' means 'How are you?'. Let's practice! How would you say 'Goodbye' in Estonian?",
                },
            ])
            return
        }

        if (inputText.toLowerCase() === 'quiz') {
            updateMessages([
                ...updatedMessages,
                {
                    role: 'assistant',
                    content:
                        "Let's test your knowledge! What does 'Tere' mean in English? Type your answer.",
                },
            ])
            return
        }

        if (inputText.toLowerCase() === 'hello') {
            updateMessages([
                ...updatedMessages,
                {
                    role: 'assistant',
                    content:
                        "Correct! 'Tere' means 'Hello'. Let's try another one! What does 'Head aega' mean?",
                },
            ])
            return
        }

        if (inputText.toLowerCase() === 'tell me about estonia') {
            updateMessages([
                ...updatedMessages,
                {
                    role: 'assistant',
                    content:
                        'Estonia is a small country in Northern Europe. It is known for its beautiful landscapes, medieval towns, and rich culture. Did you know that Estonia is famous for its digital innovation, and it is one of the most advanced e-governments in the world?',
                },
            ])
            return
        }

        if (inputText.toLowerCase() === 'what did i learn today?') {
            const learnedWords = ['Tere', 'Head aega', 'Kuidas sul läheb?']
            updateMessages([
                ...updatedMessages,
                {
                    role: 'assistant',
                    content: `Today you've learned: ${learnedWords.join(', ')}. Keep practicing!`,
                },
            ])
            return
        }

        if (inputText.toLowerCase() === 'how are you?') {
            updateMessages([
                ...updatedMessages,
                {
                    role: 'assistant',
                    content:
                        "I'm doing well, thank you! And how are you? In Estonian, you can say 'Kuidas sul läheb?' to ask someone how they are.",
                },
            ])
            return
        }

        // OpenAI API call with full context
        setIsLoading(true)
        try {
            const response = await axios.post(
                'https://api.openai.com/v1/chat/completions',
                {
                    model: 'gpt-3.5-turbo',
                    messages: updatedMessages,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${OPENAI_API_KEY}`,
                    },
                }
            )

            const assistantReply = response.data.choices[0].message.content
            updateMessages([
                ...updatedMessages,
                { role: 'assistant', content: assistantReply },
            ])
        } catch (error) {
            console.error('Error with OpenAI API:', error)
            updateMessages([
                ...updatedMessages,
                {
                    role: 'assistant',
                    content:
                        'Kahjuks midagi ei läinud õigesti. Proovige uuesti.',
                },
            ])
        } finally {
            setIsLoading(false)
        }
    }

    const renderMessage = ({ item }: { item: Message }) => (
        <View
            style={[
                styles.messageContainer,
                item.role === 'user'
                    ? styles.userMessage
                    : styles.assistantMessage,
            ]}
        >
            <Text style={styles.messageText}>{item.content}</Text>
        </View>
    )

    return (
        <View style={styles.container}>
            <FlatList
                data={messages}
                keyExtractor={(_, index) => index.toString()}
                renderItem={renderMessage}
                contentContainerStyle={styles.chatContainer}
            />

            {isLoading && (
                <ActivityIndicator
                    style={styles.loader}
                    size="small"
                    color="#0000ff"
                />
            )}

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={inputText}
                    onChangeText={setInputText}
                    placeholder="Type your message..."
                    placeholderTextColor="#aaa"
                />
                <TouchableOpacity
                    style={styles.sendButton}
                    onPress={handleSendMessage}
                >
                    <Text style={styles.sendButtonText}>Send</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: Colors.dark.background,
    },
    chatContainer: {
        padding: 10,
    },
    messageContainer: {
        marginVertical: 5,
        padding: 10,
        borderRadius: 8,
        maxWidth: '80%',
    },
    userMessage: {
        backgroundColor: '#d1e7ff',
        alignSelf: 'flex-end',
    },
    assistantMessage: {
        backgroundColor: '#f1f1f1',
        alignSelf: 'flex-start',
    },
    messageText: {
        fontSize: 16,
        color: '#333',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 5,
        borderColor: '#ddd',
        backgroundColor: Colors.dark.background,
    },
    input: {
        flex: 1,
        height: 60,
        borderRadius: 10,
        paddingHorizontal: 15,
        backgroundColor: Colors.dark.secondaryBackground,
        fontSize: 16,
        color: Colors.dark.text,
    },
    sendButton: {
        marginLeft: 10,
        backgroundColor: '#007BFF',
        borderRadius: 10,
        paddingHorizontal: 15,
        paddingVertical: 8,
    },
    sendButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    loader: {
        marginVertical: 10,
    },
})
