/**
 * UI Interaction Module
 * Handles all user interface interactions and DOM manipulation
 */

// Module-level state for advanced settings
let lastRawInput = null;
let lastDetectedMode = null;
let lastRawParsed = null; // Parser output before settings are applied
const advSettings = {
    kingdomNews: {
        showLearn: true,
        showMassacre: true,
        showPlunder: true,
        showDragons: true,
        showRituals: true,
        uniqueWindow: 6,
        sectionOrder: ['Own Kingdom Summary', 'Per-Kingdom Summaries', 'Uniques', 'Highlights'],
        groupUniques: false,
        warOnly: false,
        warDetected: false
    },
    provinceLogs: {
        sectionOrder: ['Thievery Summary', 'Resources Stolen', 'Spell Summary', 'Aid Summary', 'Dragon Summary', 'Ritual Summary', 'Construction Summary', 'Science Summary', 'Exploration Summary', 'Military Training'],
        visible: {
            'Thievery Summary': true,
            'Resources Stolen': true,
            'Spell Summary': true,
            'Aid Summary': true,
            'Dragon Summary': true,
            'Ritual Summary': true,
            'Construction Summary': true,
            'Science Summary': true,
            'Exploration Summary': true,
            'Military Training': true
        },
        showAverages: false,
        showFailedThievery: true,
        exploreDetails: false
    },
    provinceNews: {
        sectionOrder: ['Monthly Land', 'Monthly Income', 'Scientists', 'Aid Received', 'Resources Stolen', 'Thievery', 'Spell Attempts', 'Shadowlight Attacker IDs', 'Attacks Suffered', 'Hazards & Events', 'War Outcomes'],
        visible: {
            'Monthly Land': true,
            'Monthly Income': true,
            'Scientists': true,
            'Aid Received': true,
            'Resources Stolen': true,
            'Thievery': true,
            'Spell Attempts': true,
            'Shadowlight Attacker IDs': true,
            'Attacks Suffered': true,
            'Hazards & Events': true,
            'War Outcomes': true
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

    const modeLabels = { 'kingdom-news-log': 'Kingdom News', 'province-logs': 'Province Logs', 'province-news': 'Province News' };
    elements.detectBadge.textContent = `Auto-detected: ${modeLabels[detectedMode]}`;
    elements.detectBadge.classList.remove('hidden');

    try {
        let parsedText;
        if (detectedMode === 'kingdom-news-log') {
            advSettings.kingdomNews.warDetected = hasWarEvents(inputText);
            if (!advSettings.kingdomNews.warDetected) {
                advSettings.kingdomNews.warOnly = false;
            }
            parsedText = parseKingdomNewsLog(inputText, {
                uniqueWindow: advSettings.kingdomNews.uniqueWindow,
                warOnly: advSettings.kingdomNews.warOnly
            });
            lastRawParsed = parsedText;
            parsedText = applyKingdomNewsSettings(parsedText);
        } else if (detectedMode === 'province-news') {
            parsedText = parseProvinceNews(inputText);
            lastRawParsed = parsedText;
            parsedText = applyProvinceNewsSettings(parsedText);
        } else {
            parsedText = formatProvinceLogs(inputText);
            lastRawParsed = parsedText;
            parsedText = applyProvinceLogsSettings(parsedText);
        }

        lastRawInput = inputText;
        lastDetectedMode = detectedMode;
        elements.outputText.value = parsedText;
        showMessage(elements.outputText, `${modeLabels[detectedMode]} parsed successfully!`, 'success');

        showAdvancedPanel(elements);

        if (window.innerWidth < 768) {
            const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            elements.outputText.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'center' });
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

    // Reset war detection state
    advSettings.kingdomNews.warDetected = false;
    advSettings.kingdomNews.warOnly = false;

    // Hide and collapse advanced settings panel
    lastRawInput = null;
    lastDetectedMode = null;
    lastRawParsed = null;
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

    const modeLabels = { 'kingdom-news-log': 'Kingdom News', 'province-logs': 'Province Logs', 'province-news': 'Province News' };
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
    } else if (lastDetectedMode === 'province-news') {
        renderProvinceNewsSettings(container, elements);
    } else {
        renderProvinceLogsSettings(container, elements);
    }
}

/**
 * Renders Kingdom News filter controls (show/hide attack types, unique window, section order)
 * @param {HTMLElement} container - The adv-content element
 * @param {Object} elements - DOM elements object
 */
function renderKingdomNewsSettings(container, elements) {
    // ── Show / Hide ──────────────────────────────────────────────────────────
    const showHideTitle = document.createElement('div');
    showHideTitle.className = 'adv-group-title';
    showHideTitle.textContent = 'Show / Hide';
    container.appendChild(showHideTitle);

    const checkboxItems = [
        { key: 'showLearn',    label: 'Learn attacks'   },
        { key: 'showMassacre', label: 'Massacre attacks' },
        { key: 'showPlunder',  label: 'Plunder attacks'  },
        { key: 'showDragons',  label: 'Dragons'          },
        { key: 'showRituals',  label: 'Rituals'          }
    ];

    for (const item of checkboxItems) {
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

    // ── Unique Attack Window ─────────────────────────────────────────────────
    const windowTitle = document.createElement('div');
    windowTitle.className = 'adv-group-title';
    windowTitle.textContent = 'Unique Attack Window';
    container.appendChild(windowTitle);

    const windowGroup = document.createElement('div');
    windowGroup.className = 'adv-group';

    const windowLabel = document.createElement('label');
    windowLabel.htmlFor = 'adv-kn-uniqueWindow';
    windowLabel.textContent = 'Days: ';

    const windowInput = document.createElement('input');
    windowInput.type = 'number';
    windowInput.id = 'adv-kn-uniqueWindow';
    windowInput.min = '1';
    windowInput.max = '30';
    windowInput.value = advSettings.kingdomNews.uniqueWindow;
    windowInput.addEventListener('change', () => {
        const val = parseInt(windowInput.value, 10);
        if (val >= 1 && val <= 30) {
            advSettings.kingdomNews.uniqueWindow = val;
            applyAndRerender(elements);
        }
    });

    windowLabel.appendChild(windowInput);
    windowGroup.appendChild(windowLabel);
    container.appendChild(windowGroup);

    // ── Uniques Grouping ─────────────────────────────────────────────────────
    const groupingGroup = document.createElement('div');
    groupingGroup.className = 'adv-group';

    const groupingLabel = document.createElement('label');
    groupingLabel.htmlFor = 'adv-kn-groupUniques';

    const groupingCheckbox = document.createElement('input');
    groupingCheckbox.type = 'checkbox';
    groupingCheckbox.id = 'adv-kn-groupUniques';
    groupingCheckbox.checked = advSettings.kingdomNews.groupUniques;
    groupingCheckbox.addEventListener('change', () => {
        advSettings.kingdomNews.groupUniques = groupingCheckbox.checked;
        applyAndRerender(elements);
    });

    groupingLabel.appendChild(groupingCheckbox);
    groupingLabel.appendChild(document.createTextNode(' Group all Uniques at bottom'));
    groupingGroup.appendChild(groupingLabel);
    container.appendChild(groupingGroup);

    // ── War Only (only shown when war events detected) ────────────────────────
    if (advSettings.kingdomNews.warDetected) {
        const warGroup = document.createElement('div');
        warGroup.className = 'adv-group';

        const warLabel = document.createElement('label');
        warLabel.htmlFor = 'adv-kn-warOnly';

        const warCheckbox = document.createElement('input');
        warCheckbox.type = 'checkbox';
        warCheckbox.id = 'adv-kn-warOnly';
        warCheckbox.checked = advSettings.kingdomNews.warOnly;
        warCheckbox.addEventListener('change', () => {
            advSettings.kingdomNews.warOnly = warCheckbox.checked;
            applyAndRerender(elements);
        });

        warLabel.appendChild(warCheckbox);
        warLabel.appendChild(document.createTextNode(' War Only \u2014 show attacks involving war opponent only'));
        warGroup.appendChild(warLabel);
        container.appendChild(warGroup);
    }

    // ── Section Order ────────────────────────────────────────────────────────
    const orderTitle = document.createElement('div');
    orderTitle.className = 'adv-group-title';
    orderTitle.textContent = 'Section Order';
    container.appendChild(orderTitle);

    const list = document.createElement('ul');
    list.className = 'section-order-list';
    container.appendChild(list);

    function renderOrderList() {
        list.innerHTML = '';
        const order = advSettings.kingdomNews.sectionOrder;

        order.forEach((sectionName, index) => {
            const item = document.createElement('li');
            item.className = 'section-order-item';

            const upBtn = document.createElement('button');
            upBtn.className = 'order-btn';
            upBtn.textContent = '▲';
            upBtn.disabled = index === 0;
            upBtn.title = 'Move up';
            upBtn.setAttribute('aria-label', `Move ${sectionName} up`);
            upBtn.addEventListener('click', () => {
                if (index > 0) {
                    [order[index - 1], order[index]] = [order[index], order[index - 1]];
                    renderOrderList();
                    applyAndRerender(elements);
                }
            });

            const downBtn = document.createElement('button');
            downBtn.className = 'order-btn';
            downBtn.textContent = '▼';
            downBtn.disabled = index === order.length - 1;
            downBtn.title = 'Move down';
            downBtn.setAttribute('aria-label', `Move ${sectionName} down`);
            downBtn.addEventListener('click', () => {
                if (index < order.length - 1) {
                    [order[index], order[index + 1]] = [order[index + 1], order[index]];
                    renderOrderList();
                    applyAndRerender(elements);
                }
            });

            const nameSpan = document.createElement('span');
            nameSpan.textContent = sectionName;

            item.appendChild(upBtn);
            item.appendChild(downBtn);
            item.appendChild(nameSpan);
            list.appendChild(item);
        });
    }

    renderOrderList();
}

/**
 * Renders Province Logs section visibility and reorder controls
 * @param {HTMLElement} container - The adv-content element
 * @param {Object} elements - DOM elements object
 */
function renderProvinceLogsSettings(container, elements) {
    // Determine which sections are present in the parsed output
    const presentSections = new Set();
    if (lastRawParsed) {
        for (const name of advSettings.provinceLogs.sectionOrder) {
            if (lastRawParsed.includes('\n\n' + name + ':') || lastRawParsed.includes('\n' + name + ':')) {
                presentSections.add(name);
            }
        }
    } else {
        advSettings.provinceLogs.sectionOrder.forEach(n => presentSections.add(n));
    }

    const title = document.createElement('div');
    title.className = 'adv-group-title';
    title.textContent = 'Sections';
    container.appendChild(title);

    const list = document.createElement('ul');
    list.className = 'section-order-list';
    container.appendChild(list);

    function renderList() {
        list.innerHTML = '';
        const fullOrder = advSettings.provinceLogs.sectionOrder;
        // Only display sections that exist in the parsed output
        const visible = fullOrder.filter(n => presentSections.has(n));

        visible.forEach((sectionName, visIdx) => {
            const item = document.createElement('li');
            item.className = 'section-order-item';

            const upBtn = document.createElement('button');
            upBtn.className = 'order-btn';
            upBtn.textContent = '▲';
            upBtn.disabled = visIdx === 0;
            upBtn.title = 'Move up';
            upBtn.setAttribute('aria-label', `Move ${sectionName} up`);
            upBtn.addEventListener('click', () => {
                if (visIdx > 0) {
                    const prev = visible[visIdx - 1];
                    const idxA = fullOrder.indexOf(prev);
                    const idxB = fullOrder.indexOf(sectionName);
                    [fullOrder[idxA], fullOrder[idxB]] = [fullOrder[idxB], fullOrder[idxA]];
                    renderList();
                    applyAndRerender(elements);
                }
            });

            const downBtn = document.createElement('button');
            downBtn.className = 'order-btn';
            downBtn.textContent = '▼';
            downBtn.disabled = visIdx === visible.length - 1;
            downBtn.title = 'Move down';
            downBtn.setAttribute('aria-label', `Move ${sectionName} down`);
            downBtn.addEventListener('click', () => {
                if (visIdx < visible.length - 1) {
                    const next = visible[visIdx + 1];
                    const idxA = fullOrder.indexOf(sectionName);
                    const idxB = fullOrder.indexOf(next);
                    [fullOrder[idxA], fullOrder[idxB]] = [fullOrder[idxB], fullOrder[idxA]];
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

    // ── Averages ─────────────────────────────────────────────────────────────
    const avgTitle = document.createElement('div');
    avgTitle.className = 'adv-group-title';
    avgTitle.textContent = 'Display Options';
    container.appendChild(avgTitle);

    const avgGroup = document.createElement('div');
    avgGroup.className = 'adv-group';

    const avgLabel = document.createElement('label');
    avgLabel.htmlFor = 'adv-pl-showAverages';

    const avgCheckbox = document.createElement('input');
    avgCheckbox.type = 'checkbox';
    avgCheckbox.id = 'adv-pl-showAverages';
    avgCheckbox.checked = advSettings.provinceLogs.showAverages;
    avgCheckbox.addEventListener('change', () => {
        advSettings.provinceLogs.showAverages = avgCheckbox.checked;
        applyAndRerender(elements);
    });

    avgLabel.appendChild(avgCheckbox);
    avgLabel.appendChild(document.createTextNode(' Show averages'));
    avgGroup.appendChild(avgLabel);
    container.appendChild(avgGroup);

    const failedGroup = document.createElement('div');
    failedGroup.className = 'adv-group';

    const failedLabel = document.createElement('label');
    failedLabel.htmlFor = 'adv-pl-showFailedThievery';

    const failedCheckbox = document.createElement('input');
    failedCheckbox.type = 'checkbox';
    failedCheckbox.id = 'adv-pl-showFailedThievery';
    failedCheckbox.checked = advSettings.provinceLogs.showFailedThievery;
    failedCheckbox.addEventListener('change', () => {
        advSettings.provinceLogs.showFailedThievery = failedCheckbox.checked;
        applyAndRerender(elements);
    });

    failedLabel.appendChild(failedCheckbox);
    failedLabel.appendChild(document.createTextNode(' Show failed thievery attempts'));
    failedGroup.appendChild(failedLabel);
    container.appendChild(failedGroup);

    const exploreGroup = document.createElement('div');
    exploreGroup.className = 'adv-group';

    const exploreLabel = document.createElement('label');
    exploreLabel.htmlFor = 'adv-pl-exploreDetails';

    const exploreCheckbox = document.createElement('input');
    exploreCheckbox.type = 'checkbox';
    exploreCheckbox.id = 'adv-pl-exploreDetails';
    exploreCheckbox.checked = advSettings.provinceLogs.exploreDetails;
    exploreCheckbox.addEventListener('change', () => {
        advSettings.provinceLogs.exploreDetails = exploreCheckbox.checked;
        applyAndRerender(elements);
    });

    exploreLabel.appendChild(exploreCheckbox);
    exploreLabel.appendChild(document.createTextNode(' Show exploration soldier & cost details'));
    exploreGroup.appendChild(exploreLabel);
    container.appendChild(exploreGroup);
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
            parsedText = parseKingdomNewsLog(lastRawInput, {
                uniqueWindow: advSettings.kingdomNews.uniqueWindow,
                warOnly: advSettings.kingdomNews.warOnly
            });
            lastRawParsed = parsedText;
            parsedText = applyKingdomNewsSettings(parsedText);
        } else if (lastDetectedMode === 'province-news') {
            parsedText = parseProvinceNews(lastRawInput);
            lastRawParsed = parsedText;
            parsedText = applyProvinceNewsSettings(parsedText);
        } else {
            parsedText = formatProvinceLogs(lastRawInput);
            lastRawParsed = parsedText;
            parsedText = applyProvinceLogsSettings(parsedText);
        }
        elements.outputText.value = parsedText;
    } catch (error) {
        console.error('Error re-rendering with settings:', error);
    }
}

/**
 * Filters, reorders, and groups Kingdom News output based on current advSettings.
 * @param {string} text - Parsed Kingdom News output
 * @returns {string} - Filtered/reordered output
 */
function applyKingdomNewsSettings(text) {
    const s = advSettings.kingdomNews;

    // Step 1: Apply line-level filters (show/hide attack sub-types)
    const filteredText = text.split('\n').filter(line => {
        if (!s.showLearn    && /^-- Learn:/.test(line))                          return false;
        if (!s.showMassacre && /^-- Massacre:/.test(line))                       return false;
        if (!s.showPlunder  && /^-- Plunder:/.test(line))                        return false;
        if (!s.showDragons  && /^-- (Enemy )?Dragons (Started|Completed):/.test(line))   return false;
        if (!s.showDragons  && /^-- Enemy Dragons Killed:/.test(line))                    return false;
        if (!s.showRituals  && /^-- Rituals (Started|Completed):/.test(line))    return false;
        return true;
    }).join('\n');

    // Step 2: Extract the report header (text before the first ** block)
    const firstBlockMatch = filteredText.match(/\n\*\* /);
    if (!firstBlockMatch) return filteredText;

    const firstBlockIdx = firstBlockMatch.index;
    const header = filteredText.substring(0, firstBlockIdx);
    const rest = filteredText.substring(firstBlockIdx + 1); // skip leading \n

    // Step 3: Split into individual blocks (each starts with "** ... **")
    const rawBlocks = rest.split(/\n(?=\*\* )/);

    // Step 4: Categorize and pair each Per-Kingdom block with its Uniques block
    function getCategory(block) {
        const firstLine = block.split('\n')[0];
        if (/^\*\* Own Kingdom .+ Summary \*\*/.test(firstLine))  return 'Own Kingdom Summary';
        if (/^\*\* Uniques for .+ \*\*/.test(firstLine))          return 'Uniques';
        if (/^\*\* Highlights \*\*/.test(firstLine))               return 'Highlights';
        return 'Per-Kingdom Summaries';
    }

    const ownKingdomSummaryBlocks = [];
    const perKingdomPairs = []; // [{ summary: block, uniques: block|null }]
    const highlightsBlocks = [];
    let currentPair = null;

    for (const block of rawBlocks) {
        const cat = getCategory(block);
        if (cat === 'Own Kingdom Summary') {
            ownKingdomSummaryBlocks.push(block);
        } else if (cat === 'Per-Kingdom Summaries') {
            currentPair = { summary: block, uniques: null };
            perKingdomPairs.push(currentPair);
        } else if (cat === 'Uniques') {
            if (currentPair && currentPair.uniques === null) {
                currentPair.uniques = block;
                currentPair = null;
            } else {
                // Orphaned uniques block — append to last pair or own summary
                if (perKingdomPairs.length > 0) {
                    const last = perKingdomPairs[perKingdomPairs.length - 1];
                    if (!last.uniques) last.uniques = block;
                }
            }
        } else if (cat === 'Highlights') {
            highlightsBlocks.push(block);
        }
    }

    // Step 5: Reconstruct in the user-defined section order
    const resultBlocks = [];

    for (const section of s.sectionOrder) {
        if (section === 'Own Kingdom Summary') {
            resultBlocks.push(...ownKingdomSummaryBlocks);
        } else if (section === 'Per-Kingdom Summaries') {
            for (const pair of perKingdomPairs) {
                resultBlocks.push(pair.summary);
                if (!s.groupUniques && pair.uniques) {
                    resultBlocks.push(pair.uniques);
                }
            }
        } else if (section === 'Uniques') {
            if (s.groupUniques) {
                for (const pair of perKingdomPairs) {
                    if (pair.uniques) resultBlocks.push(pair.uniques);
                }
            }
            // When not grouping, uniques were already emitted inline above
        } else if (section === 'Highlights') {
            resultBlocks.push(...highlightsBlocks);
        }
    }

    return (header + '\n' + resultBlocks.join('\n')).trim();
}

/**
 * Reorders and filters Province Logs output sections based on current advSettings
 * @param {string} text - Parsed Province Logs output
 * @returns {string} - Reordered/filtered output
 */
function applyProvinceLogsSettings(text) {
    const sectionNames = [
        'Thievery Summary', 'Resources Stolen', 'Spell Summary',
        'Aid Summary', 'Dragon Summary', 'Ritual Summary',
        'Construction Summary', 'Science Summary',
        'Exploration Summary', 'Military Training'
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

    let output = result.trim();

    // Add or strip per-line averages
    if (!advSettings.provinceLogs.showFailedThievery) {
        output = output.split('\n').filter(line => !/failed thievery attempt/.test(line)).join('\n');
    }

    if (!advSettings.provinceLogs.exploreDetails) {
        output = output.split('\n').filter(line => !/soldiers sent at a cost of/.test(line)).join('\n');
    }

    if (advSettings.provinceLogs.showAverages) {
        output = output.split('\n').map(line => {
            const m = line.match(/^(\d+) (.+) for a total of ([\d,]+) (.+)$/);
            if (m) {
                const count = parseInt(m[1], 10);
                const total = parseInt(m[3].replace(/,/g, ''), 10);
                if (count > 1) {
                    const avg = Math.round(total / count);
                    const avgStr = avg.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                    return `${line} (avg ${avgStr} each)`;
                }
            }
            return line;
        }).join('\n');
    }

    return output;
}

/**
 * Renders Province News section visibility and reorder controls.
 * @param {HTMLElement} container - The adv-content element
 * @param {Object} elements - DOM elements object
 */
function renderProvinceNewsSettings(container, elements) {
    // Determine which sections are present in the parsed output
    const presentSections = new Set();
    if (lastRawParsed) {
        for (const name of advSettings.provinceNews.sectionOrder) {
            if (lastRawParsed.indexOf('\n\n' + name) !== -1) {
                presentSections.add(name);
            }
        }
    } else {
        advSettings.provinceNews.sectionOrder.forEach(n => presentSections.add(n));
    }

    const title = document.createElement('div');
    title.className = 'adv-group-title';
    title.textContent = 'Sections';
    container.appendChild(title);

    const list = document.createElement('ul');
    list.className = 'section-order-list';
    container.appendChild(list);

    function renderList() {
        list.innerHTML = '';
        const fullOrder = advSettings.provinceNews.sectionOrder;
        const visible = fullOrder.filter(n => presentSections.has(n));

        visible.forEach((sectionName, visIdx) => {
            const item = document.createElement('li');
            item.className = 'section-order-item';

            const upBtn = document.createElement('button');
            upBtn.className = 'order-btn';
            upBtn.textContent = '▲';
            upBtn.disabled = visIdx === 0;
            upBtn.title = 'Move up';
            upBtn.setAttribute('aria-label', `Move ${sectionName} up`);
            upBtn.addEventListener('click', () => {
                if (visIdx > 0) {
                    const prev = visible[visIdx - 1];
                    const idxA = fullOrder.indexOf(prev);
                    const idxB = fullOrder.indexOf(sectionName);
                    [fullOrder[idxA], fullOrder[idxB]] = [fullOrder[idxB], fullOrder[idxA]];
                    renderList();
                    applyAndRerender(elements);
                }
            });

            const downBtn = document.createElement('button');
            downBtn.className = 'order-btn';
            downBtn.textContent = '▼';
            downBtn.disabled = visIdx === visible.length - 1;
            downBtn.title = 'Move down';
            downBtn.setAttribute('aria-label', `Move ${sectionName} down`);
            downBtn.addEventListener('click', () => {
                if (visIdx < visible.length - 1) {
                    const next = visible[visIdx + 1];
                    const idxA = fullOrder.indexOf(sectionName);
                    const idxB = fullOrder.indexOf(next);
                    [fullOrder[idxA], fullOrder[idxB]] = [fullOrder[idxB], fullOrder[idxA]];
                    renderList();
                    applyAndRerender(elements);
                }
            });

            const id = `adv-pn-${sectionName.replace(/ /g, '-').replace(/&/g, 'and')}`;
            const label = document.createElement('label');
            label.htmlFor = id;

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = id;
            checkbox.checked = advSettings.provinceNews.visible[sectionName];
            checkbox.addEventListener('change', () => {
                advSettings.provinceNews.visible[sectionName] = checkbox.checked;
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
 * Reorders and filters Province News output sections based on current advSettings.
 * @param {string} text - Parsed Province News output
 * @returns {string} - Reordered/filtered output
 */
function applyProvinceNewsSettings(text) {
    const sectionNames = advSettings.provinceNews.sectionOrder;

    // Find header (everything before the first recognized section)
    let firstSectionStart = text.length;
    for (const name of sectionNames) {
        const idx = text.indexOf('\n\n' + name);
        if (idx !== -1 && idx < firstSectionStart) firstSectionStart = idx;
    }
    const header = text.substring(0, firstSectionStart);

    // Extract each section's content
    const sections = {};
    for (const name of sectionNames) {
        const marker = '\n\n' + name;
        const start = text.indexOf(marker);
        if (start === -1) continue;

        let end = text.length;
        for (const other of sectionNames) {
            if (other === name) continue;
            const otherStart = text.indexOf('\n\n' + other);
            if (otherStart > start && otherStart < end) end = otherStart;
        }
        sections[name] = text.substring(start + 2, end); // skip leading \n\n
    }

    // Reconstruct in the user-defined order, skipping hidden sections
    let result = header;
    for (const name of advSettings.provinceNews.sectionOrder) {
        if (advSettings.provinceNews.visible[name] && sections[name]) {
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
