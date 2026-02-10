# UtopiaFormatter

A comprehensive text formatting tool that parses, cleans, and summarizes text for posting in the Utopia Kingdom Forum.

## Project Overview

UtopiaFormatter is designed to take raw text copied from Utopia and the Intel Site and transform it into clean, forum-ready format. The tool supports multiple parsing modes including text cleaning, Kingdom News Report reorganization, and Province Logs summarization.

## Features

- **Multiple Parsing Modes:**
  - **Clean Text Mode**: Removes HTML tags, entities, and problematic characters
  - **Kingdom News Report Mode**: Reorganizes Utopia Kingdom News Reports for forum posting
  - **Province Logs Mode**: Summarizes province events, spells, thievery, and aid
- **Real-time Processing**: Instant text parsing with visual feedback
- **Clipboard Support**: One-click copy to clipboard functionality
- **Keyboard Shortcuts**: Enhanced user experience with shortcuts
- **Mobile Responsive**: Works on all device sizes
- **Modern UI**: Clean, gradient-based design with smooth animations
- **Comprehensive Testing**: Full test suite with real-world data validation

## Kingdom News Report Mode

This mode specifically handles Utopia Kingdom News Reports and reorganizes them for better forum readability:

### Transformations Applied:
1. **Section Reordering**: 
   - Moves "Own Kingdom 5:1" identifier to the top
   - Places attack statistics in logical order
   - Reorganizes province lists and uniques sections

2. **Clarification**:
   - Changes "Total Attacks Suffered" to "Total Attacks Made" for enemy kingdom
   - Adds spacing between sections for better readability
   - Maintains all data integrity while improving presentation

3. **Output Structure**:
   ```
   Kingdom News Report
   
   Own Kingdom 5:1
   [Date Range]
   [Your Kingdom's Attack Statistics]
   
   The Kingdom of 4:1  
   [Enemy Kingdom's Attack Statistics - shown as "Made"]
   
   Own Kingdom 5:1
   [Your Kingdom's Provinces]
   
   Uniques for 5:1
   [Your Kingdom's Uniques]
   
   The Kingdom of 4:1
   [Enemy Kingdom's Provinces]
   
   Uniques for 4:1
   [Enemy Kingdom's Uniques]
   ```

## Province Logs Mode

This mode processes raw province logs and generates comprehensive summaries of all activities:

### Features:
1. **Thievery Operations**: Tracks all thievery sabatoge ops with impact totals
2. **Resource Tracking**: Counts stolen resources (gold, bushels, runes, war horses)
3. **Spell Analysis**: Summarizes spell casting with duration and impact data
4. **Aid Summary**: Tracks resources sent to kingdommates
5. **Dragon Progress**: Monitors dragon donations and troop contributions
6. **Ritual Tracking**: Counts successful ritual casts

### Output Structure:
   ```
   Summary of Province Log Events
   ----------------------------------------
   
   Thievery Summary:
   [Operation summaries with totals]
   
   Resources Stolen:
   [Resource theft totals]
   
   Spell Summary:
   [Spell casting summaries]
   
   Aid Summary:
   [Resources sent totals]
   
   Dragon Summary:
   [Dragon contribution totals]
   
   Ritual Summary:
   [Ritual cast counts]
   ```

## Technology Stack

- **HTML5**: Semantic markup for accessibility
- **CSS3**: Modern styling with gradients and animations
- **Vanilla JavaScript**: No frameworks, pure JS for maximum compatibility
- **Testing**: Jest for unit testing (planned)
- **Deployment**: AWS S3 + CloudFront (planned)

## Project Structure

```
UtopiaFormatter/
├── index.html              # Main HTML page
├── css/
│   └── main.css           # Main stylesheet
├── js/
│   ├── parser.js          # Text parsing logic (refactored)
│   ├── ui.js              # UI interaction handlers
│   └── main.js            # Application initialization
├── tests/
│   ├── parser.test.js     # General parser unit tests
│   ├── kingdom-news.test.js # Kingdom News Report tests
│   ├── province-logs.test.js # Province Logs tests
│   ├── provincelogs.txt   # Test data for province logs
│   └── provincelogs_expected_output.txt # Expected output
├── assets/                 # Images and media (empty for now)
├── REFACTORING_SUMMARY.md # Code refactoring documentation
└── README.md              # This file
```

