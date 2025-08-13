# Link Saving Implementation

## Overview
This document describes the implementation of automatic link saving functionality that matches the web version of ReadSoon. When users extract article details from URLs, the links are automatically saved to the database.

## Database Schema

### Links Table
The application uses a `links` table in Supabase that matches the web version structure:

```sql
CREATE TABLE public.links (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    url TEXT NOT NULL,
    title TEXT,
    description TEXT,
    image_url TEXT,
    domain TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Article metadata
    author TEXT,
    published_date TIMESTAMP WITH TIME ZONE,
    reading_time INTEGER,
    
    -- User interaction
    favorite BOOLEAN DEFAULT false,
    status TEXT DEFAULT 'active',
    
    -- Collections
    collection_id UUID,
    
    -- Additional fields for content storage
    note TEXT, -- Store full article content
    tags TEXT[] DEFAULT '{}'
);
```

## Key Features

### 1. Automatic Link Saving
- **Extract and Save**: When users submit a URL, the app automatically extracts content and saves it to the database
- **No Duplicates**: Prevents saving the same URL multiple times
- **Full Content Storage**: Stores complete article content in the `note` field

### 2. Share Extension Integration
- **iOS Share Extension**: Users can save articles directly from Safari, Chrome, or any app
- **Automatic Processing**: Shared URLs are automatically processed when the app becomes active
- **Seamless Experience**: No manual intervention required

### 3. Data Extraction
- **Title**: Extracted from article metadata
- **Description**: Article summary or first 150 characters
- **Content**: Full article text content
- **Images**: Featured image and additional images
- **Reading Time**: Calculated based on content length
- **Domain**: Source website information

## Implementation Details

### ArticleService
The `ArticleService` class provides methods for managing links:

```typescript
// Save extracted link data directly from API response
static async saveExtractedLink(userId: string, url: string, extractedData: {
    title?: string;
    description?: string;
    text?: string;
    image?: string;
    images?: string[];
    domain?: string;
}): Promise<Article>

// Check if URL is already saved
static async isUrlSaved(userId: string, url: string): Promise<boolean>

// Get all articles for a user
static async getUserArticles(userId: string): Promise<Article[]>
```

### ArticleContext
The `ArticleContext` provides a new method for automatic extraction and saving:

```typescript
// Extract and save article in one step
const extractAndSaveArticle = async (url: string): Promise<Article>
```

### Share Extension Hook
The `useSharedURL` hook handles shared URLs from the iOS share extension:

```typescript
const { isProcessing, processSharedURL } = useSharedURL();
```

## User Flow

### Manual URL Entry
1. User enters URL in the input field
2. App calls `extractAndSaveArticle(url)`
3. Extractor API extracts content
4. Content is automatically saved to database
5. Success message is shown
6. Article appears in saved articles list

### Share Extension
1. User shares URL from Safari/Chrome
2. Share extension saves URL to shared UserDefaults
3. Main app opens via custom URL scheme
4. `useSharedURL` hook detects shared URL
5. App automatically processes and saves the article
6. Article appears in saved articles list

## Error Handling

### Duplicate URLs
- Prevents saving the same URL multiple times
- Shows appropriate error message to user

### Invalid URLs
- Validates URL format before processing
- Shows error message for invalid URLs

### Network Errors
- Handles API failures gracefully
- Provides retry functionality
- Shows user-friendly error messages

### Content Extraction Failures
- Handles cases where no content can be extracted
- Provides fallback content when possible

## Database Relationships

### User Links
- Each link is associated with a user via `user_id`
- Row Level Security (RLS) ensures users can only access their own links
- Cascade deletion removes links when user is deleted

### Collections (Future)
- Links can be organized into collections
- `collection_id` field prepared for future implementation

## Performance Considerations

### Indexing
- Index on `user_id` for fast user-specific queries
- Index on `created_at` for chronological ordering
- Index on `url` for duplicate checking

### Content Storage
- Full article content stored in `note` field
- Images stored as URLs, not binary data
- Efficient querying with proper indexing

## Security

### Row Level Security
- Users can only access their own links
- Proper RLS policies implemented
- Secure user authentication required

### Data Validation
- URL validation before processing
- Content sanitization
- Input validation for all fields

## Testing

### Manual Testing
1. Enter valid article URL
2. Verify content extraction
3. Check database storage
4. Verify duplicate prevention

### Share Extension Testing
1. Share URL from Safari
2. Verify automatic processing
3. Check saved articles list
4. Test error scenarios

## Future Enhancements

### Collections
- Implement collection management
- Allow users to organize articles

### Advanced Metadata
- Extract and store author information
- Store publication dates
- Add reading progress tracking

### Offline Support
- Cache extracted content
- Sync when online
- Offline reading capability

### Analytics
- Track reading patterns
- Monitor extraction success rates
- User engagement metrics

## Configuration

### Environment Variables
```bash
EXPO_PUBLIC_EXTRACTOR_API_KEY=your_api_key
EXPO_PUBLIC_EXTRACTOR_API_URL=https://api.extractor.com
```

### Supabase Configuration
- Database schema must be applied
- RLS policies must be enabled
- Proper user authentication setup required

## Troubleshooting

### Common Issues
1. **URL not saving**: Check user authentication
2. **Duplicate errors**: Verify URL uniqueness
3. **Extraction failures**: Check API configuration
4. **Share extension not working**: Verify App Group setup

### Debug Steps
1. Check console logs for errors
2. Verify database connectivity
3. Test API endpoints directly
4. Check user authentication state 