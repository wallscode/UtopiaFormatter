/**
 * UI Interaction Module
 * Handles all user interface interactions and DOM manipulation
 */

// Module-level state for advanced settings
let lastRawInput = null;
let lastDetectedMode = null;
let lastRawParsed = null; // Parser output before settings are applied
let secondaryInputVisible = false;
let showRawText = false;
let singleColumnLayout = false;
let _hintCounter = 0;
const advSettings = {
    kingdomNews: {
        showAttacks: true,
        showTradMarch: true,
        showLearn: true,
        showMassacre: true,
        showPlunder: true,
        showDragons: true,
        showDragonCancellations: false,
        showRituals: true,
        showRitualsFailed: false,
        showKingdomRelations: false,
        showWarDeclarations: true,
        showCeasefires: true,
        uniqueWindow: 6,
        sectionOrder: ['Own Kingdom Summary', 'Per-Kingdom Summaries', 'Uniques', 'Highlights', 'Kingdom Relations'],
        visible: {
            'Own Kingdom Summary':  true,
            'Per-Kingdom Summaries': true,
            'Uniques':               true,
            'Highlights':            true,
            'Kingdom Relations':     true,
        },
        uniquesWithKingdoms: false,
        warOnly: false,
        warDetected: false,
        discordCopy: false,
        showAltCopy: false
    },
    provinceLogs: {
        sectionOrder: ['Thievery Summary', 'Thievery Targets by Province', 'Thievery Targets by Op Type', 'Resources Stolen from Opponents', 'Spell Summary', 'Spell Targets by Province', 'Spell Targets by Spell Type', 'Aid Summary', 'Dragon Summary', 'Ritual Summary', 'Construction Summary', 'Science Summary', 'Exploration Summary', 'Military Training'],
        sectionGroups: [
            { label: 'Thievery', children: ['Thievery Summary', 'Thievery Targets by Province', 'Thievery Targets by Op Type', 'Resources Stolen from Opponents'] },
            { label: 'Spells',   children: ['Spell Summary', 'Spell Targets by Province', 'Spell Targets by Spell Type'] },
            { label: 'Aid Summary',          children: ['Aid Summary'] },
            { label: 'Dragon Summary',       children: ['Dragon Summary'] },
            { label: 'Ritual Summary',       children: ['Ritual Summary'] },
            { label: 'Construction Summary', children: ['Construction Summary'] },
            { label: 'Science Summary',      children: ['Science Summary'] },
            { label: 'Exploration Summary',  children: ['Exploration Summary'] },
            { label: 'Military Training',    children: ['Military Training'] },
        ],
        visible: {
            'Thievery Summary': true,
            'Thievery Targets by Province': false,
            'Thievery Targets by Op Type': false,
            'Resources Stolen from Opponents': true,
            'Spell Summary': true,
            'Spell Targets by Province': false,
            'Spell Targets by Spell Type': false,
            'Aid Summary': true,
            'Dragon Summary': true,
            'Ritual Summary': false,
            'Construction Summary': false,
            'Science Summary': false,
            'Exploration Summary': false,
            'Military Training': false
        },
        showAverages: false,
        showFailedThievery: true,
        showFailedSpellAttempts: false,
        showSuccessThieveryLosses: false,
        showRazedBuildings: false,
        showTroopsReleased: false,
        showDraftPercentage: false,
        showDraftRate: false,
        showMilitaryWages: false,
        exploreDetails: false,
        discordCopy: false,
        showAltCopy: false
    },
    provinceNews: {
        sectionOrder: ['Attacks Suffered', 'Thievery Impacts', 'Shadowlight Thief IDs', 'Spell Impacts', 'Aid Received', 'Daily Login Bonus', 'Scientists Gained', 'War Outcomes'],
        visible: {
            'Attacks Suffered':     true,
            'Thievery Impacts':     true,
            'Shadowlight Thief IDs': false,
            'Spell Impacts':        true,
            'Aid Received':         true,
            'Daily Login Bonus':    false,
            'Scientists Gained':    false,
            'War Outcomes':         false
        },
        showSourceIdentifiers: false,
        discordCopy: false,
        showAltCopy: false
    },
    combinedProvince: {
        sectionOrder: [
            'Aid Summary',
            'Thievery Summary', 'Thievery Targets by Province', 'Thievery Targets by Op Type', 'Resources Stolen from Opponents',
            'Thievery Impacts', 'Shadowlight Thief IDs',
            'Spell Summary', 'Spell Targets by Province', 'Spell Targets by Spell Type',
            'Spell Impacts',
            'Attacks Suffered', 'Military Training',
            'Exploration Summary', 'Construction Summary', 'Science Summary',
            'Dragon Summary', 'Ritual Summary',
            'War Outcomes', 'Daily Login Bonus', 'Scientists Gained',
        ],
        sectionGroups: [
            { label: 'Aid Summary',              children: ['Aid Summary'] },
            { label: 'Offensive Thievery',       children: ['Thievery Summary', 'Thievery Targets by Province', 'Thievery Targets by Op Type', 'Resources Stolen from Opponents'] },
            { label: 'Defensive Thievery',       children: ['Thievery Impacts', 'Shadowlight Thief IDs'] },
            { label: 'Offensive Spells',         children: ['Spell Summary', 'Spell Targets by Province', 'Spell Targets by Spell Type'] },
            { label: 'Defensive Spells',         children: ['Spell Impacts'] },
            { label: 'Military',                 children: ['Attacks Suffered', 'Military Training'] },
            { label: 'Exploration Summary',      children: ['Exploration Summary'] },
            { label: 'Construction Summary',     children: ['Construction Summary'] },
            { label: 'Science Summary',          children: ['Science Summary'] },
            { label: 'Dragon Summary',           children: ['Dragon Summary'] },
            { label: 'Ritual Summary',           children: ['Ritual Summary'] },
            { label: 'War Outcomes',             children: ['War Outcomes'] },
            { label: 'Daily Login Bonus',        children: ['Daily Login Bonus'] },
            { label: 'Scientists Gained',        children: ['Scientists Gained'] },
        ],
        visible: {
            'Aid Summary':                   true,
            'Thievery Summary':              true,
            'Thievery Targets by Province':  false,
            'Thievery Targets by Op Type':   false,
            'Resources Stolen from Opponents': true,
            'Thievery Impacts':              true,
            'Shadowlight Thief IDs':         false,
            'Spell Summary':                 true,
            'Spell Targets by Province':     false,
            'Spell Targets by Spell Type':   false,
            'Spell Impacts':                 true,
            'Attacks Suffered':              true,
            'Military Training':             false,
            'Exploration Summary':           false,
            'Construction Summary':          false,
            'Science Summary':               false,
            'Dragon Summary':                true,
            'Ritual Summary':                false,
            'War Outcomes':                  false,
            'Daily Login Bonus':             true,
            'Scientists Gained':             false,
        },
        showAverages:               false,
        showFailedThievery:         true,
        showFailedSpellAttempts:    false,
        showSuccessThieveryLosses:  false,
        showRazedBuildings:         false,
        showTroopsReleased:         false,
        showDraftPercentage:        false,
        showDraftRate:              false,
        showMilitaryWages:          false,
        exploreDetails:             false,
        showSourceIdentifiers:      false,
        discordCopy: false,
        showAltCopy: false
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
        discordCopyBtn: document.getElementById('discord-copy-btn'),
        discordCopyFeedback: document.getElementById('discord-copy-feedback'),
        altCopyBtn: document.getElementById('alt-copy-btn'),
        altCopyFeedback: document.getElementById('alt-copy-feedback'),
        detectBadge: document.getElementById('detect-badge'),
        advPanel: document.getElementById('advanced-settings'),
        advContent: document.getElementById('adv-content'),
        advToggle: document.getElementById('adv-toggle'),
        parseStatus: document.getElementById('parse-status'),
        provinceNewsText: document.getElementById('province-news-text'),
        secondarySection: document.getElementById('secondary-input-section'),
        enhancedOutput: document.getElementById('enhanced-output')
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

    // Discord copy button
    elements.discordCopyBtn.addEventListener('click', () => {
        handleDiscordCopy(elements);
    });

    // Alt copy button (plain text on mobile, mobile HTML on desktop)
    if (elements.altCopyBtn) {
        elements.altCopyBtn.addEventListener('click', () => {
            handleAltCopy(elements);
        });
    }

    // Input textarea - enable/disable parse button based on content
    elements.inputText.addEventListener('input', () => {
        updateParseButtonState(elements);
    });

    // Province News textarea - enable/disable parse button when content added
    if (elements.provinceNewsText) {
        elements.provinceNewsText.addEventListener('input', () => {
            updateParseButtonState(elements);
        });
        // Auto-detect combined mode on paste
        elements.provinceNewsText.addEventListener('paste', () => {
            setTimeout(() => autoDetectMode(elements), 0);
        });
        // Ctrl+Enter from Province News textarea also triggers parse
        elements.provinceNewsText.addEventListener('keydown', (event) => {
            if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
                event.preventDefault();
                handleParse(elements);
            }
        });
    }

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

    // Close hint tooltips when clicking outside any hint button (touch support)
    document.addEventListener('click', () => {
        document.querySelectorAll('.adv-hint-wrap.is-open').forEach(w => w.classList.remove('is-open'));
    });

    // Close hint tooltips on Escape (WCAG 1.4.13 — dismissible)
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.adv-hint-wrap.is-open').forEach(w => w.classList.remove('is-open'));
        }
    });

    // Tap collapsed input section to re-expand (mobile, Uto-b2kf)
    document.querySelectorAll('.input-section').forEach(section => {
        section.addEventListener('click', () => {
            if (section.classList.contains('collapsed')) {
                section.classList.remove('collapsed');
            }
        });
    });

}

/**
 * Handles the parse button click
 * @param {Object} elements - DOM elements object
 */
function handleParse(elements) {
    const inputText = elements.inputText.value.trim();
    const newsText = elements.provinceNewsText ? elements.provinceNewsText.value.trim() : '';

    if (!inputText && !newsText) {
        showMessage(elements.outputText, 'Please enter some text to parse.', 'error', elements.parseStatus);
        return;
    }

    // Combined mode: both textareas have content and one is Province Logs and the other is Province News
    const mainType = inputText ? detectInputType(inputText) : null;
    const isCombinedLogsNews = !!(inputText && newsText && mainType === 'province-logs');
    const isCombinedNewsLogs = !!(inputText && newsText && mainType === 'province-news');
    const isCombined = isCombinedLogsNews || isCombinedNewsLogs;

    if (isCombined) {
        const logsText = isCombinedLogsNews ? inputText : newsText;
        const pNewsText = isCombinedLogsNews ? newsText : inputText;
        elements.detectBadge.textContent = isCombinedLogsNews
            ? 'Auto-detected: Province Logs + Province News'
            : 'Auto-detected: Province News + Province Logs';
        elements.detectBadge.classList.remove('hidden');
        try {
            let parsedText = formatCombinedProvinceSummary(logsText, pNewsText);
            lastRawParsed = parsedText;
            parsedText = applyCombinedProvinceSettings(parsedText);
            lastRawInput = inputText;
            lastDetectedMode = 'combined-province';
            elements.outputText.value = parsedText;
            updateOutputView(elements);
            autoResizeOutput(elements.outputText);
            showMessage(elements.outputText, 'Province Logs + Province News combined successfully!', 'success', elements.parseStatus);
            showAdvancedPanel(elements);
            updateDiscordButtonVisibility(elements, 'combined-province');
            updateAltCopyButtonVisibility(elements, 'combined-province');
            if (window.innerWidth < 768) {
                const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
                elements.enhancedOutput.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
            }
            collapseInputOnMobile(elements);
        } catch (error) {
            console.error('Parsing error:', error);
            showMessage(elements.outputText, 'Error parsing text. Please check your input.', 'error', elements.parseStatus);
        }
        return;
    }

    // Single-input mode: use existing logic
    const effectiveInput = inputText || newsText;
    if (!effectiveInput) {
        showMessage(elements.outputText, 'Please enter some text to parse.', 'error', elements.parseStatus);
        return;
    }

    const detectedMode = detectInputType(effectiveInput);

    if (!detectedMode) {
        showMessage(elements.outputText, 'Could not detect input type — paste Kingdom News or Province Logs text.', 'error', elements.parseStatus);
        return;
    }

    const modeLabels = { 'kingdom-news-log': 'Kingdom News', 'province-logs': 'Province Logs', 'province-news': 'Province News' };
    elements.detectBadge.textContent = `Auto-detected: ${modeLabels[detectedMode]}`;
    elements.detectBadge.classList.remove('hidden');

    try {
        let parsedText;
        if (detectedMode === 'kingdom-news-log') {
            advSettings.kingdomNews.warDetected = hasWarEvents(effectiveInput);
            if (!advSettings.kingdomNews.warDetected) {
                advSettings.kingdomNews.warOnly = false;
            }
            parsedText = parseKingdomNewsLog(effectiveInput, {
                uniqueWindow: advSettings.kingdomNews.uniqueWindow,
                warOnly: advSettings.kingdomNews.warOnly
            });
            lastRawParsed = parsedText;
            parsedText = applyKingdomNewsSettings(parsedText);
        } else if (detectedMode === 'province-news') {
            parsedText = parseProvinceNews(effectiveInput);
            lastRawParsed = parsedText;
            parsedText = applyProvinceNewsSettings(parsedText);
        } else {
            parsedText = formatProvinceLogs(effectiveInput);
            lastRawParsed = parsedText;
            parsedText = applyProvinceLogsSettings(parsedText);
        }

        lastRawInput = effectiveInput;
        lastDetectedMode = detectedMode;
        elements.outputText.value = parsedText;
        updateOutputView(elements);
        autoResizeOutput(elements.outputText);
        showMessage(elements.outputText, `${modeLabels[detectedMode]} parsed successfully!`, 'success', elements.parseStatus);

        showAdvancedPanel(elements);
        updateDiscordButtonVisibility(elements, detectedMode);
        updateAltCopyButtonVisibility(elements, detectedMode);

        if (window.innerWidth < 768) {
            const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            elements.enhancedOutput.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
        }

        collapseInputOnMobile(elements);

    } catch (error) {
        console.error('Parsing error:', error);
        showMessage(elements.outputText, 'Error parsing text. Please check your input.', 'error', elements.parseStatus);
    }
}

