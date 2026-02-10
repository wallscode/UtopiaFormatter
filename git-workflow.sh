# Daily Git Workflow Commands for UtopiaFormatter

# Check status (see what changed)
git status

# Add specific files
git add index.html css/main.css js/ui.js

# Add all changes
git add .

# Commit with descriptive message
git commit -m "Fix mobile copy-paste line break preservation"

# Push to GitHub
git push

# Pull latest changes from GitHub
git pull

# Create new branch for features
git checkout -b feature/new-parsing-mode

# Switch back to main branch
git checkout main

# Merge feature branch
git merge feature/new-parsing-mode

# Delete branch after merge
git branch -d feature/new-parsing-mode
