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
    case 'toggleTemporaryChat':
      return handleToggleTemporaryChat();
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

function handleToggleTemporaryChat(): ActionResult {
  // First, blur any active element to ensure the button can be clicked
  if (document.activeElement instanceof HTMLElement) {
    document.activeElement.blur();
  }

  const tempChatButton = queryElement(SELECTORS.tempChatButton);
  
  if (tempChatButton instanceof HTMLElement) {
    // Button is visible, click it directly
    clickTempChatButton(tempChatButton, false);
    return { success: true };
  }
  
  // Button not visible - sidebar might be closed, try opening it first
  const sidebarToggle = queryElement(SELECTORS.sidebarToggle);
  if (sidebarToggle instanceof HTMLElement) {
    sidebarToggle.click();
    
    // Wait for sidebar to open and temp chat button to appear
    waitForElement(SELECTORS.tempChatButton, 500).then((btn) => {
      if (btn instanceof HTMLElement) {
        // Pass true to indicate we need to close sidebar after
        clickTempChatButton(btn, true);
      }
    });
    
    return { success: true };
  }
  
  return { success: false, message: 'Temporary chat button not found' };
}

function clickTempChatButton(button: HTMLElement, closeSidebarAfter: boolean): void {
  button.click();
  
  // After clicking, close sidebar if we opened it
  if (closeSidebarAfter) {
    setTimeout(() => {
      const sidebarToggle = queryElement(SELECTORS.sidebarToggle);
      if (sidebarToggle instanceof HTMLElement) {
        sidebarToggle.click();
      }
    }, 100);
  }
  
  // Prevent Gemini from focusing the input after toggle
  // by re-blurring after a short delay
  setTimeout(() => {
    if (document.activeElement instanceof HTMLElement) {
      const isPromptInput = document.activeElement.matches(
        '[contenteditable="true"], textarea, input[type="text"]'
      );
      if (isPromptInput) {
        document.activeElement.blur();
      }
    }
  }, 150);
}

function handleToggleTheme(): ActionResult {
  // First, blur any active element
  if (document.activeElement instanceof HTMLElement) {
    document.activeElement.blur();
  }

  // Check if theme submenu is already visible (has System/Light/Dark options)
  const existingThemeOptions = getThemeOptions();
  if (existingThemeOptions.length >= 3) {
    selectNextTheme();
    return { success: true };
  }

  // Check if theme button is visible (settings menu is open)
  const themeButton = queryElement(SELECTORS.themeMenuButton);
  if (themeButton instanceof HTMLElement) {
    themeButton.click();
    
    // Wait for theme submenu to appear
    setTimeout(() => {
      selectNextTheme();
    }, 150);
    
    return { success: true };
  }

  // Need to open settings menu first
  const settingsButton = queryElement(SELECTORS.settingsMenuButton);
  if (settingsButton instanceof HTMLElement) {
    settingsButton.click();
    
    // Wait for settings menu to open, then click theme button
    setTimeout(() => {
      const themeBtn = queryElement(SELECTORS.themeMenuButton);
      if (themeBtn instanceof HTMLElement) {
        themeBtn.click();
        
        // Wait for theme submenu to appear
        setTimeout(() => {
          selectNextTheme();
        }, 150);
      } else {
        console.warn('[Gemini Shortcuts] Theme button not found in settings menu');
      }
    }, 150);
    
    return { success: true };
  }

  return { success: false, message: 'Settings menu not found.' };
}

/**
 * Get theme options, filtering to only System/Light/Dark
 * Looks for menu items in the theme submenu (not the main settings menu)
 */
function getThemeOptions(): Element[] {
  // Get all mat-mdc-menu-panel elements (the actual menu containers)
  const menuPanels = document.querySelectorAll('.mat-mdc-menu-panel');
  
  // Find the theme submenu by looking for a panel with exactly 3 items: System, Light, Dark
  for (const panel of menuPanels) {
    const menuItems = panel.querySelectorAll('.mat-mdc-menu-item, [role="menuitem"]');
    const themeOptions: Element[] = [];
    
    for (const item of menuItems) {
      // Get the text from the gds-label-l span or direct text content
      const labelSpan = item.querySelector('.gds-label-l');
      const text = (labelSpan?.textContent || item.textContent || '').toLowerCase().trim();
      
      // Match theme options
      if (text === 'system' || text === 'light' || text === 'dark') {
        themeOptions.push(item);
      }
    }
    
    // Theme submenu should have exactly 3 options
    if (themeOptions.length === 3) {
      return themeOptions;
    }
  }
  
  return [];
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

  // Find the currently selected theme by checking for check_circle icon
  let currentIndex = -1;
  options.forEach((option, index) => {
    // Check for check_circle icon inside the menu item
    const hasCheckIcon = option.querySelector('mat-icon[fonticon="check_circle"]');
    if (hasCheckIcon) {
      currentIndex = index;
    }
  });

  // Select the next theme (cycle through: System -> Light -> Dark -> System)
  const nextIndex = (currentIndex + 1) % options.length;
  const nextOption = options[nextIndex];

  if (nextOption instanceof HTMLElement) {
    nextOption.click();
    
    // Close the settings menu after selecting theme
    setTimeout(() => {
      closeOverlay();
    }, 100);
  }
}
