/**
 * UI Interaction Module
 * Handles all user interface interactions and DOM manipulation
 */

/**
 * Gets DOM elements and caches them for performance
 * @returns {Object} - Object containing all needed DOM elements
 */
function getDomElements() {
    return {
        inputText: document.getElementById('input-text'),
        outputText: document.getElementById('output-text'),
        parseBtn: document.getElementById('parse-btn'),
        clearBtn: document.getElementById('clear-btn'),
        copyBtn: document.getElementById('copy-btn'),
        copyFeedback: document.getElementById('copy-feedback'),
        detectBadge: document.getElementById('detect-badge')
    };
}

/**
 * Sets up event listeners for all interactive elements
 * @param {Object} elements - DOM elements object from getDomElements()
 */
function setupEventListeners(elements) {
    // Auto-detect mode on paste
    elements.inputText.addEventListener('paste', () => {
        setTimeout(() => autoDetectMode(elements), 0);
    });

    // Parse button - processes the input text
    elements.parseBtn.addEventListener('click', () => {
        handleParse(elements);
    });

    // Clear button - resets both textareas
    elements.clearBtn.addEventListener('click', () => {
        handleClear(elements);
    });

    // Copy button - copies output to clipboard
    elements.copyBtn.addEventListener('click', () => {
        handleCopy(elements);
    });

    // Input textarea - enable/disable parse button based on content
    elements.inputText.addEventListener('input', () => {
        updateParseButtonState(elements);
    });

    // Keyboard shortcuts for better UX
    document.addEventListener('keydown', (event) => {
        handleKeyboardShortcuts(event, elements);
    });
}

/**
 * Handles the parse button click
 * @param {Object} elements - DOM elements object
 */
function handleParse(elements) {
    const inputText = elements.inputText.value.trim();

    if (!inputText) {
        showMessage(elements.outputText, 'Please enter some text to parse.', 'error');
        return;
    }

    const detectedMode = detectInputType(inputText);

    if (!detectedMode) {
        showMessage(elements.outputText, 'Could not detect input type — paste Kingdom News or Province Logs text.', 'error');
        return;
    }

    const modeLabels = { 'kingdom-news-log': 'Kingdom News', 'province-logs': 'Province Logs' };
    elements.detectBadge.textContent = `Auto-detected: ${modeLabels[detectedMode]}`;
    elements.detectBadge.classList.remove('hidden');

    try {
        let parsedText;
        if (detectedMode === 'kingdom-news-log') {
            parsedText = parseKingdomNewsLog(inputText);
        } else {
            parsedText = formatProvinceLogs(inputText);
        }

        elements.outputText.value = parsedText;
        showMessage(elements.outputText, `${modeLabels[detectedMode]} parsed successfully!`, 'success');

        if (window.innerWidth < 768) {
            elements.outputText.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

    } catch (error) {
        console.error('Parsing error:', error);
        showMessage(elements.outputText, 'Error parsing text. Please check your input.', 'error');
    }
}

/**
 * Handles the clear button click
 * @param {Object} elements - DOM elements object
 */
function handleClear(elements) {
    elements.inputText.value = '';
    elements.outputText.value = '';
    hideMessage(elements.outputText);
    elements.detectBadge.classList.add('hidden');
    updateParseButtonState(elements);
    
    // Focus back to input for better UX
    elements.inputText.focus();
}

/**
 * Handles copying text to clipboard with mobile and WYSIWYG forum compatibility
 * @param {Object} elements - DOM elements object
 */
async function handleCopy(elements) {
    const outputText = elements.outputText.value.trim();
    
    if (!outputText) {
        showCopyFeedback(elements.copyFeedback, 'No text to copy!', 'error');
        return;
    }

    try {
        // Use modern Clipboard API with fallback for mobile
        if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(outputText);
            showCopyFeedback(elements.copyFeedback, 'Copied to clipboard!', 'success');
        } else {
            // Fallback for older browsers and some mobile contexts
            fallbackCopyToClipboard(outputText);
            showCopyFeedback(elements.copyFeedback, 'Copied to clipboard!', 'success');
        }
        
        // Select the text for visual feedback and manual copy fallback
        elements.outputText.select();
        elements.outputText.setSelectionRange(0, 99999); // For mobile
        
    } catch (error) {
        console.error('Copy failed:', error);
        // Always provide fallback
        fallbackCopyToClipboard(outputText);
        showCopyFeedback(elements.copyFeedback, 'Text selected - copy manually', 'warning');
        
        // Select text as fallback for manual copy
        elements.outputText.select();
        elements.outputText.setSelectionRange(0, 99999);
    }
}

