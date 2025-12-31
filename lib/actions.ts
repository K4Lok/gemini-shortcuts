import type { ShortcutActionId } from './types';
import { SELECTORS, queryElement, queryAllElements, focusElement, waitForElement } from './selectors';

/**
 * Result of an action execution
 */
interface ActionResult {
  success: boolean;
  message?: string;
}

/**
 * Execute a shortcut action
 */
export function executeAction(actionId: ShortcutActionId): ActionResult {
  switch (actionId) {
    case 'toggleSidebar':
      return handleToggleSidebar();
    case 'focusInput':
      return handleFocusInput();
    case 'showHelp':
      return handleShowHelp();
    case 'copyLastResponse':
      return handleCopyLastResponse();
    case 'stopGeneration':
      return handleStopGeneration();
    case 'toggleModel':
      return handleToggleModel();
    case 'toggleTheme':
      return handleToggleTheme();
    default:
      return { success: false, message: `Unknown action: ${actionId}` };
  }
}

function handleToggleSidebar(): ActionResult {
  const button = queryElement(SELECTORS.sidebarToggle);
  if (button instanceof HTMLElement) {
    button.click();
    return { success: true };
  }
  return { success: false, message: 'Sidebar toggle not found' };
}

function handleFocusInput(): ActionResult {
  const input = queryElement(SELECTORS.promptInput);
  if (input) {
    focusElement(input);
    return { success: true };
  }
  return { success: false, message: 'Prompt input not found' };
}

function handleShowHelp(): ActionResult {
  // This will be handled by the content script which has access to shortcuts
  // Dispatch a custom event that the content script will listen for
  window.dispatchEvent(new CustomEvent('gemini-shortcuts:toggle-help'));
  return { success: true };
}

function handleCopyLastResponse(): ActionResult {
  // First, try to find and click the copy button directly
  const copyButtons = queryAllElements(SELECTORS.copyButton);
  if (copyButtons.length > 0) {
    // Get the last copy button (most recent response)
    const lastCopyButton = copyButtons[copyButtons.length - 1];
    if (lastCopyButton instanceof HTMLElement) {
      lastCopyButton.click();
      return { success: true, message: 'Clicked copy button' };
    }
  }

  // Fallback: Try to get text content from response containers
  const responses = queryAllElements(SELECTORS.responseContainer);
  if (responses.length === 0) {
    return { success: false, message: 'No responses found' };
  }

  // Get the last response
  const lastResponse = responses[responses.length - 1];
  const text = lastResponse.textContent?.trim();

  if (!text) {
    return { success: false, message: 'Response text is empty' };
  }

  // Copy to clipboard
  navigator.clipboard.writeText(text).catch((err) => {
    console.error('Failed to copy response:', err);
  });

  return { success: true, message: 'Copied to clipboard' };
}

function handleStopGeneration(): ActionResult {
  const button = queryElement(SELECTORS.stopButton);
  if (button instanceof HTMLElement) {
    button.click();
    return { success: true };
  }
  // Escape might not always have a stop button visible, so don't report failure
  return { success: true };
}

function handleToggleModel(): ActionResult {
  // First, blur any active element to ensure the model switcher can be clicked
  // This is important when focus is in the textarea
  if (document.activeElement instanceof HTMLElement) {
    document.activeElement.blur();
  }

  // Find the model switcher button (works on both desktop and mobile)
  const switcherButton = queryElement(SELECTORS.modelSwitcher);
  if (!(switcherButton instanceof HTMLElement)) {
    return { success: false, message: 'Model switcher not found' };
  }

  // Check if menu is already open by looking for menu options
  const existingOptions = queryAllElements(SELECTORS.modelOptions);
  
  if (existingOptions.length === 0) {
    // Menu is not open, click to open it
    switcherButton.click();
    
    // Wait for menu to open and then select next model
    waitForElement(SELECTORS.modelOptions, 500).then((option) => {
      if (!option) {
        console.warn('[Gemini Shortcuts] Model options not found after opening menu');
        return;
      }
      
      // Small delay to ensure all options are rendered
      setTimeout(() => {
        selectNextModel();
      }, 100);
    });
  } else {
    // Menu is already open, select next model immediately
    selectNextModel();
  }

  return { success: true };
}

