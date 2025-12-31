# Chrome Web Store Submission Guide

**Last Updated: December 31, 2025**

This document contains the complete answers and justifications for submitting the Gemini Keyboard Shortcuts extension to the Chrome Web Store.

## Single Purpose Description

**Answer**: More efficient when using Gemini Web

*Alternative*: "Adds customizable keyboard shortcuts to Google Gemini for faster navigation and interaction"

## Permission Justifications

### Storage Permission Justification
```
The storage permission is required to save and sync user preferences across devices. Specifically, it stores:
1. Customized keyboard shortcut configurations (which keys trigger which actions)
2. Extension enabled/disabled state

Data is stored using chrome.storage.sync API, keeping it local to the user's browser and synced across their signed-in devices. No data is sent to external servers.
```

### Host Permission Justification
```
The host permission for "*://gemini.google.com/*" is required because this extension adds keyboard shortcuts to the Google Gemini website. The content script must be injected into gemini.google.com to:
1. Listen for keyboard events on the page
2. Execute navigation and UI actions (like focusing input, switching conversations, copying responses)
3. Display a help overlay showing available shortcuts

The extension ONLY runs on gemini.google.com and does not access any other websites.
```

## Remote Code

**Answer**: No, I am not using Remote code

**Justification**: Not required (since answer is "No")

*Explanation*: All JavaScript is bundled within the extension package. No external scripts, modules, or eval() usage.

## Data Usage

### What user data do you plan to collect?

**Select NONE of the checkboxes** - the extension collects no user data.

- ❌ Personally identifiable information
- ❌ Health information
- ❌ Financial and payment information
- ❌ Authentication information
- ❌ Personal communications
- ❌ Location
- ❌ Web history
- ❌ User activity
- ❌ Website content

### Certifications

**Check all three boxes**:

- ✅ I do not sell or transfer user data to third parties, outside of the approved use cases
- ✅ I do not use or transfer user data for purposes that are unrelated to my item's single purpose
- ✅ I do not use or transfer user data to determine creditworthiness or for lending purposes

## Privacy Policy URL

**Required**: Yes (extension collects user preferences, so needs privacy policy)

**URL Options** (choose one):

1. **GitHub Pages** (recommended): `https://k4lok.github.io/gemini-shortcuts/privacy-policy`
2. **GitHub Raw**: `https://raw.githubusercontent.com/k4lok/gemini-shortcuts/main/docs/privacy-policy.md`
3. **GitHub Wiki**: `https://github.com/k4lok/gemini-shortcuts/wiki/Privacy-Policy`

## Extension Manifest Details

```json
{
  "manifest_version": 3,
  "name": "Gemini Keyboard Shortcuts",
  "description": "Add keyboard shortcuts to Google Gemini for faster navigation",
  "version": "1.0.0",
  "permissions": ["storage"],
  "content_scripts": [
    {
      "matches": ["*://gemini.google.com/*"],
      "js": ["content-scripts/content.js"]
    }
  ]
}
```

## Data Collection Summary

**What the extension stores locally**:
- Keyboard shortcut configurations (user preferences)
- Extension enabled/disabled state

**What the extension does NOT collect**:
- Personal information (name, email, etc.)
- Conversations with Google Gemini
- Browsing history
- Cookies or tracking data
- Analytics or usage statistics
- Any data sent to external servers

## Review Notes

- **Host Permission Warning**: Due to the host permission, your extension may require in-depth review which will delay publishing.
- **Single Purpose**: The extension has a clear, narrow purpose focused on keyboard shortcuts for Gemini.
- **Permissions**: Only uses "storage" permission - no unnecessary permissions requested.
- **Privacy**: Zero data collection means minimal privacy concerns.

## Submission Checklist

- [ ] Single purpose description entered
- [ ] Storage permission justified
- [ ] Host permission justified
- [ ] Remote code set to "No"
- [ ] All data collection checkboxes unchecked
- [ ] All three certifications checked
- [ ] Privacy policy URL provided and accessible
- [ ] Privacy policy content matches actual extension behavior
- [ ] Extension tested and working properly
- [ ] Icons and screenshots prepared (if required)

## Additional Resources

- [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/developer/dashboard)
- [Chrome Extension Developer Guide](https://developer.chrome.com/docs/extensions/)
- [Privacy Policy FAQ](https://developer.chrome.com/docs/webstore/troubleshooting/#privacy-policy)
