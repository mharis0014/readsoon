import * as Speech from 'expo-speech';

// Helper function to find a female voice
export const findFemaleVoice = (voices: Speech.Voice[]): string | null => {
    // Common female voice identifiers
    const femaleKeywords = [
        'female', 'woman', 'girl', 'samantha', 'victoria', 'alex', 'karen',
        'helena', 'susan', 'nancy', 'lisa', 'sarah', 'emma', 'olivia',
        'ava', 'isabella', 'sophia', 'charlotte', 'mia', 'amelia'
    ];

    // First, try to find voices with explicit female identifiers
    for (const voice of voices) {
        const voiceName = voice.name?.toLowerCase() || '';
        if (femaleKeywords.some(keyword => voiceName.includes(keyword))) {
            return voice.identifier;
        }
    }

    // If no explicit female voice found, try to find voices that are commonly female
    // based on language and region
    for (const voice of voices) {
        const voiceLanguage = voice.language?.toLowerCase() || '';
        if (voiceLanguage.includes('en-us') || voiceLanguage.includes('en-gb')) {
            const voiceName = voice.name?.toLowerCase() || '';
            if (voiceName.includes('enhanced') || voiceName.includes('premium')) {
                return voice.identifier;
            }
        }
    }

    // If still no female voice found, return the first available voice
    return voices.length > 0 ? voices[0].identifier : null;
};
