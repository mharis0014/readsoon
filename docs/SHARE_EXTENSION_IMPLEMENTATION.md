# iOS Share Extension Implementation

## Overview
The ReadSoon app now includes an iOS Share Extension that allows users to save articles directly from Safari, Chrome, or any other app that supports sharing URLs.

## Features Implemented

### Share Extension Functionality
- **URL Sharing**: Accepts shared URLs from any app
- **Article Preview**: Shows the URL being shared
- **One-Tap Save**: Save articles directly to ReadSoon
- **Seamless Integration**: Opens main app after saving

### User Experience
- **Native iOS Interface**: Uses standard iOS share extension UI
- **Error Handling**: Graceful handling of invalid URLs
- **Loading States**: Visual feedback during processing
- **Automatic Processing**: Shared URLs are automatically processed in the main app

## Technical Implementation

### iOS Share Extension
**Location**: `ios/ShareExtension/`

**Key Files:**
- `ShareViewController.swift`: Main share extension controller
- `Info.plist`: Extension configuration
- `MainInterface.storyboard`: UI layout

**Features:**
- Processes shared URLs from any app
- Validates URL format
- Saves URL to shared UserDefaults
- Opens main app with custom URL scheme

### React Native Integration
**Hook**: `useSharedURL` in `src/hooks/useSharedURL.ts`

**Features:**
- Monitors for shared URLs when app becomes active
- Handles URL processing and cleanup
- Integrates with existing article fetching system
- Provides loading states and error handling

### Data Sharing
**App Group**: `group.com.zaidmunir-2.readsoon`

**Shared Data:**
- Shared URLs via UserDefaults
- Timestamp for URL validation
- Automatic cleanup of old shared data

## Setup Instructions

### For Users
1. **Enable Share Extension**:
   - Open Safari
   - Navigate to any webpage
   - Tap the Share button (square with arrow)
   - Scroll down and tap "More"
   - Toggle on "ReadSoon"
   - Tap "Done"

2. **Using the Share Extension**:
   - In any app, find an article you want to save
   - Tap Share → ReadSoon
   - Tap "Save Article"
   - ReadSoon will open and process the article

### For Developers
1. **Xcode Configuration**:
   - Add Share Extension target to iOS project
   - Configure App Group entitlements
   - Set up URL schemes for main app

2. **Build and Test**:
   - Build the app with share extension
   - Test on physical device (share extensions don't work in simulator)
   - Verify URL sharing functionality

## File Structure
```
ios/
├── ShareExtension/
│   ├── ShareViewController.swift    # Main extension logic
│   ├── Info.plist                   # Extension configuration
│   └── MainInterface.storyboard     # UI layout
├── AppGroup.entitlements            # App Group configuration
└── readsoon/
    └── Info.plist                   # Main app URL schemes

src/
├── hooks/
│   └── useSharedURL.ts              # Shared URL handling hook
└── ...

app/
├── (tabs)/
│   └── index.tsx                    # Updated to handle shared URLs
└── (auth)/
    └── share-extension-info.tsx     # Setup instructions
```

## Usage Flow
1. **User shares URL**: From Safari, Chrome, or any app
2. **Share extension opens**: Shows URL preview
3. **User taps "Save Article"**: Extension saves URL to shared storage
4. **Main app opens**: ReadSoon launches automatically
5. **Article processing**: URL is fetched and article is saved
6. **User can read**: Article appears in saved articles list

## Configuration

### URL Schemes
- `readsoon://` - Main app scheme
- `com.zaidmunir-2.readsoon://` - Alternative scheme

### App Group
- `group.com.zaidmunir-2.readsoon` - Shared data storage

### Share Extension Activation
- Supports web URLs
- Supports web pages
- Maximum 1 URL at a time

## Error Handling
- **Invalid URLs**: Shows error message in extension
- **Network Errors**: Handled in main app with user feedback
- **Missing Content**: Graceful fallback with helpful messages
- **Extension Setup**: Clear instructions for enabling the extension

## Testing
1. **Enable Extension**: Follow setup instructions
2. **Test URL Sharing**: Share URLs from Safari, Chrome, etc.
3. **Verify Processing**: Check that articles appear in main app
4. **Test Error Cases**: Try invalid URLs, network issues

## Future Enhancements
- **Rich Preview**: Show article title and image in extension
- **Multiple URLs**: Support for sharing multiple articles
- **Custom Actions**: Different save options (read later, favorite, etc.)
- **Background Processing**: Process articles without opening main app
- **Cross-Platform**: Android share intent support

## Notes
- Share extensions only work on physical iOS devices
- Requires proper App Group configuration
- URL schemes must be unique across the App Store
- Extension UI follows iOS design guidelines
- Automatic cleanup prevents data accumulation 