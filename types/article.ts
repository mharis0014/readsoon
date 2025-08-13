/**
 * Article type definition
 */
export type Article = {
    id: string;
    title: string;
    description: string;
    content: string;
    htmlContent?: string; // HTML formatted content
    imageUrl: string | number; // Can be a URL string or local asset number
    images?: string[]; // Array of image URLs from ExtractorAPI
    authorImage?: string; // Author profile image URL
    url: string;
    savedAt: string;
    readingTime: number;
    source: string;
    isSaved?: boolean; // Optional property to track saved state
};

/**
 * Add Link Modal interfaces
 */
export interface AddLinkModalProps {
    visible: boolean;
    onClose: () => void;
    onSave?: (linkData: LinkData) => void;
}

export interface LinkData {
    url: string;
    title: string;
    description: string;
    tags: string;
} 