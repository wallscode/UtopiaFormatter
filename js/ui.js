/**
 * UI Interaction Module
 * Handles all user interface interactions and DOM manipulation
 */

// Module-level state for advanced settings
let lastRawInput = null;
let lastDetectedMode = null;
const advSettings = {
    kingdomNews: {
        showLearn: true,
        showMassacre: true,
        showPlunder: true,
        showDragons: true,
        showRituals: true
    },
    provinceLogs: {
        sectionOrder: ['Thievery Summary', 'Resources Stolen', 'Spell Summary', 'Aid Summary', 'Dragon Summary', 'Ritual Summary'],
        visible: {
            'Thievery Summary': true,
            'Resources Stolen': true,
            'Spell Summary': true,
            'Aid Summary': true,
            'Dragon Summary': true,
            'Ritual Summary': true
        }
    }
};

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
        detectBadge: document.getElementById('detect-badge'),
        advPanel: document.getElementById('advanced-settings'),
        advContent: document.getElementById('adv-content'),
        advToggle: document.getElementById('adv-toggle')
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

    // Advanced settings toggle
    elements.advToggle.addEventListener('click', () => {
        const expanded = elements.advToggle.getAttribute('aria-expanded') === 'true';
        elements.advToggle.setAttribute('aria-expanded', String(!expanded));
        if (!expanded) {
            elements.advContent.removeAttribute('hidden');
        } else {
            elements.advContent.setAttribute('hidden', '');
        }
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
            parsedText = applyKingdomNewsSettings(parsedText);
        } else {
            parsedText = formatProvinceLogs(inputText);
            parsedText = applyProvinceLogsSettings(parsedText);
        }

        lastRawInput = inputText;
        lastDetectedMode = detectedMode;
        elements.outputText.value = parsedText;
        showMessage(elements.outputText, `${modeLabels[detectedMode]} parsed successfully!`, 'success');

        showAdvancedPanel(elements);

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

    // Hide and collapse advanced settings panel
    lastRawInput = null;
    lastDetectedMode = null;
    elements.advPanel.classList.add('hidden');
    elements.advToggle.setAttribute('aria-expanded', 'false');
    elements.advContent.setAttribute('hidden', '');

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
 * Shows and populates the advanced settings panel after a successful parse
 * @param {Object} elements - DOM elements object
 */
function showAdvancedPanel(elements) {
    elements.advPanel.classList.remove('hidden');
    renderAdvancedSettings(elements);
}

/**
 * Renders the correct settings controls based on detected mode
 * @param {Object} elements - DOM elements object
 */
function renderAdvancedSettings(elements) {
    const container = elements.advContent;
    container.innerHTML = '';
    if (lastDetectedMode === 'kingdom-news-log') {
        renderKingdomNewsSettings(container, elements);
    } else {
        renderProvinceLogsSettings(container, elements);
    }
}

/**
 * Renders Kingdom News filter controls (show/hide attack types)
 * @param {HTMLElement} container - The adv-content element
 * @param {Object} elements - DOM elements object
 */
function renderKingdomNewsSettings(container, elements) {
    const title = document.createElement('div');
    title.className = 'adv-group-title';
    title.textContent = 'Show / Hide';
    container.appendChild(title);

    const items = [
        { key: 'showLearn',    label: 'Learn attacks'   },
        { key: 'showMassacre', label: 'Massacre attacks' },
        { key: 'showPlunder',  label: 'Plunder attacks'  },
        { key: 'showDragons',  label: 'Dragons'          },
        { key: 'showRituals',  label: 'Rituals'          }
    ];

    for (const item of items) {
        const group = document.createElement('div');
        group.className = 'adv-group';

        const id = `adv-kn-${item.key}`;
        const label = document.createElement('label');
        label.htmlFor = id;

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = id;
        checkbox.checked = advSettings.kingdomNews[item.key];
        checkbox.addEventListener('change', () => {
            advSettings.kingdomNews[item.key] = checkbox.checked;
            applyAndRerender(elements);
        });

        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(' ' + item.label));
        group.appendChild(label);
        container.appendChild(group);
    }
}

/**
 * Renders Province Logs section visibility and reorder controls
 * @param {HTMLElement} container - The adv-content element
 * @param {Object} elements - DOM elements object
 */