function selectNextModel(): void {
  const options = queryAllElements(SELECTORS.modelOptions);
  if (options.length === 0) {
    console.warn('[Gemini Shortcuts] No model options found');
    return;
  }

  // Find the currently selected model by checking for the check icon or is-selected class
  let currentIndex = -1;
  options.forEach((option, index) => {
    // Check various indicators of selection
    const hasCheckIcon = option.querySelector('mat-icon[fonticon="check_circle"]');
    const isSelected = option.classList.contains('is-selected');
    const ariaChecked = option.getAttribute('aria-checked') === 'true';
    
    if (hasCheckIcon || isSelected || ariaChecked) {
      currentIndex = index;
    }
  });

  // Select the next model (cycle through)
  const nextIndex = (currentIndex + 1) % options.length;
  const nextOption = options[nextIndex];

  if (nextOption instanceof HTMLElement) {
    nextOption.click();
  }
}

function handleToggleTheme(): ActionResult {
  // First, blur any active element
  if (document.activeElement instanceof HTMLElement) {
    document.activeElement.blur();
  }

  // Check if theme options are already visible (theme submenu/bottom sheet is open)
  const existingThemeOptions = getThemeOptions();
  if (existingThemeOptions.length > 0) {
    selectNextTheme();
    return { success: true };
  }

  // Check if theme button is visible (settings menu is open)
  const themeButton = queryElement(SELECTORS.themeMenuButton);
  if (themeButton instanceof HTMLElement) {
    themeButton.click();
    
    // Wait for theme options to appear and select next
    waitForElement(SELECTORS.themeOptions, 1000).then(() => {
      // Give extra time for all options to render
      setTimeout(() => {
        selectNextTheme();
      }, 150);
    });
    
    return { success: true };
  }

  // Need to open settings menu first
  const settingsButton = queryElement(SELECTORS.settingsMenuButton);
  if (settingsButton instanceof HTMLElement) {
    settingsButton.click();
    
    // Wait for settings menu to open, then click theme button
    waitForElement(SELECTORS.themeMenuButton, 1000).then((themeBtn) => {
      if (themeBtn instanceof HTMLElement) {
        // Small delay before clicking theme button
        setTimeout(() => {
          themeBtn.click();
          
          // Wait for theme options to appear
          waitForElement(SELECTORS.themeOptions, 1000).then(() => {
            // Give extra time for all options to render
            setTimeout(() => {
              selectNextTheme();
            }, 150);
          });
        }, 100);
      }
    });
    
    return { success: true };
  }

  return { success: false, message: 'Settings menu not found.' };
}

/**
 * Get theme options, filtering to only System/Light/Dark
 */
function getThemeOptions(): Element[] {
  const allOptions = queryAllElements(SELECTORS.themeOptions);
  
  // Filter to only theme-related options by checking text content
  return allOptions.filter((option) => {
    const text = option.textContent?.toLowerCase() || '';
    return text.includes('system') || text.includes('light') || text.includes('dark');
  });
}

/**
 * Close any open overlay/modal by clicking the backdrop or pressing Escape
 */
function closeOverlay(): void {
  // Try clicking the backdrop
  const backdrop = queryElement(SELECTORS.overlayBackdrop);
  if (backdrop instanceof HTMLElement) {
    backdrop.click();
    return;
  }
  
  // Fallback: dispatch Escape key
  document.dispatchEvent(new KeyboardEvent('keydown', {
    key: 'Escape',
    code: 'Escape',
    bubbles: true,
    cancelable: true,
  }));
}

function selectNextTheme(): void {
  const options = getThemeOptions();
  if (options.length === 0) {
    console.warn('[Gemini Shortcuts] No theme options found');
    return;
  }

  console.log('[Gemini Shortcuts] Found theme options:', options.length);

  // Find the currently selected theme by checking for check icon
  let currentIndex = -1;
  options.forEach((option, index) => {
    // Check for check_circle icon (both mobile and desktop)
    const hasCheckIcon = option.querySelector('mat-icon[fonticon="check_circle"]');
    const ariaChecked = option.getAttribute('aria-checked') === 'true';
    const isSelected = option.classList.contains('is-selected');
    
    if (hasCheckIcon || ariaChecked || isSelected) {
      currentIndex = index;
    }
  });

  console.log('[Gemini Shortcuts] Current theme index:', currentIndex);

  // Select the next theme (cycle through)
  const nextIndex = (currentIndex + 1) % options.length;
  const nextOption = options[nextIndex];

  console.log('[Gemini Shortcuts] Selecting theme index:', nextIndex);

  if (nextOption instanceof HTMLElement) {
    nextOption.click();
    
    // Close the overlay/modal after a short delay
    setTimeout(() => {
      closeOverlay();
    }, 100);
  }
}
