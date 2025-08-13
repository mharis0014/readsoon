# Text-to-Speech Implementation

## Overview
The ReadSoon app now includes real text-to-speech functionality using `expo-speech`. Users can listen to their saved articles with adjustable playback speed and controls. The TTS system automatically selects a female voice for a more pleasant listening experience.

## Features Implemented

### Core TTS Functionality
- **Real Speech Synthesis**: Uses device's built-in TTS engine
- **Female Voice Selection**: Automatically selects female voices when available
- **Play/Pause/Stop Controls**: Full playback control
- **Speed Adjustment**: 0.5x, 1x, 1.5x, 2x playback speeds
- **Progress Tracking**: Real-time position tracking
- **Auto-completion**: Automatically stops when finished

### User Interface
- **Audio Player Screen**: Dedicated TTS interface
- **Voice Information Display**: Shows current voice name and speed
- **Waveform Visualization**: Visual progress indicator
- **Speed Controls**: Easy speed adjustment
- **Error Handling**: Graceful error messages

## Technical Implementation

### Custom Hook: `useTextToSpeech`
Located in `src/hooks/useTextToSpeech.ts`

**Key Features:**
- Manages TTS state (playing, paused, position, duration)
- Handles speech synthesis with expo-speech
- **Automatic Female Voice Selection**: Prefers female voices
- Provides speed and voice controls
- Automatic cleanup on unmount

**Female Voice Detection:**
The hook automatically detects and selects female voices using:
- Voice name keywords (Samantha, Victoria, Alex, Karen, etc.)
- Language-specific patterns
- Enhanced/premium voice indicators
- Fallback to first available voice if no female voice found

**API:**
```typescript
const {
  state,           // Current TTS state
  speak,           // Start speaking
  pause,           // Pause speech
  resume,          // Resume speech
  stop,            // Stop speech
  seek,            // Seek to position
  updateSpeed,     // Change playback speed
  updateVoice,     // Change voice
  updatePitch,     // Change pitch (future)
  updateVolume,    // Change volume (future)
  getCurrentVoiceName,  // Get current voice name
  getFemaleVoices,      // Get available female voices
} = useTextToSpeech(text);
```

### Integration Points
1. **Article Detail Screen**: "Listen to Article" button
2. **TTS Player Screen**: Full audio player interface with voice info
3. **Article Context**: Provides article content to TTS

## Usage Flow
1. User opens an article in the detail view
2. Taps "Listen to Article" button
3. TTS player opens with article content and female voice
4. User can control playback, adjust speed, see voice info
5. Speech automatically stops when finished

## Voice Selection

### Automatic Female Voice Detection
The system automatically selects female voices using these criteria:
1. **Explicit Female Identifiers**: Names like Samantha, Victoria, Alex, Karen
2. **Language Patterns**: English US/UK enhanced voices
3. **Fallback**: First available voice if no female voice detected

### Supported Female Voice Names
- Samantha (iOS default female voice)
- Victoria (iOS alternative)
- Alex (iOS enhanced)
- Karen (iOS Australian)
- Helena (iOS British)
- Susan, Nancy, Lisa, Sarah
- Emma, Olivia, Ava, Isabella
- Sophia, Charlotte, Mia, Amelia

### Voice Information Display
The TTS player shows:
- Current voice name
- Playback speed
- Real-time progress
- Voice selection options (when multiple female voices available)

## Dependencies
- `expo-speech`: Core TTS functionality
- React Native components for UI
- Custom hooks for state management

## Future Enhancements
- **Voice Selection UI**: Dropdown menu for voice selection
- **Voice Preview**: Test different voices before selecting
- **Sleep timer functionality**
- **Background playback**
- **Offline TTS support**
- **Audio file export**
- **Voice customization**: Pitch, volume, accent preferences

## Testing
The TTS functionality can be tested by:
1. Opening any article with content
2. Tapping the "Listen to Article" button
3. Using the playback controls
4. Adjusting the playback speed
5. Checking the voice information display

## Notes
- TTS uses the device's built-in speech synthesis
- Female voice selection works best on iOS devices
- Performance may vary by device and OS
- Some devices may have limited voice options
- Seeking functionality is approximated (expo-speech limitation)
- Voice selection is automatic but can be customized in future updates 