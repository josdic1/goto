from app import create_app
from app.extensions import db
from app.models import User, Language, Category, Cheat

app = create_app()

with app.app_context():
    # Nuke everything
    db.drop_all()
    db.create_all()
    
    print("🗑️  Database nuked and recreated")
    
    # Create test user
    user = User(name="Josh", email="josh@josh.com", password="1111")
    db.session.add(user)
    db.session.commit()
    print(f"✅ Created user: {user.email}")
    
    # Create languages (alphabetized)
    languages = [
        Language(name="Css"),
        Language(name="Html"),
        Language(name="JavaScript"),
        Language(name="Json"),
        Language(name="Python"),
        Language(name="React"),
        Language(name="Regex"),
        Language(name="Sql"),
        Language(name="Terminal"),
        Language(name="Xml"),
    ]
    
    db.session.add_all(languages)
    db.session.commit()
    print(f"✅ Created {Language.query.count()} languages")
    
    # Create categories (alphabetized)
    categories = [
        Category(name="Arrays"),
        Category(name="Classes"),
        Category(name="Curl"),
        Category(name="Functions"),
        Category(name="Images"),
        Category(name="Loops"),
        Category(name="Manipulation"),
        Category(name="Methods"),
        Category(name="Startup"),
    ]
    
    db.session.add_all(categories)
    db.session.commit()
    print(f"✅ Created {Category.query.count()} categories")
    
    # Get Terminal language and Startup category
    terminal = Language.query.filter_by(name="Terminal").first()
    startup = Category.query.filter_by(name="Startup").first()
    
    # Create single cheat
    cheat = Cheat(
        title="npm create vite@latest client -- --template react",
        code="""npm create vite@latest client -- --template react
cd client
npm install
npm install react-router-dom lucide-react""",
        notes="Executed from existing client folder with router and lucide",
        user_id=user.id,
        language_id=terminal.id,
        category_id=startup.id
    )
    
    db.session.add(cheat)
    db.session.commit()
    print(f"✅ Created {Cheat.query.count()} cheat")
    
    print("\n🎉 Seed complete!")
    print(f"   User: {user.email} / password: 1111")