/**
 * Fallback method for copying text (older browsers and mobile)
 * @param {string} text - Text to copy
 */
function fallbackCopyToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    textArea.style.fontSize = '16px'; // Prevent zoom on iOS
    textArea.style.padding = '0';
    textArea.style.border = 'none';
    textArea.style.whiteSpace = 'pre'; // Preserve line breaks
    textArea.style.wordWrap = 'normal'; // Prevent unwanted wrapping
    document.body.appendChild(textArea);
    
    // Ensure focus for mobile compatibility
    textArea.focus();
    textArea.select();
    textArea.setSelectionRange(0, 99999); // For mobile devices
    
    try {
        const successful = document.execCommand('copy');
        if (!successful) {
            console.warn('Fallback copy was not successful');
        }
    } catch (error) {
        console.error('Fallback copy failed:', error);
    }
    
    // Clean up
    document.body.removeChild(textArea);
}

/**
 * Detects input type from pasted text and auto-selects the matching mode
 * @param {Object} elements - DOM elements object
 */
function autoDetectMode(elements) {
    const text = elements.inputText.value;
    if (!text.trim()) return;

    const detected = detectInputType(text);
    if (!detected) return;

    const modeLabels = { 'kingdom-news-log': 'Kingdom News', 'province-logs': 'Province Logs' };
    elements.detectBadge.textContent = `Auto-detected: ${modeLabels[detected]}`;
    elements.detectBadge.classList.remove('hidden');
}

/**
 * Updates the parse button state based on input content
 * @param {Object} elements - DOM elements object
 */
function updateParseButtonState(elements) {
    const hasText = elements.inputText.value.trim().length > 0;
    elements.parseBtn.disabled = !hasText;
    elements.parseBtn.style.opacity = hasText ? '1' : '0.6';
}

/**
 * Shows a temporary message in the output textarea
 * @param {HTMLElement} target - Element to show message in
 * @param {string} message - Message to display
 * @param {string} type - 'success' or 'error'
 */
function showMessage(target, message, type) {
    const originalValue = target.value;
    const originalPlaceholder = target.placeholder;
    
    target.value = message;
    target.style.color = type === 'error' ? '#e53e3e' : '#38a169';
    
    setTimeout(() => {
        target.value = originalValue;
        target.placeholder = originalPlaceholder;
        target.style.color = '';
    }, 2000);
}

/**
 * Shows copy feedback message with mobile-friendly styling
 * @param {HTMLElement} element - Feedback element
 * @param {string} message - Message to show
 * @param {string} type - 'success', 'error', or 'warning'
 */
function showCopyFeedback(element, message, type) {
    element.textContent = message;
    element.className = 'feedback';
    
    if (type === 'error') {
        element.style.background = '#fed7d7';
        element.style.color = '#742a2a';
    } else if (type === 'warning') {
        element.style.background = '#feebc8';
        element.style.color = '#744210';
    } else {
        element.style.background = '#c6f6d5';
        element.style.color = '#22543d';
    }
    
    // Longer timeout for mobile users
    const timeout = window.innerWidth < 768 ? 3000 : 2000;
    setTimeout(() => {
        element.className = 'feedback hidden';
    }, timeout);
}

/**
 * Hides any message in the feedback element
 * @param {HTMLElement} element - Feedback element to hide
 */
function hideMessage(element) {
    element.className = 'feedback hidden';
}

/**
 * Handles keyboard shortcuts for better UX
 * @param {KeyboardEvent} event - Keyboard event
 * @param {Object} elements - DOM elements object
 */
function handleKeyboardShortcuts(event, elements) {
    // Ctrl+Enter or Cmd+Enter to parse
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
        if (document.activeElement === elements.inputText) {
            event.preventDefault();
            handleParse(elements);
        }
    }
    
    // Escape to clear
    if (event.key === 'Escape') {
        handleClear(elements);
    }
    
    // Ctrl+Shift+C to copy (alternative to button)
    if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'C') {
        event.preventDefault();
        handleCopy(elements);
    }
}