## How It Works

### Text Processing Pipeline

1. **HTML Tag Removal**: Strips all `<tag>` elements using regex
2. **Entity Cleanup**: Converts `&amp;` to `&`, removes unknown entities
3. **Whitespace Normalization**: Converts multiple spaces to single spaces
4. **Character Cleaning**: Removes zero-width characters and smart quotes
5. **Line Break Normalization**: Ensures consistent line endings

### User Interface

- **Input Section**: Large textarea for pasting raw text
- **Output Section**: Readonly textarea showing cleaned text
- **Action Buttons**: Parse, Clear, and Copy functionality
- **Visual Feedback**: Success/error messages and loading states

## Usage Instructions

1. **Paste Text**: Copy text from any website and paste into the input textarea
2. **Parse**: Click "Parse Text" button or press Ctrl+Enter
3. **Copy**: Click "Copy to Clipboard" or press Ctrl+Shift+C
4. **Paste to Forum**: Paste the cleaned text into the Utopia Kingdom Forum

### Keyboard Shortcuts

- `Ctrl+Enter`: Parse the input text
- `Escape`: Clear all text areas
- `Ctrl+Shift+C`: Copy output to clipboard

## Testing

Run the complete test suite to verify functionality:

```bash
# Run all tests
node tests/parser.test.js
node tests/kingdom-news.test.js  
node tests/province-logs.test.js
```

### Test Coverage

**General Parser Tests** (`tests/parser.test.js`):
- HTML tag removal
- HTML entity cleanup
- Whitespace normalization
- Line break handling
- Special character conversion
- Edge cases (empty strings, etc.)

**Kingdom News Report Tests** (`tests/kingdom-news.test.js`):
- Dynamic header detection
- Section reordering
- Attack statistics processing
- Province list extraction
- Uniques handling
- Highlights section support

**Province Logs Tests** (`tests/province-logs.test.js`):
- Real-world data processing (1,172 lines)
- Thievery operation tracking
- Resource theft monitoring
- Spell casting analysis
- Aid and dragon contribution tracking
- Performance validation
- Output structure verification

## Development

### Local Development

1. Start a local server:
   ```bash
   python -m http.server 3000
   # or
   npx serve .
   ```

2. Open `http://localhost:3000` in your browser

### Debug Utilities

When running on localhost, debug utilities are available at `window.UtopiaFormatterDebug`:

- `UtopiaFormatterDebug.testParser()`: Test parser with sample text
- `UtopiaFormatterDebug.getState()`: Get current application state
- `UtopiaFormatterDebug.clearAll()`: Clear all text areas

## Deployment Plan

### Phase 1: Manual Deployment
- Upload files to AWS S3 bucket
- Configure CloudFront distribution
- Set up custom domain with web.com

### Phase 2: Automated Deployment
- Set up GitHub repository
- Configure GitHub Actions for CI/CD
- Automated testing and deployment

### Phase 3: Enhanced Features
- Add more text formatting options
- Implement user preferences
- Add text history functionality

## Browser Compatibility

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+
- ✅ Mobile browsers

## Security Considerations

- No server-side processing (client-side only)
- No external API calls
- No user data storage
- XSS protection through text sanitization

## Future Enhancements

- Multiple output formats (BBCode, Markdown)
- Text history and favorites
- Advanced parsing options
- User preferences and themes
- Batch processing capabilities

## Contributing

This is a learning project. Feel free to:
- Study the code structure
- Modify the parsing logic
- Improve the UI design
- Add new features

## License

MIT License - feel free to use this code for learning purposes.

---

**Built for the Utopia Kingdom Forum community** 🎮
