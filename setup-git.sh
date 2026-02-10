# Git and GitHub CLI Setup Commands
# Run these in PowerShell after installation

# Configure Git (replace with your info)
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# Authenticate with GitHub CLI
gh auth login

# Initialize your project repository
git init

# Create .gitignore file
echo "# Node.js
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Test outputs
test-output.txt
debug-*.js

# IDE files
.vscode/
.idea/
*.swp
*.swo

# OS files
.DS_Store
Thumbs.db

# Logs
*.log" > .gitignore

# Add all files and make initial commit
git add .
git commit -m "Initial commit: UtopiaFormatter with mobile-optimized copy-paste functionality"

# Create GitHub repository (you'll be prompted for repo name)
gh repo create UtopiaFormatter --public --source=. --push

# Or if you already created the repo manually:
# git remote add origin https://github.com/YOUR_USERNAME/UtopiaFormatter.git
# git push -u origin main
