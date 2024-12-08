import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';
import { LessonChatProps } from '@/app/types/exercise';
import axios from 'axios';

interface Props {
    data: LessonChatProps;
    onComplete: () => void;
}

const LessonChat = (props: Props) => {
    const { data } = props;
    const { theme, words } = data;
    const [messages, setMessages] = useState<{ user: boolean; text: string }[]>([]);
    const [inputText, setInputText] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // Initial greeting from the bot
        const initialMessage = `Tere! I am your Estonian language teacher. Today we will practice "${theme}". We will focus on these words: ${words?.join(', ')}. Let's start! You can ask me questions about these words or practice using them in sentences.`;
        setMessages([{ user: false, text: initialMessage }]);
    }, [theme, words]);

    const handleSend = async () => {
        if (inputText.trim()) {
            setIsLoading(true);
            const userMessage = inputText.trim();
            setMessages(prev => [...prev, { user: true, text: userMessage }]);
            setInputText('');

            try {
                if (!process.env.EXPO_PUBLIC_OPENAI_API_KEY) {
                    throw new Error('OpenAI API key is not configured');
                }

                // Convert previous messages to the format expected by the API
                const messageHistory = messages.map(msg => ({
                    role: msg.user ? 'user' : 'assistant',
                    content: msg.text
                }));

                const response = await axios.post('https://api.openai.com/v1/chat/completions', {
                    model: "gpt-3.5-turbo",
                    messages: [
                        {
                            role: "system",
                            content: `You are an Estonian language teacher. Your task is to help students practice Estonian, focusing specifically on the theme: "${theme}". 
                            You should help students practice these words: ${words?.join(', ')}.
                            Rules:
                            1. Only answer questions related to Estonian language learning
                            2. Focus on the provided theme and words
                            3. If a student asks something unrelated, politely redirect them to Estonian learning
                            4. Provide examples and explanations in both Estonian and English
                            5. Encourage proper pronunciation and usage
                            6. Keep responses concise and educational
                            7. If student writes in Estonian, praise their attempt and correct any mistakes`
                        },
                        ...messageHistory,
                        {
                            role: "user",
                            content: userMessage
                        }
                    ]
                }, {
                    headers: {
                        'Authorization': `Bearer ${process.env.EXPO_PUBLIC_OPENAI_API_KEY}`,
                        'Content-Type': 'application/json'
                    }
                });

                const botResponse = response.data.choices[0].message.content;
                setMessages(prev => [...prev, { user: false, text: botResponse }]);
            } catch (error) {
                console.error('Error:', error);
                setMessages(prev => [...prev, { user: false, text: "I apologize, but I'm having trouble connecting. Let's try again!" }]);
            } finally {
                setIsLoading(false);
            }
        }
    };

    const renderMessage = ({ item }: { item: { user: boolean; text: string } }) => (
        <View
            style={[
                styles.messageContainer,
                item.user ? styles.userMessage : styles.systemMessage,
            ]}
        >
            <Text style={styles.messageText}>{item.text}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={messages}
                renderItem={renderMessage}
                keyExtractor={(_, index) => index.toString()}
                style={styles.chatContainer}
            />
            <TextInput
                style={styles.input}
                value={inputText}
                onChangeText={setInputText}
                placeholderTextColor={Colors.light.text}
                placeholder="Type your message..."
            />
            <TouchableOpacity style={styles.sendButton} onPress={handleSend} disabled={isLoading}>
                <Text style={styles.sendButtonText}>{isLoading ? 'Sending...' : 'Send'}</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    chatContainer: {
        flex: 1,
        marginBottom: 10,
    },
    messageContainer: {
        marginVertical: 5,
        padding: 10,
        borderRadius: 10,
        maxWidth: '80%',
    },
    userMessage: {
        backgroundColor: Colors.light.color,
        alignSelf: 'flex-end',
    },
    systemMessage: {
        backgroundColor: Colors.light.secondaryLight,
        alignSelf: 'flex-start',
    },
    messageText: {
        fontSize: 16,
        color: "black",
    },
    input: {
        height: 60,
        width: '100%',
        borderColor: Colors.light.cardsBackground,
        borderWidth: 1,
        borderRadius: 25,
        paddingHorizontal: 15,
        backgroundColor: Colors.light.background,
        marginBottom: 10,
        color: Colors.light.text,
    },
    sendButton: {
        height: 50,
        borderRadius: 25,
        backgroundColor: Colors.light.itemsColor,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
    },
    sendButtonText: {
        color: Colors.light.white,
        fontSize: 16,
    },
    themeText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: Colors.light.text,
    },
    wordSuggestionsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginVertical: 10,
    },
    wordButton: {
        backgroundColor: Colors.light.itemsColor,
        borderRadius: 15,
        padding: 10,
        margin: 5,
    },
});

export default LessonChat;