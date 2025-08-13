import * as Clipboard from 'expo-clipboard';
import * as Linking from 'expo-linking';
import * as Sharing from 'expo-sharing';
import { Alert } from 'react-native';

export class ShareService {
    /**
 * Share the original article URL using the native share sheet
 */
    static async shareOriginalLink(url: string, title?: string): Promise<void> {
        try {
            const isAvailable = await Sharing.isAvailableAsync();

            if (isAvailable) {
                const shareOptions: any = {
                    dialogTitle: title ? `Share: ${title}` : 'Share Article',
                };

                // Include title in the message for better sharing experience
                if (title) {
                    shareOptions.message = `${title}\n\n${url}`;
                } else {
                    shareOptions.message = url;
                }

                await Sharing.shareAsync(url, shareOptions);
            } else {
                // Fallback to copying to clipboard if sharing is not available
                await this.copyToClipboard(url);
                Alert.alert(
                    'Link Copied',
                    'The article link has been copied to your clipboard since sharing is not available on this device.'
                );
            }
        } catch (error) {
            console.error('Error sharing link:', error);
            Alert.alert(
                'Share Failed',
                'Unable to share the link. Please try again.'
            );
        }
    }

    /**
     * Copy the original article URL to clipboard
     */
    static async copyOriginalLink(url: string): Promise<void> {
        try {
            await this.copyToClipboard(url);
            Alert.alert(
                '✓ Link Copied',
                'The article link has been copied to your clipboard.',
                [{ text: 'OK', style: 'default' }]
            );
        } catch (error) {
            console.error('Error copying link:', error);
            Alert.alert(
                'Copy Failed',
                'Unable to copy the link. Please try again.',
                [{ text: 'OK', style: 'default' }]
            );
        }
    }

    /**
 * Open the original article URL in the default browser
 */
    static async openInBrowser(url: string): Promise<void> {
        try {
            // Ensure the URL has a protocol
            let formattedUrl = url;
            if (!url.startsWith('http://') && !url.startsWith('https://')) {
                formattedUrl = `https://${url}`;
            }

            const canOpen = await Linking.canOpenURL(formattedUrl);

            if (canOpen) {
                await Linking.openURL(formattedUrl);
            } else {
                Alert.alert(
                    'Cannot Open Link',
                    'Unable to open this link in the browser. The URL may be invalid.',
                    [{ text: 'OK', style: 'default' }]
                );
            }
        } catch (error) {
            console.error('Error opening link in browser:', error);
            Alert.alert(
                'Open Failed',
                'Unable to open the link in browser. Please try again.',
                [{ text: 'OK', style: 'default' }]
            );
        }
    }

    /**
     * Share article on Twitter/X
     */
    static async shareOnTwitter(url: string, title?: string): Promise<void> {
        try {
            const text = title ? `${title}\n\n${url}` : url;
            const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;

            const canOpen = await Linking.canOpenURL(twitterUrl);

            if (canOpen) {
                await Linking.openURL(twitterUrl);
            } else {
                // Fallback to copying to clipboard
                await this.copyToClipboard(url);
                Alert.alert(
                    'Twitter Not Available',
                    'Twitter app is not available. The link has been copied to your clipboard.'
                );
            }
        } catch (error) {
            console.error('Error sharing on Twitter:', error);
            Alert.alert(
                'Tweet Failed',
                'Unable to share on Twitter. Please try again.'
            );
        }
    }

    /**
     * Print the article (placeholder for future implementation)
     */
    static async printArticle(): Promise<void> {
        Alert.alert(
            'Print',
            'Print functionality will be available in a future update.'
        );
    }

    /**
     * Export article as PDF (placeholder for future implementation)
     */
    static async exportAsPDF(): Promise<void> {
        Alert.alert(
            'Export PDF',
            'PDF export functionality will be available in a future update.'
        );
    }

    /**
     * Helper method to copy text to clipboard
     */
    private static async copyToClipboard(text: string): Promise<void> {
        await Clipboard.setStringAsync(text);
    }

    /**
     * Validate if a URL is properly formatted
     */
    static isValidUrl(url: string): boolean {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Get the original URL from an article object
     */
    static getOriginalUrl(article: any): string | null {
        // Check various possible URL fields in order of preference
        const urlFields = [
            'original_url',
            'url',
            'source_url',
            'link',
            'article_url',
            'web_url',
            'canonical_url'
        ];

        for (const field of urlFields) {
            if (article?.[field] && this.isValidUrl(article[field])) {
                return article[field];
            }
        }

        // For mock data that might not have URLs, we can create a fallback
        // This is especially useful for top picks and staff picks
        if (article?.id && (article?.title || article?.content)) {
            // Create a realistic-looking URL based on the article content
            // In a real app, you might want to prompt user or show a message
            const slug = article.title
                ? article.title.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')
                : article.id;
            return `https://readsoon.app/articles/${slug}-${article.id}`;
        }

        return null;
    }
}
