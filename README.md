# 🎮 CheatCode - Code Snippet Manager

A full-stack code reference application with retro terminal aesthetics. Store, search, and organize your frequently used code snippets across multiple programming languages and categories.

![Tech Stack](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![Tech Stack](https://img.shields.io/badge/Flask-3.1-000000?logo=flask)
![Tech Stack](https://img.shields.io/badge/Python-3.11+-3776AB?logo=python)
![Tech Stack](https://img.shields.io/badge/SQLite-3-003B57?logo=sqlite)

## ✨ Features

- 🔐 **User Authentication** - Secure session-based auth with bcrypt
- 📝 **Code Snippet Management** - Create, edit, delete, and copy code examples
- 🔍 **Advanced Filtering** - Filter by language, category, or search text
- 🎨 **Multiple Themes** - Wargames (terminal green), Boutique (modern pink/purple), Apple II GS (classic Mac)
- 📊 **Metrics Dashboard** - Live stats and system monitoring
- 💾 **Database Persistence** - SQLite for development, easy PostgreSQL migration
- 🛠️ **Dev Tools** - Built-in database management utilities

## 🏗️ Project Structure

```
cheat-code-app/
├── client/              # React + Vite frontend
│   ├── src/
│   │   ├── components/  # Reusable React components
│   │   ├── pages/       # Page-level components
│   │   ├── providers/   # Context providers (Auth)
│   │   ├── hooks/       # Custom React hooks
│   │   └── routes.jsx   # React Router configuration
│   ├── public/styles/   # Theme CSS files
│   └── vite.config.js   # Vite + proxy config
│
└── server/              # Flask backend
    ├── app/
    │   ├── models.py    # SQLAlchemy models
    │   ├── routes.py    # API endpoints
    │   ├── config.py    # Configuration
    │   └── __init__.py  # Flask app factory
    ├── migrations/      # Alembic database migrations
    ├── run.py          # Application entry point
    └── seed.py         # Database seeding script
```

## 🚀 Quick Start

### Prerequisites

- Python 3.11+
- Node.js 18+
- npm or yarn

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd cheat-code-app
```

### 2. Setup Backend

```bash
cd server

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Initialize database
flask db upgrade

# Seed with example data (optional)
python seed.py

# Start Flask server
python run.py
```

Backend runs on: **http://localhost:5555**

### 3. Setup Frontend

```bash
cd client

# Install dependencies
npm install

# Start dev server
npm run dev
```

Frontend runs on: **http://localhost:5173**

### 4. Login

**Default credentials** (if you ran seed.py):
- Email: `josh@josh.com`
- Password: `1111`

Or create a new account at `/signup`

## 📚 Tech Stack

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **React Router 6** - Client-side routing
- **Lucide React** - Icon library
- **Context API** - State management

### Backend
- **Flask 3.1** - Web framework
- **Flask-RESTful** - REST API
- **SQLAlchemy** - ORM
- **Flask-Migrate** - Database migrations
- **Flask-Bcrypt** - Password hashing
- **Flask-CORS** - Cross-origin requests

### Database
- **SQLite** - Development database
- Easy migration to PostgreSQL for production

## 🎨 Available Themes

Switch themes in the navbar:

- **Wargames** - 1980s terminal green aesthetic
- **Boutique** - Modern pink/purple design
- **Apple II GS** - Classic 1995 Mac GUI with rainbow stripes

## 📖 API Endpoints

### Authentication
- `POST /api/signup` - Create new account
- `POST /api/login` - Authenticate user
- `POST /api/logout` - End session
- `GET /api/check_session` - Verify session + load user data

### Cheats
- `GET /api/cheats` - List all cheats (with optional filters)
- `POST /api/cheats` - Create new cheat
- `PATCH /api/cheats/:id` - Update cheat
- `DELETE /api/cheats/:id` - Delete cheat

### Reference Data
- `GET /api/languages` - List all languages
- `GET /api/categories` - List all categories

### Dev Tools
- `POST /api/dev-tools` - Execute database commands (dev only)

## 🗂️ Database Models

### User
- Stores user accounts with bcrypt-hashed passwords
- One-to-many relationship with Cheats

### Language
- Programming languages (JavaScript, Python, SQL, etc.)
- Seeded with 10 common languages

### Category
- Code categories (Arrays, Functions, Loops, etc.)
- Seeded with 11 common categories

### Cheat
- Individual code snippets
- Belongs to User, Language, and Category
- Stores title, code, notes, timestamps

## 🛠️ Development

### Database Migrations

```bash
cd server

# Create migration after model changes
flask db migrate -m "description"

# Apply migrations
flask db upgrade

# Rollback last migration
flask db downgrade
```

### Reseed Database

```bash
cd server
python seed.py
```

### Frontend Dev Commands

```bash
cd client

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

### Backend Dev Tools

Access at `/devtools` in the app:
- Check database status
- Delete database
- Create/upgrade database
- Run seed file
- Generate seed from current data

## 📦 Deployment

### Backend (Flask)

```bash
# Install gunicorn
pip install gunicorn

# Run with gunicorn
gunicorn -w 4 -b 0.0.0.0:5555 'app:create_app()'
```

### Frontend (React)

```bash
# Build static files
npm run build

# Serve with any static server
# Output in: client/dist/
```

### Environment Variables

Create `.env` file in server directory:

```bash
SECRET_KEY=your-secret-key-here
DATABASE_URI=sqlite:///app.db  # or postgresql://...
FLASK_ENV=production
```

## 🔒 Security Notes

- Sessions use httpOnly cookies (XSS protection)
- Passwords hashed with bcrypt
- CORS configured for development (localhost:5173)
- Update CORS origins for production
- Change SECRET_KEY before deploying

## 📝 Key Features Explained

### The Refetch Pattern

Instead of complex local state updates, the app refetches data after mutations:

```javascript
// After create/update/delete:
await checkSession()  // Reload all data
```

**Trade-offs:**
- ✅ Simple, consistent code
- ✅ Guaranteed server-client sync
- ✅ No manual state management bugs
- ⚠️ Extra API call (~50-100ms)

### Dual Data Grouping

Cheats are stored in TWO places in state:
- `user.languages[].cheats[]` - For language filtering
- `user.categories[].cheats[]` - For category filtering

This enables fast filtering without additional API calls.

## 🐛 Troubleshooting

**Frontend won't start:**
- Check Node version: `node --version` (needs 18+)
- Delete node_modules and reinstall: `rm -rf node_modules && npm install`

**Backend errors:**
- Check Python version: `python --version` (needs 3.11+)
- Activate virtual environment
- Verify database exists: `ls server/instance/app.db`

**CORS errors:**
- Verify Vite proxy in `client/vite.config.js`
- Check Flask CORS origins in `server/app/__init__.py`

**Session not persisting:**
- Check cookies in browser dev tools
- Verify `credentials: 'include'` in fetch calls

## 📄 Documentation

- **[Complete App Documentation](./APP_DOCUMENTATION.md)** - Full technical docs (3,383 lines!)
- **[Client README](./client/README.md)** - Frontend-specific details
- **[Apple II GS Theme](./APPLE2GS_THEME_INSTALL.md)** - Classic Mac theme guide

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Open pull request

## 📜 License

MIT License - See LICENSE file for details

## 👤 Author

Built by Josh - Bootcamp graduate learning full-stack development

## 🙏 Acknowledgments

- Inspired by retro terminal aesthetics
- Apple II GS rainbow stripe
- 1980s hacker movie UIs
- All the developers who asked "do you have a cheat sheet for that?"

---

**Happy Coding!** 🚀

For detailed setup instructions, see individual READMEs in `/client` and `/server` directories.