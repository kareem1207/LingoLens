# LingoLens 🌍📸

**Your AI-Powered Travel Companion**

LingoLens transforms the way you explore the world. Whether you're navigating a foreign menu, deciphering street signs, or discovering cultural treasures, LingoLens acts as your personal local guide—delivering instant translations, rich cultural insights, and practical travel tips, all powered by cutting-edge AI.

## 🎥 Demo

Watch LingoLens in action:

https://github.com/user-attachments/assets/LingoLens.mp4

[Try the Live App](https://ai.studio/apps/drive/1EHRXgHbzcMeONmtRUj0qQffbtsL7rzcX?fullscreenApplet=true)

## ✨ Features

### 🧠 Intelligent Visual Analysis
LingoLens leverages Google's Gemini 3 Pro model to provide contextual understanding that goes far beyond simple translation. Upload any image, and the AI analyzes it to deliver:

- **Vibe Check**: Cultural context and historical background to help you appreciate what you're seeing
- **Pro Tip**: Actionable advice tailored to travelers—from ordering recommendations to etiquette tips
- **Flavor Profile**: Detailed descriptions of ingredients, taste, and preparation methods for food items

### 🗣️ Immersive Audio Experience
Bring your discoveries to life with dynamic text-to-speech powered by Gemini 2.5 Flash. LingoLens offers five distinct AI voice personalities—Kore, Fenrir, Puck, Zephyr, and Charon—each with their own character. Preview voices in the settings panel and choose the one that matches your travel vibe.

### 🌐 True Localization
LingoLens speaks your language. The entire interface adapts to your selected target language, with support for English, Spanish, French, German, Hindi, and Japanese. The AI generates all insights directly in your chosen language, creating a seamless, native experience.

### ⚡ Flexible Workflow
- **Instant Mode**: Enable one-click analysis for rapid-fire exploration
- **Manual Mode**: Review images and fine-tune language settings before processing
- **Persistent Preferences**: Your settings are automatically saved for next time

### 🎨 Premium Design
The interface features a sophisticated glassmorphism aesthetic with deep gradient backgrounds, smooth animations, and carefully crafted micro-interactions that make every tap feel polished and premium.

## 📸 Screenshots

<div align="center">
  <img src="output/output 1.png" alt="LingoLens Home Screen" width="45%">
  <img src="output/output 2.png" alt="Image Upload Interface" width="45%">
</div>

<div align="center">
  <img src="output/output 3.png" alt="AI Analysis Results" width="45%">
  <img src="output/output 4.png" alt="Cultural Insights" width="45%">
</div>

<div align="center">
  <img src="output/output 5.png" alt="Audio Controls" width="45%">
  <img src="output/output 6.png" alt="Voice Selection" width="45%">
</div>

<div align="center">
  <img src="output/output 7.png" alt="Settings Panel" width="45%">
  <img src="output/output 8.png" alt="Language Options" width="45%">
</div>

<div align="center">
  <img src="output/output 9.png" alt="Instant Mode" width="45%">
</div>

## 🛠️ Tech Stack

- **Framework**: React 19 with TypeScript for type-safe, modern development
- **Styling**: Tailwind CSS for rapid, utility-first styling
- **AI Models**: 
  - Vision Analysis: `gemini-3-pro-preview`
  - Text-to-Speech: `gemini-2.5-flash-preview-tts`
- **Build Tool**: Vite for lightning-fast development and optimized builds
- **SDK**: `@google/genai` for seamless integration with Google's Gemini API

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- A Google Gemini API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/kareem1207/LingoLens.git
   cd LingoLens
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure your API key**
   
   Set your Gemini API key as an environment variable or update the configuration file with your credentials.

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## 🎯 Use Cases

- **Restaurant Menus**: Decode unfamiliar dishes and get recommendations
- **Street Signs**: Navigate confidently with instant translations
- **Museum Exhibits**: Understand the history and significance of artifacts
- **Product Labels**: Know what you're buying in local shops
- **Cultural Objects**: Learn about traditional items and their meanings

## 🤝 Contributing

Contributions are welcome! Feel free to submit issues, feature requests, or pull requests to help make LingoLens even better.

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

Built with Google's Gemini API, LingoLens showcases the power of modern AI to break down language barriers and enrich cultural experiences for travelers worldwide.

---

**Made with ❤️ for curious travelers everywhere**