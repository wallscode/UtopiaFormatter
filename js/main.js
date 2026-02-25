/**
 * Main Application Module
 * Initializes the entire NewsParser application
 */

/**
 * Application initialization function
 * Sets up the entire application when DOM is ready
 */
function initializeApp() {
    console.log('NewsParser initializing...');
    
    try {
        // Initialize theme system first
        if (window.themeManager) {
            window.themeManager.initializeTheme();
        }
        
        // Get all DOM elements we need
        const elements = getDomElements();
        
        // Validate that all required elements exist
        validateDomElements(elements);
        
        // Set up event listeners
        setupEventListeners(elements);
        
        // Initialize UI state
        initializeUIState(elements);
        
        // Add some helpful console messages for development
        console.log('NewsParser initialized successfully!');
        console.log('Keyboard shortcuts:');
        console.log('  Ctrl+Enter: Parse text');
        console.log('  Escape: Clear all');
        console.log('  Ctrl+Shift+C: Copy to clipboard');
        
    } catch (error) {
        console.error('Failed to initialize NewsParser:', error);
        showErrorToUser(error);
    }
}

/**
 * Validates that all required DOM elements exist
 * @param {Object} elements - DOM elements object
 */
function validateDomElements(elements) {
    const requiredElements = [
        'inputText', 'outputText', 'parseBtn', 
        'clearBtn', 'copyBtn', 'copyFeedback'
    ];
    
    const missingElements = requiredElements.filter(
        elementName => !elements[elementName]
    );
    
    if (missingElements.length > 0) {
        throw new Error(
            `Missing required DOM elements: ${missingElements.join(', ')}`
        );
    }
}

/**
 * Initializes the UI state when the app loads
 * @param {Object} elements - DOM elements object
 */
function initializeUIState(elements) {
    // Set initial button state
    updateParseButtonState(elements);

    // Focus on input textarea for better UX
    elements.inputText.focus();
    
    elements.inputText.placeholder = 'Paste your Kingdom News or Province Logs text here...';
    elements.outputText.placeholder = 'Formatted output will appear here...';
}

/**
 * Shows error message to user if initialization fails
 * @param {Error} error - The error that occurred
 */
function showErrorToUser(error) {
    // Create a simple error message if the app fails to load
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #fed7d7;
        color: #742a2a;
        padding: 1rem;
        border-radius: 8px;
        border: 1px solid #fc8181;
        max-width: 300px;
        z-index: 1000;
    `;
    errorDiv.innerHTML = `
        <strong>NewsParser Error</strong><br>
        ${error.message}<br>
        <small>Please refresh the page and try again.</small>
    `;
    
    document.body.appendChild(errorDiv);
}

/**
 * Adds some utility functions to the window object for debugging
 * These are only available in development
 */
function addDebugUtilities() {
    // Only add debug utilities in development (not in production)
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        window.NewsParserDebug = {
            // Test the parser with sample Kingdom News text
            testParser: function() {
                const sampleText = 'February 1 of YR0\t15 - Test Province (5:1) captured 10 acres of land from 20 - Target (4:1).';
                const result = parseKingdomNewsLog(sampleText);
                console.log('Input:', sampleText);
                console.log('Output:', result);
                return result;
            },
            
            // Get current app state
            getState: function() {
                const elements = getDomElements();
                return {
                    inputLength: elements.inputText.value.length,
                    outputLength: elements.outputText.value.length,
                    parseButtonDisabled: elements.parseBtn.disabled
                };
            },
            
            // Clear all data
            clearAll: function() {
                const elements = getDomElements();
                elements.inputText.value = '';
                elements.outputText.value = '';
                updateParseButtonState(elements);
            }
        };
        
        console.log('Debug utilities available at window.NewsParserDebug');
    }
}

// Initialize the application when DOM is ready
if (document.readyState === 'loading') {
    // DOM is still loading, wait for it
    document.addEventListener('DOMContentLoaded', () => {
        initializeApp();
        addDebugUtilities();
    });
} else {
    // DOM is already loaded
    initializeApp();
    addDebugUtilities();
}