/**
 * Handles the clear button click
 * @param {Object} elements - DOM elements object
 */
function handleClear(elements) {
    elements.inputText.value = '';
    elements.outputText.value = '';
    if (elements.provinceNewsText) elements.provinceNewsText.value = '';
    elements.detectBadge.classList.add('hidden');
    secondaryInputVisible = false;
    setSecondaryInputVisible(false, null, elements);
    if (elements.altCopyBtn) elements.altCopyBtn.classList.add('hidden');
    updateParseButtonState(elements);

    // Reset war detection state
    advSettings.kingdomNews.warDetected = false;
    advSettings.kingdomNews.warOnly = false;

    // Hide and collapse advanced settings panel
    lastRawInput = null;
    lastDetectedMode = null;
    lastRawParsed = null;
    if (elements.enhancedOutput) {
        elements.enhancedOutput.innerHTML = '';
        elements.enhancedOutput.classList.add('hidden');
    }
    elements.outputText.classList.remove('hidden');
    elements.advPanel.classList.add('hidden');
    elements.advToggle.setAttribute('aria-expanded', 'false');
    elements.advContent.setAttribute('hidden', '');

    // Re-expand any collapsed input sections (Uto-b2kf)
    expandInputSections();

    // Focus back to input for better UX
    elements.inputText.focus();
}

/**
 * Shows or hides the secondary input section and updates its heading/label for the given mode.
 * @param {boolean} visible
 * @param {string|null} mode - 'province-logs' or 'province-news' (the primary mode)
 * @param {Object} elements - DOM elements object
 */
function setSecondaryInputVisible(visible, mode, elements) {
    if (!elements.secondarySection) return;
    if (!visible) {
        elements.secondarySection.classList.add('hidden');
        return;
    }
    elements.secondarySection.classList.remove('hidden');
    const heading = document.getElementById('secondary-input-heading');
    const labelEl = elements.secondarySection.querySelector('.textarea-label');
    const textarea = elements.provinceNewsText;
    if (mode === 'province-logs') {
        if (heading) heading.innerHTML = 'Province News <span class="optional-label">(optional)</span>';
        if (labelEl) labelEl.textContent = 'Paste Province News here to generate a Combined Province Summary:';
        if (textarea) textarea.placeholder = 'Paste Province News text here...';
    } else {
        if (heading) heading.innerHTML = 'Province Logs <span class="optional-label">(optional)</span>';
        if (labelEl) labelEl.textContent = 'Paste Province Logs here to generate a Combined Province Summary:';
        if (textarea) textarea.placeholder = 'Paste Province Logs text here...';
    }
}

/**
 * Renders the "Combined Summary" toggle in the Advanced Settings panel.
 * @param {HTMLElement} container - left column element
 * @param {string} mode - 'province-logs' or 'province-news' (the primary mode)
 * @param {Object} elements - DOM elements object
 */
function renderSecondaryInputToggle(container, mode, elements) {
    const group = document.createElement('div');
    group.className = 'adv-group';

    const id = mode === 'province-logs' ? 'adv-secondary-input-pl' : 'adv-secondary-input-pn';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = id;
    checkbox.checked = secondaryInputVisible;

    const labelText = mode === 'province-logs'
        ? 'Show Province News input for Combined Summary'
        : 'Show Province Logs input for Combined Summary';

    checkbox.addEventListener('change', () => {
        secondaryInputVisible = checkbox.checked;
        setSecondaryInputVisible(secondaryInputVisible, mode, elements);
        if (!secondaryInputVisible && elements.provinceNewsText) {
            elements.provinceNewsText.value = '';
        }
    });

    const label = document.createElement('label');
    label.htmlFor = id;
    const secondaryHintText = mode === 'province-logs'
        ? 'Show a second input box to paste Province News. When both inputs have content, a Combined Province Summary is generated'
        : 'Show a second input box to paste Province Logs. When both inputs have content, a Combined Province Summary is generated';

    label.appendChild(checkbox);
    label.appendChild(document.createTextNode(' ' + labelText));
    group.appendChild(label);
    group.appendChild(makeHint(secondaryHintText));
    container.appendChild(group);
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
        await writeToClipboard(outputText);
        showCopyFeedback(elements.copyFeedback, 'Copied to clipboard!', 'success');

        // Select the text for visual feedback and manual copy fallback
        elements.outputText.select();
        elements.outputText.setSelectionRange(0, 99999);

    } catch (error) {
        console.error('Copy failed:', error);
        fallbackCopyToClipboard(outputText);
        showCopyFeedback(elements.copyFeedback, 'Text selected - copy manually', 'warning');

        elements.outputText.select();
        elements.outputText.setSelectionRange(0, 99999);
    }
}

/**
 * Converts plain text to a string where newlines and leading spaces are replaced
 * with HTML markup (<br> and &nbsp;).
 * The mobile Utopia forum editor interprets pasted content as HTML: real newlines
 * are stripped on submit, but <br> and &nbsp; are preserved and rendered correctly.
 * @param {string} text
 * @returns {string} HTML-markup string (no wrapper tag)
 */
function textToMobileHtml(text) {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/\n/g, '<br>')
        .replace(/(^|<br>)([ ]+)/g, (_, br, spaces) => br + '&nbsp;'.repeat(spaces.length));
}

/**
 * Writes text to the clipboard.
 * On mobile: writes plain text containing <br> and &nbsp; markup. The mobile
 * Utopia forum editor interprets these as HTML, preserving line breaks and spacing.
 * Real newlines are stripped by the mobile editor on submit, so they cannot be used.
 * On desktop: writes plain text with real newlines — the desktop forum editor
 * preserves them correctly and treats <br> as literal text.
 * @param {string} text - Plain text to copy
 */
async function writeToClipboard(text) {
    const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    const mobileText = isMobile ? textToMobileHtml(text) : text;
    if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(mobileText);
    } else {
        fallbackCopyToClipboard(mobileText);
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
    const newsText = elements.provinceNewsText ? elements.provinceNewsText.value : '';

    if (text.trim() && newsText.trim()) {
        const mainType = detectInputType(text.trim());
        if (mainType === 'province-logs') {
            elements.detectBadge.textContent = 'Auto-detected: Province Logs + Province News';
            elements.detectBadge.classList.remove('hidden');
            return;
        }
        if (mainType === 'province-news') {
            elements.detectBadge.textContent = 'Auto-detected: Province News + Province Logs';
            elements.detectBadge.classList.remove('hidden');
            return;
        }
    }

    const effective = text.trim() || newsText.trim();
    if (!effective) return;
    const detected = detectInputType(effective);
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
    const hasText = elements.inputText.value.trim().length > 0
                 || (elements.provinceNewsText && elements.provinceNewsText.value.trim().length > 0);
    elements.parseBtn.disabled = !hasText;
    elements.parseBtn.style.opacity = hasText ? '1' : '0.6';
}

/**
 * Expands the output textarea to fit its content, capped at 80% of viewport height (Uto-qsxw).
 * @param {HTMLElement} el - The output textarea element
 */
function autoResizeOutput(el) {
    el.style.height = 'auto';
    const maxHeight = Math.floor(window.innerHeight * 0.8);
    el.style.height = Math.min(el.scrollHeight, maxHeight) + 'px';
}

/**
 * Shows a temporary message in the output textarea
 * @param {HTMLElement} target - Element to show message in
 * @param {string} message - Message to display
 * @param {string} type - 'success' or 'error'
 */
