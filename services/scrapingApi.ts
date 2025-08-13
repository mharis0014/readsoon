/* eslint-disable @typescript-eslint/no-unused-vars */
import * as cheerio from 'react-native-cheerio';

const API_KEY = "scp-live-dbbcb57476a74a68a0f4e2ab767c2932";
const SCRAPFLY_API_URL = "https://api.scrapfly.io/scrape";

export interface ScrapedArticle {
    title: string;
    description: string;
    content: string;
    htmlContent?: string;
    imageUrl?: string;
    author?: string;
    authorImage?: string;
    publishDate?: string;
    canonicalUrl?: string;
    tags?: string[];
}

// Scrapfly API call
export const scrapeUrl = async (url: string): Promise<string> => {
    try {
        const scrapeConfig = {
            url: encodeURIComponent(url),
            key: API_KEY,
            render_js: true,
            country: "us",
            asp: true,
            proxy_pool: "public_residential_pool",
        };

        // Build URL with query parameters
        const queryParams = new URLSearchParams();
        for (const [key, value] of Object.entries(scrapeConfig)) {
            if (key === 'url') {
                queryParams.append(key, value as string);
            } else if (typeof value === 'boolean') {
                queryParams.append(key, value ? 'true' : 'false');
            } else {
                queryParams.append(key, String(value));
            }
        }

        const response = await fetch(
            `${SCRAPFLY_API_URL}?${queryParams.toString()}`,
            {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                }
            }
        );

        const data = await response.json();

        if (data.result.success) {
            return data.result.content; // This is the scraped HTML
        } else {
            throw new Error('Scraping failed');
        }
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

// Remove noise elements from HTML
const removeNoiseElements = ($: cheerio.CheerioAPI) => {
    // Remove ads, social media, navigation, etc.
    const noiseSelectors = [
        // Ads and promotional content
        "[class*='ad']",
        "[id*='ad']",
        ".advertisement",
        ".promo",
        ".sponsored",
        "[class*='banner']",
        "[id*='banner']",
        ".marketing",
        "[class*='sponsor']",

        // Social media and sharing
        ".social",
        ".share",
        "[class*='social']",
        "[class*='share']",
        ".facebook",
        ".twitter",
        ".instagram",
        ".linkedin",
        ".pinterest",

        // Navigation and UI elements
        "nav",
        ".navigation",
        ".menu",
        ".breadcrumb",
        ".pagination",
        ".sidebar",
        ".widget",
        ".newsletter",
        ".subscribe",

        // Comments and user-generated content
        ".comments",
        ".comment",
        "[class*='comment']",
        ".discussion",
        ".reviews",
        ".rating",
        ".user-content",

        // Footer and header noise
        "header",
        "footer",
        ".header",
        ".footer",
        ".top-bar",
        ".bottom-bar",

        // Scripts and tracking
        "script",
        "noscript",
        "iframe",
        ".tracking",
        "[class*='analytics']",

        // Pop-ups and overlays
        ".modal",
        ".popup",
        ".overlay",
        ".lightbox",
        "[class*='popup']",

        // Related articles (often not main content)
        ".related",
        ".recommended",
        "[class*='related']",
        "[class*='recommend']",
        ".trending",
        ".popular",
        ".more-stories",

        // Author bio boxes and sidebars
        ".author-bio",
        ".bio-box",
        "[class*='author-box']",
    ];

    $(noiseSelectors.join(", ")).remove();
};

// Smarter noise removal that preserves content-heavy elements
const removeNoiseElementsSmart = ($: cheerio.CheerioAPI) => {
    // Only remove elements that are clearly non-content
    const safeNoiseSelectors = [
        // Specific ad selectors (more targeted)
        ".advertisement",
        ".promo",
        ".sponsored",
        "[id*='ad-']",
        "[class*='ad-banner']",

        // Social media widgets (but not sharing buttons in articles)
        ".social-widget",
        ".social-sidebar",

        // Navigation (but only nav elements, not headers that might contain content)
        "nav:not([role='main'])",
        ".navigation:not([role='main'])",
        ".menu:not([role='main'])",
        ".breadcrumb",
        ".pagination",

        // Comments sections
        ".comments",
        ".comment-section",
        "[id*='comment']",
        ".discussion",

        // Sidebar widgets
        ".sidebar .widget",
        ".newsletter-signup",
        ".subscribe-widget",

        // Footer elements (but not if they contain main content)
        "footer:not(:has(article)):not(:has([role='main']))",
        ".footer:not(:has(article)):not(:has([role='main']))",

        // Scripts and styles
        "script",
        "style",
        "noscript"
    ];

    $(safeNoiseSelectors.join(", ")).remove();
};

// Extract article title
const extractArticleTitle = ($: cheerio.CheerioAPI): string => {
    return (
        $("h1").first().text().trim() ||
        $('[class*="headline"]').first().text().trim() ||
        $('[class*="title"]').first().text().trim() ||
        $('meta[property="og:title"]').attr("content") ||
        $('meta[name="title"]').attr("content") ||
        ""
    );
};

// Extract description
const extractDescription = ($: cheerio.CheerioAPI): string => {
    return (
        $('meta[name="description"]').attr("content") ||
        $('meta[property="og:description"]').attr("content") ||
        $(".lead").text().trim() ||
        $(".summary").text().trim() ||
        ""
    );
};

// Extract canonical URL
const extractCanonicalUrl = ($: cheerio.CheerioAPI, fallbackUrl: string): string => {
    return (
        $('link[rel="canonical"]').attr("href") ||
        $('meta[property="og:url"]').attr("content") ||
        fallbackUrl
    );
};

// Extract publish date
const extractPublishDate = ($: cheerio.CheerioAPI): string => {
    return (
        $('meta[property="article:published_time"]').attr("content") ||
        $('meta[name="date"]').attr("content") ||
        $("time").attr("datetime") ||
        $('[class*="date"]').first().text().trim() ||
        ""
    );
};

// Extract author
const extractAuthor = ($: cheerio.CheerioAPI): string => {
    return (
        $('meta[name="author"]').attr("content") ||
        $('meta[property="article:author"]').attr("content") ||
        $('[class*="author"]').first().text().trim() ||
        $('[rel="author"]').text().trim() ||
        ""
    );
};

// Extract author image
const extractAuthorImage = ($: cheerio.CheerioAPI, baseUrl: string): string => {
    // Try to find author image in meta tags
    const authorImageMeta = $('meta[property="article:author:image"]').attr('content');
    if (authorImageMeta && authorImageMeta.length > 0) {
        return authorImageMeta.startsWith('http') ? authorImageMeta : new URL(authorImageMeta, baseUrl).href;
    }

    // Try to find author image in structured data
    const jsonLd = $('script[type="application/ld+json"]');
    for (let i = 0; i < jsonLd.length; i++) {
        try {
            const data = JSON.parse($(jsonLd[i]).html() || '{}');
            if (data.author && data.author.image) {
                const authorImage = data.author.image;
                if (typeof authorImage === 'string') {
                    return authorImage.startsWith('http') ? authorImage : new URL(authorImage, baseUrl).href;
                }
            }
        } catch (e) {
            // Ignore JSON parse errors
        }
    }

    // Try to find author avatar in common selectors
    const authorAvatarSelectors = [
        '.author-avatar img',
        '.author-image img',
        '.avatar img',
        '.profile-image img',
        '[class*="author"] img',
        '[class*="avatar"] img'
    ];

    for (const selector of authorAvatarSelectors) {
        const img = $(selector).first();
        if (img.length > 0) {
            const src = img.attr('src') || img.attr('data-src');
            if (src && src.length > 0) {
                const fullUrl = src.startsWith('http') ? src : new URL(src, baseUrl).href;
                if (!fullUrl.startsWith('data:')) {
                    return fullUrl;
                }
            }
        }
    }

    return '';
};

// Extract important content - exactly like web version
const extractImportantContent = ($: cheerio.CheerioAPI): string => {
    // Try to find the main article content container
    const contentSelectors = [
        "article",
        "[role='main']",
        ".article-content",
        ".content",
        ".post-content",
        ".entry-content",
        ".story-body",
        ".article-body",
    ];

    let mainContent = null;
    for (const selector of contentSelectors) {
        const element = $(selector);
        if (element.length && element.text().trim().length > 200) {
            mainContent = element;
            break;
        }
    }

    // Fallback to body if no main content found
    if (!mainContent) {
        mainContent = $("body");
    }

    let html = "";
    const importantTags = [
        "h1",
        "h2",
        "h3",
        "h4",
        "p",
        "blockquote",
        "ul",
        "ol",
        "li",
        "img",
    ];

    mainContent.find(importantTags.join(", ")).each((_, el) => {
        const $el = $(el);
        const tag = el.tagName.toLowerCase();
        const text = $el.text().trim();

        // Skip if text is too short or looks like noise
        if (!text || text.length < 10) return;
        if (isNoiseText(text)) return;

        if (tag === "p") {
            // Only include paragraphs with substantial content
            if (
                text.length > 20 &&
                !text.match(/^(share|like|follow|subscribe|click)/i)
            ) {
                html += `<p>${text}</p>\n\n`;
            }
        } else if (["h1", "h2", "h3", "h4"].includes(tag)) {
            if (text.length > 5 && text.length < 200) {
                html += `<${tag}>${text}</${tag}>\n\n`;
            }
        } else if (tag === "blockquote") {
            if (text.length > 20) {
                html += `<blockquote>${text}</blockquote>\n\n`;
            }
        } else if (tag === "ul" || tag === "ol") {
            const listItems = $el
                .find("li")
                .map((_, li) => $(li).text().trim())
                .get();
            if (listItems.length > 0 && listItems.some((item) => item.length > 10)) {
                const cleanItems = listItems
                    .filter((item) => item.length > 10 && !isNoiseText(item))
                    .map((item) => `<li>${item}</li>`)
                    .join("\n");
                if (cleanItems) {
                    html += `<${tag}>\n${cleanItems}\n</${tag}>\n\n`;
                }
            }
        } else if (tag === "img") {
            const src = $el.attr("src") || $el.attr("data-src");
            const alt = $el.attr("alt") || "";
            if (src && !isNoiseText(alt)) {
                html += `<img src="${src}" alt="${alt}" />\n\n`;
            }
        }
    });

    return html.trim();
};

// Parse content to div HTML - exactly like web version
const parseContentToDivHTML = (cleanText: string): string => {
    // Simple HTML escaping
    const escaped = cleanText
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

    // Convert double newlines to paragraph breaks
    const withParagraphs = escaped
        .split("\n\n")
        .map((paragraph) => paragraph.trim())
        .filter((paragraph) => paragraph.length > 0)
        .map((paragraph) => `<p>${paragraph.replace(/\n/g, "<br />")}</p>`)
        .join("\n");

    return `<div class="article-content">${withParagraphs}</div>`;
};

// Check if text is noise - exactly like web version
const isNoiseText = (text: string): boolean => {
    const noisePatterns = [
        // Social media and sharing
        /^(share|like|follow|subscribe|click here|read more|continue reading)$/i,
        /^(facebook|twitter|instagram|linkedin|pinterest)$/i,

        // Numbers that look like engagement metrics
        /^\d+(\.\d+)?[kKmM]?(\s+(likes?|shares?|views?|comments?))?$/,

        // Navigation and UI text
        /^(menu|home|back|next|previous|search|login|sign up)$/i,
        /^(advertisement|sponsored|promoted)$/i,

        // Copyright and legal
        /^(copyright|©|\(c\)|all rights reserved|terms|privacy)$/i,

        // Empty or very short content
        /^[\s\.\-_]*$/,

        // Cookie notices
        /cookies?|privacy policy|terms of service/i,

        // Newsletter signups
        /newsletter|subscribe|email/i,
    ];

    return noisePatterns.some((pattern) => pattern.test(text.trim()));
};

// Filter important text
const filterImportantText = (rawText: string): string => {
    const lines = rawText
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line);
    const filteredLines = [];

    for (const line of lines) {
        // Skip very short lines (likely noise)
        if (line.length < 15) continue;

        // Skip lines that are clearly noise
        if (isNoiseText(line)) continue;

        // Skip lines with too many special characters (likely navigation/UI)
        const specialCharRatio =
            (line.match(/[^\w\s]/g) || []).length / line.length;
        if (specialCharRatio > 0.3) continue;

        // Skip lines that are all uppercase (likely headings or navigation)
        if (line === line.toUpperCase() && line.length > 5) continue;

        // Skip lines with excessive whitespace
        if (line.match(/\s{3,}/)) continue;

        filteredLines.push(line);
    }

    return filteredLines.join("\n\n");
};

