# 🎨 CheatCode - Frontend

React + Vite frontend for the CheatCode snippet manager. Features retro terminal themes, advanced filtering, and real-time search.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Visit: **http://localhost:5173**

## 📦 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Build for production → `dist/` |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## 🏗️ Project Structure

```
src/
├── components/
│   ├── home/                    # HomePage-specific components
│   │   ├── FilterPanel.jsx      # Main filter orchestrator
│   │   ├── FilterPanelLayout.jsx # Filter UI presentation
│   │   ├── LanguageButtons.jsx  # Language filter buttons
│   │   ├── CategoryButtons.jsx  # Category filter buttons
│   │   ├── SearchBar.jsx        # Search input
│   │   ├── MetricsPanel.jsx     # Stats display with ASCII art
│   │   └── NoResults.jsx        # Empty state
│   │
│   ├── layout/                  # App layout components
│   │   ├── AppLayout.jsx        # Root layout wrapper
│   │   ├── Scanline.jsx         # CRT effect overlay
│   │   ├── Header/
│   │   │   ├── Header.jsx       # Header container
│   │   │   ├── AsciiHeader.jsx  # ASCII art banner
│   │   │   └── StatsBar.jsx     # Stats counter bar
│   │   └── Footer/
│   │       └── AppFooter.jsx    # Footer bar
│   │
│   ├── CheatForm.jsx            # Create/Edit form
│   ├── CheatItem.jsx            # Individual cheat card
│   ├── CheatList.jsx            # Maps cheats to CheatItems
│   ├── NavBar.jsx               # Top navigation
│   └── ProtectedRoute.jsx       # Auth route guard
│
├── pages/
│   ├── HomePage.jsx             # Main dashboard
│   ├── LoginPage.jsx            # Login form
│   ├── SignupPage.jsx           # Registration form
│   ├── DevTools.jsx             # Database tools
│   └── ErrorPage.jsx            # Error boundary
│
├── providers/
│   └── AuthProvider.jsx         # Auth context provider (THE SOURCE OF TRUTH)
│
├── contexts/
│   └── AuthContext.jsx          # Auth context definition
│
├── hooks/
│   └── useAuth.jsx              # Custom hook to access auth
│
├── routes.jsx                   # React Router configuration
├── main.jsx                     # Entry point
├── App.jsx                      # Root component
└── index.css                    # Global styles + theme variables
```

## 🎨 Themes

Three themes available via navbar buttons:

### Wargames Theme
- **Style:** 1980s terminal green
- **Colors:** `#33aa33` on black
- **Vibe:** Retro hacker aesthetic
- **File:** `/public/styles/wargames.css`

### Boutique Theme
- **Style:** Modern web app
- **Colors:** Pink/purple gradients
- **Vibe:** Contemporary, spacious
- **File:** `/public/styles/boutique.css`

### Apple II GS Theme
- **Style:** Classic 1995 Mac OS
- **Colors:** White/gray with rainbow accents
- **Vibe:** Nostalgic Apple GUI
- **File:** `/public/styles/apple2gs.css`

**Theme Switching:**
```javascript
// In AppLayout.jsx
const [theme, setTheme] = useState('boutique')

useEffect(() => {
  document.documentElement.setAttribute('data-theme', theme)
}, [theme])
```

## 🔄 State Management

### The Refetch Pattern

Instead of complex local updates, we refetch after mutations:

```javascript
// In AuthProvider.jsx
async function createCheat(data) {
  await fetch('/api/cheats', { method: 'POST', body: data })
  await checkSession()  // ← Refetch ALL data
}
```

**Why?**
- ✅ Simple code (no complex nested updates)
- ✅ Always in sync with server
- ✅ Consistent pattern for all CRUD ops
- ⚠️ Trade-off: Extra 50-100ms API call

### State Structure

```javascript
// In AuthProvider
const [user, setUser] = useState({
  id, name, email,
  languages: [
    { 
      id, name,
      cheats: [{ id, title, code, notes, category: {...} }]
    }
  ],
  categories: [
    {
      id, name,
      cheats: [{ id, title, code, notes, language: {...} }]
    }
  ]
})
```

**Why dual grouping?**
- Fast filtering by language OR category
- No additional API calls needed
- Pre-grouped data from backend

## 🛠️ Key Components

### AuthProvider (Most Important!)

**Location:** `/src/providers/AuthProvider.jsx`

**What it does:**
- Manages ALL app state
- Handles authentication
- Provides CRUD methods
- Initial data load via `checkSession()`

**Methods provided:**
```javascript
{
  user,              // Complete user data with nested cheats
  loggedIn,          // Boolean auth status
  loading,           // Initial load state
  allLanguages,      // Language options for dropdowns
  allCategories,     // Category options for dropdowns
  login(),           // Authenticate user
  signup(),          // Create account
  logout(),          // End session
  createCheat(),     // Create new cheat
  updateCheat(),     // Update existing cheat
  deleteCheat()      // Delete cheat
}
```

### FilterPanel

**Location:** `/src/components/home/FilterPanel.jsx`

**What it does:**
- Manages filter state (language, category, search)
- Filters cheats in real-time
- Passes filtered results to CheatList

**Filter logic:**
```javascript
const displayedCheats = allCheats.filter(cheat => {
  if (selectedLanguage && cheat.language.id !== selectedLanguage) return false
  if (selectedCategory && cheat.category.id !== selectedCategory) return false
  if (searchTerm) {
    return cheat.title.includes(searchTerm) || cheat.code.includes(searchTerm)
  }
  return true
})
```