function showMessage(target, message, type, parseStatusEl) {
    const originalValue = target.value;
    const originalPlaceholder = target.placeholder;
    const prefix = type === 'error' ? 'Error: ' : 'Success: ';

    target.value = prefix + message;
    target.style.color = type === 'error' ? '#e53e3e' : '#38a169';

    // Announce to screen readers via the dedicated assertive live region
    if (parseStatusEl) {
        parseStatusEl.textContent = prefix + message;
    }

    setTimeout(() => {
        target.value = originalValue;
        target.placeholder = originalPlaceholder;
        target.style.color = '';
        if (parseStatusEl) parseStatusEl.textContent = '';
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

    const leftCol = document.createElement('div');
    leftCol.className = 'adv-col adv-col-left';
    const rightCol = document.createElement('div');
    rightCol.className = 'adv-col adv-col-right';
    container.appendChild(leftCol);
    container.appendChild(rightCol);

    if (lastDetectedMode === 'combined-province') {
        renderCombinedProvincePanel(elements);
        return;
    }

    if (lastDetectedMode === 'kingdom-news-log') {
        renderKingdomNewsSettings(leftCol, rightCol, elements);
    } else if (lastDetectedMode === 'province-news') {
        renderProvinceNewsSettings(leftCol, rightCol, elements);
    } else {
        renderProvinceLogsSettings(leftCol, rightCol, elements);
    }
}

/**
 * Creates an accessible hint (?) button with a tooltip.
 * - Desktop: tooltip appears on hover over the wrapper or focus of the button.
 * - Touch: button click toggles .is-open on the wrapper; outside click / Escape closes it.
 * WCAG: role="tooltip", aria-describedby, aria-label, keyboard accessible, hoverable (WCAG 1.4.13).
 * @param {string} text - Tooltip content
 * @returns {HTMLElement} Wrapper span containing the button and tooltip
 */
function makeHint(text) {
    const id = `adv-hint-${++_hintCounter}`;

    const wrap = document.createElement('span');
    wrap.className = 'adv-hint-wrap';

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'adv-hint';
    btn.setAttribute('aria-label', 'More information');
    btn.setAttribute('aria-describedby', id);
    btn.textContent = '?';

    btn.addEventListener('click', e => {
        e.stopPropagation();
        // Close any other open tooltip
        document.querySelectorAll('.adv-hint-wrap.is-open').forEach(w => {
            if (w !== wrap) w.classList.remove('is-open');
        });
        wrap.classList.toggle('is-open');
        // Clamp tooltip within viewport after opening
        if (wrap.classList.contains('is-open')) {
            tooltip.style.transform = 'translateX(-50%)';
            const rect = tooltip.getBoundingClientRect();
            const margin = 8;
            if (rect.right > window.innerWidth - margin) {
                const overflow = rect.right - (window.innerWidth - margin);
                tooltip.style.transform = `translateX(calc(-50% - ${overflow}px))`;
            } else if (rect.left < margin) {
                const overflow = margin - rect.left;
                tooltip.style.transform = `translateX(calc(-50% + ${overflow}px))`;
            }
        }
    });

    const tooltip = document.createElement('span');
    tooltip.className = 'adv-hint-tooltip';
    tooltip.id = id;
    tooltip.setAttribute('role', 'tooltip');
    tooltip.textContent = text;

    wrap.appendChild(btn);
    wrap.appendChild(tooltip);
    return wrap;
}

/**
 * Renders Kingdom News filter controls (show/hide attack types, unique window, section order)
 * @param {HTMLElement} container - The adv-content element
 * @param {Object} elements - DOM elements object
 */
function renderKingdomNewsSettings(leftCol, rightCol, elements) {
    // ── Sections (reorder + show/hide) ───────────────────────────────────────
    const orderTitle = document.createElement('div');
    orderTitle.className = 'adv-group-title';
    orderTitle.textContent = 'Sections';
    leftCol.appendChild(orderTitle);

    const list = document.createElement('ul');
    list.className = 'section-order-list';
    leftCol.appendChild(list);

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

            const id = `adv-kn-vis-${sectionName.replace(/ /g, '-')}`;
            const visLabel = document.createElement('label');
            visLabel.htmlFor = id;
            const visCb = document.createElement('input');
            visCb.type = 'checkbox';
            visCb.id = id;
            visCb.checked = advSettings.kingdomNews.visible[sectionName] !== false;
            visCb.addEventListener('change', () => {
                advSettings.kingdomNews.visible[sectionName] = visCb.checked;
                applyAndRerender(elements);
            });
            visLabel.appendChild(visCb);
            visLabel.appendChild(document.createTextNode(' ' + sectionName));

            item.appendChild(upBtn);
            item.appendChild(downBtn);
            item.appendChild(visLabel);
            list.appendChild(item);
        });
    }

    renderOrderList();

    // ── Show / Hide ──────────────────────────────────────────────────────────
    const showHideTitle = document.createElement('div');
    showHideTitle.className = 'adv-group-title';
    showHideTitle.textContent = 'Show / Hide';
    leftCol.appendChild(showHideTitle);

    const checkboxGroups = [
        {
            parentKey: 'showAttacks', parentLabel: 'Attacks',
            hint: 'Show or hide all attack types in the output',
            children: [
                { key: 'showTradMarch', label: 'Trad March', hint: 'Include Traditional March attacks (land capture)' },
                { key: 'showLearn',     label: 'Learn',      hint: 'Include Learn attacks (books looted from a province)' },
                { key: 'showMassacre',  label: 'Massacre',   hint: 'Include Massacre attacks (peasants killed)' },
                { key: 'showPlunder',   label: 'Plunder',    hint: 'Include Plunder attacks (resources looted)' },
            ]
        },
        {
            parentKey: 'showDragons', parentLabel: 'Dragons',
            hint: 'Show dragon events — launches, completions, and enemy dragons killed',
            children: [
                { key: 'showDragonCancellations', label: 'Dragon Cancellations', hint: 'Show when a kingdom cancels their dragon project' },
            ]
        },
        {
            parentKey: 'showKingdomRelations', parentLabel: 'Kingdom Relations',
            hint: 'Show war and ceasefire events between kingdoms',
            children: [
                { key: 'showWarDeclarations', label: 'War Declarations', hint: 'Show which kingdoms declared war and when' },
                { key: 'showCeasefires',      label: 'Ceasefires',       hint: 'Show ceasefire proposals, acceptances, and formal entries' },
            ]
        },
        { key: 'showRituals',        label: 'Rituals started/completed',    hint: 'Show ritual project starts and completions. Completions include the ritual type name (e.g. Haste, Barrier).' },
        { key: 'showRitualsFailed',  label: 'Rituals failed (summoning)',   hint: 'Show failed ritual summoning attempts' },
    ];

    function makeCheckbox(key, id) {
        const cb = document.createElement('input');
        cb.type = 'checkbox';
        cb.id = id;
        cb.checked = advSettings.kingdomNews[key];
        cb.addEventListener('change', () => {
            advSettings.kingdomNews[key] = cb.checked;
            applyAndRerender(elements);
        });
        return cb;
    }

    for (const item of checkboxGroups) {
        if (item.parentKey) {
            // Parent-child group
            const wrapper = document.createElement('div');
            wrapper.className = 'adv-parent-group';

            // Parent row
            const parentRow = document.createElement('div');
            parentRow.className = 'adv-group';
            const parentId = `adv-kn-${item.parentKey}`;
            const parentLabel = document.createElement('label');
            parentLabel.htmlFor = parentId;
            const parentCb = makeCheckbox(item.parentKey, parentId);
            parentLabel.appendChild(parentCb);
            parentLabel.appendChild(document.createTextNode(' ' + item.parentLabel));
            parentRow.appendChild(parentLabel);
            if (item.hint) parentRow.appendChild(makeHint(item.hint));
            wrapper.appendChild(parentRow);

            // Children container
            const childrenDiv = document.createElement('div');
            childrenDiv.className = 'adv-children' + (advSettings.kingdomNews[item.parentKey] ? '' : ' disabled');

            for (const child of item.children) {
                const childRow = document.createElement('div');
                childRow.className = 'adv-child-group';
                const childId = `adv-kn-${child.key}`;
                const childLabel = document.createElement('label');
                childLabel.htmlFor = childId;
                const childCb = makeCheckbox(child.key, childId);
                childLabel.appendChild(childCb);
                childLabel.appendChild(document.createTextNode(' ' + child.label));
                childRow.appendChild(childLabel);
                if (child.hint) childRow.appendChild(makeHint(child.hint));
                childrenDiv.appendChild(childRow);
            }

            // Update children disabled state when parent changes
            parentCb.addEventListener('change', () => {
                childrenDiv.classList.toggle('disabled', !parentCb.checked);
            });

            wrapper.appendChild(childrenDiv);
            leftCol.appendChild(wrapper);
        } else {
            // Standalone item
            const group = document.createElement('div');
            group.className = 'adv-group';
            const id = `adv-kn-${item.key}`;
            const label = document.createElement('label');
            label.htmlFor = id;
            const cb = makeCheckbox(item.key, id);
            label.appendChild(cb);
            label.appendChild(document.createTextNode(' ' + item.label));
            group.appendChild(label);
            if (item.hint) group.appendChild(makeHint(item.hint));
            leftCol.appendChild(group);
        }
    }

    // ── Unique Attack Window ─────────────────────────────────────────────────
    const windowTitle = document.createElement('div');
    windowTitle.className = 'adv-group-title';
    windowTitle.textContent = 'Unique Attack Window';
    leftCol.appendChild(windowTitle);

    const windowGroup = document.createElement('div');
    windowGroup.className = 'adv-group';

    const windowLabel = document.createElement('label');
    windowLabel.htmlFor = 'adv-kn-uniqueWindow';
    windowLabel.textContent = 'Days (0 = every attack unique): ';

    const windowInput = document.createElement('input');
    windowInput.type = 'number';
    windowInput.id = 'adv-kn-uniqueWindow';
    windowInput.min = '0';
    windowInput.max = '30';
    windowInput.value = advSettings.kingdomNews.uniqueWindow;
    windowInput.addEventListener('change', () => {
        const val = parseInt(windowInput.value, 10);
        if (val >= 0 && val <= 30) {
            advSettings.kingdomNews.uniqueWindow = val;
            applyAndRerender(elements);
        }
    });

    windowLabel.appendChild(windowInput);
    windowGroup.appendChild(windowLabel);
    windowGroup.appendChild(makeHint('Attacks by the same province within this many in-game days count as one unique. Set to 0 to count every attack as its own unique.'));
    leftCol.appendChild(windowGroup);

    // ── Uniques Grouping ─────────────────────────────────────────────────────
    const groupingGroup = document.createElement('div');
    groupingGroup.className = 'adv-group';

    const groupingLabel = document.createElement('label');
    groupingLabel.htmlFor = 'adv-kn-groupUniques';

    const groupingCheckbox = document.createElement('input');
    groupingCheckbox.type = 'checkbox';
    groupingCheckbox.id = 'adv-kn-uniquesWithKingdoms';
    groupingCheckbox.checked = advSettings.kingdomNews.uniquesWithKingdoms;
    groupingCheckbox.addEventListener('change', () => {
        advSettings.kingdomNews.uniquesWithKingdoms = groupingCheckbox.checked;
        applyAndRerender(elements);
    });

    groupingLabel.appendChild(groupingCheckbox);
    groupingLabel.appendChild(document.createTextNode(' Uniques grouped with Kingdoms'));
    groupingGroup.appendChild(groupingLabel);
    groupingGroup.appendChild(makeHint('Show unique attack counts under each kingdom\'s summary instead of in a separate Uniques section'));
    leftCol.appendChild(groupingGroup);

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
        warGroup.appendChild(makeHint('Filter the output to only show attacks between your kingdom and your war opponent during the war period'));
        leftCol.appendChild(warGroup);
    }

    // ── Display Options ───────────────────────────────────────────────────────
    renderRawTextToggle(rightCol, elements);
    renderLayoutToggle(rightCol);
    renderCopyButtonsSection(rightCol, 'kingdomNews', 'kn', elements);
}

/**
 * Renders Province Logs section visibility and reorder controls
 * @param {HTMLElement} container - The adv-content element
 * @param {Object} elements - DOM elements object
 */
