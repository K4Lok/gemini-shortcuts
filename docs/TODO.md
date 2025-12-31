# TODO & Roadmap

This document tracks planned features, improvements, and ideas for future development.

---

## 🚀 High Priority

### Global Gemini Search Hotkey
- [ ] Browser-wide shortcut (e.g., `⌘⇧G` / `Ctrl+Shift+G`) to trigger quick search
- [ ] Popup input window for entering queries
- [ ] On submit, open new tab with `gemini.google.com` and auto-fill the prompt
- [ ] Research: Can we use `chrome.commands` for global shortcuts?

### Enhanced Settings Page UI
- [ ] Better visual design with cleaner layout
- [ ] Group shortcuts by category (Navigation, Actions, etc.)
- [ ] Add search/filter for shortcuts
- [ ] Show shortcut conflict warnings
- [ ] Add import/export settings feature

---

## 🎯 Medium Priority

### Additional Shortcuts
- [ ] Edit last message (`⌘E` / `Ctrl+E`)
- [ ] Navigate between responses (up/down arrows when not in input)
- [ ] Jump to first/last response
- [ ] Toggle voice input
- [ ] Open/close specific Gems
- [ ] Pin/unpin current conversation
- [ ] Share conversation shortcut

### UX Improvements
- [ ] Toast notifications when shortcuts execute (optional)
- [ ] Shortcut recording improvements (show preview of keys pressed)
- [ ] Better help overlay design with categories
- [ ] Onboarding tutorial for new users
- [ ] Visual feedback when shortcut is triggered

### Technical Improvements
- [ ] Add unit tests for shortcut matching logic
- [ ] Add E2E tests with Playwright
- [ ] Better error handling and logging
- [ ] Performance optimization for DOM queries
- [ ] Debounce rapid shortcut presses

---

## 💡 Ideas / Backlog

### Features to Explore
- [ ] Vim-style modal shortcuts (optional mode)
- [ ] Context-aware shortcuts (different shortcuts based on state)
- [ ] Integration with other AI assistants (Claude, ChatGPT?)

### Accessibility
- [ ] Screen reader support improvements
- [ ] High contrast mode
- [ ] Reduce motion option
- [ ] Keyboard-only navigation for all extension UI

### Distribution
- [ ] Publish to Chrome Web Store
- [ ] Publish to Firefox Add-ons
- [ ] Publish to Edge Add-ons
- [ ] Create promotional materials (screenshots, video)
- [ ] Write blog post / launch announcement

---

## 🐛 Known Issues

- [ ] Toggle theme may need multiple presses on some screen sizes
- [ ] Model toggle button selector might break with Gemini updates
- [ ] Help overlay z-index conflicts with some Gemini modals

---

## ✅ Completed

- [x] Basic keyboard shortcut engine
- [x] Content script with keydown listener
- [x] Toggle sidebar shortcut
- [x] Focus input shortcut
- [x] Copy last response shortcut
- [x] Toggle model shortcut (desktop + mobile)
- [x] Toggle theme shortcut (desktop + mobile)
- [x] Help overlay with all shortcuts
- [x] Settings page with customization
- [x] Shortcut recording feature
- [x] Reset to defaults functionality
- [x] Popup quick reference view
- [x] shadcn/ui integration
- [x] Zustand state management
- [x] Chrome storage sync
- [x] Show Gemini built-in shortcuts in help

---

## 📝 Notes

### Gemini DOM Stability
Gemini's HTML structure can change frequently. Current selectors are based on:
- `data-test-id` attributes (most stable)
- `aria-label` attributes
- Material Design component classes

Monitor for breaking changes after Gemini updates.

### Browser Extension APIs
- `chrome.commands` - For browser-wide shortcuts (limited to 4)
- `chrome.omnibox` - For address bar integration
- `chrome.storage.sync` - For cross-device sync
- Content scripts - For page interaction

### Resources
- [WXT Documentation](https://wxt.dev/)
- [Chrome Extension Docs](https://developer.chrome.com/docs/extensions/)
- [Firefox Add-on Docs](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions)

