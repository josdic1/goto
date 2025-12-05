# 🐍 CheatCode - Backend

Flask + SQLAlchemy backend API for the CheatCode snippet manager. Provides RESTful endpoints with session-based authentication.

## 🚀 Quick Start

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Initialize database
flask db upgrade

# Seed with example data
python seed.py

# Start server
python run.py
```

Server runs on: **http://localhost:5555**

## 📦 Available Commands

| Command | Description |
|---------|-------------|
| `python run.py` | Start Flask development server |
| `flask db init` | Initialize migrations (first time only) |
| `flask db migrate -m "message"` | Create new migration |
| `flask db upgrade` | Apply migrations to database |
| `flask db downgrade` | Rollback last migration |
| `python seed.py` | Seed database with example data |

## 🏗️ Project Structure

```
server/
├── app/
│   ├── __init__.py          # Flask app factory (creates app)
│   ├── config.py            # Configuration settings
│   ├── extensions.py        # Extension instances (db, bcrypt, ma)
│   ├── models.py            # SQLAlchemy models (User, Cheat, etc)
│   ├── routes.py            # API endpoints (Resources)
│   └── serializers.py       # Marshmallow schemas (unused)
│
├── migrations/              # Alembic migration files
│   ├── versions/            # Individual migration scripts
│   ├── alembic.ini          # Alembic configuration
│   ├── env.py               # Migration environment
│   └── script.py.mako       # Migration template
│
├── instance/                # Instance-specific files (gitignored)
│   └── app.db               # SQLite database file
│
├── run.py                   # Application entry point
├── seed.py                  # Database seeding script
└── requirements.txt         # Python dependencies
```

## 🗂️ Key Files Explained

### `run.py` - Entry Point
```python
from app import create_app

app = create_app()

if __name__ == '__main__':
    app.run(port=5555, debug=True)
```
**What it does:**
- Creates app using factory pattern
- Starts development server on port 5555
- Enables debug mode for auto-reload

---

### `app/__init__.py` - App Factory
**What it does:**
- Creates Flask app instance
- Loads configuration from `Config` class
- Initializes extensions (db, bcrypt, migrations, CORS)
- Registers API routes
- Returns configured app

**Key pattern:** Factory allows multiple apps with different configs

---

### `app/config.py` - Configuration
```python
class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-secret-key'
    SQLALCHEMY_DATABASE_URI = 'sqlite:///app.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    SESSION_COOKIE_SAMESITE = 'Lax'
    SESSION_COOKIE_SECURE = False      # Set True in production
    SESSION_COOKIE_HTTPONLY = True
```
**What to change for production:**
- Set `SECRET_KEY` environment variable
- Change `DATABASE_URI` to PostgreSQL
- Set `SESSION_COOKIE_SECURE = True`

---

### `app/extensions.py` - Extension Instances
```python
db = SQLAlchemy()      # Database ORM
bcrypt = Bcrypt()      # Password hashing
ma = Marshmallow()     # Serialization (unused)
```
**Why here?** Avoids circular imports

---

### `app/models.py` - Database Models

**4 Models:**

1. **User** - User accounts
   ```python
   id, name, email, _password_hash
   Relationships: cheats (one-to-many)
   ```

2. **Language** - Programming languages
   ```python
   id, name
   Relationships: cheats (one-to-many)
   ```

3. **Category** - Code categories
   ```python
   id, name
   Relationships: cheats (one-to-many)
   ```

4. **Cheat** - Code snippets
   ```python
   id, title, code, notes, created_at, updated_at
   Foreign Keys: user_id, language_id, category_id
   Relationships: user, language, category (many-to-one)
   ```

---

### `app/routes.py` - API Endpoints

**12 Flask-RESTful Resources:**

#### Authentication (3)
- `POST /api/signup` - Create account
- `POST /api/login` - Authenticate user
- `POST /api/logout` - End session

#### Session (1)
- `GET /api/check_session` - Verify auth + load user data

#### Cheats (4)
- `GET /api/cheats` - List all cheats (unused - data from check_session)
- `POST /api/cheats` - Create cheat
- `PATCH /api/cheats/<id>` - Update cheat
- `DELETE /api/cheats/<id>` - Delete cheat

#### Reference Data (2)
- `GET /api/languages` - List languages
- `GET /api/categories` - List categories

#### Dev Tools (1)
- `POST /api/dev-tools` - Database management commands

---

### `seed.py` - Database Seeding

**What it creates:**
- 1 user: Josh (josh@josh.com / 1111)
- 10 languages: JavaScript, Python, SQL, React, etc.
- 11 categories: Arrays, Functions, Loops, etc.
- 40+ example cheats

**Usage:**
```bash
python seed.py  # Clears and reseeds database
```

## 📖 API Documentation

### Authentication Flow

**1. Signup**
```bash
POST /api/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepass"
}

