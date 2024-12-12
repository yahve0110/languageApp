import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    TextInput,
    FlatList,
    Modal,
    Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';

const { width } = Dimensions.get('window');

interface Folder {
    id: string;
    name: string;
    cardCount: number;
}

interface Props {
    visible: boolean;
    folders: Folder[];
    onClose: () => void;
    onSelectFolder: (folderId: string) => void;
    onCreateFolder: (name: string) => void;
}

const FolderSelectionModal: React.FC<Props> = ({
    visible,
    folders,
    onClose,
    onSelectFolder,
    onCreateFolder,
}) => {
    const [isCreatingFolder, setIsCreatingFolder] = useState(false);
    const [newFolderName, setNewFolderName] = useState('');

    const handleCreateFolder = () => {
        if (newFolderName.trim()) {
            onCreateFolder(newFolderName.trim());
            setNewFolderName('');
            setIsCreatingFolder(false);
        }
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Save to Folder</Text>
                        <TouchableOpacity
                            style={styles.modalCloseButton}
                            onPress={onClose}
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
                                    style={[styles.button, styles.cancelButton]}
                                    onPress={() => {
                                        setIsCreatingFolder(false);
                                        setNewFolderName('');
                                    }}
                                >
                                    <Text style={styles.buttonText}>Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.button, styles.confirmButton]}
                                    onPress={handleCreateFolder}
                                >
                                    <Text style={[styles.buttonText, { color: '#fff' }]}>Create</Text>
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

                            {folders.length === 0 ? (
                                <View style={styles.emptyState}>
                                    <Ionicons name="folder-open-outline" size={48} color={Colors.light.color} />
                                    <Text style={styles.emptyStateText}>No folders available</Text>
                                    <Text style={styles.emptyStateSubtext}>
                                        Create a folder to save cards
                                    </Text>
                                </View>
                            ) : (
                                <FlatList
                                    data={folders}
                                    keyExtractor={(item) => item.id}
                                    renderItem={({ item }) => (
                                        <TouchableOpacity
                                            style={styles.folderItem}
                                            onPress={() => onSelectFolder(item.id)}
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
                        </>
                    )}
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: Colors.light.background,
        borderRadius: 20,
        width: width - 40,
        maxHeight: '80%',
        padding: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
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
        padding: 8,
    },
    createFolderContainer: {
        marginBottom: 20,
    },
    createFolderInput: {
        backgroundColor: Colors.light.secondaryBackground,
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        color: Colors.light.text,
        marginBottom: 16,
    },
    createFolderButtons: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 12,
    },
    button: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        minWidth: 100,
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: Colors.light.secondaryBackground,
    },
    confirmButton: {
        backgroundColor: Colors.light.tint,
    },
    buttonText: {
        fontSize: 16,
        color: Colors.light.text,
        fontWeight: '500',
    },
    createFolderButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
        backgroundColor: Colors.light.secondaryBackground,
        marginBottom: 12,
    },
    createFolderButtonText: {
        color: Colors.light.text,
        fontSize: 16,
        marginLeft: 8,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 40,
    },
    emptyStateText: {
        fontSize: 18,
        color: Colors.light.text,
        marginTop: 16,
        fontWeight: '500',
    },
    emptyStateSubtext: {
        fontSize: 14,
        color: Colors.light.color,
        marginTop: 8,
    },
    folderList: {
        paddingTop: 8,
    },
    folderItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: Colors.light.secondaryBackground,
        borderRadius: 12,
        marginBottom: 12,
    },
    folderIcon: {
        marginRight: 12,
    },
    folderInfo: {
        flex: 1,
    },
    folderName: {
        fontSize: 16,
        color: Colors.light.text,
        fontWeight: '500',
    },
    cardCount: {
        fontSize: 14,
        color: Colors.light.color,
        marginTop: 4,
    },
});

export default FolderSelectionModal;

export default FolderSelectionModal;