// Extract image URL
const extractImageUrl = ($: cheerio.CheerioAPI, baseUrl: string): string => {
    // Try Open Graph image
    const ogImage = $('meta[property="og:image"]').attr('content');
    if (ogImage && ogImage.length > 0) {
        return ogImage.startsWith('http') ? ogImage : new URL(ogImage, baseUrl).href;
    }

    // Try Twitter image
    const twitterImage = $('meta[name="twitter:image"]').attr('content');
    if (twitterImage && twitterImage.length > 0) {
        return twitterImage.startsWith('http') ? twitterImage : new URL(twitterImage, baseUrl).href;
    }

    // Try article image meta tags
    const articleImage = $('meta[property="article:image"]').attr('content');
    if (articleImage && articleImage.length > 0) {
        return articleImage.startsWith('http') ? articleImage : new URL(articleImage, baseUrl).href;
    }

    // Try first image in content with better filtering
    const images = $('img');
    for (let i = 0; i < images.length; i++) {
        const img = $(images[i]);
        const src = img.attr('src') || img.attr('data-src') || img.attr('data-lazy-src');

        if (src && src.length > 0) {
            // Skip small images, icons, and avatars
            const width = img.attr('width');
            const height = img.attr('height');
            const alt = img.attr('alt') || '';
            const className = img.attr('class') || '';

            // Skip if it's likely an icon or small image
            if (width && parseInt(width) < 100) continue;
            if (height && parseInt(height) < 100) continue;
            if (alt.toLowerCase().includes('icon') || alt.toLowerCase().includes('logo')) continue;
            if (className.toLowerCase().includes('icon') || className.toLowerCase().includes('avatar')) continue;

            const fullUrl = src.startsWith('http') ? src : new URL(src, baseUrl).href;

            // Skip data URLs and invalid URLs
            if (fullUrl.startsWith('data:') || fullUrl.includes('placeholder')) continue;

            return fullUrl;
        }
    }

    // For Hacker News, try to find a relevant image
    if (baseUrl.includes('news.ycombinator.com')) {
        // Look for images in linked articles
        const links = $('a[href*="http"]');
        for (let i = 0; i < Math.min(links.length, 5); i++) {
            const link = $(links[i]);
            const href = link.attr('href');
            if (href && !href.includes('news.ycombinator.com')) {
                // This is an external link, we could potentially fetch it for an image
                // For now, return empty to use placeholder
                break;
            }
        }
    }

    return '';
};

