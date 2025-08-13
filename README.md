# ReadSoon

ReadSoon is a mobile app that allows users to save and organize articles they find online. The app provides a clean, modern interface for reading saved articles and even includes a text-to-speech feature for listening to content on the go.

## Features

- **Save Articles**: Enter any URL to save articles for later reading
- **Organize Content**: Keep all your reading material in one place
- **Text-to-Speech**: Listen to your articles when you can't read (powered by Lemonfox AI)
- **User Authentication**: Secure login with email or Google
- **Clean UI**: Modern, intuitive interface for a great reading experience
- **Dark Mode**: Comfortable reading in any lighting conditions

## Tech Stack

- **React Native**: Cross-platform mobile framework
- **Expo**: Development toolchain and runtime
- **TypeScript**: Type-safe JavaScript
- **React Navigation**: Navigation library
- **Supabase** (planned): Backend and authentication
- **Expo Router**: File-based routing

## Screens

1. **Onboarding**: Introduction to the app's features
2. **Authentication**: Login and signup flows
3. **Home**: URL input and article preview
4. **Saved Articles**: List of saved content
5. **Article Detail**: Full article view with text-to-speech option
6. **Text-to-Speech Player**: Audio player interface
7. **Notifications**: User notifications
8. **Profile/Settings**: User preferences and account management

## Getting Started

### Prerequisites

- Node.js (v14 or newer)
- npm or yarn
- Expo CLI
- Lemonfox AI API key (for text-to-speech functionality)

### Environment Setup

1. Create a `.env` file in the root directory:
   ```
   EXPO_PUBLIC_LEMONFOX_API_KEY=your_lemonfox_api_key_here
   ```

2. Get your Lemonfox AI API key:
   - Sign up at [Lemonfox AI](https://lemonfox.ai)
   - Navigate to your API settings
   - Copy your API key and paste it in the `.env` file

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/readsoon.git
cd readsoon
   ```

2. Install dependencies:
   ```
   npm install
   ```
   or
   ```
   yarn install
   ```

3. Start the development server:
   ```
   npx expo start
   ```

4. Open the app on your device using the Expo Go app or run on a simulator.

## Project Structure

```
readsoon/
├── app/                 # Main app screens and navigation
│   ├── (auth)/          # Authentication screens
│   ├── (onboarding)/    # Onboarding screens
│   ├── (tabs)/          # Main tab screens
│   └── _layout.tsx      # Root layout with navigation setup
├── assets/              # Images, fonts, and other static files
├── components/          # Reusable UI components
│   ├── ui/              # Basic UI building blocks
│   └── ...              # Feature-specific components
├── constants/           # App constants and configuration
├── context/             # React Context for state management
├── hooks/               # Custom React hooks
└── ...
```

## Current Status

This is a frontend prototype with mock data and simulated functionality. Backend integration with Supabase is planned for future development.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Design inspiration from various reading apps
- Expo team for the excellent development tools
- React Native community for the robust ecosystem
