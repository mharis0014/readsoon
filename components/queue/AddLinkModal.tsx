import React, { useState } from 'react';
import { ActivityIndicator, Alert, Modal, Text, TouchableOpacity, View } from 'react-native';
import { ARTICLE_CONSTANTS } from '../../constants/Article';
import { Colors } from '../../constants/Colors';
import { useHybridUser } from '../../context/HybridUserContext';
import { ArticleService } from '../../services/articleService';
import { extractArticleData, ScrapedArticle } from '../../services/scrapingApi';
import { addLinkModalStyles as styles } from '../../styles/add-link-modal';
import { AddLinkModalProps } from '../../types/article';
import { extractDomain } from '../../utils/urlHelpers';
import { CustomInput } from '../ui/CustomInput';

export default function AddLinkModal({ visible, onClose, onSave }: AddLinkModalProps) {
    const [url, setUrl] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [tags, setTags] = useState('');
    const [loading, setLoading] = useState(false);

    const { user } = useHybridUser();

    const handleSave = async () => {
        if (!url.trim()) {
            Alert.alert('Error', 'Please enter a valid URL to save an article.');
            return;
        }
        if (!user?.id) {
            Alert.alert('Error', 'You must be logged in to save articles. Please log in and try again.');
            return;
        }
        setLoading(true);
        try {
            const trimmedUrl = url.trim();
            const scrapedData: ScrapedArticle = await extractArticleData(trimmedUrl);

            const savedArticle = await ArticleService.saveArticle(user.id, {
                url: trimmedUrl,
                title: title.trim() || scrapedData.title,
                description: description.trim() || scrapedData.description,
                content: scrapedData.content,
                imageUrl: scrapedData.imageUrl || '',
                // Extract source from canonical URL or fallback
                source: scrapedData.author || extractDomain(scrapedData.canonicalUrl || ''),
                // Estimate reading time by dividing word count by avg reading speed (WPM)
                readingTime: Math.ceil(scrapedData.content.split(' ').length / ARTICLE_CONSTANTS.WORDS_PER_MINUTE),
            });

            onSave?.({
                url: trimmedUrl,
                title: savedArticle.title,
                description: savedArticle.description,
                tags: tags.trim(),
            });

            handleClose();
        } catch (err: any) {
            console.error('Failed to save article in AddLinkModal:', err);
            Alert.alert(
                'Error', 'Failed to save article. Please try again.',
                [{ text: 'OK', onPress: handleClose }]
            );
        }
    };

    const handleClose = () => {
        setUrl('');
        setTitle('');
        setDescription('');
        setTags('');
        setLoading(false);
        onClose();
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={handleClose}
        >
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.title}>Add Link</Text>
                        <TouchableOpacity
                            onPress={handleClose}
                            style={styles.closeButton}
                            accessibilityLabel="Close Add Link Modal"
                        >
                            <Text style={styles.closeIcon}>✕</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Form */}
                    <View style={styles.form}>
                        <CustomInput
                            label="URL"
                            placeholder="Enter article URL"
                            value={url}
                            onChangeText={setUrl}
                            autoCapitalize="none"
                            autoCorrect={false}
                            keyboardType="url"
                        />

                        <CustomInput
                            label="Title (Optional)"
                            placeholder="Enter article title"
                            value={title}
                            onChangeText={setTitle}
                            autoCapitalize="words"
                        />

                        <CustomInput
                            label="Description (Optional)"
                            placeholder="Enter article description"
                            value={description}
                            onChangeText={setDescription}
                            multiline
                            numberOfLines={3}
                        />

                        <CustomInput
                            label="Tags (Optional)"
                            placeholder="Enter tags (comma separated)"
                            value={tags}
                            onChangeText={setTags}
                            autoCapitalize="words"
                        />
                    </View>

                    {/* Actions */}
                    <View style={styles.actions}>
                        <TouchableOpacity
                            style={styles.cancelButton}
                            onPress={handleClose}
                            accessibilityLabel="Cancel Button"
                        >
                            <Text style={styles.cancelButtonText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.saveButton, loading && styles.saveButtonDisabled]}
                            onPress={handleSave}
                            disabled={loading}
                            accessibilityLabel="Save Link Button"
                        >
                            {loading ? (
                                <ActivityIndicator size="small" color={Colors.white} />
                            ) : (
                                <Text style={styles.saveButtonText}>Save Link</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}
