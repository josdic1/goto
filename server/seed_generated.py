#!/usr/bin/env python3
"""
Auto-generated seed file
Generated: 2025-12-05T16:02:09.929038
"""
from app import create_app
from app.extensions import db
from app.models import User, Language, Category, Cheat

def seed_database():
    app = create_app()
    
    with app.app_context():
        print("🌱 Starting seed...")
        
        # Clear existing data
        print("Clearing existing data...")
        Cheat.query.delete()
        Language.query.delete()
        Category.query.delete()
        User.query.delete()
        db.session.commit()
        
        # Create Users
        print("Creating users...")
        users = {}
        users['Josh'] = User(
            name='Josh',
            email='josh@josh.com'
        )
        users['Josh']._password_hash = '$2b$12$Zx4h4EslZpWNrVyUpAi8h.ANMdrAG9o82awO7K8tzEWOHslT37iSC'
        db.session.add(users['Josh'])
        db.session.commit()
        
        # Create Languages
        print("Creating languages...")
        languages = {}
        languages['Css'] = Language(
            name='Css'
        )
        db.session.add(languages['Css'])
        languages['Html'] = Language(
            name='Html'
        )
        db.session.add(languages['Html'])
        languages['JavaScript'] = Language(
            name='JavaScript'
        )
        db.session.add(languages['JavaScript'])
        languages['Json'] = Language(
            name='Json'
        )
        db.session.add(languages['Json'])
        languages['Python'] = Language(
            name='Python'
        )
        db.session.add(languages['Python'])
        languages['React'] = Language(
            name='React'
        )
        db.session.add(languages['React'])
        languages['Regex'] = Language(
            name='Regex'
        )
        db.session.add(languages['Regex'])
        languages['Sql'] = Language(
            name='Sql'
        )
        db.session.add(languages['Sql'])
        languages['Terminal'] = Language(
            name='Terminal'
        )
        db.session.add(languages['Terminal'])
        languages['Xml'] = Language(
            name='Xml'
        )
        db.session.add(languages['Xml'])
        db.session.commit()
        
        # Create Categories
        print("Creating categories...")
        categories = {}
        categories['Arrays'] = Category(
            name='Arrays'
        )
        db.session.add(categories['Arrays'])
        categories['Classes'] = Category(
            name='Classes'
        )
        db.session.add(categories['Classes'])
        categories['Curl'] = Category(
            name='Curl'
        )
        db.session.add(categories['Curl'])
        categories['Functions'] = Category(
            name='Functions'
        )
        db.session.add(categories['Functions'])
        categories['Images'] = Category(
            name='Images'
        )
        db.session.add(categories['Images'])
        categories['Loops'] = Category(
            name='Loops'
        )
        db.session.add(categories['Loops'])
        categories['Manipulation'] = Category(
            name='Manipulation'
        )
        db.session.add(categories['Manipulation'])
        categories['Methods'] = Category(
            name='Methods'
        )
        db.session.add(categories['Methods'])
        categories['Startup'] = Category(
            name='Startup'
        )
        db.session.add(categories['Startup'])
        categories['Filters'] = Category(
            name='Filters'
        )
        db.session.add(categories['Filters'])
        categories['Components'] = Category(
            name='Components'
        )
        db.session.add(categories['Components'])
        db.session.commit()
        
        # Create Cheats
        print("Creating cheats...")
        cheat = Cheat(
            title='New Vite React Project',
            code='npm create vite@latest client -- --template react\ncd client\nnpm install\nnpm install react-router-dom lucide-react',
            notes='Executed from existing client folder with router and lucide',
            user=users['Josh'],
            language=languages['Terminal'],
            category=categories['Startup']
        )
        db.session.add(cheat)
        cheat = Cheat(
            title='Initial and Use Migration',
            code='flask db init\nflask db migrate -m \"initial migration\"\nflask db upgrade',
            notes='First time setup: init creates migrations folder. After changing models: migrate creates migration file. upgrade applies changes to database. Run from server directory.',
            user=users['Josh'],
            language=languages['Terminal'],
            category=categories['Startup']
        )
        db.session.add(cheat)
        cheat = Cheat(
            title='Flask GET Route with jsonify',
            code='@app.route(\'/cheats\', methods=[\'GET\'])\ndef get_cheats():\n    cheats = Cheat.query.all()\n    return jsonify([cheat.to_dict() for cheat in cheats]), 200',
            notes='Standard Flask route decorator. Query all cheats from database. Use list comprehension with to_dict() to serialize. jsonify converts to JSON response. Returns 200 status. Use when not using Flask-RESTful.',
            user=users['Josh'],
            language=languages['Python'],
            category=categories['Methods']
        )
        db.session.add(cheat)
        cheat = Cheat(
            title='React Router Setup in main.jsx',
            code='import { createRoot } from \'react-dom/client\'\nimport { createBrowserRouter, RouterProvider } from \'react-router-dom\'\nimport { routes } from \'./routes.jsx\'\nimport \'./index.css\'\n\nconst router = createBrowserRouter(routes)\n\nconst root = createRoot(document.getElementById(\'root\'))\nroot.render(<RouterProvider router={router} />)',
            notes=' Entry point for React app with React Router. Import routes from separate file. createBrowserRouter sets up routing. RouterProvider wraps app with router. Renders into root div.',
            user=users['Josh'],
            language=languages['React'],
            category=categories['Startup']
        )
        db.session.add(cheat)
        cheat = Cheat(
            title='Vite Proxy Configuration',
            code='import { defineConfig } from \'vite\'\nimport react from \'@vitejs/plugin-react\'\n\nexport default defineConfig({\n  plugins: [react()],\n  server: {\n    proxy: {\n      \'/api\': {\n        target: \'http://localhost:5555\',\n        changeOrigin: true,\n        rewrite: (path) => path.replace(/^\/api/, \'\')\n      }\n    }\n  }\n})',
            notes='Proxies /api requests to Flask backend at port 5555. Change target port if Flask runs on different port (like 5000). rewrite strips /api prefix before sending to Flask. Good for all React + Flask projects. Avoids CORS issues in development.',
            user=users['Josh'],
            language=languages['JavaScript'],
            category=categories['Startup']
        )
        db.session.add(cheat)
        cheat = Cheat(
            title='Create React Context',
            code='import { createContext } from \"react\";\n\nexport const AuthContext = createContext();',
            notes='Creates context object for sharing state across components. Export to use in provider and custom hook. Holds no initial value - provider will supply values. Import in provider file and custom hook.',
            user=users['Josh'],
            language=languages['React'],
            category=categories['Startup']
        )
        db.session.add(cheat)
        cheat = Cheat(
            title='React Router Routes Setup',
            code='import App from \'./App.jsx\';\nimport { ErrorPage } from \'./pages/ErrorPage.jsx\';\nimport { ProtectedRoute } from \'./components/ProtectedRoute.jsx\';\n\nexport const routes = [\n    {\n        path: \'/\',\n        element: <ProtectedRoute><App /></ProtectedRoute>,\n        errorElement: <ErrorPage />\n    }\n];',
            notes='Exports routes array for React Router. Sets App as root with ErrorPage fallback. Children array holds nested routes. Wrap protected routes in ProtectedRoute component. Add more route objects for login, signup, etc.',
            user=users['Josh'],
            language=languages['React'],
            category=categories['Startup']
        )
        db.session.add(cheat)
        cheat = Cheat(
            title='Protected Route Component',
            code='import { Navigate } from \'react-router-dom\';\nimport { useAuth } from \'../hooks/useAuth\';\n\nexport function ProtectedRoute({ children }) {\n    const { loggedIn, loading } = useAuth();\n    \n    if (loading) return <div>Loading...</div>;\n    if (!loggedIn) return <Navigate to=\"/login\" replace />;\n    \n    return children;\n}',
            notes='Wraps routes that require authentication. Checks loading state first to avoid flash redirects. Redirects to login if not logged in. Returns children if authenticated. Use in routes.jsx to protect pages.',
            user=users['Josh'],
            language=languages['React'],
            category=categories['Components']
        )
        db.session.add(cheat)
        cheat = Cheat(
            title='Basic Error Page Component',
            code='import { useRouteError, useNavigate } from \"react-router-dom\";\n\nexport function ErrorPage() {\n    const error = useRouteError();\n    const navigate = useNavigate();\n\n    return (\n        <div className=\"error-container\">\n            <h1>Oops!</h1>\n            <p>Sorry, an unexpected error has occurred.</p>\n            <p><i>{error.statusText || error.message}</i></p>\n            <button onClick={() => navigate(\'/\')}>Go Home</button>\n        </div>\n    );\n}',
            notes='Catches routing errors with useRouteError hook. Displays error message and Go Home button. Set as errorElement in routes. Logs error to console for debugging.',
            user=users['Josh'],
            language=languages['React'],
            category=categories['Components']
        )
        db.session.add(cheat)
        cheat = Cheat(
            title='Flask Extensions File',
            code='from flask_sqlalchemy import SQLAlchemy\nfrom flask_migrate import Migrate\nfrom flask_bcrypt import Bcrypt\nfrom flask_cors import CORS\n\ndb = SQLAlchemy()\nmigrate = Migrate()\nbcrypt = Bcrypt()\ncors = CORS()',
            notes='Centralized file for Flask extensions. Import extensions here, initialize in create_app(). Avoids circular imports. Import db in models and routes. Import bcrypt for password hashing.',
            user=users['Josh'],
            language=languages['Python'],
            category=categories['Startup']
        )
        db.session.add(cheat)
        cheat = Cheat(
            title='Flask Configuration File',
            code='import os\n\nclass Config:\n    SQLALCHEMY_DATABASE_URI = os.getenv(\'DATABASE_URI\', \'sqlite:///app.db\')\n    SQLALCHEMY_TRACK_MODIFICATIONS = False\n    SECRET_KEY = os.getenv(\'SECRET_KEY\', \'dev-secret-key-change-in-production\')',
            notes='Configuration class for Flask settings. Database URI defaults to SQLite. SECRET_KEY for sessions and security. SQLALCHEMY_TRACK_MODIFICATIONS False saves memory. Import in create_app with app.config.from_object(Config).',
            user=users['Josh'],
            language=languages['Python'],
            category=categories['Startup']
        )
        db.session.add(cheat)
        cheat = Cheat(
            title='Flask Run File',
            code='from app import create_app\n\napp = create_app()\n\nif __name__ == \'__main__\':\n    app.run(port=5555, debug=True)',
            notes='Entry point to run Flask app. Imports create_app factory function. Runs on port 5555 with debug mode. Execute with python run.py from server directory. Change port to match vite.config proxy.',
            user=users['Josh'],
            language=languages['Python'],
            category=categories['Startup']
        )
        db.session.add(cheat)
        cheat = Cheat(
            title='Basic App Component with Auth Provider',
            code='import { Outlet } from \"react-router-dom\";\nimport { AuthProvider } from \"./providers/Provider\";\n\nfunction App() {\n  return (\n    <AuthProvider>\n      <Outlet />\n    </AuthProvider>\n  );\n}\n\nexport default App;',
            notes='Root App component wrapped in AuthProvider for global auth state. Outlet renders child routes from routes.jsx. Remove extra fragments - AuthProvider can be direct parent. Add more providers here if needed for global state.',
            user=users['Josh'],
            language=languages['React'],
            category=categories['Startup']
        )
        db.session.add(cheat)
        cheat = Cheat(
            title='Flask Requirements.txt Template',
            code='alembic==1.17.0\nbcrypt==5.0.0\nblinker==1.9.0\nclick==8.3.0\nFlask==3.1.2\nFlask-Bcrypt==1.0.1\nflask-cors==6.0.1\nflask-marshmallow==1.3.0\nFlask-Migrate==4.1.0\nFlask-RESTful==0.3.10\nFlask-SQLAlchemy==3.1.1\ngunicorn==21.2.0\nitsdangerous==2.2.0\nJinja2==3.1.6\nMako==1.3.10\nMarkupSafe==3.0.2\nmarshmallow==4.0.1\nmarshmallow-sqlalchemy==1.4.2\npsycopg2-binary==2.9.10\nPyJWT==2.10.1\npython-dotenv==1.2.1\nSQLAlchemy==2.0.44\nsqlite-web==0.6.5\ntyping_extensions==4.15.0\nWerkzeug==3.1.3',
            notes='Standard Flask requirements for full-stack apps. Includes database (SQLAlchemy, Migrate), auth (Bcrypt, JWT), API tools (RESTful, CORS, Marshmallow), and production server (gunicorn). Install with pip install -r requirements.txt. Good starter for all Flask projects.',
            user=users['Josh'],
            language=languages['Terminal'],
            category=categories['Startup']
        )
        db.session.add(cheat)
        cheat = Cheat(
            title='Sort List by Title in React',
            code='const sortedCheats = [...cheats].sort((a, b) => \n  a.title.localeCompare(b.title)\n);',
            notes='Spread operator creates copy to avoid mutating original array. sort with localeCompare does alphabetical sorting. Use sortedCheats in map instead of cheats. For reverse order use b.title.localeCompare(a.title). Works with any object property.',
            user=users['Josh'],
            language=languages['React'],
            category=categories['Arrays']
        )
        db.session.add(cheat)
        cheat = Cheat(
            title='Flask-RESTful GET List Resource',
            code='class CategoryList(Resource):\n    def get(self):\n        categories = Category.query.all()\n        return [{\'id\': c.id, \'name\': c.name} for c in categories], 200',
            notes='Flask-RESTful class-based resource. Inherits from Resource. get method returns list of dicts using list comprehension. No jsonify needed - auto converts. Returns tuple with data and status code. Register with api.add_resource(CategoryList, \'/categories\').',
            user=users['Josh'],
            language=languages['Python'],
            category=categories['Methods']
        )
        db.session.add(cheat)
        cheat = Cheat(
            title='Replace Spaces with Underscores',
            code='string = \'cheat code app\'\nstring.replaceAll(\' \', \'_\')\n\n// Example\nconst title = \"cheat code app\"\nconst formatted = title.replaceAll(\' \', \'_\')',
            notes='replaceAll method replaces all occurrences. First argument is what to find, second is replacement. Works with any string characters. Can also use replace with regex: replace(/ /g, \'_\'). Returns new string, doesn\'t modify original.',
            user=users['Josh'],
            language=languages['JavaScript'],
            category=categories['Manipulation']
        )
        db.session.add(cheat)
        cheat = Cheat(
            title='Replace Spaces with Underscores',
            code='string = \'cheat code app\'\nstring.replace(\' \', \'_\')\n\n# Example\ntitle = \"cheat code app\"\nformatted = title.replace(\' \', \'_\')',
            notes='replace method replaces all occurrences by default in Python. First argument is what to find, second is replacement. Works with any string characters. Returns new string, doesn\'t modify original. No need for replaceAll like JavaScript.',
            user=users['Josh'],
            language=languages['Python'],
            category=categories['Manipulation']
        )
        db.session.add(cheat)
        cheat = Cheat(
            title='Count Spaces in String',
            code='// Count all spaces\nstring.split(\' \').length - 1\n\n// Example\nconst title = \"cheat code app\"\nconst spaceCount = title.split(\' \').length - 1\n// Result: 2',
            notes='split divides string by spaces into array, subtract 1 from length. Cleaner than match with null check. matchAll with spread operator is modern but overkill for simple counting. split method is most readable and straightforward.',
            user=users['Josh'],
            language=languages['JavaScript'],
            category=categories['Manipulation']
        )
        db.session.add(cheat)
        cheat = Cheat(
            title='Count Spaces in String',
            code='# Count all spaces\nstring.count(\' \')\n\n# Example\ntitle = \"cheat code app\"\nspace_count = title.count(\' \')\n# Result: 2',
            notes='count method counts occurrences of substring. Pass space character as argument. Returns integer count. Works with any character or substring. Simpler than JavaScript - no regex needed.',
            user=users['Josh'],
            language=languages['Python'],
            category=categories['Manipulation']
        )
        db.session.add(cheat)
        cheat = Cheat(
            title='Basic Email Validation',
            code='# Check for @ and dot after @\n\'@\' in email and \'.\' in email.split(\'@\')[-1]\n\n# Example\nemail = \"josh@josh.com\"\nis_valid = \'@\' in email and \'.\' in email.split(\'@\')[-1]\n# Result: True\n\nbad_email = \"joshjosh.com\"\nis_valid = \'@\' in bad_email and \'.\' in bad_email.split(\'@\')[-1]\n# Result: False',
            notes=' in operator checks for @ symbol. Split by @ and check last part has dot. Simple validation - not production-grade. For real validation use regex or email-validator library. Works for basic form checks.',
            user=users['Josh'],
            language=languages['Python'],
            category=categories['Functions']
        )
        db.session.add(cheat)
        cheat = Cheat(
            title='Basic Email Validation',
            code='// Check for @ and dot after @\nemail.includes(\'@\') && email.split(\'@\')[1]?.includes(\'.\')\n\n// Example with steps\nconst email = \"josh@josh.com\"\nconst parts = email.split(\'@\')  // [\'josh\', \'josh.com\']\nconst domain = parts[1]         // \'josh.com\'\nconst isValid = email.includes(\'@\') && domain?.includes(\'.\')\n// Result: true\n\nconst badEmail = \"joshjosh.com\"\nconst badParts = badEmail.split(\'@\')  // [\'joshjosh.com\']\nconst badDomain = badParts[1]         // undefined\nconst isValid = badEmail.includes(\'@\') && badDomain?.includes(\'.\')\n// Result: false',
            notes='Includes checks for @ symbol. Split by @ creates array of parts. Index [1] gets domain part after @. Optional chaining ?. prevents error if no domain. Simple validation - not production-grade. For real validation use regex or validation library.',
            user=users['Josh'],
            language=languages['JavaScript'],
            category=categories['Functions']
        )
        db.session.add(cheat)
        cheat = Cheat(
            title='Email Validation with Regex',
            code='// Email regex pattern\nconst emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/\n\n// Test method\nemailRegex.test(email)\n\n// Example\nconst email = \"josh@josh.com\"\nconst isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)\n// Result: true\n\nconst badEmail = \"josh@josh\"\nconst isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(badEmail)\n// Result: false\n\n// More comprehensive (RFC 5322 compliant)\nconst strictRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/\nconst isValid = strictRegex.test(email)\n\n# Use\nfunction handleSubmit(e) {\n    e.preventDefault()\n    const email = e.target.email.value\n    \n    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {\n        alert(\'Invalid email\')\n        return\n    }',
            notes='Basic regex checks: characters before @, characters after @, dot in domain. test method returns true/false. Use in form validation before submit. Regex catches most invalid emails but not all edge cases. For production use validation library like validator.js or email-validator.',
            user=users['Josh'],
            language=languages['JavaScript'],
            category=categories['Manipulation']
        )
        db.session.add(cheat)
        cheat = Cheat(
            title='Email Validation with Regex',
            code='import re\n\n# Email regex pattern\nemail_regex = r\'^[^\s@]+@[^\s@]+\.[^\s@]+$\'\n\n# Match method\nre.match(email_regex, email)\n\n# Example\nemail = \"josh@josh.com\"\nis_valid = bool(re.match(r\'^[^\s@]+@[^\s@]+\.[^\s@]+$\', email))\n# Result: True\n\nbad_email = \"josh@josh\"\nis_valid = bool(re.match(r\'^[^\s@]+@[^\s@]+\.[^\s@]+$\', bad_email))\n# Result: False\n\n# More comprehensive\nstrict_regex = r\'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$\'\nis_valid = bool(re.match(strict_regex, email))\n\n# Use\n@app.route(\'/signup\', methods=[\'POST\'])\ndef signup():\n    email = request.json.get(\'email\')\n    \n    if not re.match(r\'^[^\s@]+@[^\s@]+\.[^\s@]+$\', email):\n        return {\'error\': \'Invalid email\'}, 400',
            notes='Basic regex checks: characters before @, characters after @, dot in domain. test method returns true/false. Use in form validation before submit. Regex catches most invalid emails but not all edge cases. For production use validation library like validator.js or email-validator.',
            user=users['Josh'],
            language=languages['Python'],
            category=categories['Manipulation']
        )
        db.session.add(cheat)
        cheat = Cheat(
            title='Flask Login Resource',
            code='class Login(Resource):\n    def post(self):\n        data = request.get_json()\n        user = User.query.filter_by(email=data.get(\'email\')).first()\n        \n        if user and user.authenticate(data.get(\'password\')):\n            session[\'user_id\'] = user.id\n            return {\'id\': user.id, \'name\': user.name, \'email\': user.email}\n        \n        return {\'error\': \'Invalid credentials\'}, 401',
            notes='Flask-RESTful login endpoint. Gets JSON data from request body. Queries user by email. Checks password with authenticate method. Stores user_id in session. Returns user data on success or 401 error. Register with api.add_resource(Login, \'/login\').',
            user=users['Josh'],
            language=languages['Python'],
            category=categories['Methods']
        )
        db.session.add(cheat)
        cheat = Cheat(
            title='Flask Logout Resource',
            code='class Logout(Resource):\n    def post(self):\n        session.pop(\'user_id\', None)\n        return {\'message\': \'Logged out\'}, 200',
            notes='Flask-RESTful logout endpoint. Removes user_id from session with pop. Second argument None prevents KeyError if not found. Returns success message with 200 status. Register with api.add_resource(Logout, \'/logout\').',
            user=users['Josh'],
            language=languages['Python'],
            category=categories['Methods']
        )
        db.session.add(cheat)
        cheat = Cheat(
            title='Flask User Model with Bcrypt',
            code='class User(db.Model):\n    __tablename__ = \'users\'\n    \n    id = db.Column(db.Integer, primary_key=True)\n    name = db.Column(db.String(100), nullable=False)\n    email = db.Column(db.String(100), unique=True, nullable=False)\n    _password_hash = db.Column(db.String(128), nullable=False)\n    \n    cheats = db.relationship(\'Cheat\', backref=\'user\', lazy=True, cascade=\'all, delete-orphan\')\n    \n    def __init__(self, name, email, password):\n        self.name = name\n        self.email = email\n        self._password_hash = bcrypt.generate_password_hash(password).decode(\'utf-8\')\n    \n    def authenticate(self, password):\n        return bcrypt.check_password_hash(self._password_hash, password)\n    \n    def __repr__(self):\n        return f\'<User {self.name}>\'',
            notes='User model with secure password hashing. Underscore prefix _password_hash keeps it private. init auto-hashes password on creation with bcrypt. authenticate method checks password against hash. unique=True on email prevents duplicates. Change relationship name (cheats) for each project. cascade delete removes related records when user deleted.',
            user=users['Josh'],
            language=languages['Python'],
            category=categories['Classes']
        )
        db.session.add(cheat)
        cheat = Cheat(
            title='Loading State for Auth Context',
            code='function HomePage() {\n    const { loading, loggedIn, user } = useAuth();\n    const [cheats, setCheats] = useState([]);\n    \n    // Wait for auth to load\n    if (loading) {\n        return <div>Loading...</div>;\n    }\n    \n    // Now safe to fetch data\n    useEffect(() => {\n        if (loggedIn) {\n            fetch(\'/api/cheats\')\n                .then(r => r.json())\n                .then(setCheats);\n        }\n    }, [loggedIn]);\n    \n    return (\n        <div>\n            {cheats.map(cheat => <div key={cheat.id}>{cheat.title}</div>)}\n        </div>\n    );\n}',
            notes='Check loading state from auth context at top of component. Return loading message if still checking auth. Prevents render before data loads. Avoids flash of wrong content. Add after useAuth hook call before any other logic.',
            user=users['Josh'],
            language=languages['React'],
            category=categories['Components']
        )
        db.session.add(cheat)
        cheat = Cheat(
            title='Curl POST Create User',
            code='curl -X POST http://localhost:5555/api/users \\n  -H \"Content-Type: application/json\" \\n  -d \'{\n    \"name\": \"Josh\",\n    \"email\": \"josh@josh.com\",\n    \"password\": \"1111\"\n  }\'',
            notes='curl POST request to create user. -X POST specifies method. -H sets Content-Type header to JSON. -d sends JSON data in request body. Use password not _password_hash - model handles hashing. Change port and endpoint to match your setup. Response returns created user data. Send password in the request, NOT _password_hash.',
            user=users['Josh'],
            language=languages['Terminal'],
            category=categories['Curl']
        )
        db.session.add(cheat)
        cheat = Cheat(
            title='Curl POST Login',
            code='curl -X POST http://localhost:5555/api/login \\n  -H \"Content-Type: application/json\" \\n  -d \'{\n    \"email\": \"josh@josh.com\",\n    \"password\": \"1111\"\n  }\'',
            notes='curl POST request to login. Sends email and password as JSON. Returns user data if credentials valid or 401 error if invalid. Creates session cookie but curl doesn\'t save it by default. Add -c cookies.txt to save session. Add -b cookies.txt to send saved cookies in next request.',
            user=users['Josh'],
            language=languages['Terminal'],
            category=categories['Curl']
        )
        db.session.add(cheat)
        cheat = Cheat(
            title='Autocomplete Filter on Input',
            code='const filteredCheats = cheats.filter(cheat =>\n        cheat.title.toLowerCase().includes(searchTerm.toLowerCase())\n    );',
            notes='Controlled input with searchTerm state. onChange updates state on every keystroke. Filter array using includes for partial match. toLowerCase makes search case-insensitive. filteredCheats recalculates automatically on state change. Shows results instantly as user types.',
            user=users['Josh'],
            language=languages['React'],
            category=categories['Components']
        )
        db.session.add(cheat)
        cheat = Cheat(
            title='Query All Records',
            code='# Get all users\nusers = User.query.all()\n\n# Example\nusers = User.query.all()\n# Result: [<User Josh>, <User Sarah>, <User Mike>]',
            notes='Returns list of all records from table. Use on Query object not model directly. Good for small tables under 1000 records. Bad for large tables - loads everything into memory. If need just one use .first(). If counting use .count(). If filtering first use .filter_by() then .all().',
            user=users['Josh'],
            language=languages['Python'],
            category=categories['Methods']
        )
        db.session.add(cheat)
        cheat = Cheat(
            title='Query First Record',
            code='# Get first user\nuser = User.query.first()\n\n# With filter\nuser = User.query.filter_by(email=\"josh@josh.com\").first()\n\n# Example\nuser = User.query.filter_by(name=\"Josh\").first()\n# Result: <User Josh> or None',
            notes='Returns first matching record or None if not found. Safer than .one() which errors if zero or multiple results. Use after .filter_by() for single lookups. Good for getting one record safely. If must exist use .one(). If need all use .all().',
            user=users['Josh'],
            language=languages['Python'],
            category=categories['Methods']
        )
        db.session.add(cheat)
        cheat = Cheat(
            title='Check Relationship with any()',
            code='# Check if user has any cheats with \"python\" in title\nhas_python = user.cheats.any(Cheat.title.ilike(\'%python%\'))\n\n# Example\njosh = User.query.first()\nhas_terminal_cheats = josh.cheats.any(Cheat.category_id == 4)\n# Result: True or False',
            notes='Used on collection relationships to check if any match condition. Returns boolean. Good for filtering parent by child properties. Use .has() for parent relationships instead. Don\'t use on plain columns. Returns True/False not records.',
            user=users['Josh'],
            language=languages['Python'],
            category=categories['Methods']
        )
        db.session.add(cheat)
        cheat = Cheat(
            title='Check Parent with has()',
            code='# Check if cheat has user with specific email\nCheat.query.filter(Cheat.user.has(email=\"josh@josh.com\"))\n\n# Example\nterminal_cheats = Cheat.query.filter(\n    Cheat.user.has(User.name == \"Josh\")\n).all()\n# Result: Query of cheats where user.name is Josh',
            notes='Used on parent relationships to check if parent matches condition. Returns filtered query not boolean. Good for filtering children by parent properties. Use .any() for collection relationships instead. Chain with .all() or .first() to execute.',
            user=users['Josh'],
            language=languages['Python'],
            category=categories['Methods']
        )
        db.session.add(cheat)
        cheat = Cheat(
            title='Count Query Results',
            code='# Count all users\ntotal = User.query.count()\n\n# Count with filter\npython_cheats = Cheat.query.filter_by(language_id=5).count()\n\n# Example\ncheat_count = Cheat.query.filter_by(user_id=1).count()\n# Result: 42',
            notes='Returns integer count without loading records into memory. Faster than len(query.all()) for large tables. Use on Query object. Good for quick counts and pagination. If need actual data use .all() instead. More efficient than counting list length.',
            user=users['Josh'],
            language=languages['Python'],
            category=categories['Methods']
        )
        db.session.add(cheat)
        cheat = Cheat(
            title='Filter by Equality with filter_by()',
            code='# Filter by single field\nusers = User.query.filter_by(name=\"Josh\").all()\n\n# Multiple fields\ncheats = Cheat.query.filter_by(language_id=5, category_id=2).all()\n\n# Example\nuser = User.query.filter_by(email=\"josh@josh.com\").first()\n# Result: <User Josh>',
            notes='Simple equality filtering using keyword arguments. Only works with equals not >, <, OR, LIKE. Chain multiple fields with commas. Use .filter() for complex conditions. Chain with .all() or .first() to execute. Most readable for simple lookups.',
            user=users['Josh'],
            language=languages['Python'],
            category=categories['Methods']
        )
        db.session.add(cheat)
        cheat = Cheat(
            title='Filter Complex Conditions with filter()',
            code='# Greater than\nusers = User.query.filter(User.id > 5).all()\n\n# Multiple conditions (AND)\ncheats = Cheat.query.filter(\n    Cheat.language_id == 5,\n    Cheat.category_id > 2\n).all()\n\n# OR conditions\nfrom sqlalchemy import or_\nusers = User.query.filter(\n    or_(User.name == \"Josh\", User.name == \"Sarah\")\n).all()\n\n# Example\nrecent_cheats = Cheat.query.filter(Cheat.id > 10).all()\n# Result: [<Cheat 11>, <Cheat 12>, <Cheat 13>]',
            notes='Complex filtering with comparison operators and logic. Use Model.column for conditions. Comma separates AND conditions. Import or_ for OR logic. Use .filter_by() for simple equality. Chain with .all() or .first() to execute.',
            user=users['Josh'],
            language=languages['Python'],
            category=categories['Methods']
        )
        db.session.add(cheat)
        cheat = Cheat(
            title='Get by Primary Key with session.get()',
            code='# Modern way (SQLAlchemy 2.0+)\nuser = db.session.get(User, 5)\n\n# OLD way (deprecated)\n# user = User.query.get(5)\n\n# Example\ncheat = db.session.get(Cheat, 42)\n# Result: <Cheat 42> or None',
            notes='Modern SQLAlchemy 2.0+ method for primary key lookup. First arg is model, second is ID. Returns record or None. Replaces deprecated Model.query.get(). Fastest way to get by ID. Use .filter_by() for non-ID columns. Only works with primary keys.',
            user=users['Josh'],
            language=languages['Python'],
            category=categories['Methods']
        )
        db.session.add(cheat)
        cheat = Cheat(
            title='Case-Insensitive Search with ilike()',
            code='# Search with wildcards\nusers = User.query.filter(User.name.ilike(\'%josh%\')).all()\n\n# Starts with\ncheats = Cheat.query.filter(Cheat.title.ilike(\'python%\')).all()\n\n# Example\nsearch = \"REACT\"\nresults = Cheat.query.filter(Cheat.title.ilike(f\'%{search}%\')).all()\n# Result: Finds \"react\", \"React\", \"REACT\"',
            notes='Case-insensitive pattern matching. Use % as wildcard for any characters. Good for user search features. Use .like() for case-sensitive. Use .filter_by() for exact match. Works on string columns only. Surround with % for contains search.',
            user=users['Josh'],
            language=languages['Python'],
            category=categories['Methods']
        )
        db.session.add(cheat)
        cheat = Cheat(
            title='Filter by List with in_()',
            code='# Filter by ID list\nids = [1, 2, 3, 5, 8]\nusers = User.query.filter(User.id.in_(ids)).all()\n\n# Example\nselected_ids = [10, 20, 30]\ncheats = Cheat.query.filter(Cheat.id.in_(selected_ids)).all()\n# Result: [<Cheat 10>, <Cheat 20>, <Cheat 30>]',
            notes='SQL IN clause for multiple values. Pass list or tuple to in_(). Good for bulk lookups by ID. Use on column object not model. Efficient for small to medium lists. Very large lists (10000+) may be slow - batch instead.',
            user=users['Josh'],
            language=languages['Python'],
            category=categories['Methods']
        )
        db.session.add(cheat)
        cheat = Cheat(
            title=' Sort Results with order_by()',
            code='# Sort ascending (A to Z, 1 to 10)\nusers = User.query.order_by(User.name).all()\n\n# Sort descending (Z to A, 10 to 1)\ncheats = Cheat.query.order_by(Cheat.id.desc()).all()\n\n# Multiple sorts\nresults = Cheat.query.order_by(\n    Cheat.language_id,\n    Cheat.title.desc()\n).all()\n\n# Example\nrecent_first = Cheat.query.order_by(Cheat.id.desc()).all()\n# Result: [<Cheat 100>, <Cheat 99>, <Cheat 98>...]',
            notes='Sorts query results by column. Default is ascending use .desc() for descending. Use .asc() to be explicit about ascending. Chain multiple order_by for secondary sorts. Must call before .all() or .first(). Use on Query object. Good for displaying sorted lists.',
            user=users['Josh'],
            language=languages['Python'],
            category=categories['Methods']
        )
        db.session.add(cheat)
        cheat = Cheat(
            title='Limit Results with limit()',
            code='# Get first 10 users\nusers = User.query.limit(10).all()\n\n# With offset for pagination (skip first 20, get next 10)\npage_2 = Cheat.query.offset(20).limit(10).all()\n\n# Example - get 5 most recent cheats\nrecent = Cheat.query.order_by(Cheat.id.desc()).limit(5).all()\n# Result: [<Cheat 100>, <Cheat 99>, <Cheat 98>, <Cheat 97>, <Cheat 96>]',
            notes='Limits number of results returned. Good for pagination and performance. Use .offset() to skip records. Chain with .order_by() for consistent results. Use before .all(). Don\'t use if need all records. Combine offset and limit for page navigation.',
            user=users['Josh'],
            language=languages['Python'],
            category=categories['Methods']
        )
        db.session.add(cheat)
        cheat = Cheat(
            title='Access Relationship Records',
            code='# Access collection relationship\nuser = db.session.get(User, 1)\nuser_cheats = user.cheats\n# Result: [<Cheat 1>, <Cheat 2>, <Cheat 3>]\n\n# Access parent relationship\ncheat = db.session.get(Cheat, 5)\ncheat_author = cheat.user\n# Result: <User Josh>\n\n# Example\njosh = User.query.filter_by(name=\"Josh\").first()\nall_josh_cheats = josh.cheats\n# Result: List of all cheats belonging to Josh',
            notes='Access related records through relationship properties defined in models. Collection relationships return list. Parent relationships return single object. Automatically queries database when accessed. Good for simple related data access. If need filtering use .query.join() instead. Returns actual objects not query.',
            user=users['Josh'],
            language=languages['Python'],
            category=categories['Methods']
        )
        db.session.add(cheat)
        cheat = Cheat(
            title='List Directory Contents with ls',
            code='# Basic list\nls\n\n# List with hidden files (starts with .)\nls -a\n\n# List with details (permissions, size, date)\nls -l\n\n# Combine flags (long format + hidden)\nls -la\n\n# Example in project directory\nls\n# Result: client  server  README.md\n\nls -a\n# Result: .  ..  .git  .gitignore  client  server  README.md',
            notes='Lists files and folders in current directory. -a shows hidden files starting with dot. -l shows long format with permissions and dates. Combine flags like -la. Use before navigating to see what\'s available. Hidden files include .git .env .gitignore.',
            user=users['Josh'],
            language=languages['Terminal'],
            category=categories['Methods']
        )
        db.session.add(cheat)
        cheat = Cheat(
            title='Print Working Directory with pwd',
            code='# Show current full path\npwd\n\n# Example\ncd ~/Desktop/projects/cheat-app\npwd\n# Result: /Users/josh/Desktop/projects/cheat-app',
            notes='Prints full path of current directory. Useful when lost in filesystem. Shows absolute path from root. Use after cd to confirm location. Good for scripts that need current path.',
            user=users['Josh'],
            language=languages['Terminal'],
            category=categories['Methods']
        )
        db.session.add(cheat)
        cheat = Cheat(
            title='Move or Rename with mv',
            code='# Rename file\nmv oldname.txt newname.txt\n\n# Move file to folder\nmv file.txt folder/\n\n# Move and rename\nmv old.txt folder/new.txt\n\n# Move multiple files\nmv file1.txt file2.txt destination-folder/\n\n# Example\nmv app.py main.py\n# Result: Renames app.py to main.py\n\nmv config.py server/\n# Result: Moves config.py into server folder',
            notes='Moves or renames files and directories. Same command for both operations. Overwrites destination if exists. Use with caution. Can move multiple files to directory. Destination must be folder when moving multiple. No undo.',
            user=users['Josh'],
            language=languages['Terminal'],
            category=categories['Methods']
        )
        db.session.add(cheat)
        cheat = Cheat(
            title='Marshmallow schema with ma.Method for custom field serialization',
            code='class UserSchema(ma.SQLAlchemyAutoSchema):\n    languages = ma.Method(\"get_languages_with_cheats\")\n    \n    def get_languages_with_cheats(self, user):\n        # Custom grouping logic here\n        return [...]',
            notes='I\'m using Marshmallow SQLAlchemyAutoSchema with custom serialization  methods defined using ma.Method. This allows me to override specific  fields with custom logic while keeping automatic serialization for  other fields.',
            user=users['Josh'],
            language=languages['Python'],
            category=categories['Classes']
        )
        db.session.add(cheat)
        db.session.commit()
        
        print("✅ Seed completed!")
        print(f"  • {len(users)} users")
        print(f"  • {len(languages)} languages")
        print(f"  • {len(categories)} categories")
        print(f"  • {len(cheats)} cheats")

if __name__ == "__main__":
    seed_database()