// Main function to extract article data - exactly like web version
export const extractArticleData = async (url: string, customTitle?: string): Promise<ScrapedArticle> => {
    try {
        // Scrape the URL
        const html = await scrapeUrl(url);
        if (!html) {
            throw new Error('Failed to extract article data: No HTML content received');
        }



        // Load HTML into cheerio
        const $ = cheerio.load(html);
        const baseUrl = new URL(url).origin;

        // Enhanced ad and noise removal with smart content preservation
        removeNoiseElementsSmart($);

        // Get page title
        const pageTitle = $("title").text();

        // Extract all the data
        const articleTitle = extractArticleTitle($);
        const description = extractDescription($);
        const canonicalUrl = extractCanonicalUrl($, url);
        const publishDate = extractPublishDate($);
        const author = extractAuthor($);
        const authorImage = extractAuthorImage($, baseUrl);

        // Get og:image
        const ogImage = $('meta[property="og:image"]').attr("content") || "";

        // Extract only the most important content
        const contentHTML = extractImportantContent($);
        const contentText = cheerio.load(contentHTML).text().trim();

        // Clean and filter the text content
        const cleanContent = filterImportantText(contentText);



        // Extract tags/keywords
        const tags: string[] = [];
        const keywords = $('meta[name="keywords"]').attr('content');
        if (keywords) {
            tags.push(...keywords.split(',').map((tag: string) => tag.trim()));
        }

        // For Hacker News, we need special handling
        if (url.includes('news.ycombinator.com')) {
            if (!cleanContent || cleanContent.trim().length < 10) {
                throw new Error('No content could be extracted from this URL. Please try a different article.');
            }

            // For HN, we'll use the title as content if content is too short
            const finalContent = cleanContent.trim().length > 50 ? cleanContent : articleTitle;

            return {
                title: customTitle || articleTitle || 'Hacker News Articles',
                description: description || 'Latest articles from Hacker News',
                content: finalContent,
                htmlContent: contentHTML,
                imageUrl: ogImage,
                author: author || 'Hacker News',
                authorImage,
                publishDate,
                canonicalUrl,
                tags
            };
        }

        // Validate that we have at least a title
        if (!articleTitle) {
            throw new Error('No content could be extracted from this URL. Please try a different article.');
        }

        // Use exact same threshold as web version
        if (!cleanContent || cleanContent.trim().length < 10) {
            throw new Error('No content could be extracted from this URL. Please try a different article.');
        }

        return {
            title: customTitle || articleTitle,
            description,
            content: cleanContent,
            htmlContent: contentHTML,
            imageUrl: ogImage,
            author,
            authorImage,
            publishDate,
            canonicalUrl,
            tags
        };
    } catch (error) {
        throw error;
    }
}; 