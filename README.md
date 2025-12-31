# Gemini Keyboard Shortcuts

A browser extension that adds keyboard shortcuts to Google Gemini, making your AI conversations faster and more efficient.

![Chrome Web Store](https://img.shields.io/badge/Chrome-Extension-green)
![Firefox Add-on](https://img.shields.io/badge/Firefox-Add--on-orange)
![License](https://img.shields.io/badge/License-MIT-blue)

## Features

- **Custom Keyboard Shortcuts** - Navigate Gemini with customizable key combinations
- **Toggle AI Models** - Quickly switch between Fast, Thinking, and Pro modes
- **Theme Switching** - Cycle through System, Light, and Dark themes
- **Help Overlay** - Press `⌘/` to see all available shortcuts at a glance
- **Cross-Browser Support** - Works on Chrome, Firefox, and Edge
- **Sync Across Devices** - Your shortcut preferences sync via browser storage

## Default Shortcuts

### Gemini Built-in
| Action | Mac | Windows/Linux |
|--------|-----|---------------|
| New Chat | `⌘⇧O` | `Ctrl+Shift+O` |
| Search Conversations | `⌘⇧K` | `Ctrl+Shift+K` |

### Extension Shortcuts
| Action | Mac | Windows/Linux |
|--------|-----|---------------|
| Show Help | `⌘/` | `Ctrl+/` |
| Focus Input | `/` | `/` |
| Toggle Sidebar | `⌘⇧S` | `Ctrl+Shift+S` |
| Toggle Model | `⌘⇧M` | `Ctrl+Shift+M` |
| Stop Generation | `Esc` | `Esc` |
| Copy Last Response | `⌘⇧C` | `Ctrl+Shift+C` |
| Toggle Theme | `⌘⇧T` | `Ctrl+Shift+T` |

## Installation

### Chrome Web Store
1. Visit the [Chrome Web Store](#) (link coming soon)
2. Click "Add to Chrome"
3. Navigate to [gemini.google.com](https://gemini.google.com)
4. Press `⌘/` (Mac) or `Ctrl+/` (Windows) to see all shortcuts

### Firefox Add-ons
1. Visit [Firefox Add-ons](#) (link coming soon)
2. Click "Add to Firefox"

### Manual Installation (Development)
```bash
# Clone the repository
git clone https://github.com/k4lok/gemini-shortcuts.git
cd gemini-shortcuts

# Install dependencies
bun install

# Build for Chrome
bun run build

# Build for Firefox
bun run build:firefox
```

Then load the extension:
- **Chrome**: Go to `chrome://extensions/`, enable Developer Mode, click "Load unpacked", select `.output/chrome-mv3`
- **Firefox**: Go to `about:debugging#/runtime/this-firefox`, click "Load Temporary Add-on", select any file in `.output/firefox-mv2`

## Development

```bash
# Start development server with hot reload
bun run dev

# Start development for Firefox
bun run dev:firefox

# Type check
bun run compile

# Build for production
bun run build

# Create distributable ZIP
bun run zip
```

## Tech Stack

- **Framework**: [WXT](https://wxt.dev/) - Modern Web Extension Framework
- **UI Library**: React 19 with TypeScript
- **Styling**: Tailwind CSS v4 + shadcn/ui
- **State Management**: Zustand
- **Package Manager**: Bun

## Project Structure

```
├── entrypoints/
│   ├── content.ts        # Keyboard shortcut engine
│   ├── background.ts     # Service worker
│   ├── popup/            # Extension popup UI
│   └── options/          # Settings page
├── lib/
│   ├── types.ts          # TypeScript interfaces
│   ├── defaults.ts       # Default shortcut configurations
│   ├── storage.ts        # Chrome storage utilities
│   ├── selectors.ts      # Gemini DOM selectors
│   ├── actions.ts        # Shortcut action handlers
│   └── help-overlay.ts   # In-page help modal
├── components/           # React components
├── stores/               # Zustand stores
└── public/               # Static assets
```

## Customization

1. Click the extension icon in your browser toolbar
2. Click "Settings" to open the options page
3. Click on any shortcut badge to record a new key combination
4. Toggle shortcuts on/off using the switch
5. Click "Reset All" to restore defaults

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Roadmap

- [ ] Global Gemini search hotkey (browser-wide quick search)
- [ ] Enhanced settings page UI
- [ ] More shortcut actions

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [WXT Framework](https://wxt.dev/) for the excellent extension development experience
- [shadcn/ui](https://ui.shadcn.com/) for beautiful UI components
- Google Gemini team for building an amazing AI assistant

---

**Note**: This extension is not affiliated with Google. Gemini is a trademark of Google LLC.
