import { ARTICLE_CONSTANTS } from '../constants/Article';

/**
 * Extract domain from URL
 * @param url - The URL to extract domain from
 * @returns The hostname or default source if invalid
 */
export const extractDomain = (url: string): string => {
    try {
        return new URL(url).hostname;
    } catch {
        return ARTICLE_CONSTANTS.DEFAULT_SOURCE;
    }
}; 