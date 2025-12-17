from app import create_app
from app.extensions import db
from app.models import User, Category, Language, Cheat 

app = create_app()

with app.app_context():
    print("Deleting existing data...")
    Cheat.query.delete()
    Category.query.delete()
    Language.query.delete()
    User.query.delete()
    db.session.commit()
    
    print("Creating users...")
    u1 = User(name='Josh', email='josh@josh.com')
    u1.password = '1111'
    
    db.session.add(u1)
    db.session.commit()
    
    print("Creating languages...")
    lang_css = Language(name='CSS')
    lang_html = Language(name='HTML')
    lang_js = Language(name='JavaScript')
    lang_json = Language(name='JSON')
    lang_python = Language(name='Python')
    lang_react = Language(name='React')
    lang_regex = Language(name='Regex')
    lang_sql = Language(name='SQL')
    lang_terminal = Language(name='Terminal')
    lang_xml = Language(name='Xml')
    
    db.session.add_all([lang_css, lang_html, lang_js, lang_json, lang_python, lang_react, lang_regex, lang_sql, lang_terminal, lang_xml])
    db.session.commit()
    
    print("Creating categories...")
    cat_arrays = Category(name='Arrays')
    cat_classes = Category(name='Classes')
    cat_curl = Category(name='Curl')
    cat_functions = Category(name='Functions')
    cat_images = Category(name='Images')
    cat_loops = Category(name='Loops')
    cat_manipulation = Category(name='Manipulation')
    cat_methods = Category(name='Methods')
    cat_startup = Category(name='Startup')
    cat_filters = Category(name='Filters')
    cat_components = Category(name='Components')
    
    db.session.add_all([cat_arrays, cat_classes, cat_curl, cat_functions, cat_images, cat_loops, cat_manipulation, cat_methods, cat_startup, cat_filters, cat_components])
    db.session.commit()
    
    print("Creating cheats...")
    cheats = []
    
    cheats.append(Cheat(
        title='New Vite React Project',
        code='npm create vite@latest client -- --template react\ncd client\nnpm install\nnpm install react-router-dom lucide-react',
        notes='Executed from existing client folder with router and lucide',
        user_id=u1.id,
        language_id=lang_terminal.id,
        category_id=cat_startup.id
    ))
    
    cheats.append(Cheat(
        title='Initial and Use Migration',
        code='flask db init\nflask db migrate -m "initial migration"\nflask db upgrade',
        notes='First time setup: init creates migrations folder. After changing models: migrate creates migration file. upgrade applies changes to database. Run from server directory.',
        user_id=u1.id,
        language_id=lang_terminal.id,
        category_id=cat_startup.id
    ))
    
    cheats.append(Cheat(
        title='Flask GET Route with jsonify',
        code='@app.route(\'/cheats\', methods=[\'GET\'])\ndef get_cheats():\n    cheats = Cheat.query.all()\n    return jsonify([cheat.to_dict() for cheat in cheats]), 200',
        notes='Standard Flask route decorator. Query all cheats from database. Use list comprehension with to_dict() to serialize. jsonify converts to JSON response. Returns 200 status. Use when not using Flask-RESTful.',
        user_id=u1.id,
        language_id=lang_python.id,
        category_id=cat_methods.id
    ))
    
    cheats.append(Cheat(
        title='React Router Setup in main.jsx',
        code='import { createRoot } from \'react-dom/client\'\nimport { createBrowserRouter, RouterProvider } from \'react-router-dom\'\nimport { routes } from \'./routes.jsx\'\nimport \'./index.css\'\n\nconst router = createBrowserRouter(routes)\n\nconst root = createRoot(document.getElementById(\'root\'))\nroot.render(<RouterProvider router={router} />)',
        notes='Entry point for React app with React Router. Import routes from separate file. createBrowserRouter sets up routing. RouterProvider wraps app with router. Renders into root div.',
        user_id=u1.id,
        language_id=lang_react.id,
        category_id=cat_startup.id
    ))
    
    cheats.append(Cheat(
        title='Vite Proxy Configuration',
        code='import { defineConfig } from \'vite\'\nimport react from \'@vitejs/plugin-react\'\n\nexport default defineConfig({\n  plugins: [react()],\n  server: {\n    proxy: {\n      \'/api\': {\n        target: \'http://localhost:5555\',\n        changeOrigin: true,\n        rewrite: (path) => path.replace(/^\\/api/, \'\')\n      }\n    }\n  }\n})',
        notes='Proxies /api requests to Flask backend at port 5555. Change target port if Flask runs on different port (like 5000). rewrite strips /api prefix before sending to Flask. Good for all React + Flask projects. Avoids CORS issues in development.',
        user_id=u1.id,
        language_id=lang_js.id,
        category_id=cat_startup.id
    ))
    
    cheats.append(Cheat(
        title='Create React Context',
        code='import { createContext } from "react";\n\nexport const AuthContext = createContext();',
        notes='Creates context object for sharing state across components. Export to use in provider and custom hook. Holds no initial value - provider will supply values. Import in provider file and custom hook.',
        user_id=u1.id,
        language_id=lang_react.id,
        category_id=cat_startup.id
    ))
    
    cheats.append(Cheat(
        title='React Router Routes Setup',
        code='import App from \'./App.jsx\';\nimport { ErrorPage } from \'./pages/ErrorPage.jsx\';\nimport { ProtectedRoute } from \'./components/ProtectedRoute.jsx\';\n\nexport const routes = [\n    {\n        path: \'/\',\n        element: <ProtectedRoute><App /></ProtectedRoute>,\n        errorElement: <ErrorPage />\n    }\n];',
        notes='Exports routes array for React Router. Sets App as root with ErrorPage fallback. Children array holds nested routes. Wrap protected routes in ProtectedRoute component. Add more route objects for login, signup, etc.',
        user_id=u1.id,
        language_id=lang_react.id,
        category_id=cat_startup.id
    ))
    
    cheats.append(Cheat(
        title='Protected Route Component',
        code='import { Navigate } from \'react-router-dom\';\nimport { useAuth } from \'../hooks/useAuth\';\n\nexport function ProtectedRoute({ children }) {\n    const { loggedIn, loading } = useAuth();\n    \n    if (loading) return <div>Loading...</div>;\n    if (!loggedIn) return <Navigate to="/login" replace />;\n    \n    return children;\n}',
        notes='Wraps routes that require authentication. Checks loading state first to avoid flash redirects. Redirects to login if not logged in. Returns children if authenticated. Use in routes.jsx to protect pages.',
        user_id=u1.id,
        language_id=lang_react.id,
        category_id=cat_components.id
    ))
    
    cheats.append(Cheat(
        title='Basic Error Page Component',
        code='import { useRouteError, useNavigate } from "react-router-dom";\n\nexport function ErrorPage() {\n    const error = useRouteError();\n    const navigate = useNavigate();\n\n    return (\n        <div className="error-container">\n            <h1>Oops!</h1>\n            <p>Sorry, an unexpected error has occurred.</p>\n            <p><i>{error.statusText || error.message}</i></p>\n            <button onClick={() => navigate(\'/\')}>Go Home</button>\n        </div>\n    );\n}',
        notes='Catches routing errors with useRouteError hook. Displays error message and Go Home button. Set as errorElement in routes. Logs error to console for debugging.',
        user_id=u1.id,
        language_id=lang_react.id,
        category_id=cat_components.id
    ))
    
    cheats.append(Cheat(
        title='Flask Extensions File',
        code='from flask_sqlalchemy import SQLAlchemy\nfrom flask_migrate import Migrate\nfrom flask_bcrypt import Bcrypt\nfrom flask_cors import CORS\n\ndb = SQLAlchemy()\nmigrate = Migrate()\nbcrypt = Bcrypt()\ncors = CORS()',
        notes='Centralized file for Flask extensions. Import extensions here, initialize in create_app(). Avoids circular imports. Import db in models and routes. Import bcrypt for password hashing.',
        user_id=u1.id,
        language_id=lang_python.id,
        category_id=cat_startup.id
    ))
    
    cheats.append(Cheat(
        title='Flask Configuration File',
        code='import os\n\nclass Config:\n    SQLALCHEMY_DATABASE_URI = os.getenv(\'DATABASE_URI\', \'sqlite:///app.db\')\n    SQLALCHEMY_TRACK_MODIFICATIONS = False\n    SECRET_KEY = os.getenv(\'SECRET_KEY\', \'dev-secret-key-change-in-production\')',
        notes='Configuration class for Flask settings. Database URI defaults to SQLite. SECRET_KEY for sessions and security. SQLALCHEMY_TRACK_MODIFICATIONS False saves memory. Import in create_app with app.config.from_object(Config).',
        user_id=u1.id,
        language_id=lang_python.id,
        category_id=cat_startup.id
    ))
    
    cheats.append(Cheat(
        title='Flask Run File',
        code='from app import create_app\n\napp = create_app()\n\nif __name__ == \'__main__\':\n    app.run(port=5555, debug=True)',
        notes='Entry point to run Flask app. Imports create_app factory function. Runs on port 5555 with debug mode. Execute with python run.py from server directory. Change port to match vite.config proxy.',
        user_id=u1.id,
        language_id=lang_python.id,
        category_id=cat_startup.id
    ))
    
    cheats.append(Cheat(
        title='Basic App Component with Auth Provider',
        code='import { Outlet } from "react-router-dom";\nimport { AuthProvider } from "./providers/Provider";\n\nfunction App() {\n  return (\n    <AuthProvider>\n      <Outlet />\n    </AuthProvider>\n  );\n}\n\nexport default App;',
        notes='Root App component wrapped in AuthProvider for global auth state. Outlet renders child routes from routes.jsx. Remove extra fragments - AuthProvider can be direct parent. Add more providers here if needed for global state.',
        user_id=u1.id,
        language_id=lang_react.id,
        category_id=cat_startup.id
    ))
    
    cheats.append(Cheat(
        title='Flask Requirements.txt Template',
        code='alembic==1.17.0\nbcrypt==5.0.0\nblinker==1.9.0\nclick==8.3.0\nFlask==3.1.2\nFlask-Bcrypt==1.0.1\nflask-cors==6.0.1\nflask-marshmallow==1.3.0\nFlask-Migrate==4.1.0\nFlask-RESTful==0.3.10\nFlask-SQLAlchemy==3.1.1\ngunicorn==21.2.0\nitsdangerous==2.2.0\nJinja2==3.1.6\nMako==1.3.10\nMarkupSafe==3.0.2\nmarshmallow==4.0.1\nmarshmallow-sqlalchemy==1.4.2\npsycopg2-binary==2.9.10\nPyJWT==2.10.1\npython-dotenv==1.2.1\nSQLAlchemy==2.0.44\nsqlite-web==0.6.5\ntyping_extensions==4.15.0\nWerkzeug==3.1.3',
        notes='Standard Flask requirements for full-stack apps. Includes database (SQLAlchemy, Migrate), auth (Bcrypt, JWT), API tools (RESTful, CORS, Marshmallow), and production server (gunicorn). Install with pip install -r requirements.txt. Good starter for all Flask projects.',
        user_id=u1.id,
        language_id=lang_terminal.id,
        category_id=cat_startup.id
    ))
    
    cheats.append(Cheat(
        title='Sort List by Title in React',
        code='const sortedCheats = [...cheats].sort((a, b) => \n  a.title.localeCompare(b.title)\n);',
        notes='Spread operator creates copy to avoid mutating original array. sort with localeCompare does alphabetical sorting. Use sortedCheats in map instead of cheats. For reverse order use b.title.localeCompare(a.title). Works with any object property.',
        user_id=u1.id,
        language_id=lang_react.id,
        category_id=cat_arrays.id
    ))
    
    cheats.append(Cheat(
        title='Flask-RESTful GET List Resource',
        code='class CategoryList(Resource):\n    def get(self):\n        categories = Category.query.all()\n        return [{\'id\': c.id, \'name\': c.name} for c in categories], 200',
        notes='Flask-RESTful class-based resource. Inherits from Resource. get method returns list of dicts using list comprehension. No jsonify needed - auto converts. Returns tuple with data and status code. Register with api.add_resource(CategoryList, \'/categories\').',
        user_id=u1.id,
        language_id=lang_python.id,
        category_id=cat_methods.id
    ))
    
    cheats.append(Cheat(
        title='Replace Spaces with Underscores (JavaScript)',
        code='string = \'cheat code app\'\nstring.replaceAll(\' \', \'_\')\n\n// Example\nconst title = "cheat code app"\nconst formatted = title.replaceAll(\' \', \'_\')',
        notes='replaceAll method replaces all occurrences. First argument is what to find, second is replacement. Works with any string characters. Can also use replace with regex: replace(/ /g, \'_\'). Returns new string, doesn\'t modify original.',
        user_id=u1.id,
        language_id=lang_js.id,
        category_id=cat_manipulation.id
    ))
    
    cheats.append(Cheat(
        title='Replace Spaces with Underscores (Python)',
        code='string = \'cheat code app\'\nstring.replace(\' \', \'_\')\n\n# Example\ntitle = "cheat code app"\nformatted = title.replace(\' \', \'_\')',
        notes='replace method replaces all occurrences by default in Python. First argument is what to find, second is replacement. Works with any string characters. Returns new string, doesn\'t modify original. No need for replaceAll like JavaScript.',
        user_id=u1.id,
        language_id=lang_python.id,
        category_id=cat_manipulation.id
    ))
    
    cheats.append(Cheat(
        title='Count Spaces in String (JavaScript)',
        code='// Count all spaces\nstring.split(\' \').length - 1\n\n// Example\nconst title = "cheat code app"\nconst spaceCount = title.split(\' \').length - 1\n// Result: 2',
        notes='split divides string by spaces into array, subtract 1 from length. Cleaner than match with null check. matchAll with spread operator is modern but overkill for simple counting. split method is most readable and straightforward.',
        user_id=u1.id,
        language_id=lang_js.id,
        category_id=cat_manipulation.id
    ))
    
    cheats.append(Cheat(
        title='Count Spaces in String (Python)',
        code='# Count all spaces\nstring.count(\' \')\n\n# Example\ntitle = "cheat code app"\nspace_count = title.count(\' \')\n# Result: 2',
        notes='count method counts occurrences of substring. Pass space character as argument. Returns integer count. Works with any character or substring. Simpler than JavaScript - no regex needed.',
        user_id=u1.id,
        language_id=lang_python.id,
        category_id=cat_manipulation.id
    ))
    
    cheats.append(Cheat(
        title='Basic Email Validation (Python)',
        code='# Check for @ and dot after @\n\'@\' in email and \'.\' in email.split(\'@\')[-1]\n\n# Example\nemail = "josh@josh.com"\nis_valid = \'@\' in email and \'.\' in email.split(\'@\')[-1]\n# Result: True\n\nbad_email = "joshjosh.com"\nis_valid = \'@\' in bad_email and \'.\' in bad_email.split(\'@\')[-1]\n# Result: False',
        notes='in operator checks for @ symbol. Split by @ and check last part has dot. Simple validation - not production-grade. For real validation use regex or email-validator library. Works for basic form checks.',
        user_id=u1.id,
        language_id=lang_python.id,
        category_id=cat_functions.id
    ))
    
    cheats.append(Cheat(
        title='Basic Email Validation (JavaScript)',
        code='// Check for @ and dot after @\nemail.includes(\'@\') && email.split(\'@\')[1]?.includes(\'.\')\n\n// Example with steps\nconst email = "josh@josh.com"\nconst parts = email.split(\'@\')  // [\'josh\', \'josh.com\']\nconst domain = parts[1]         // \'josh.com\'\nconst isValid = email.includes(\'@\') && domain?.includes(\'.\')\n// Result: true\n\nconst badEmail = "joshjosh.com"\nconst badParts = badEmail.split(\'@\')  // [\'joshjosh.com\']\nconst badDomain = badParts[1]         // undefined\nconst isValid = badEmail.includes(\'@\') && badDomain?.includes(\'.\')\n// Result: false',
        notes='Includes checks for @ symbol. Split by @ creates array of parts. Index [1] gets domain part after @. Optional chaining ?. prevents error if no domain. Simple validation - not production-grade. For real validation use regex or validation library.',
        user_id=u1.id,
        language_id=lang_js.id,
        category_id=cat_functions.id
    ))
    
    cheats.append(Cheat(
        title='Email Validation with Regex (JavaScript)',
        code=r'''// Email regex pattern
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Test method
emailRegex.test(email)

// Example
const email = "josh@josh.com"
const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
// Result: true

const badEmail = "josh@josh"
const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(badEmail)
// Result: false

// More comprehensive (RFC 5322 compliant)
const strictRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
const isValid = strictRegex.test(email)

// Use
function handleSubmit(e) {
    e.preventDefault()
    const email = e.target.email.value
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        alert('Invalid email')
        return
    }
}''',
        notes='Basic regex checks: characters before @, characters after @, dot in domain. test method returns true/false. Use in form validation before submit. Regex catches most invalid emails but not all edge cases. For production use validation library like validator.js or email-validator.',
        user_id=u1.id,
        language_id=lang_js.id,
        category_id=cat_manipulation.id
    ))
    
    cheats.append(Cheat(
        title='Email Validation with Regex (Python)',
        code=r'''import re

# Email regex pattern
email_regex = r'^[^\s@]+@[^\s@]+\.[^\s@]+$'

# Match method
re.match(email_regex, email)

# Example
email = "josh@josh.com"
is_valid = bool(re.match(r'^[^\s@]+@[^\s@]+\.[^\s@]+$', email))
# Result: True

bad_email = "josh@josh"
is_valid = bool(re.match(r'^[^\s@]+@[^\s@]+\.[^\s@]+$', bad_email))
# Result: False

# More comprehensive
strict_regex = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
is_valid = bool(re.match(strict_regex, email))

# Use
@app.route('/signup', methods=['POST'])
def signup():
    email = request.json.get('email')
    
    if not re.match(r'^[^\s@]+@[^\s@]+\.[^\s@]+$', email):
        return {'error': 'Invalid email'}, 400''',
        notes='Basic regex checks: characters before @, characters after @, dot in domain. re.match returns match object or None. Use in form validation. Regex catches most invalid emails but not all edge cases. For production use validation library like email-validator.',
        user_id=u1.id,
        language_id=lang_python.id,
        category_id=cat_manipulation.id
    ))
    
    cheats.append(Cheat(
        title='Flask Login Resource',
        code='class Login(Resource):\n    def post(self):\n        data = request.get_json()\n        user = User.query.filter_by(email=data.get(\'email\')).first()\n        \n        if user and user.authenticate(data.get(\'password\')):\n            session[\'user_id\'] = user.id\n            return {\'id\': user.id, \'name\': user.name, \'email\': user.email}\n        \n        return {\'error\': \'Invalid credentials\'}, 401',
        notes='Flask-RESTful login endpoint. Gets JSON data from request body. Queries user by email. Checks password with authenticate method. Stores user_id in session. Returns user data on success or 401 error. Register with api.add_resource(Login, \'/login\').',
        user_id=u1.id,
        language_id=lang_python.id,
        category_id=cat_methods.id
    ))
    
    cheats.append(Cheat(
        title='Flask Logout Resource',
        code='class Logout(Resource):\n    def post(self):\n        session.pop(\'user_id\', None)\n        return {\'message\': \'Logged out\'}, 200',
        notes='Flask-RESTful logout endpoint. Removes user_id from session with pop. Second argument None prevents KeyError if not found. Returns success message with 200 status. Register with api.add_resource(Logout, \'/logout\').',
        user_id=u1.id,
        language_id=lang_python.id,
        category_id=cat_methods.id
    ))
    
    cheats.append(Cheat(
        title='Flask User Model with Bcrypt',
        code='''class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    _password_hash = db.Column(db.String(128), nullable=False)
    
    cheats = db.relationship('Cheat', backref='user', lazy=True, cascade='all, delete-orphan')
    
    def __init__(self, name, email, password):
        self.name = name
        self.email = email
        self._password_hash = bcrypt.generate_password_hash(password).decode('utf-8')
    
    def authenticate(self, password):
        return bcrypt.check_password_hash(self._password_hash, password)
    
    def __repr__(self):
        return f'<User {self.name}>\'''',
        notes='User model with secure password hashing. Underscore prefix _password_hash keeps it private. init auto-hashes password on creation with bcrypt. authenticate method checks password against hash. unique=True on email prevents duplicates. Change relationship name (cheats) for each project. cascade delete removes related records when user deleted.',
        user_id=u1.id,
        language_id=lang_python.id,
        category_id=cat_classes.id
    ))
    
    cheats.append(Cheat(
        title='Loading State for Auth Context',
        code='''function HomePage() {
    const { loading, loggedIn, user } = useAuth();
    const [cheats, setCheats] = useState([]);
    
    // Wait for auth to load
    if (loading) {
        return <div>Loading...</div>;
    }
    
    // Now safe to fetch data
    useEffect(() => {
        if (loggedIn) {
            fetch('/api/cheats')
                .then(r => r.json())
                .then(setCheats);
        }
    }, [loggedIn]);
    
    return (
        <div>
            {cheats.map(cheat => <div key={cheat.id}>{cheat.title}</div>)}
        </div>
    );
}''',
        notes='Check loading state from auth context at top of component. Return loading message if still checking auth. Prevents render before data loads. Avoids flash of wrong content. Add after useAuth hook call before any other logic.',
        user_id=u1.id,
        language_id=lang_react.id,
        category_id=cat_components.id
    ))
    
    cheats.append(Cheat(
        title='Curl POST Create User',
        code='''curl -X POST http://localhost:5555/api/users \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "Josh",
    "email": "josh@josh.com",
    "password": "1111"
  }' ''',
        notes='curl POST request to create user. -X POST specifies method. -H sets Content-Type header to JSON. -d sends JSON data in request body. Use password not _password_hash - model handles hashing. Change port and endpoint to match your setup. Response returns created user data. Send password in the request, NOT _password_hash.',
        user_id=u1.id,
        language_id=lang_terminal.id,
        category_id=cat_curl.id
    ))
    
    cheats.append(Cheat(
        title='Curl POST Login',
        code='''curl -X POST http://localhost:5555/api/login \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "josh@josh.com",
    "password": "1111"
  }' ''',
        notes='curl POST request to login. Sends email and password as JSON. Returns user data if credentials valid or 401 error if invalid. Creates session cookie but curl doesn\'t save it by default. Add -c cookies.txt to save session. Add -b cookies.txt to send saved cookies in next request.',
        user_id=u1.id,
        language_id=lang_terminal.id,
        category_id=cat_curl.id
    ))
    
    cheats.append(Cheat(
        title='Autocomplete Filter on Input',
        code='const filteredCheats = cheats.filter(cheat =>\n        cheat.title.toLowerCase().includes(searchTerm.toLowerCase())\n    );',
        notes='Controlled input with searchTerm state. onChange updates state on every keystroke. Filter array using includes for partial match. toLowerCase makes search case-insensitive. filteredCheats recalculates automatically on state change. Shows results instantly as user types.',
        user_id=u1.id,
        language_id=lang_react.id,
        category_id=cat_components.id
    ))
    
    cheats.append(Cheat(
        title='Query All Records',
        code='# Get all users\nusers = User.query.all()\n\n# Example\nusers = User.query.all()\n# Result: [<User Josh>, <User Sarah>, <User Mike>]',
        notes='Returns list of all records from table. Use on Query object not model directly. Good for small tables under 1000 records. Bad for large tables - loads everything into memory. If need just one use .first(). If counting use .count(). If filtering first use .filter_by() then .all().',
        user_id=u1.id,
        language_id=lang_python.id,
        category_id=cat_methods.id
    ))
    
    cheats.append(Cheat(
        title='Query First Record',
        code='# Get first user\nuser = User.query.first()\n\n# With filter\nuser = User.query.filter_by(email="josh@josh.com").first()\n\n# Example\nuser = User.query.filter_by(name="Josh").first()\n# Result: <User Josh> or None',
        notes='Returns first matching record or None if not found. Safer than .one() which errors if zero or multiple results. Use after .filter_by() for single lookups. Good for getting one record safely. If must exist use .one(). If need all use .all().',
        user_id=u1.id,
        language_id=lang_python.id,
        category_id=cat_methods.id
    ))
    
    cheats.append(Cheat(
        title='Check Relationship with any()',
        code='# Check if user has any cheats with "python" in title\nhas_python = user.cheats.any(Cheat.title.ilike(\'%python%\'))\n\n# Example\njosh = User.query.first()\nhas_terminal_cheats = josh.cheats.any(Cheat.category_id == 4)\n# Result: True or False',
        notes='Used on collection relationships to check if any match condition. Returns boolean. Good for filtering parent by child properties. Use .has() for parent relationships instead. Don\'t use on plain columns. Returns True/False not records.',
        user_id=u1.id,
        language_id=lang_python.id,
        category_id=cat_methods.id
    ))
    
    cheats.append(Cheat(
        title='Check Parent with has()',
        code='# Check if cheat has user with specific email\nCheat.query.filter(Cheat.user.has(email="josh@josh.com"))\n\n# Example\nterminal_cheats = Cheat.query.filter(\n    Cheat.user.has(User.name == "Josh")\n).all()\n# Result: Query of cheats where user.name is Josh',
        notes='Used on parent relationships to check if parent matches condition. Returns filtered query not boolean. Good for filtering children by parent properties. Use .any() for collection relationships instead. Chain with .all() or .first() to execute.',
        user_id=u1.id,
        language_id=lang_python.id,
        category_id=cat_methods.id
    ))
    
    cheats.append(Cheat(
        title='Count Query Results',
        code='# Count all users\ntotal = User.query.count()\n\n# Count with filter\npython_cheats = Cheat.query.filter_by(language_id=5).count()\n\n# Example\ncheat_count = Cheat.query.filter_by(user_id=1).count()\n# Result: 42',
        notes='Returns integer count without loading records into memory. Faster than len(query.all()) for large tables. Use on Query object. Good for quick counts and pagination. If need actual data use .all() instead. More efficient than counting list length.',
        user_id=u1.id,
        language_id=lang_python.id,
        category_id=cat_methods.id
    ))
    
    cheats.append(Cheat(
        title='Filter by Equality with filter_by()',
        code='# Filter by single field\nusers = User.query.filter_by(name="Josh").all()\n\n# Multiple fields\ncheats = Cheat.query.filter_by(language_id=5, category_id=2).all()\n\n# Example\nuser = User.query.filter_by(email="josh@josh.com").first()\n# Result: <User Josh>',
        notes='Simple equality filtering using keyword arguments. Only works with equals not >, <, OR, LIKE. Chain multiple fields with commas. Use .filter() for complex conditions. Chain with .all() or .first() to execute. Most readable for simple lookups.',
        user_id=u1.id,
        language_id=lang_python.id,
        category_id=cat_methods.id
    ))
    
    cheats.append(Cheat(
        title='Filter Complex Conditions with filter()',
        code='''# Greater than
users = User.query.filter(User.id > 5).all()

# Multiple conditions (AND)
cheats = Cheat.query.filter(
    Cheat.language_id == 5,
    Cheat.category_id > 2
).all()

# OR conditions
from sqlalchemy import or_
users = User.query.filter(
    or_(User.name == "Josh", User.name == "Sarah")
).all()

# Example
recent_cheats = Cheat.query.filter(Cheat.id > 10).all()
# Result: [<Cheat 11>, <Cheat 12>, <Cheat 13>]''',
        notes='Complex filtering with comparison operators and logic. Use Model.column for conditions. Comma separates AND conditions. Import or_ for OR logic. Use .filter_by() for simple equality. Chain with .all() or .first() to execute.',
        user_id=u1.id,
        language_id=lang_python.id,
        category_id=cat_methods.id
    ))
    
    cheats.append(Cheat(
        title='Get by Primary Key with session.get()',
        code='# Modern way (SQLAlchemy 2.0+)\nuser = db.session.get(User, 5)\n\n# OLD way (deprecated)\n# user = User.query.get(5)\n\n# Example\ncheat = db.session.get(Cheat, 42)\n# Result: <Cheat 42> or None',
        notes='Modern SQLAlchemy 2.0+ method for primary key lookup. First arg is model, second is ID. Returns record or None. Replaces deprecated Model.query.get(). Fastest way to get by ID. Use .filter_by() for non-ID columns. Only works with primary keys.',
        user_id=u1.id,
        language_id=lang_python.id,
        category_id=cat_methods.id
    ))
    
    cheats.append(Cheat(
        title='Case-Insensitive Search with ilike()',
        code='# Search with wildcards\nusers = User.query.filter(User.name.ilike(\'%josh%\')).all()\n\n# Starts with\ncheats = Cheat.query.filter(Cheat.title.ilike(\'python%\')).all()\n\n# Example\nsearch = "REACT"\nresults = Cheat.query.filter(Cheat.title.ilike(f\'%{search}%\')).all()\n# Result: Finds "react", "React", "REACT"',
        notes='Case-insensitive pattern matching. Use % as wildcard for any characters. Good for user search features. Use .like() for case-sensitive. Use .filter_by() for exact match. Works on string columns only. Surround with % for contains search.',
        user_id=u1.id,
        language_id=lang_python.id,
        category_id=cat_methods.id
    ))
    
    cheats.append(Cheat(
        title='Filter by List with in_()',
        code='# Filter by ID list\nids = [1, 2, 3, 5, 8]\nusers = User.query.filter(User.id.in_(ids)).all()\n\n# Example\nselected_ids = [10, 20, 30]\ncheats = Cheat.query.filter(Cheat.id.in_(selected_ids)).all()\n# Result: [<Cheat 10>, <Cheat 20>, <Cheat 30>]',
        notes='SQL IN clause for multiple values. Pass list or tuple to in_(). Good for bulk lookups by ID. Use on column object not model. Efficient for small to medium lists. Very large lists (10000+) may be slow - batch instead.',
        user_id=u1.id,
        language_id=lang_python.id,
        category_id=cat_methods.id
    ))
    
    cheats.append(Cheat(
        title='Sort Results with order_by()',
        code='''# Sort ascending (A to Z, 1 to 10)
users = User.query.order_by(User.name).all()

# Sort descending (Z to A, 10 to 1)
cheats = Cheat.query.order_by(Cheat.id.desc()).all()

# Multiple sorts
results = Cheat.query.order_by(
    Cheat.language_id,
    Cheat.title.desc()
).all()

# Example
recent_first = Cheat.query.order_by(Cheat.id.desc()).all()
# Result: [<Cheat 100>, <Cheat 99>, <Cheat 98>...]''',
        notes='Sorts query results by column. Default is ascending use .desc() for descending. Use .asc() to be explicit about ascending. Chain multiple order_by for secondary sorts. Must call before .all() or .first(). Use on Query object. Good for displaying sorted lists.',
        user_id=u1.id,
        language_id=lang_python.id,
        category_id=cat_methods.id
    ))
    
    cheats.append(Cheat(
        title='Limit Results with limit()',
        code='# Get first 10 users\nusers = User.query.limit(10).all()\n\n# With offset for pagination (skip first 20, get next 10)\npage_2 = Cheat.query.offset(20).limit(10).all()\n\n# Example - get 5 most recent cheats\nrecent = Cheat.query.order_by(Cheat.id.desc()).limit(5).all()\n# Result: [<Cheat 100>, <Cheat 99>, <Cheat 98>, <Cheat 97>, <Cheat 96>]',
        notes='Limits number of results returned. Good for pagination and performance. Use .offset() to skip records. Chain with .order_by() for consistent results. Use before .all(). Don\'t use if need all records. Combine offset and limit for page navigation.',
        user_id=u1.id,
        language_id=lang_python.id,
        category_id=cat_methods.id
    ))
    
    cheats.append(Cheat(
        title='Access Relationship Records',
        code='# Access collection relationship\nuser = db.session.get(User, 1)\nuser_cheats = user.cheats\n# Result: [<Cheat 1>, <Cheat 2>, <Cheat 3>]\n\n# Access parent relationship\ncheat = db.session.get(Cheat, 5)\ncheat_author = cheat.user\n# Result: <User Josh>\n\n# Example\njosh = User.query.filter_by(name="Josh").first()\nall_josh_cheats = josh.cheats\n# Result: List of all cheats belonging to Josh',
        notes='Access related records through relationship properties defined in models. Collection relationships return list. Parent relationships return single object. Automatically queries database when accessed. Good for simple related data access. If need filtering use .query.join() instead. Returns actual objects not query.',
        user_id=u1.id,
        language_id=lang_python.id,
        category_id=cat_methods.id
    ))
    
    cheats.append(Cheat(
        title='List Directory Contents with ls',
        code='# Basic list\nls\n\n# List with hidden files (starts with .)\nls -a\n\n# List with details (permissions, size, date)\nls -l\n\n# Combine flags (long format + hidden)\nls -la\n\n# Example in project directory\nls\n# Result: client  server  README.md\n\nls -a\n# Result: .  ..  .git  .gitignore  client  server  README.md',
        notes='Lists files and folders in current directory. -a shows hidden files starting with dot. -l shows long format with permissions and dates. Combine flags like -la. Use before navigating to see what\'s available. Hidden files include .git .env .gitignore.',
        user_id=u1.id,
        language_id=lang_terminal.id,
        category_id=cat_methods.id
    ))
    
    cheats.append(Cheat(
        title='Print Working Directory with pwd',
        code='# Show current full path\npwd\n\n# Example\ncd ~/Desktop/projects/cheat-app\npwd\n# Result: /Users/josh/Desktop/projects/cheat-app',
        notes='Prints full path of current directory. Useful when lost in filesystem. Shows absolute path from root. Use after cd to confirm location. Good for scripts that need current path.',
        user_id=u1.id,
        language_id=lang_terminal.id,
        category_id=cat_methods.id
    ))
    
    cheats.append(Cheat(
        title='Move or Rename with mv',
        code='# Rename file\nmv oldname.txt newname.txt\n\n# Move file to folder\nmv file.txt folder/\n\n# Move and rename\nmv old.txt folder/new.txt\n\n# Move multiple files\nmv file1.txt file2.txt destination-folder/\n\n# Example\nmv app.py main.py\n# Result: Renames app.py to main.py\n\nmv config.py server/\n# Result: Moves config.py into server folder',
        notes='Moves or renames files and directories. Same command for both operations. Overwrites destination if exists. Use with caution. Can move multiple files to directory. Destination must be folder when moving multiple. No undo.',
        user_id=u1.id,
        language_id=lang_terminal.id,
        category_id=cat_methods.id
    ))
    
    cheats.append(Cheat(
        title='Marshmallow schema with ma.Method for custom field serialization',
        code='''class UserSchema(ma.SQLAlchemyAutoSchema):
    languages = ma.Method("get_languages_with_cheats")
    
    def get_languages_with_cheats(self, user):
        # Custom grouping logic here
        return [...]''',
        notes='I\'m using Marshmallow SQLAlchemyAutoSchema with custom serialization methods defined using ma.Method. This allows me to override specific fields with custom logic while keeping automatic serialization for other fields.',
        user_id=u1.id,
        language_id=lang_python.id,
        category_id=cat_classes.id
    ))
    
    cheats.append(Cheat(
        title='Remove Screenshots in Downloads',
        code='rm ~/Downloads/screenshot*.png',
        notes='Removes all files titled \'screenshot_...\' in the Downloads folder',
        user_id=u1.id,
        language_id=lang_terminal.id,
        category_id=cat_methods.id
    ))
    
    db.session.add_all(cheats)
    db.session.commit()
    
    print(f"Created {User.query.count()} users")
    print(f"Created {Language.query.count()} languages")
    print(f"Created {Category.query.count()} categories")
    print(f"Created {Cheat.query.count()} cheats")
    print("Done!")