/**
 * Theme Management Module
 * Handles light/dark theme switching with localStorage persistence
 */

/**
 * Theme configuration
 */
const THEMES = {
    LIGHT: 'light-mode',
    DARK: 'dark-mode'
};

const THEME_STORAGE_KEY = 'utopia-formatter-theme';

/**
 * Gets DOM elements for theme management
 * @returns {Object} - Theme-related DOM elements
 */
function getThemeElements() {
    return {
        themeToggle: document.getElementById('theme-toggle'),
        themeIcon: document.querySelector('.theme-icon'),
        themeText: document.querySelector('.theme-text'),
        body: document.body
    };
}

/**
 * Initializes theme system
 * Sets up event listeners and applies saved theme
 */
function initializeTheme() {
    const elements = getThemeElements();
    
    // Apply saved theme or default to light mode
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) || THEMES.LIGHT;
    applyTheme(savedTheme);
    
    // Set up theme toggle event listener
    elements.themeToggle.addEventListener('click', () => {
        toggleTheme();
    });
    
    // Listen for system theme changes
    if (window.matchMedia) {
        const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
        darkModeQuery.addEventListener('change', (e) => {
            // Only auto-switch if user hasn't manually set a preference
            if (!localStorage.getItem(THEME_STORAGE_KEY)) {
                applyTheme(e.matches ? THEMES.DARK : THEMES.LIGHT);
            }
        });
    }
}

/**
 * Toggles between light and dark themes
 */
function toggleTheme() {
    const elements = getThemeElements();
    const currentTheme = elements.body.classList.contains(THEMES.DARK) ? THEMES.DARK : THEMES.LIGHT;
    const newTheme = currentTheme === THEMES.DARK ? THEMES.LIGHT : THEMES.DARK;
    
    applyTheme(newTheme);
    saveThemePreference(newTheme);
}

/**
 * Applies the specified theme to the document
 * @param {string} theme - Theme to apply ('light-mode' or 'dark-mode')
 */
function applyTheme(theme) {
    const elements = getThemeElements();
    
    // Remove existing theme classes
    elements.body.classList.remove(THEMES.LIGHT, THEMES.DARK);
    
    // Add new theme class
    elements.body.classList.add(theme);
    
    // Update toggle button appearance
    updateThemeToggle(theme);
}

/**
 * Updates the theme toggle button appearance
 * @param {string} theme - Current theme
 */
function updateThemeToggle(theme) {
    const elements = getThemeElements();
    
    if (theme === THEMES.DARK) {
        elements.themeIcon.textContent = '☀️';
        elements.themeText.textContent = 'Light';
    } else {
        elements.themeIcon.textContent = '🌙';
        elements.themeText.textContent = 'Dark';
    }
}

/**
 * Saves theme preference to localStorage
 * @param {string} theme - Theme to save
 */
function saveThemePreference(theme) {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
}

/**
 * Gets the current active theme
 * @returns {string} - Current theme ('light-mode' or 'dark-mode')
 */
function getCurrentTheme() {
    const elements = getThemeElements();
    return elements.body.classList.contains(THEMES.DARK) ? THEMES.DARK : THEMES.LIGHT;
}

/**
 * Resets theme preference and uses system default
 */
function resetThemePreference() {
    localStorage.removeItem(THEME_STORAGE_KEY);
    
    // Apply system theme
    if (window.matchMedia) {
        const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
        applyTheme(darkModeQuery.matches ? THEMES.DARK : THEMES.LIGHT);
    } else {
        // Fallback to light mode
        applyTheme(THEMES.LIGHT);
    }
}

// Export theme functions for use in other modules
window.themeManager = {
    initializeTheme,
    toggleTheme,
    applyTheme,
    getCurrentTheme,
    resetThemePreference,
    THEMES
};
