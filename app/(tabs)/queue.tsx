import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';

import { router } from 'expo-router';
import AddLinkModal from '../../components/queue/AddLinkModal';
import DropdownMenu from '../../components/queue/DropdownMenu';
import EmptyQueueState from '../../components/queue/EmptyQueueState';
import GettingStartedCard from '../../components/queue/GettingStartedCard';
import QueueHeader from '../../components/queue/QueueHeader';
import { SavedArticlesList } from '../../components/saved/SavedArticlesList';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import ICONS from '../../constants/Icons';
import { useHybridUser } from '../../context/HybridUserContext';
import { ArticleService } from '../../services/articleService';
import { queueStyles as styles } from '../../styles/queue';
import { Article } from '../../types/article';

export default function QueueScreen() {
    const [showGettingStarted, setShowGettingStarted] = useState(true);
    const [showOptionsDropdown, setShowOptionsDropdown] = useState(false);
    const [showAddDropdown, setShowAddDropdown] = useState(false);
    const [showQueueDropdown, setShowQueueDropdown] = useState(false);
    const [showAddLinkModal, setShowAddLinkModal] = useState(false);
    const [savedArticles, setSavedArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const { user } = useHybridUser();

    const fetchSavedArticles = useCallback(async () => {
        if (!user?.id) return;

        setLoading(true);
        try {
            const articles = await ArticleService.getUserArticles(user.id);
            setSavedArticles(articles);
        } catch (error) {
            console.error('Error fetching saved articles:', error);
        } finally {
            setLoading(false);
        }
    }, [user?.id]);

    // Fetch saved articles on component mount and when user changes
    useEffect(() => {
        if (user?.id) {
            fetchSavedArticles();
        }
    }, [user?.id, fetchSavedArticles]);

    const handleRefresh = async () => {
        if (!user?.id) return;

        setRefreshing(true);
        try {
            const articles = await ArticleService.getUserArticles(user.id);
            setSavedArticles(articles);
        } catch (error) {
            console.error('Error refreshing saved articles:', error);
        } finally {
            setRefreshing(false);
        }
    };

    const handleCloseGettingStarted = () => {
        setShowGettingStarted(false);
    };

    const handleSetupMobile = () => {
        console.log('Setup mobile reading');
    };

    const handleSetupDesktop = () => {
        console.log('Setup desktop reading');
    };

    const handleOptionsDropdownToggle = () => {
        setShowOptionsDropdown(!showOptionsDropdown);
    };

    const handleAddDropdownToggle = () => {
        setShowAddDropdown(!showAddDropdown);
    };

    const handleQueueDropdownToggle = () => {
        setShowQueueDropdown(!showQueueDropdown);
    };

    const handleOptionsDropdownOption = (option: string) => {
        console.log('Selected Options option:', option);
        setShowOptionsDropdown(false);
    };

    const handleAddDropdownOption = (option: string) => {
        setShowAddDropdown(false);

        if (option === 'enter-a-url') {
            setShowAddLinkModal(true);
        }
    };

    const handleQueueDropdownOption = (option: string) => {
        setShowQueueDropdown(false);
    };

    const handleAddLinkModalClose = () => {
        setShowAddLinkModal(false);
    };

    const handleAddLinkSave = async (linkData: any) => {
        setShowAddLinkModal(false);
        setShowGettingStarted(false);

        await fetchSavedArticles();
    };

    const handleArticlePress = (article: Article) => {
        router.push({
            pathname: '/article-detail',
            params: { id: article.id, type: 'saved' }
        });
    };

    const handleRemoveArticle = async (articleId: string) => {
        try {
            await ArticleService.removeArticle(articleId);

            await fetchSavedArticles();
        } catch (error) {
            console.error('Error removing article:', error);
        }
    };

    const optionsDropdownItems = [
        { id: 'resume-reading', title: 'Resume Reading', icon: ICONS.CLOCK },
        { id: 'sort-by', title: 'Sort By', icon: ICONS.SORT },
        { id: 'filter', title: 'Filter', icon: ICONS.FILTER, hasSeparator: true },
        { id: 'edit', title: 'Edit', icon: ICONS.EDIT },
        { id: 'archive-all', title: 'Archive All', icon: ICONS.CLOCK, hasSeparator: true },
        { id: 'send-feedback', title: 'Send Feedback', icon: ICONS.FEEDBACK },
    ];

    const addDropdownItems = [
        { id: 'enter-a-url', title: 'Enter a URL', icon: ICONS.LINK },
    ];

    const queueDropdownItems = [
        { id: 'articles', title: 'Articles' },
        { id: 'podcasts', title: 'Podcasts' },
        { id: 'youtube', title: 'Youtube' },
    ];

    return (
        <View style={styles.container}>
            <StatusBar style="light" />

            <QueueHeader
                onAddDropdownToggle={handleAddDropdownToggle}
                onOptionsDropdownToggle={handleOptionsDropdownToggle}
                onQueueDropdownToggle={handleQueueDropdownToggle}
            />

            <DropdownMenu
                visible={showOptionsDropdown}
                containerStyle={styles.optionsDropdownContainer}
                items={optionsDropdownItems}
                onItemPress={handleOptionsDropdownOption}
            />

            <DropdownMenu
                visible={showAddDropdown}
                containerStyle={styles.addDropdownContainer}
                items={addDropdownItems}
                onItemPress={handleAddDropdownOption}
            />

            <DropdownMenu
                visible={showQueueDropdown}
                containerStyle={styles.queueDropdownContainer}
                items={queueDropdownItems}
                onItemPress={handleQueueDropdownOption}
            />

            {showGettingStarted ? (
                <View style={styles.content}>
                    <GettingStartedCard
                        onClose={handleCloseGettingStarted}
                        onSetupMobile={handleSetupMobile}
                        onSetupDesktop={handleSetupDesktop}
                    />
                </View>
            ) : loading ? (
                <LoadingSpinner text="Loading your articles..." />
            ) : (
                <SavedArticlesList
                    articles={savedArticles}
                    onArticlePress={handleArticlePress}
                    onRemoveArticle={handleRemoveArticle}
                    ListEmptyComponent={EmptyQueueState}
                    refreshing={refreshing}
                    onRefresh={handleRefresh}
                />
            )}

            <AddLinkModal
                visible={showAddLinkModal}
                onClose={handleAddLinkModalClose}
                onSave={handleAddLinkSave}
            />
        </View>
    );
} 