### CheatItem

**Location:** `/src/components/CheatItem.jsx`

**What it does:**
- Displays individual cheat card
- Edit button → Navigate to form
- Delete button → Confirm + delete
- Click code → Copy to clipboard

**Key features:**
- Terminal-style design
- Copy feedback (2-second "COPIED" message)
- Language and category badges
- Notes section (only if notes exist)

## 🔌 API Integration

All API calls use `fetch` with credentials:

```javascript
fetch('http://localhost:5555/api/endpoint', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',  // ← Send session cookie
  body: JSON.stringify(data)
})
```

**Proxy configured in `vite.config.js`:**
```javascript
proxy: {
  '/api': {
    target: 'http://localhost:5555',
    changeOrigin: true
  }
}
```

This lets you use `/api/cheats` instead of `http://localhost:5555/api/cheats`.

## 🎯 Routes

Configured in `/src/routes.jsx`:

| Path | Component | Protected | Description |
|------|-----------|-----------|-------------|
| `/` | HomePage | ✅ Yes | Main dashboard |
| `/login` | LoginPage | ❌ No | Login form |
| `/signup` | SignupPage | ❌ No | Registration |
| `/cheats` | CheatForm | ✅ Yes | Create cheat |
| `/cheats/:id/edit` | CheatForm | ✅ Yes | Edit cheat |
| `/devtools` | DevTools | ✅ Yes | Database tools |

**Protected routes** use `<ProtectedRoute>` wrapper that:
1. Checks `loading` state first
2. Redirects to `/login` if not authenticated
3. Renders children if authenticated

## 🎨 Adding a New Theme

1. **Create CSS file:**
```bash
touch public/styles/mytheme.css
```

2. **Add theme styles:**
```css
[data-theme="mytheme"] {
  --bg-primary: #your-color;
  --text-primary: #your-color;
  /* etc... */
}

[data-theme="mytheme"] .terminal-card {
  /* Your card styles */
}
```

3. **Link in `index.html`:**
```html
<link rel="stylesheet" href="/styles/mytheme.css">
```

4. **Add button in `NavBar.jsx`:**
```jsx
<button
  onClick={() => setCurrentTheme('mytheme')}
  className={currentTheme === 'mytheme' ? 'active' : ''}
>
  MY THEME
</button>
```

## 🔍 Search & Filter Flow

```
User Action → Update State → Filter Array → Re-render
```

**Example:**
```javascript
// 1. User clicks "JavaScript" button
setSelectedLanguage(3)

// 2. FilterPanel filters
const filtered = cheats.filter(c => c.language.id === 3)

// 3. CheatList re-renders with filtered data
<CheatList cheats={filtered} />
```

## 📝 Adding a New Page

1. **Create page component:**
```bash
touch src/pages/MyPage.jsx
```

2. **Add to routes:**
```javascript
// In routes.jsx
{
  path: '/mypage',
  element: <ProtectedRoute><MyPage /></ProtectedRoute>
}
```

3. **Add nav link:**
```javascript
// In NavBar.jsx
<NavLink to="/mypage">My Page</NavLink>
```

## 🐛 Common Issues

### Hot Reload Not Working
```bash
# Restart Vite dev server
npm run dev
```

### Styles Not Updating
- Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
- Clear browser cache

### API Calls Failing
- Check backend is running on port 5555
- Verify proxy in `vite.config.js`
- Check browser console for CORS errors

### Auth Not Persisting
- Verify `credentials: 'include'` in fetch calls
- Check cookies in browser dev tools (Application tab)

## 📦 Dependencies

**Core:**
- `react` - UI library
- `react-dom` - React renderer
- `react-router-dom` - Routing

**Icons:**
- `lucide-react` - Icon library

**Dev:**
- `vite` - Build tool
- `@vitejs/plugin-react` - React plugin for Vite
- `eslint` - Linting

## 🚀 Production Build

```bash
# Build static files
npm run build

# Output directory: dist/
# Files: index.html, assets/index-[hash].js, assets/index-[hash].css

# Preview build locally
npm run preview
```

**Deploy to:**
- Netlify
- Vercel
- GitHub Pages
- Any static hosting

**Environment:**
- Update API URL in production
- Configure CORS on backend

## 📚 Learn More

- [React Docs](https://react.dev)
- [Vite Docs](https://vitejs.dev)
- [React Router Docs](https://reactrouter.com)
- [Lucide Icons](https://lucide.dev)

## 🎓 Code Patterns

### Component Pattern
```javascript
export function MyComponent({ prop1, prop2 }) {
  const [state, setState] = useState(initial)
  
  useEffect(() => {
    // Side effects
  }, [dependencies])
  
  const handleEvent = () => {
    // Event handlers
  }
  
  return (
    <div>...</div>
  )
}
```

### Context Consumer Pattern
```javascript
import { useAuth } from '../hooks/useAuth'

export function MyComponent() {
  const { user, createCheat } = useAuth()
  
  // Use context values
}
```

### Protected Route Pattern
```javascript
<ProtectedRoute>
  <MyPrivatePage />
</ProtectedRoute>
```

---

**Questions?** Check the [main README](../README.md) or [full documentation](../APP_DOCUMENTATION.md).