# Response: 201 Created
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com"
}
```

**2. Login**
```bash
POST /api/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepass"
}

# Response: 200 OK + Session cookie set
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com"
}
```

**3. Check Session**
```bash
GET /api/check_session

# Response: 200 OK
{
  "logged_in": true,
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "languages": [
      {
        "id": 1,
        "name": "JavaScript",
        "cheats": [...]
      }
    ],
    "categories": [
      {
        "id": 1,
        "name": "Arrays",
        "cheats": [...]
      }
    ]
  }
}
```

---

### CRUD Operations

**Create Cheat**
```bash
POST /api/cheats
Content-Type: application/json

{
  "title": "Array Sort",
  "code": "arr.sort((a, b) => a - b)",
  "notes": "Numeric sort",
  "language_id": 1,
  "category_id": 2,
  "user_id": 1
}

# Response: 201 Created
{
  "id": 42,
  "title": "Array Sort",
  "code": "arr.sort((a, b) => a - b)",
  "notes": "Numeric sort",
  "language": { "id": 1, "name": "JavaScript" },
  "category": { "id": 2, "name": "Arrays" },
  "created_at": "2024-12-05T10:30:00",
  "updated_at": "2024-12-05T10:30:00"
}
```

**Update Cheat**
```bash
PATCH /api/cheats/42
Content-Type: application/json

{
  "title": "Updated Title",
  "code": "new code"
}

# Response: 200 OK
{
  "id": 42,
  "title": "Updated Title",
  "code": "new code",
  ...
}
```

**Delete Cheat**
```bash
DELETE /api/cheats/42

# Response: 200 OK
{
  "message": "Cheat deleted successfully"
}
```

## 🗄️ Database Management

### Migrations Workflow

**1. After changing models:**
```bash
flask db migrate -m "Add new field to User model"
```
This creates a new migration file in `migrations/versions/`

**2. Review the migration:**
```bash
cat migrations/versions/xxxxx_add_new_field.py
```

**3. Apply migration:**
```bash
flask db upgrade
```

**4. Rollback if needed:**
```bash
flask db downgrade
```

---

### Common Migration Commands

```bash
# Check current migration status
flask db current

# Show migration history
flask db history

# Upgrade to specific version
flask db upgrade <revision>

# Downgrade to specific version
flask db downgrade <revision>

# Generate SQL without applying
flask db upgrade --sql
```

---

### Reset Database

```bash
# Delete database
rm instance/app.db

# Recreate from migrations
flask db upgrade

# Reseed
python seed.py
```

## 🔐 Authentication System

### Session-Based Auth

**How it works:**
1. User logs in with email/password
2. Server verifies with bcrypt
3. Server sets `session['user_id']`
4. Browser stores session cookie
5. Browser sends cookie with each request
6. Server verifies session

**Security features:**
- Passwords hashed with bcrypt (never stored plain text)
- httpOnly cookies (JavaScript can't access)
- CSRF protection via SameSite=Lax
- Session cookie expires when browser closes

---

### Password Hashing

**In User model:**
```python
@hybrid_property
def password(self):
    raise AttributeError('Password is not readable')

@password.setter
def password(self, password):
    self._password_hash = bcrypt.generate_password_hash(
        password.encode('utf-8')
    ).decode('utf-8')

def authenticate(self, password):
    return bcrypt.check_password_hash(
        self._password_hash, password.encode('utf-8')
    )
```

**How it works:**
- `generate_password_hash()` - Creates one-way hash
- `check_password_hash()` - Verifies password against hash
- Original password is never stored

## 🛠️ Development

### Adding a New Endpoint

**1. Create Resource class in `routes.py`:**
```python
class MyNewResource(Resource):
    def get(self):
        # Handle GET requests
        return {'message': 'Hello'}
    
    def post(self):
        # Handle POST requests
        data = request.get_json()
        return {'received': data}, 201
```

**2. Register in `initialize_routes()`:**
```python
def initialize_routes(api):
    # ... existing routes ...
    api.add_resource(MyNewResource, '/api/mynew')
```

**3. Test:**
```bash
curl http://localhost:5555/api/mynew
```

---

### Adding a New Model

**1. Create model in `models.py`:**
```python
class MyModel(db.Model):
    __tablename__ = 'my_models'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
```

**2. Create migration:**
```bash
flask db migrate -m "Add MyModel table"
```

**3. Apply migration:**
```bash
flask db upgrade
```

**4. Use in routes:**
```python
from app.models import MyModel

class MyModelResource(Resource):
    def get(self):
        items = MyModel.query.all()
        return [{'id': i.id, 'name': i.name} for i in items]
