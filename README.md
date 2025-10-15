# 📖 Bible-Restored

A modern Bible reader with restored Hebrew names, built with Python backend and React frontend.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-19.1.1-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.0-38B2AC.svg)](https://tailwindcss.com/)

## ✨ Features

- 🔤 **Restored Hebrew Names**: KJV text with linguistically correct divine name restorations
- 🎨 **Modern UI**: Clean, responsive design with dark/light themes
- 📱 **Cross-Platform**: Works on desktop and mobile
- 🔍 **Full-Text Search**: Powered by Fuse.js for fast searching
- ⚙️ **Settings**: Customizable themes, fonts, and preferences
- 🔗 **Deep Linking**: Direct links to specific verses
- 📚 **Multiple Translations**: Switch between KJV and restored versions

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- Python 3.8+
- npm or yarn

### Frontend (Web App)

```bash
# Clone the repository
git clone https://github.com/asjames18/Bible-Restored.git
cd Bible-Restored

# Install dependencies
cd frontend
npm install

# Start development server
npm run dev
```

Visit **http://localhost:5173/** to see the application.

### Backend (Data Processing)

```bash
# Process Bible data with restored names
cd backend
python restore_names.py \
  --json data/kjv.json \
  --config config/restored_names_config.json \
  --overrides config/restored_overrides.json \
  --out_txt build/restored_kjv.txt \
  --out_json build/restored_kjv.json \
  --report build/replacements_report.csv \
  -v
```

## 📁 Project Structure

```
bible-project/
├── 📁 backend/                    # Python data processing
│   ├── 📁 build/                 # Generated files
│   │   ├── restored_kjv.json     # Processed Bible data
│   │   ├── restored_kjv.txt     # Text version
│   │   └── replacements_report.csv
│   ├── 📁 config/                # Name restoration rules
│   ├── 📁 data/                  # Source KJV data
│   └── 📄 restore_names.py       # Main converter script
│
├── 📁 frontend/                  # React web application
│   ├── 📁 src/
│   │   ├── 📁 components/        # UI components
│   │   ├── 📁 routes/            # Page components
│   │   ├── 📁 store/             # State management
│   │   └── 📁 lib/                # Utilities
│   ├── 📁 public/
│   │   └── 📁 translations/       # Bible JSON files
│   └── 📄 package.json           # Dependencies
│
└── 📄 README.md                  # This file
```

## 🔤 Restored Names

The converter applies linguistically correct Hebrew name restorations:

| Original | Restored | Notes |
|----------|----------|-------|
| `LORD God` | `Yahuah Elohiym` | Divine name restoration |
| `LORD JEHOVAH` | `Yah Yahuah` | Via overrides |
| `JAH` | `Yah` | Short form restoration |
| `Holy Spirit` | `Ruach Ha'Qodesh` | Hebrew translation |
| `Jesus Christ` | `Yahusha Ha'Mashiach` | Hebrew name restoration |
| `God` | `Elohiym` | Hebrew term |

## 🛠️ Development Status

### ✅ Completed Features
- [x] Backend converter with JSON I/O
- [x] React frontend with routing
- [x] Verse display with restored names
- [x] Dark/light theme support
- [x] Book/chapter navigation
- [x] Full-text search functionality
- [x] Settings page with preferences
- [x] Translation switching
- [x] Deep linking support
- [x] Responsive design

### 🚧 Planned Features
- [ ] Hebrew name highlighting
- [ ] Interactive name popovers
- [ ] Glossary with name counts
- [ ] PWA offline support
- [ ] Mobile app optimization
- [ ] Accessibility improvements

## 🔧 API Usage

The backend converter supports multiple input formats:

```bash
# JSON input (recommended)
python restore_names.py \
  --json data/kjv.json \
  --out_json build/restored_kjv.json

# Text input
python restore_names.py \
  --src kjv.txt \
  --out_txt restored_kjv.txt

# Generate replacement report
python restore_names.py \
  --json data/kjv.json \
  --report build/replacements_report.csv \
  -v
```

## 🎯 Keyboard Shortcuts

- `←/→` - Navigate chapters
- `↑/↓` - Navigate verses
- `Ctrl+F` - Search
- `Ctrl+D` - Toggle dark mode
- `Ctrl+,` - Open settings

## 🚀 Deployment

### Deploy to Vercel

This project is configured for easy deployment to Vercel:

1. Push your code to GitHub
2. Import the repository in [Vercel Dashboard](https://vercel.com)
3. Click "Deploy" - Vercel will automatically use the `vercel.json` configuration

Or use the Vercel CLI:
```bash
npm install -g vercel
vercel --prod
```

For detailed deployment instructions, see [DEPLOYMENT.md](DEPLOYMENT.md).

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- King James Version (KJV) Bible text
- Hebrew name restoration research
- React and TypeScript communities
- Tailwind CSS for styling

---

**Made with ❤️ for accurate Biblical study**