function renderProvinceLogsSettings(leftCol, rightCol, elements) {
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
    leftCol.appendChild(title);

    const list = document.createElement('ul');
    list.className = 'section-order-list';
    leftCol.appendChild(list);

    function makeOrderBtn(text, ariaLabel, disabled, onClick) {
        const btn = document.createElement('button');
        btn.className = 'order-btn';
        btn.textContent = text;
        btn.disabled = disabled;
        btn.title = text === '▲' ? 'Move up' : 'Move down';
        btn.setAttribute('aria-label', ariaLabel);
        btn.addEventListener('click', onClick);
        return btn;
    }

    function renderList() {
        list.innerHTML = '';
        const fullOrder = advSettings.provinceLogs.sectionOrder;
        const groups = advSettings.provinceLogs.sectionGroups;

        // Derive visible group order from sectionOrder
        const visibleGroups = groups
            .map(g => ({
                ...g,
                presentChildren: g.children.filter(c => presentSections.has(c))
            }))
            .filter(g => g.presentChildren.length > 0)
            .sort((a, b) => {
                const idxA = Math.min(...a.children.map(c => fullOrder.indexOf(c)).filter(i => i >= 0));
                const idxB = Math.min(...b.children.map(c => fullOrder.indexOf(c)).filter(i => i >= 0));
                return idxA - idxB;
            });

        // Swap two groups in fullOrder (handles different group sizes)
        function swapGroups(groupA, groupB) {
            // Get current positions of all children of both groups
            const childrenA = groupA.children.filter(c => fullOrder.includes(c));
            const childrenB = groupB.children.filter(c => fullOrder.includes(c));
            const minA = Math.min(...childrenA.map(c => fullOrder.indexOf(c)));
            const minB = Math.min(...childrenB.map(c => fullOrder.indexOf(c)));

            // Remove both groups' children from array
            const allToMove = [...childrenA, ...childrenB];
            const remaining = fullOrder.filter(s => !allToMove.includes(s));

            // Determine insertion point: where the earlier group started
            const insertAt = Math.min(minA, minB);

            // Reinsert with groups swapped
            const [first, second] = minA < minB ? [childrenB, childrenA] : [childrenA, childrenB];
            remaining.splice(insertAt, 0, ...first, ...second);
            fullOrder.length = 0;
            fullOrder.push(...remaining);
        }

        visibleGroups.forEach((group, gIdx) => {
            const isStandalone = group.children.length === 1;
            const isFirstGroup = gIdx === 0;
            const isLastGroup = gIdx === visibleGroups.length - 1;

            if (isStandalone) {
                // Standalone: single row with reorder buttons + checkbox
                const sectionName = group.children[0];
                const item = document.createElement('li');
                item.className = 'section-order-item';

                item.appendChild(makeOrderBtn('▲', `Move ${group.label} up`, isFirstGroup, () => {
                    swapGroups(group, visibleGroups[gIdx - 1]);
                    renderList();
                    applyAndRerender(elements);
                }));
                item.appendChild(makeOrderBtn('▼', `Move ${group.label} down`, isLastGroup, () => {
                    swapGroups(group, visibleGroups[gIdx + 1]);
                    renderList();
                    applyAndRerender(elements);
                }));

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
                item.appendChild(label);
                list.appendChild(item);
            } else {
                // Multi-child group: parent header row + indented child rows
                const parentItem = document.createElement('li');
                parentItem.className = 'section-order-item section-order-parent';

                parentItem.appendChild(makeOrderBtn('▲', `Move ${group.label} group up`, isFirstGroup, () => {
                    swapGroups(group, visibleGroups[gIdx - 1]);
                    renderList();
                    applyAndRerender(elements);
                }));
                parentItem.appendChild(makeOrderBtn('▼', `Move ${group.label} group down`, isLastGroup, () => {
                    swapGroups(group, visibleGroups[gIdx + 1]);
                    renderList();
                    applyAndRerender(elements);
                }));

                const parentLabel = document.createElement('span');
                parentLabel.className = 'section-order-group-label';
                parentLabel.textContent = group.label;
                parentItem.appendChild(parentLabel);
                list.appendChild(parentItem);

                // Child rows
                const presentChildren = group.presentChildren;
                presentChildren.forEach((sectionName, cIdx) => {
                    const childItem = document.createElement('li');
                    childItem.className = 'section-order-item section-order-child';

                    const isFirstChild = cIdx === 0;
                    const isLastChild = cIdx === presentChildren.length - 1;

                    childItem.appendChild(makeOrderBtn('▲', `Move ${sectionName} up`, isFirstChild, () => {
                        const prev = presentChildren[cIdx - 1];
                        const idxA = fullOrder.indexOf(prev);
                        const idxB = fullOrder.indexOf(sectionName);
                        [fullOrder[idxA], fullOrder[idxB]] = [fullOrder[idxB], fullOrder[idxA]];
                        renderList();
                        applyAndRerender(elements);
                    }));
                    childItem.appendChild(makeOrderBtn('▼', `Move ${sectionName} down`, isLastChild, () => {
                        const next = presentChildren[cIdx + 1];
                        const idxA = fullOrder.indexOf(sectionName);
                        const idxB = fullOrder.indexOf(next);
                        [fullOrder[idxA], fullOrder[idxB]] = [fullOrder[idxB], fullOrder[idxA]];
                        renderList();
                        applyAndRerender(elements);
                    }));

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
                    childItem.appendChild(label);
                    list.appendChild(childItem);
                });
            }
        });
    }

    renderList();

    // ── Display Options ───────────────────────────────────────────────────────
    const avgTitle = document.createElement('div');
    avgTitle.className = 'adv-group-title';
    avgTitle.textContent = 'Display Options';
    rightCol.appendChild(avgTitle);

    const thieverySpellsTitle = document.createElement('div');
    thieverySpellsTitle.className = 'adv-subgroup-title';
    thieverySpellsTitle.textContent = 'Thievery and Spells';
    rightCol.appendChild(thieverySpellsTitle);

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
    avgGroup.appendChild(makeHint('Show the average impact per operation, e.g. average acres per Greater Arson op or average books per Amnesia'));
    rightCol.appendChild(avgGroup);

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
    failedGroup.appendChild(makeHint('Include failed thievery ops and any thieves lost in the Thievery Summary'));
    rightCol.appendChild(failedGroup);

    const failedSpellGroup = document.createElement('div');
    failedSpellGroup.className = 'adv-group';

    const failedSpellLabel = document.createElement('label');
    failedSpellLabel.htmlFor = 'adv-pl-showFailedSpellAttempts';

    const failedSpellCheckbox = document.createElement('input');
    failedSpellCheckbox.type = 'checkbox';
    failedSpellCheckbox.id = 'adv-pl-showFailedSpellAttempts';
    failedSpellCheckbox.checked = advSettings.provinceLogs.showFailedSpellAttempts;
    failedSpellCheckbox.addEventListener('change', () => {
        advSettings.provinceLogs.showFailedSpellAttempts = failedSpellCheckbox.checked;
        applyAndRerender(elements);
    });

    failedSpellLabel.appendChild(failedSpellCheckbox);
    failedSpellLabel.appendChild(document.createTextNode(' Show failed spell attempts'));
    failedSpellGroup.appendChild(failedSpellLabel);
    failedSpellGroup.appendChild(makeHint('Include spells that were attempted but failed to land in the Spell Targets breakdown'));
    rightCol.appendChild(failedSpellGroup);

    const successLossGroup = document.createElement('div');
    successLossGroup.className = 'adv-group';

    const successLossLabel = document.createElement('label');
    successLossLabel.htmlFor = 'adv-pl-showSuccessThieveryLosses';

    const successLossCheckbox = document.createElement('input');
    successLossCheckbox.type = 'checkbox';
    successLossCheckbox.id = 'adv-pl-showSuccessThieveryLosses';
    successLossCheckbox.checked = advSettings.provinceLogs.showSuccessThieveryLosses;
    successLossCheckbox.addEventListener('change', () => {
        advSettings.provinceLogs.showSuccessThieveryLosses = successLossCheckbox.checked;
        applyAndRerender(elements);
    });

    successLossLabel.appendChild(successLossCheckbox);
    successLossLabel.appendChild(document.createTextNode(' Show thieves lost in successful operations'));
    successLossGroup.appendChild(successLossLabel);
    successLossGroup.appendChild(makeHint('Include thief casualty counts from operations that succeeded (separate from failed op losses)'));
    rightCol.appendChild(successLossGroup);

    const constructionTitle = document.createElement('div');
    constructionTitle.className = 'adv-subgroup-title';
    constructionTitle.textContent = 'Construction & Exploring';
    rightCol.appendChild(constructionTitle);

    const razedGroup = document.createElement('div');
    razedGroup.className = 'adv-group';

    const razedLabel = document.createElement('label');
    razedLabel.htmlFor = 'adv-pl-showRazedBuildings';

    const razedCheckbox = document.createElement('input');
    razedCheckbox.type = 'checkbox';
    razedCheckbox.id = 'adv-pl-showRazedBuildings';
    razedCheckbox.checked = advSettings.provinceLogs.showRazedBuildings;
    razedCheckbox.addEventListener('change', () => {
        advSettings.provinceLogs.showRazedBuildings = razedCheckbox.checked;
        applyAndRerender(elements);
    });

    razedLabel.appendChild(razedCheckbox);
    razedLabel.appendChild(document.createTextNode(' Show razed building summary'));
    razedGroup.appendChild(razedLabel);
    razedGroup.appendChild(makeHint('Include buildings demolished by your province in the Construction Summary'));
    rightCol.appendChild(razedGroup);

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
    exploreGroup.appendChild(makeHint('Show the number of soldiers sent and gold spent per exploration order in the Exploration Summary'));
    rightCol.appendChild(exploreGroup);

    const militaryTitle = document.createElement('div');
    militaryTitle.className = 'adv-subgroup-title';
    militaryTitle.textContent = 'Military';
    rightCol.appendChild(militaryTitle);

    const releaseGroup = document.createElement('div');
    releaseGroup.className = 'adv-group';

    const releaseLabel = document.createElement('label');
    releaseLabel.htmlFor = 'adv-pl-showTroopsReleased';

    const releaseCheckbox = document.createElement('input');
    releaseCheckbox.type = 'checkbox';
    releaseCheckbox.id = 'adv-pl-showTroopsReleased';
    releaseCheckbox.checked = advSettings.provinceLogs.showTroopsReleased;
    releaseCheckbox.addEventListener('change', () => {
        advSettings.provinceLogs.showTroopsReleased = releaseCheckbox.checked;
        applyAndRerender(elements);
    });

    releaseLabel.appendChild(releaseCheckbox);
    releaseLabel.appendChild(document.createTextNode(' Show troops released from duty'));
    releaseGroup.appendChild(releaseLabel);
    releaseGroup.appendChild(makeHint('Include troop release orders in the Military Training section'));
    rightCol.appendChild(releaseGroup);

    const draftGroup = document.createElement('div');
    draftGroup.className = 'adv-group';

    const draftLabel = document.createElement('label');
    draftLabel.htmlFor = 'adv-pl-showDraftPercentage';

    const draftCheckbox = document.createElement('input');
    draftCheckbox.type = 'checkbox';
    draftCheckbox.id = 'adv-pl-showDraftPercentage';
    draftCheckbox.checked = advSettings.provinceLogs.showDraftPercentage;
    draftCheckbox.addEventListener('change', () => {
        advSettings.provinceLogs.showDraftPercentage = draftCheckbox.checked;
        applyAndRerender(elements);
    });

    draftLabel.appendChild(draftCheckbox);
    draftLabel.appendChild(document.createTextNode(' Show draft percentage changes'));
    draftGroup.appendChild(draftLabel);
    draftGroup.appendChild(makeHint('Include draft percentage orders (e.g. "draft up to 15% of population") in the Military Training section'));
    rightCol.appendChild(draftGroup);

    const draftRateGroup = document.createElement('div');
    draftRateGroup.className = 'adv-group';

    const draftRateLabel = document.createElement('label');
    draftRateLabel.htmlFor = 'adv-pl-showDraftRate';

    const draftRateCheckbox = document.createElement('input');
    draftRateCheckbox.type = 'checkbox';
    draftRateCheckbox.id = 'adv-pl-showDraftRate';
    draftRateCheckbox.checked = advSettings.provinceLogs.showDraftRate;
    draftRateCheckbox.addEventListener('change', () => {
        advSettings.provinceLogs.showDraftRate = draftRateCheckbox.checked;
        applyAndRerender(elements);
    });

    draftRateLabel.appendChild(draftRateCheckbox);
    draftRateLabel.appendChild(document.createTextNode(' Show draft rate changes'));
    draftRateGroup.appendChild(draftRateLabel);
    draftRateGroup.appendChild(makeHint('Include draft rate setting changes (e.g. "Intensive") in the Military Training section'));
    rightCol.appendChild(draftRateGroup);

    const wagesGroup = document.createElement('div');
    wagesGroup.className = 'adv-group';

    const wagesLabel = document.createElement('label');
    wagesLabel.htmlFor = 'adv-pl-showMilitaryWages';

    const wagesCheckbox = document.createElement('input');
    wagesCheckbox.type = 'checkbox';
    wagesCheckbox.id = 'adv-pl-showMilitaryWages';
    wagesCheckbox.checked = advSettings.provinceLogs.showMilitaryWages;
    wagesCheckbox.addEventListener('change', () => {
        advSettings.provinceLogs.showMilitaryWages = wagesCheckbox.checked;
        applyAndRerender(elements);
    });

    wagesLabel.appendChild(wagesCheckbox);
    wagesLabel.appendChild(document.createTextNode(' Show military wage changes'));
    wagesGroup.appendChild(wagesLabel);
    wagesGroup.appendChild(makeHint('Include military wage percentage changes in the Military Training section'));
    rightCol.appendChild(wagesGroup);

    const miscTitle = document.createElement('div');
    miscTitle.className = 'adv-subgroup-title';
    miscTitle.textContent = 'Miscellaneous';
    rightCol.appendChild(miscTitle);

    renderSecondaryInputToggle(rightCol, 'province-logs', elements);

    renderRawTextToggle(rightCol, elements);
    renderLayoutToggle(rightCol);
    renderCopyButtonsSection(rightCol, 'provinceLogs', 'pl', elements);
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
        } else if (lastDetectedMode === 'combined-province') {
            parsedText = applyCombinedProvinceSettings(lastRawParsed);
        } else {
            parsedText = formatProvinceLogs(lastRawInput);
            lastRawParsed = parsedText;
            parsedText = applyProvinceLogsSettings(parsedText);
        }
        elements.outputText.value = parsedText;
        updateOutputView(elements);
        autoResizeOutput(elements.outputText);
        updateDiscordButtonVisibility(elements, lastDetectedMode);
        updateAltCopyButtonVisibility(elements, lastDetectedMode);
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
        // Attacks parent + children
        const atk = s.showAttacks;
        if ((!atk || !s.showTradMarch) && /^-- Trad March:/.test(line))                   return false;
        if (!atk                        && /^-- (Ambush|Conquest|Raze):/.test(line))       return false;
        if ((!atk || !s.showLearn)     && /^-- Learn:/.test(line))                         return false;
        if ((!atk || !s.showMassacre)  && /^-- Massacre:/.test(line))                      return false;
        if ((!atk || !s.showPlunder)   && /^-- Plunder:/.test(line))                       return false;
        // Dragons parent + child
        if (!s.showDragons                              && /^-- (Enemy )?Dragons (Started|Completed):/.test(line)) return false;
        if (!s.showDragons                              && /^-- Enemy Dragons Killed:/.test(line))                  return false;
        if ((!s.showDragons || !s.showDragonCancellations) && /^-- (Enemy )?Dragons Cancelled:/.test(line))        return false;
        // Kingdom Relations children
        if ((!s.showKingdomRelations || !s.showWarDeclarations) && /^-- War Declarations/.test(line))              return false;
        if ((!s.showKingdomRelations || !s.showCeasefires)      && /^-- (Ceasefire|Formal Ceasefires)/.test(line)) return false;
        if (!s.showRituals             && /^-- Rituals (Started|Completed):/.test(line))            return false;
        if (!s.showRitualsFailed       && /^-- Rituals Failed:/.test(line))                         return false;

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
        if (/^\*\* Kingdom Relations \*\*/.test(firstLine))        return 'Kingdom Relations';
        return 'Per-Kingdom Summaries';
    }

    const ownKingdomSummaryBlocks = [];
    const perKingdomPairs = []; // [{ summary: block, uniques: block|null }]
    const highlightsBlocks = [];
    const kingdomRelationsBlocks = [];
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
        } else if (cat === 'Kingdom Relations') {
            kingdomRelationsBlocks.push(block);
        }
    }

    // Step 5: Reconstruct in the user-defined section order
    const resultBlocks = [];

    for (const section of s.sectionOrder) {
        if (s.visible && s.visible[section] === false) continue;
        if (section === 'Own Kingdom Summary') {
            resultBlocks.push(...ownKingdomSummaryBlocks);
        } else if (section === 'Per-Kingdom Summaries') {
            for (const pair of perKingdomPairs) {
                resultBlocks.push(pair.summary);
                if (s.uniquesWithKingdoms && pair.uniques) {
                    resultBlocks.push(pair.uniques);
                }
            }
        } else if (section === 'Uniques') {
            if (!s.uniquesWithKingdoms) {
                for (const pair of perKingdomPairs) {
                    if (pair.uniques) resultBlocks.push(pair.uniques);
                }
            }
            // When uniquesWithKingdoms, uniques were already emitted inline above
        } else if (section === 'Highlights') {
            resultBlocks.push(...highlightsBlocks);
        } else if (section === 'Kingdom Relations') {
            if (s.showKingdomRelations) resultBlocks.push(...kingdomRelationsBlocks);
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
        'Thievery Summary', 'Thievery Targets by Province', 'Thievery Targets by Op Type', 'Resources Stolen from Opponents',
        'Spell Summary', 'Spell Targets by Province', 'Spell Targets by Spell Type',
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
    if (!advSettings.provinceLogs.showAverages) {
        // Strip subcomponent avg annotations (4-space-indented lines: Greater Arson buildings, Propaganda troops)
        output = output.split('\n').map(line =>
            /^    /.test(line) ? line.replace(/ \(\d+ ops, avg [^)]+\)$/, '') : line
        ).join('\n');
    }

    if (!advSettings.provinceLogs.showFailedThievery) {
        // Thievery Summary: remove "N failed thievery attempts" line
        output = output.split('\n').filter(line => !/failed thievery attempt/.test(line)).join('\n');
        // Thievery Targets: remove "    Failed: N (N thieves lost)" lines (distinguished by trailing parens)
        output = output.split('\n').filter(line => !/^    Failed: \d+ \(/.test(line)).join('\n');
        // Thievery Targets: strip "(N failed)" annotation from province header lines
        output = output.split('\n').map(line => line.replace(/ \(\d+ failed\)(?=:$)/, '')).join('\n');
        // Thievery by Op Type: remove entire "Failed — N ops:" block and its province sub-lines
        let skipThieveryBlock = false;
        output = output.split('\n').filter(line => {
            if (/^  Failed — \d+ ops:/.test(line)) { skipThieveryBlock = true; return false; }
            if (skipThieveryBlock && /^    /.test(line)) { return false; }
            skipThieveryBlock = false;
            return true;
        }).join('\n');
    }

    if (!advSettings.provinceLogs.showFailedSpellAttempts) {
        // Spell Targets: remove "    Failed: N" lines (no trailing content, unlike thievery)
        output = output.split('\n').filter(line => !/^    Failed: \d+$/.test(line)).join('\n');
        // Spell Targets: strip "(N failed)" annotation from province header lines
        output = output.split('\n').map(line => line.replace(/ \(\d+ failed\)(?=:$)/, '')).join('\n');
        // Spell by Spell Type: remove entire "Failed — N casts:" block and its province sub-lines
        let skipSpellBlock = false;
        output = output.split('\n').filter(line => {
            if (/^  Failed — \d+ casts:/.test(line)) { skipSpellBlock = true; return false; }
            if (skipSpellBlock && /^    /.test(line)) { return false; }
            skipSpellBlock = false;
            return true;
        }).join('\n');
    }

    if (!advSettings.provinceLogs.showSuccessThieveryLosses) {
        output = output.split('\n').filter(line => !/thieves lost in successful operations/.test(line)).join('\n');
    }

    if (!advSettings.provinceLogs.showRazedBuildings) {
        output = output.split('\n').filter(line => !/ razed$/.test(line)).join('\n');
    }

    if (!advSettings.provinceLogs.showDraftPercentage) {
        output = output.split('\n').filter(line => !/Draft:/.test(line)).join('\n');
    }

    if (!advSettings.provinceLogs.showDraftRate) {
        output = output.split('\n').filter(line => !/Draft rate:/.test(line)).join('\n');
    }

    if (!advSettings.provinceLogs.showMilitaryWages) {
        output = output.split('\n').filter(line => !/Military wages:/.test(line)).join('\n');
    }

    if (!advSettings.provinceLogs.showTroopsReleased) {
        output = output.split('\n').filter(line => !/ released$/.test(line)).join('\n');
    }

    if (!advSettings.provinceLogs.exploreDetails) {
        output = output.split('\n').filter(line => !/soldiers sent at a cost of/.test(line)).join('\n');
    }

    if (advSettings.provinceLogs.showAverages) {
        output = output.split('\n').map(line => {
            const m = line.match(/^\s*(\d+) (.+) for a total of ([\d,]+) (.+)$/);
            if (m) {
                const count = parseInt(m[1], 10);
                const total = parseInt(m[3].replace(/,/g, ''), 10);
                if (count > 1) {
                    const avg = Math.round(total / count);
                    const avgStr = avg.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                    return `${line} (avg ${avgStr})`;
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
function renderProvinceNewsSettings(leftCol, rightCol, elements) {
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
    leftCol.appendChild(title);

    const list = document.createElement('ul');
    list.className = 'section-order-list';
    leftCol.appendChild(list);

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

    // ── Display Options ───────────────────────────────────────────────────────
    const optTitle = document.createElement('div');
    optTitle.className = 'adv-group-title';
    optTitle.textContent = 'Display Options';
    rightCol.appendChild(optTitle);

    const srcGroup = document.createElement('div');
    srcGroup.className = 'adv-group';

    const srcLabel = document.createElement('label');
    srcLabel.htmlFor = 'adv-pn-showSourceIdentifiers';

    const srcCheckbox = document.createElement('input');
    srcCheckbox.type = 'checkbox';
    srcCheckbox.id = 'adv-pn-showSourceIdentifiers';
    srcCheckbox.checked = advSettings.provinceNews.showSourceIdentifiers;
    srcCheckbox.addEventListener('change', () => {
        advSettings.provinceNews.showSourceIdentifiers = srcCheckbox.checked;
        applyAndRerender(elements);
    });

    srcLabel.appendChild(srcCheckbox);
    srcLabel.appendChild(document.createTextNode(' Show attacker names in Thievery & Spell Impacts'));
    srcGroup.appendChild(srcLabel);
    srcGroup.appendChild(makeHint('Show which province or kingdom was responsible for each thievery op and spell impact'));
    rightCol.appendChild(srcGroup);

    renderSecondaryInputToggle(rightCol, 'province-news', elements);

    renderRawTextToggle(rightCol, elements);
    renderLayoutToggle(rightCol);
    renderCopyButtonsSection(rightCol, 'provinceNews', 'pn', elements);
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

    // Strip source identifier lines when toggle is off (Uto-l42y)
    if (!advSettings.provinceNews.showSourceIdentifiers) {
        for (const sectionName of ['Thievery Impacts', 'Spell Impacts']) {
            if (sections[sectionName]) {
                sections[sectionName] = sections[sectionName]
                    .split('\n')
                    .filter(line => !line.startsWith('    '))
                    .join('\n');
            }
        }
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
 * Applies combined province advanced settings to the raw combined output text.
 * Extracts sections from both Province Logs and Province News pass-through content,
 * applies visibility/ordering from advSettings.combinedProvince, and applies
 * all display toggles.
 * @param {string} text - Raw output from formatCombinedProvinceSummary
 * @returns {string} Filtered and reordered combined output
 */
function applyCombinedProvinceSettings(text) {
    const s = advSettings.combinedProvince;

    // All section names in the combined output — logs sections use ":", news sections don't
    const logsSectionNames = [
        'Aid Summary',
        'Thievery Summary', 'Thievery Targets by Province', 'Thievery Targets by Op Type', 'Resources Stolen from Opponents',
        'Spell Summary', 'Spell Targets by Province', 'Spell Targets by Spell Type',
        'Dragon Summary', 'Ritual Summary', 'Construction Summary', 'Science Summary',
        'Exploration Summary', 'Military Training'
    ];
    const newsSectionNames = [
        'Attacks Suffered', 'Thievery Impacts', 'Shadowlight Thief IDs', 'Spell Impacts',
        'Daily Login Bonus', 'Scientists Gained', 'War Outcomes', 'Starvation'
    ];
    const allSectionNames = [...logsSectionNames, ...newsSectionNames];

    // Find header (everything before the first recognised section)
    let firstSectionStart = text.length;
    for (const name of allSectionNames) {
        const withColon = text.indexOf('\n\n' + name + ':');
        const withoutColon = text.indexOf('\n\n' + name + '\n');
        const idx = withColon !== -1 ? (withoutColon !== -1 ? Math.min(withColon, withoutColon) : withColon)
                                      : withoutColon;
        if (idx !== -1 && idx < firstSectionStart) firstSectionStart = idx;
    }
    const header = text.substring(0, firstSectionStart);

    // Extract each section
    const sections = {};
    for (const name of allSectionNames) {
        // Try both colon and non-colon markers
        let start = text.indexOf('\n\n' + name + ':');
        if (start === -1) start = text.indexOf('\n\n' + name + '\n');
        if (start === -1) continue;

        let end = text.length;
        for (const other of allSectionNames) {
            if (other === name) continue;
            let otherStart = text.indexOf('\n\n' + other + ':');
            if (otherStart === -1) otherStart = text.indexOf('\n\n' + other + '\n');
            if (otherStart > start && otherStart < end) end = otherStart;
        }
        sections[name] = text.substring(start + 2, end);
    }

    // Apply Province News showSourceIdentifiers toggle
    if (!s.showSourceIdentifiers) {
        for (const sectionName of ['Thievery Impacts', 'Spell Impacts']) {
            if (sections[sectionName]) {
                sections[sectionName] = sections[sectionName]
                    .split('\n')
                    .filter(line => !line.startsWith('    '))
                    .join('\n');
            }
        }
    }

    // Reconstruct in the user-defined order, skipping hidden sections
    let result = header;
    for (const name of s.sectionOrder) {
        if (s.visible[name] && sections[name]) {
            result += '\n\n' + sections[name];
        }
    }

    let output = result.trim();

    // Apply Province Logs display toggles (same logic as applyProvinceLogsSettings)
    if (!s.showAverages) {
        output = output.split('\n').map(line =>
            /^    /.test(line) ? line.replace(/ \(\d+ ops, avg [^)]+\)$/, '') : line
        ).join('\n');
    }
    if (!s.showFailedThievery) {
        output = output.split('\n').filter(line => !/failed thievery attempt/.test(line)).join('\n');
        output = output.split('\n').filter(line => !/^    Failed: \d+ \(/.test(line)).join('\n');
        output = output.split('\n').map(line => line.replace(/ \(\d+ failed\)(?=:$)/, '')).join('\n');
        let skipThieveryBlock = false;
        output = output.split('\n').filter(line => {
            if (/^  Failed — \d+ ops:/.test(line)) { skipThieveryBlock = true; return false; }
            if (skipThieveryBlock && /^    /.test(line)) { return false; }
            skipThieveryBlock = false;
            return true;
        }).join('\n');
    }
    if (!s.showFailedSpellAttempts) {
        output = output.split('\n').filter(line => !/^    Failed: \d+$/.test(line)).join('\n');
        output = output.split('\n').map(line => line.replace(/ \(\d+ failed\)(?=:$)/, '')).join('\n');
        let skipSpellBlock = false;
        output = output.split('\n').filter(line => {
            if (/^  Failed — \d+ casts:/.test(line)) { skipSpellBlock = true; return false; }
            if (skipSpellBlock && /^    /.test(line)) { return false; }
            skipSpellBlock = false;
            return true;
        }).join('\n');
    }
    if (!s.showSuccessThieveryLosses) {
        output = output.split('\n').filter(line => !/thieves lost in successful operations/.test(line)).join('\n');
    }
    if (!s.showRazedBuildings) {
        output = output.split('\n').filter(line => !/ razed$/.test(line)).join('\n');
    }
    if (!s.showDraftPercentage) {
        output = output.split('\n').filter(line => !/Draft:/.test(line)).join('\n');
    }
    if (!s.showDraftRate) {
        output = output.split('\n').filter(line => !/Draft rate:/.test(line)).join('\n');
    }
    if (!s.showMilitaryWages) {
        output = output.split('\n').filter(line => !/Military wages:/.test(line)).join('\n');
    }
    if (!s.showTroopsReleased) {
        output = output.split('\n').filter(line => !/ released$/.test(line)).join('\n');
    }
    if (!s.exploreDetails) {
        output = output.split('\n').filter(line => !/soldiers sent at a cost of/.test(line)).join('\n');
    }

    return output;
}

/**
 * Renders the Advanced Settings panel for Combined Province mode.
 * Provides section visibility/ordering (superset of Province Logs + Province News)
 * and all display toggles from both parsers.
 */
function renderCombinedProvincePanel(elements) {
    const container = elements.advContent;
    container.innerHTML = '';
    const s = advSettings.combinedProvince;

    // Two-column layout (reuse existing adv-panel CSS)
    const cols = document.createElement('div');
    cols.className = 'adv-two-col';
    container.appendChild(cols);

    // Left column: Sections (visibility + ordering)
    const leftCol = document.createElement('div');
    leftCol.className = 'adv-col';
    cols.appendChild(leftCol);
    const sectionsHeading = document.createElement('h3');
    sectionsHeading.className = 'adv-col-heading';
    sectionsHeading.textContent = 'Sections';
    leftCol.appendChild(sectionsHeading);

    // Build section groups UI (same pattern as Province Logs panel)
    const groups = s.sectionGroups;
    const visibleGroups = groups.filter(g => g.children.some(c => s.sectionOrder.includes(c)));

    function swapGroups(gA, gB) {
        const orderArr = s.sectionOrder;
        const firstA = orderArr.findIndex(n => gA.children.includes(n));
        const firstB = orderArr.findIndex(n => gB.children.includes(n));
        if (firstA === -1 || firstB === -1) return;
        const minIdx = Math.min(firstA, firstB);
        const maxIdx = Math.max(firstA, firstB);
        const aChildren = orderArr.filter(n => gA.children.includes(n));
        const bChildren = orderArr.filter(n => gB.children.includes(n));
        const between = orderArr.slice(minIdx, maxIdx + Math.max(aChildren.length, bChildren.length)).filter(n => !gA.children.includes(n) && !gB.children.includes(n));
        const [first, second] = firstA < firstB ? [bChildren, aChildren] : [aChildren, bChildren];
        const newSegment = [...first, ...between, ...second];
        s.sectionOrder.splice(minIdx, newSegment.length, ...newSegment);
        renderCombinedProvincePanel(elements);
        applyAndRerender(elements);
    }

    visibleGroups.forEach((group, gIdx) => {
        const groupDiv = document.createElement('div');
        groupDiv.className = 'adv-section-group';
        leftCol.appendChild(groupDiv);
        const isLastGroup = gIdx === visibleGroups.length - 1;

        const upBtn = document.createElement('button');
        upBtn.className = 'adv-move-btn';
        upBtn.textContent = '▲';
        upBtn.disabled = gIdx === 0;
        upBtn.setAttribute('aria-label', `Move ${group.label} up`);
        upBtn.addEventListener('click', () => swapGroups(group, visibleGroups[gIdx - 1]));

        const downBtn = document.createElement('button');
        downBtn.className = 'adv-move-btn';
        downBtn.textContent = '▼';
        downBtn.disabled = isLastGroup;
        downBtn.setAttribute('aria-label', `Move ${group.label} down`);
        downBtn.addEventListener('click', () => swapGroups(group, visibleGroups[gIdx + 1]));

        group.children.forEach((sectionName, cIdx) => {
            const row = document.createElement('div');
            row.className = 'adv-section-row';
            if (cIdx === 0) { row.appendChild(upBtn); row.appendChild(downBtn); }

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = 'adv-cp-vis-' + sectionName.replace(/\s+/g, '-');
            checkbox.checked = s.visible[sectionName];
            checkbox.addEventListener('change', () => {
                s.visible[sectionName] = checkbox.checked;
                applyAndRerender(elements);
            });

            const label = document.createElement('label');
            label.htmlFor = checkbox.id;
            label.textContent = cIdx === 0 ? group.label : sectionName;
            row.appendChild(checkbox);
            row.appendChild(label);
            groupDiv.appendChild(row);
        });
    });

    // Right column: Display Options
    const rightCol = document.createElement('div');
    rightCol.className = 'adv-col';
    cols.appendChild(rightCol);
    const dispHeading = document.createElement('h3');
    dispHeading.className = 'adv-col-heading';
    dispHeading.textContent = 'Display Options';
    rightCol.appendChild(dispHeading);

    function addToggle(id, label, getter, setter) {
        const row = document.createElement('div');
        row.className = 'adv-option-row';
        const cb = document.createElement('input');
        cb.type = 'checkbox';
        cb.id = id;
        cb.checked = getter();
        cb.addEventListener('change', () => { setter(cb.checked); applyAndRerender(elements); });
        const lbl = document.createElement('label');
        lbl.htmlFor = id;
        lbl.textContent = label;
        row.appendChild(cb);
        row.appendChild(lbl);
        rightCol.appendChild(row);
    }

    addToggle('adv-cp-showAverages',              'Show averages in Thievery',          () => s.showAverages,              v => { s.showAverages = v; });
    addToggle('adv-cp-showFailedThievery',         'Show failed thievery operations',    () => s.showFailedThievery,        v => { s.showFailedThievery = v; });
    addToggle('adv-cp-showFailedSpellAttempts',    'Show failed spell attempts',          () => s.showFailedSpellAttempts,   v => { s.showFailedSpellAttempts = v; });
    addToggle('adv-cp-showSuccessThieveryLosses',  'Show thieves lost on success',        () => s.showSuccessThieveryLosses, v => { s.showSuccessThieveryLosses = v; });
    addToggle('adv-cp-showRazedBuildings',         'Show razed buildings',               () => s.showRazedBuildings,        v => { s.showRazedBuildings = v; });
    addToggle('adv-cp-exploreDetails',             'Show explore details',               () => s.exploreDetails,            v => { s.exploreDetails = v; });
    addToggle('adv-cp-showTroopsReleased',         'Show troops released',               () => s.showTroopsReleased,        v => { s.showTroopsReleased = v; });
    addToggle('adv-cp-showDraftPercentage',        'Show draft percentage',              () => s.showDraftPercentage,       v => { s.showDraftPercentage = v; });
    addToggle('adv-cp-showDraftRate',              'Show draft rate',                    () => s.showDraftRate,             v => { s.showDraftRate = v; });
    addToggle('adv-cp-showMilitaryWages',          'Show military wages',                () => s.showMilitaryWages,         v => { s.showMilitaryWages = v; });
    addToggle('adv-cp-showSourceIdentifiers',      'Show thief/spell source identifiers', () => s.showSourceIdentifiers,    v => { s.showSourceIdentifiers = v; });

    renderRawTextToggle(rightCol, elements);
    renderLayoutToggle(rightCol);
    renderCopyButtonsSection(rightCol, 'combinedProvince', 'cp', elements);
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

/**
 * Shows or hides the Discord copy button based on the current mode's discordCopy setting.
 */
function updateDiscordButtonVisibility(elements, mode) {
    if (!elements.discordCopyBtn) return;
    const modeKey = mode === 'kingdom-news-log'    ? 'kingdomNews'
                  : mode === 'province-news'        ? 'provinceNews'
                  : mode === 'combined-province'    ? 'combinedProvince'
                  :                                   'provinceLogs';
    const show = mode && advSettings[modeKey] && advSettings[modeKey].discordCopy;
    elements.discordCopyBtn.classList.toggle('hidden', !show);
}

/**
 * Handles the Discord copy button click — transforms output and copies to clipboard.
 */
async function handleDiscordCopy(elements) {
    const outputText = elements.outputText.value.trim();
    if (!outputText) {
        showCopyFeedback(elements.discordCopyFeedback, 'No text to copy!', 'error');
        return;
    }
    const transformed = toDiscordFormat(outputText, lastDetectedMode);
    const charCount = transformed.length;
    try {
        await writeToClipboard(transformed);
        if (charCount <= 2000) {
            showCopyFeedback(elements.discordCopyFeedback, 'Copied for Discord!', 'success');
        } else {
            showCopyFeedback(elements.discordCopyFeedback,
                `Copied for Discord \u26a0 ${charCount.toLocaleString()} chars (Discord limit: 2,000)`, 'warning');
        }
    } catch (err) {
        fallbackCopyToClipboard(transformed);
        showCopyFeedback(elements.discordCopyFeedback, 'Text copied \u2014 paste into Discord', 'warning');
    }
}

/**
 * Handles the alt copy button: plain text on mobile, mobile HTML on desktop.
 */
async function handleAltCopy(elements) {
    const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    if (isMobile) {
        await copyPlainText(elements);
    } else {
        await copyMobileHtml(elements);
    }
}

/**
 * Copies the output as plain text (always, regardless of device).
 * This is the desktop copy path made available on mobile via Advanced Settings.
 */
async function copyPlainText(elements) {
    const outputText = elements.outputText.value.trim();
    if (!outputText) {
        showCopyFeedback(elements.altCopyFeedback, 'No text to copy!', 'error');
        return;
    }
    try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(outputText);
        } else {
            fallbackCopyToClipboard(outputText);
        }
        showCopyFeedback(elements.altCopyFeedback, 'Copied!', 'success');
    } catch (err) {
        fallbackCopyToClipboard(outputText);
        showCopyFeedback(elements.altCopyFeedback, 'Text selected — copy manually', 'warning');
        elements.outputText.select();
        elements.outputText.setSelectionRange(0, 99999);
    }
}

/**
 * Copies the output as mobile HTML (always, regardless of device).
 * This is the mobile copy path made available on desktop via Advanced Settings.
 */
async function copyMobileHtml(elements) {
    const outputText = elements.outputText.value.trim();
    if (!outputText) {
        showCopyFeedback(elements.altCopyFeedback, 'No text to copy!', 'error');
        return;
    }
    const mobileText = textToMobileHtml(outputText);
    try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(mobileText);
        } else {
            fallbackCopyToClipboard(mobileText);
        }
        showCopyFeedback(elements.altCopyFeedback, 'Copied for mobile!', 'success');
    } catch (err) {
        fallbackCopyToClipboard(mobileText);
        showCopyFeedback(elements.altCopyFeedback, 'Text selected — copy manually', 'warning');
    }
}

/**
 * Shows or hides the alt copy button and sets its label based on device.
 */
function updateAltCopyButtonVisibility(elements, mode) {
    if (!elements.altCopyBtn) return;
    const modeKey = mode === 'kingdom-news-log'    ? 'kingdomNews'
                  : mode === 'province-news'        ? 'provinceNews'
                  : mode === 'combined-province'    ? 'combinedProvince'
                  :                                   'provinceLogs';
    const show = mode && advSettings[modeKey] && advSettings[modeKey].showAltCopy;
    if (show) {
        const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
        elements.altCopyBtn.textContent = isMobile ? 'Copy Raw Text' : 'Copy for Mobile';
    }
    elements.altCopyBtn.classList.toggle('hidden', !show);
}

/**
 * Renders the "Copy Buttons" section in Advanced Settings.
 * Includes the Discord toggle and the device-dynamic alt copy toggle.
 * @param {HTMLElement} container - Right column element to append into
 * @param {string} modeKey - advSettings key ('kingdomNews', 'provinceLogs', etc.)
 * @param {string} idPrefix - Short prefix for element IDs ('kn', 'pl', 'pn', 'cp')
 * @param {Object} elements - DOM elements object
 */
function renderCopyButtonsSection(container, modeKey, idPrefix, elements) {
    const title = document.createElement('div');
    title.className = 'adv-group-title';
    title.textContent = 'Copy Buttons';
    container.appendChild(title);

    // Discord toggle
    const discordGroup = document.createElement('div');
    discordGroup.className = 'adv-group';
    const discordLabel = document.createElement('label');
    discordLabel.htmlFor = `adv-${idPrefix}-discordCopy`;
    const discordCheckbox = document.createElement('input');
    discordCheckbox.type = 'checkbox';
    discordCheckbox.id = `adv-${idPrefix}-discordCopy`;
    discordCheckbox.checked = advSettings[modeKey].discordCopy;
    discordCheckbox.addEventListener('change', () => {
        advSettings[modeKey].discordCopy = discordCheckbox.checked;
        applyAndRerender(elements);
    });
    discordLabel.appendChild(discordCheckbox);
    discordLabel.appendChild(document.createTextNode(' Copy for Discord'));
    discordGroup.appendChild(discordLabel);
    discordGroup.appendChild(makeHint('Show a "Copy for Discord" button that formats the output with Discord markdown (bold headers, code blocks)'));
    container.appendChild(discordGroup);

    // Alt copy toggle (device-dynamic label)
    const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    const altCopyGroup = document.createElement('div');
    altCopyGroup.className = 'adv-group';
    const altCopyLabel = document.createElement('label');
    altCopyLabel.htmlFor = `adv-${idPrefix}-altCopy`;
    const altCopyCheckbox = document.createElement('input');
    altCopyCheckbox.type = 'checkbox';
    altCopyCheckbox.id = `adv-${idPrefix}-altCopy`;
    altCopyCheckbox.checked = advSettings[modeKey].showAltCopy;
    const altCopyLabelText = isMobile
        ? 'Copy Raw Text'
        : 'Copy Text for KD Forum on Mobile';
    altCopyCheckbox.addEventListener('change', () => {
        advSettings[modeKey].showAltCopy = altCopyCheckbox.checked;
        updateAltCopyButtonVisibility(elements, lastDetectedMode);
    });
    altCopyLabel.appendChild(altCopyCheckbox);
    altCopyLabel.appendChild(document.createTextNode(' ' + altCopyLabelText));
    altCopyGroup.appendChild(altCopyLabel);
    altCopyGroup.appendChild(makeHint(isMobile
        ? 'Show a "Copy Raw Text" button that copies plain unformatted text'
        : 'Show a "Copy for Mobile" button that copies text formatted for pasting on mobile browsers'));
    container.appendChild(altCopyGroup);
}

/**
 * Dispatches to a mode-specific Discord markdown transform helper.
 */
function toDiscordFormat(text, mode) {
    if (mode === 'province-news')    return toDiscordProvinceNews(text);
    if (mode === 'kingdom-news-log') return toDiscordKingdomNews(text);
    return toDiscordProvinceLogs(text);
}

/**
 * Transforms Province News plain text (post-settings) into Discord markdown.
 * Rules:
 *   - Title + date line merged: **Title** — date
 *   - Flush-left lines with ':' → **Heading:** rest (if any)
 *   - 4-space sub-items → "- stripped"
 *   - 2-space detail lines → stripped (no prefix)
 *   - Empty lines preserved
 */
function toDiscordProvinceNews(text) {
    const lines = text.split('\n');
    const out = [];
    let i = 0;

    // Title (line 0) + date (line 1) merged onto one line
    if (lines.length > 0) {
        const title = lines[0].replace(' from UtopiaFormatter.com', '');
        const dateLine = lines.length > 1 ? lines[1] : '';
        if (dateLine && !dateLine.startsWith(' ')) {
            out.push(`**${title}** \u2014 ${dateLine}`);
            i = 2;
        } else {
            out.push(`**${title}**`);
            i = 1;
        }
    }

    while (i < lines.length) {
        const line = lines[i++];

        if (line === '') {
            out.push('');
            continue;
        }

        // 4-space source sub-items → bullet
        if (line.startsWith('    ')) {
            out.push('- ' + line.trimStart());
            continue;
        }

        // 2-space detail lines → strip indent
        if (line.startsWith('  ')) {
            out.push(line.slice(2));
            continue;
        }

        // Flush-left lines with colon → bold the heading portion
        const colonIdx = line.indexOf(':');
        if (colonIdx !== -1) {
            const heading = line.substring(0, colonIdx);
            const rest = line.substring(colonIdx + 1).trim();
            out.push(rest ? `**${heading}:** ${rest}` : `**${heading}:**`);
            continue;
        }

        out.push(line);
    }

    return out.join('\n');
}

/**
 * Transforms Kingdom News plain text (post-settings) into Discord markdown.
 * Rules:
 *   - ** Block Header ** → **Block Header**
 *   - -- Key: value → Key: value (strip "-- ")
 *   - Province breakdown lines containing " | " → wrapped in code fences
 *   - Other lines pass through
 */
function toDiscordKingdomNews(text) {
    const lines = text.split('\n');
    const out = [];
    let i = 0;

    while (i < lines.length) {
        const line = lines[i];

        // ** Block Header ** → **Block Header**
        const blockMatch = line.match(/^\*\* (.+?) \*\*$/);
        if (blockMatch) {
            out.push(`**${blockMatch[1]}**`);
            i++;
            // Collect province breakdown table lines (contain " | ")
            if (i < lines.length && lines[i].includes(' | ')) {
                out.push('```');
                while (i < lines.length && lines[i].includes(' | ')) {
                    out.push(lines[i]);
                    i++;
                }
                out.push('```');
            }
            continue;
        }

        // -- Key: value → Key: value
        if (line.startsWith('-- ')) {
            out.push(line.slice(3));
            i++;
            continue;
        }

        out.push(line);
        i++;
    }

    return out.join('\n');
}

/**
 * Transforms Province Logs plain text (post-settings) into Discord markdown.
 * Rules:
 *   - First line (summary title) → **Province Log Summary**
 *   - Separator line (---...) → skipped
 *   - Flush-left section headings ending in ':' → **Heading:**
 *   - 2-space sub-headings ending in ':' (e.g. "  Propaganda:") → **SubHeading:**
 *   - 4-space sub-items (Propaganda troops) → "- stripped"
 *   - 2-space detail lines → stripped (no prefix)
 *   - Empty lines preserved
 */
function toDiscordProvinceLogs(text) {
    const lines = text.split('\n');
    const out = [];
    let i = 0;

    // Replace title line
    if (lines.length > 0) {
        out.push('**Province Log Summary**');
        i = 1;
    }

    // Skip separator line (---...)
    if (i < lines.length && /^-{3,}/.test(lines[i])) {
        i++;
    }

    while (i < lines.length) {
        const line = lines[i++];

        if (line === '') {
            out.push('');
            continue;
        }

        // 4-space sub-items (Propaganda troops) → bullet
        if (line.startsWith('    ')) {
            out.push('- ' + line.trimStart());
            continue;
        }

        // 2-space sub-headings like "  Propaganda:" → **SubHeading:**
        if (line.startsWith('  ') && line.trimEnd().endsWith(':')) {
            const subheading = line.trim().slice(0, -1);
            out.push(`**${subheading}:**`);
            continue;
        }

        // 2-space detail lines → strip indent
        if (line.startsWith('  ')) {
            out.push(line.slice(2));
            continue;
        }

        // Flush-left section headings ending in ':'
        if (line.endsWith(':')) {
            const heading = line.slice(0, -1);
            out.push(`**${heading}:**`);
            continue;
        }

        out.push(line);
    }

    return out.join('\n');
}

// ── Enhanced Output View ──────────────────────────────────────────────────────

/**
 * Renders the Show Raw Text toggle in Advanced Settings.
 */
function renderRawTextToggle(container, elements) {
    const group = document.createElement('div');
    group.className = 'adv-group';
    const label = document.createElement('label');
    const cb = document.createElement('input');
    cb.type = 'checkbox';
    cb.id = 'adv-showRawText';
    cb.checked = showRawText;
    cb.addEventListener('change', () => {
        showRawText = cb.checked;
        updateOutputView(elements);
    });
    label.htmlFor = cb.id;
    label.appendChild(cb);
    label.appendChild(document.createTextNode(' Show raw text'));
    group.appendChild(label);
    group.appendChild(makeHint('Show the plain text output below the formatted view. This is the exact text that Copy to Clipboard uses.'));
    container.appendChild(group);
}

/**
 * Renders the Single-column layout toggle in Advanced Settings.
 * Temporary toggle — remove this function, its call sites, the CSS class,
 * and the singleColumnLayout variable when a layout decision is made.
 */
function renderLayoutToggle(container) {
    const group = document.createElement('div');
    group.className = 'adv-group';
    const label = document.createElement('label');
    const cb = document.createElement('input');
    cb.type = 'checkbox';
    cb.id = 'adv-singleColumnLayout';
    cb.checked = singleColumnLayout;
    cb.addEventListener('change', () => {
        singleColumnLayout = cb.checked;
        document.querySelector('main.container').classList.toggle('single-col', singleColumnLayout);
    });
    label.htmlFor = cb.id;
    label.appendChild(cb);
    label.appendChild(document.createTextNode(' Single-column layout'));
    group.appendChild(label);
    group.appendChild(makeHint('Switch to a single-column layout where the output flows below the input at full width instead of side by side.'));
    container.appendChild(group);
}

/**
 * Returns the advSettings key for a given parser mode string.
 */
function modeKeyFor(mode) {
    if (mode === 'kingdom-news-log')  return 'kingdomNews';
    if (mode === 'province-news')     return 'provinceNews';
    if (mode === 'combined-province') return 'combinedProvince';
    return 'provinceLogs';
}

/**
 * Shows the enhanced view as the primary output and optionally shows
 * the raw textarea below it when showRawText is enabled.
 */
function updateOutputView(elements) {
    if (!elements.enhancedOutput) return;
    const text = elements.outputText.value;

    if (text) {
        // Always show enhanced view when there's output
        elements.enhancedOutput.classList.remove('hidden');
        renderEnhancedView(elements);
        // Show/hide textarea based on showRawText
        elements.outputText.classList.toggle('hidden', !showRawText);
    } else {
        // No output — show textarea (with placeholder), hide enhanced
        elements.enhancedOutput.classList.add('hidden');
        elements.enhancedOutput.innerHTML = '';
        elements.outputText.classList.remove('hidden');
    }
}

/**
 * Dispatches to mode-specific enhanced view renderer.
 */
function renderEnhancedView(elements) {
    const container = elements.enhancedOutput;
    const text = elements.outputText.value;
    container.innerHTML = '';
    if (!text) return;

    const grid = document.createElement('div');
    grid.className = 'ev-grid';
    container.appendChild(grid);

    const mode = lastDetectedMode;
    if (mode === 'kingdom-news-log') renderEnhancedKingdomNews(grid, text);
    else renderEnhancedSections(grid, text, mode);
}

// ── Province Logs / Province News / Combined enhanced view ────────────────────

/** Section left-border accent colours by section name */
const EV_SECTION_COLORS = {
    'Thievery Summary':               '#c8a450',
    'Thievery Targets by Province':   '#c8a450',
    'Thievery Targets by Op Type':    '#c8a450',
    'Resources Stolen from Opponents':'#4aaa6a',
    'Thievery Impacts':               '#4a9aba',
    'Shadowlight Thief IDs':          '#4a9aba',
    'Spell Summary':                  '#9a7acc',
    'Spell Targets by Province':      '#9a7acc',
    'Spell Targets by Spell Type':    '#9a7acc',
    'Spell Impacts':                  '#4a9aba',
    'Aid Summary':                    '#4aaa6a',
    'Aid Received':                   '#4aaa6a',
    'Attacks Suffered':               '#c87070',
    'Military Training':              '#c87850',
    'Dragon Summary':                 '#c87850',
    'Ritual Summary':                 '#9a7acc',
    'Construction Summary':           '#7a8aaa',
    'Science Summary':                '#aab050',
    'Exploration Summary':            '#4a9aba',
    'Daily Login Bonus':              '#c8a450',
    'Scientists Gained':              '#aab050',
    'War Outcomes':                   '#c87070',
};

/**
 * Renders Province Logs / Province News / Combined enhanced view.
 * Parses the plain text output into section cards.
 */
function renderEnhancedSections(grid, text, mode) {
    const lines = text.split('\n');
    let headerLines = [];
    let sections = [];
    let currentSection = null;
    let inHeader = true;

    for (const line of lines) {
        // Separator line (dashes) — skip
        if (/^-{3,}$/.test(line.trim())) continue;

        // Section header: non-empty, no leading space, ends with ':'
        if (line.length > 0 && !line.startsWith(' ') && line.endsWith(':')) {
            inHeader = false;
            currentSection = { title: line.slice(0, -1), lines: [] };
            sections.push(currentSection);
            continue;
        }

        if (inHeader) {
            headerLines.push(line);
        } else if (currentSection) {
            currentSection.lines.push(line);
        }
    }

    // Render header
    const titleLine = headerLines.find(l => l.trim().length > 0 && !l.startsWith('Date') && !l.match(/^\d/));
    const dateLine  = headerLines.find(l => l.match(/^(Date|May|Jan|Feb|Mar|Apr|Jun|Jul|Aug|Sep|Oct|Nov|Dec|\d)/i) || l.includes(' of YR') || l.includes(' - '));

    if (titleLine || dateLine) {
        const hdr = document.createElement('div');
        hdr.className = 'ev-report-header';
        if (titleLine) {
            const t = document.createElement('div');
            t.className = 'ev-report-title';
            t.textContent = titleLine.trim().replace(' from UtopiaFormatter.com', '');
            hdr.appendChild(t);
        }
        if (dateLine) {
            const d = document.createElement('div');
            d.className = 'ev-report-meta';
            d.textContent = dateLine.trim();
            hdr.appendChild(d);
        }
        grid.appendChild(hdr);
    }

    // Render each section as a card
    for (const section of sections) {
        // Skip entirely empty sections
        if (section.lines.every(l => l.trim() === '')) continue;

        const card = document.createElement('div');
        card.className = 'ev-card';
        const accentColor = EV_SECTION_COLORS[section.title];
        if (accentColor) card.style.borderLeftColor = accentColor;

        const cardTitle = document.createElement('div');
        cardTitle.className = 'ev-card-title';
        cardTitle.textContent = section.title;
        card.appendChild(cardTitle);

        renderSectionLines(card, section.lines);
        grid.appendChild(card);
    }
}

/**
 * Renders section body lines into a card element.
 * Handles:
 *   "  Item text" — plain list item (2-space indent)
 *   "    Sub item" — deeper list item (4-space indent)
 *   "  SubSection:" — sub-section header
 */
function renderSectionLines(card, lines) {
    // Trim trailing empty lines
    let end = lines.length;
    while (end > 0 && lines[end - 1].trim() === '') end--;

    let currentSubsection = null;

    for (let i = 0; i < end; i++) {
        const line = lines[i];
        if (line.trim() === '') {
            // Small gap between sub-groups
            if (currentSubsection) {
                const hr = document.createElement('hr');
                hr.className = 'ev-divider';
                card.appendChild(hr);
                currentSubsection = null;
            }
            continue;
        }

        // 4-space or deeper → sub-list item
        if (line.startsWith('    ')) {
            const el = document.createElement('div');
            el.className = 'ev-list-item';
            el.textContent = line.trimStart();
            card.appendChild(el);
            continue;
        }

        // 2-space sub-section header (ends with ':')
        if (line.startsWith('  ') && line.trimEnd().endsWith(':') && !line.includes('(')) {
            const el = document.createElement('div');
            el.className = 'ev-subsection';
            el.textContent = line.trim().slice(0, -1);
            card.appendChild(el);
            currentSubsection = el;
            continue;
        }

        // 2-space plain item
        if (line.startsWith('  ')) {
            const text = line.trimStart();
            // Check if it's a "Key: Value" style line.
            // Greedy (.+) instead of lazy (.+?) so that lines with colons inside
            // parentheticals (e.g. "Province (3:7): 56 acres") split at the LAST
            // colon+space, not the first.
            const kvMatch = text.match(/^(.+):\s+(.+)$/);
            if (kvMatch) {
                const row = document.createElement('div');
                row.className = 'ev-stat-row';
                const lbl = document.createElement('span');
                lbl.className = 'ev-stat-label';
                lbl.textContent = kvMatch[1] + ': ';
                const val = document.createElement('span');
                val.className = 'ev-stat-value';
                val.textContent = kvMatch[2];
                row.appendChild(lbl);
                row.appendChild(val);
                card.appendChild(row);
            } else {
                const el = document.createElement('div');
                el.className = 'ev-plain-row';
                el.textContent = text;
                card.appendChild(el);
            }
            continue;
        }

        // Non-indented line within section body (e.g. province target header)
        const el = document.createElement('div');
        el.className = 'ev-plain-row';
        el.style.fontWeight = '600';
        el.style.color = '#8aafc8';
        el.style.marginTop = '0.35rem';
        el.textContent = line;
        card.appendChild(el);
    }
}

// ── Kingdom News enhanced view ────────────────────────────────────────────────

/**
 * Renders Kingdom News enhanced view.
 * Parses ** Block Title ** delimiters into cards.
 */
function renderEnhancedKingdomNews(grid, text) {
    const lines = text.split('\n');

    // Collect header lines (before first ** block)
    let headerLines = [];
    let blocks = [];
    let currentBlock = null;
    let pastHeader = false;

    for (const line of lines) {
        if (line.startsWith('** ') && line.endsWith(' **')) {
            pastHeader = true;
            currentBlock = { title: line.slice(3, -3).trim(), lines: [] };
            blocks.push(currentBlock);
        } else if (!pastHeader) {
            headerLines.push(line);
        } else if (currentBlock) {
            currentBlock.lines.push(line);
        }
    }

    // Render report header
    const titleLine = headerLines.find(l => l.trim().length > 0);
    const rangeLine = headerLines.find(l => l.startsWith('Range:'));

    if (titleLine || rangeLine) {
        const hdr = document.createElement('div');
        hdr.className = 'ev-report-header';
        if (titleLine) {
            const t = document.createElement('div');
            t.className = 'ev-report-title';
            t.textContent = titleLine.trim().replace(' from UtopiaFormatter.com', '');
            hdr.appendChild(t);
        }
        if (rangeLine) {
            const d = document.createElement('div');
            d.className = 'ev-report-meta';
            d.textContent = rangeLine.replace(/^Range:\s*/, '');
            hdr.appendChild(d);
        }
        grid.appendChild(hdr);
    }

    // Render each block as a card
    for (const block of blocks) {
        if (block.lines.every(l => l.trim() === '')) continue;

        const card = document.createElement('div');
        card.className = 'ev-kn-block';

        const titleEl = document.createElement('div');
        titleEl.className = 'ev-kn-block-title';
        if (/^Own Kingdom/.test(block.title)) {
            titleEl.classList.add('ev-own-kn');
        }
        titleEl.textContent = block.title;
        card.appendChild(titleEl);

        renderKnBlockLines(card, block.lines);
        grid.appendChild(card);
    }
}

/**
 * Renders lines within a Kingdom News block into the card.
 */
function renderKnBlockLines(card, lines) {
    let end = lines.length;
    while (end > 0 && lines[end - 1].trim() === '') end--;

    let inProvinces = false;
    let inRelations = false;

    for (let i = 0; i < end; i++) {
        const line = lines[i];

        if (line.trim() === '') {
            inProvinces = false;
            inRelations = false;
            const hr = document.createElement('hr');
            hr.className = 'ev-divider';
            card.appendChild(hr);
            continue;
        }

        // Sub-section headers like "Provinces:" or "War Events:"
        if (!line.startsWith(' ') && line.endsWith(':')) {
            inProvinces = line.startsWith('Provinces');
            inRelations = !inProvinces;
            const el = document.createElement('div');
            el.className = 'ev-subsection';
            el.textContent = line.slice(0, -1);
            card.appendChild(el);
            continue;
        }

        // Province rows (indented, under "Provinces:")
        if (inProvinces && line.startsWith('  ')) {
            const el = document.createElement('div');
            el.className = 'ev-province-row';
            el.textContent = line.trimStart();
            card.appendChild(el);
            continue;
        }

        // Relation/event lines
        if (inRelations && line.startsWith('  ')) {
            const el = document.createElement('div');
            el.className = 'ev-list-item';
            el.textContent = line.trimStart();
            card.appendChild(el);
            continue;
        }

        // "-- Key: Value" stat lines
        if (line.startsWith('-- ')) {
            const text = line.slice(3);
            // Greedy (.+) to split at the LAST colon+space (handles values containing colons)
            const kvMatch = text.match(/^(.+):\s+(.+)$/);
            if (kvMatch) {
                const row = document.createElement('div');
                row.className = 'ev-stat-row';
                const lbl = document.createElement('span');
                lbl.className = 'ev-stat-label';
                lbl.textContent = kvMatch[1] + ': ';
                const val = document.createElement('span');
                val.className = 'ev-stat-value';
                val.textContent = kvMatch[2];
                row.appendChild(lbl);
                row.appendChild(val);
                card.appendChild(row);
                continue;
            }
        }

        // "Total ..." summary lines
        if (/^Total /.test(line)) {
            const el = document.createElement('div');
            el.className = 'ev-plain-row';
            el.style.fontWeight = '600';
            el.style.color = '#8aafc8';
            el.style.marginTop = '0.2rem';
            el.textContent = line;
            card.appendChild(el);
            continue;
        }

        // Highlights / other flush-left lines
        const el = document.createElement('div');
        el.className = 'ev-plain-row';
        el.textContent = line;
        card.appendChild(el);
    }
}

// ── Auto-collapse input on mobile (Uto-b2kf) ────────────────────────────────

/**
 * After a successful parse on mobile, collapse input sections so the output
 * gets maximum screen space.  Tapping the collapsed heading re-expands.
 */
function collapseInputOnMobile(elements) {
    if (window.innerWidth >= 768) return;

    const inputSection = elements.inputText.closest('.input-section');
    if (inputSection) {
        inputSection.classList.add('collapsed');
    }

    const secondarySection = elements.secondarySection;
    if (secondarySection && !secondarySection.classList.contains('hidden')) {
        secondarySection.classList.add('collapsed');
    }
}

/**
 * Remove collapsed state from all input sections (used on Clear).
 */
function expandInputSections() {
    document.querySelectorAll('.input-section.collapsed').forEach(s => s.classList.remove('collapsed'));
}

// ── Node.js test exports ──────────────────────────────────────────────────────
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { applyProvinceLogsSettings, applyKingdomNewsSettings, applyProvinceNewsSettings, applyCombinedProvinceSettings, advSettings };
}