```

## 🔌 CORS Configuration

**Current setup (development):**
```python
CORS(app,
    resources={r"/*": {"origins": "http://localhost:5173"}},
    supports_credentials=True,
    allow_headers=["Content-Type"],
    methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"]
)
```

**For production:**
```python
CORS(app,
    resources={r"/*": {"origins": "https://yourdomain.com"}},
    supports_credentials=True,
    allow_headers=["Content-Type", "Authorization"],
    methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"]
)
```

## 📦 Dependencies

**Core:**
- `Flask` - Web framework
- `Flask-SQLAlchemy` - ORM
- `Flask-Migrate` - Database migrations
- `Flask-RESTful` - REST API framework
- `Flask-Bcrypt` - Password hashing
- `Flask-CORS` - Cross-origin requests

**Database:**
- `SQLAlchemy` - SQL toolkit
- `Alembic` - Migration tool (via Flask-Migrate)

**Utilities:**
- `python-dotenv` - Environment variables (optional)

## 🚀 Production Deployment

### Using Gunicorn

```bash
# Install
pip install gunicorn

# Run
gunicorn -w 4 -b 0.0.0.0:5555 'app:create_app()'
```

**Gunicorn options:**
- `-w 4` - 4 worker processes
- `-b 0.0.0.0:5555` - Bind to all interfaces on port 5555
- `--reload` - Auto-reload on code changes (dev only)

---

### Environment Variables

Create `.env` file:
```bash
SECRET_KEY=your-production-secret-key-here
DATABASE_URI=postgresql://user:pass@localhost/dbname
FLASK_ENV=production
```

Load with python-dotenv:
```python
from dotenv import load_dotenv
load_dotenv()
```

---

### PostgreSQL Migration

**1. Install psycopg2:**
```bash
pip install psycopg2-binary
```

**2. Update config.py:**
```python
SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URI') or 'sqlite:///app.db'
```

**3. Export data (optional):**
```bash
# Via dev-tools in app, or manually
```

**4. Set environment variable:**
```bash
export DATABASE_URI="postgresql://user:pass@localhost/dbname"
```

**5. Run migrations:**
```bash
flask db upgrade
python seed.py  # If needed
```

## 🐛 Troubleshooting

**"No module named 'app'"**
```bash
# Make sure you're in the server directory
cd server
python run.py
```

**"Cannot import name 'db' from 'app.extensions'"**
- Check `extensions.py` exists
- Verify `db = SQLAlchemy()` is defined
- Restart Python interpreter

**"Database locked" error**
- Close all database connections
- Delete `instance/app.db-journal` if it exists
- Restart server

**CORS errors**
- Verify frontend URL in `CORS(origins=...)`
- Check `credentials: 'include'` in frontend fetch calls
- Clear browser cache

**Session not persisting**
- Check `SESSION_COOKIE_SAMESITE` setting
- Verify `credentials: 'include'` in fetch
- Check browser cookie storage (dev tools)

**Migration errors**
- Delete `migrations/` folder
- Run `flask db init` to restart
- Run `flask db migrate` again

## 📚 Learn More

- [Flask Documentation](https://flask.palletsprojects.com)
- [SQLAlchemy Docs](https://docs.sqlalchemy.org)
- [Flask-RESTful](https://flask-restful.readthedocs.io)
- [Alembic Migrations](https://alembic.sqlalchemy.org)
- [Flask-Migrate](https://flask-migrate.readthedocs.io)

## 🎓 Code Patterns

### Resource Pattern (Flask-RESTful)
```python
class MyResource(Resource):
    def get(self):
        return {'data': 'GET response'}
    
    def post(self):
        data = request.get_json()
        return {'received': data}, 201
    
    def patch(self, id):
        item = MyModel.query.get_or_404(id)
        # Update logic
        return {'updated': item.id}
    
    def delete(self, id):
        item = MyModel.query.get_or_404(id)
        db.session.delete(item)
        db.session.commit()
        return {'message': 'Deleted'}
```

### Session Check Pattern
```python
def get(self):
    user_id = session.get('user_id')
    if not user_id:
        return {'error': 'Not authenticated'}, 401
    
    user = User.query.get(user_id)
    return {'user': user.to_dict()}
```

### Query Pattern
```python
# Get all
items = Model.query.all()

# Get by ID
item = Model.query.get(id)
item = Model.query.get_or_404(id)  # Returns 404 if not found

# Filter
items = Model.query.filter_by(name='value').all()
items = Model.query.filter(Model.age > 18).all()

# Order
items = Model.query.order_by(Model.created_at.desc()).all()

# Limit
items = Model.query.limit(10).all()
```

---

**Questions?** Check the [main README](../README.md) or [full documentation](../APP_DOCUMENTATION.md).