function renderProvinceLogsSettings(container, elements) {
    const title = document.createElement('div');
    title.className = 'adv-group-title';
    title.textContent = 'Sections';
    container.appendChild(title);

    const list = document.createElement('ul');
    list.className = 'section-order-list';
    container.appendChild(list);

    function renderList() {
        list.innerHTML = '';
        const order = advSettings.provinceLogs.sectionOrder;

        order.forEach((sectionName, index) => {
            const item = document.createElement('li');
            item.className = 'section-order-item';

            const upBtn = document.createElement('button');
            upBtn.className = 'order-btn';
            upBtn.textContent = '▲';
            upBtn.disabled = index === 0;
            upBtn.title = 'Move up';
            upBtn.addEventListener('click', () => {
                if (index > 0) {
                    [order[index - 1], order[index]] = [order[index], order[index - 1]];
                    renderList();
                    applyAndRerender(elements);
                }
            });

            const downBtn = document.createElement('button');
            downBtn.className = 'order-btn';
            downBtn.textContent = '▼';
            downBtn.disabled = index === order.length - 1;
            downBtn.title = 'Move down';
            downBtn.addEventListener('click', () => {
                if (index < order.length - 1) {
                    [order[index], order[index + 1]] = [order[index + 1], order[index]];
                    renderList();
                    applyAndRerender(elements);
                }
            });

            const id = `adv-pl-${sectionName.replace(/ /g, '-')}`;
            const label = document.createElement('label');
            label.htmlFor = id;

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = id;
            checkbox.checked = advSettings.provinceLogs.visible[sectionName];
            checkbox.addEventListener('change', () => {
                advSettings.provinceLogs.visible[sectionName] = checkbox.checked;
                applyAndRerender(elements);
            });

            label.appendChild(checkbox);
            label.appendChild(document.createTextNode(' ' + sectionName));

            item.appendChild(upBtn);
            item.appendChild(downBtn);
            item.appendChild(label);
            list.appendChild(item);
        });
    }

    renderList();
}

/**
 * Re-parses from the stored raw input and applies current settings, then updates output
 * @param {Object} elements - DOM elements object
 */
function applyAndRerender(elements) {
    if (!lastRawInput || !lastDetectedMode) return;
    try {
        let parsedText;
        if (lastDetectedMode === 'kingdom-news-log') {
            parsedText = parseKingdomNewsLog(lastRawInput);
            parsedText = applyKingdomNewsSettings(parsedText);
        } else {
            parsedText = formatProvinceLogs(lastRawInput);
            parsedText = applyProvinceLogsSettings(parsedText);
        }
        elements.outputText.value = parsedText;
    } catch (error) {
        console.error('Error re-rendering with settings:', error);
    }
}

/**
 * Filters Kingdom News output lines based on current advSettings
 * @param {string} text - Parsed Kingdom News output
 * @returns {string} - Filtered output
 */
function applyKingdomNewsSettings(text) {
    const s = advSettings.kingdomNews;
    return text.split('\n').filter(line => {
        if (!s.showLearn    && /^Learn:/.test(line))                       return false;
        if (!s.showMassacre && /^Massacre:/.test(line))                    return false;
        if (!s.showPlunder  && /^Plunder:/.test(line))                     return false;
        if (!s.showDragons  && /^Dragons (Started|Completed):/.test(line)) return false;
        if (!s.showDragons  && /^Enemy Dragons Killed:/.test(line))        return false;
        if (!s.showRituals  && /^Rituals (Started|Completed):/.test(line)) return false;
        return true;
    }).join('\n');
}

/**
 * Reorders and filters Province Logs output sections based on current advSettings
 * @param {string} text - Parsed Province Logs output
 * @returns {string} - Reordered/filtered output
 */
function applyProvinceLogsSettings(text) {
    const sectionNames = [
        'Thievery Summary', 'Resources Stolen', 'Spell Summary',
        'Aid Summary', 'Dragon Summary', 'Ritual Summary'
    ];

    // Find header (everything before the first section)
    let firstSectionStart = text.length;
    for (const name of sectionNames) {
        const idx = text.indexOf('\n\n' + name + ':');
        if (idx !== -1 && idx < firstSectionStart) firstSectionStart = idx;
    }
    const header = text.substring(0, firstSectionStart);

    // Extract each section's content (without the leading \n\n)
    const sections = {};
    for (const name of sectionNames) {
        const start = text.indexOf('\n\n' + name + ':');
        if (start === -1) continue;

        let end = text.length;
        for (const other of sectionNames) {
            if (other === name) continue;
            const otherStart = text.indexOf('\n\n' + other + ':');
            if (otherStart > start && otherStart < end) end = otherStart;
        }
        sections[name] = text.substring(start + 2, end); // +2 to skip leading \n\n
    }

    // Reconstruct in the user-defined order, skipping hidden sections
    let result = header;
    for (const name of advSettings.provinceLogs.sectionOrder) {
        if (advSettings.provinceLogs.visible[name] && sections[name]) {
            result += '\n\n' + sections[name];
        }
    }

    return result.trim();
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
