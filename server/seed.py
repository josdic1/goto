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
    
    # Create languages
    python = Language(name="Python")
    javascript = Language(name="JavaScript")
    ruby = Language(name="Ruby")
    
    db.session.add_all([python, javascript, ruby])
    db.session.commit()
    print(f"✅ Created {Language.query.count()} languages")
    
    # Create categories
    functions = Category(name="Functions")
    loops = Category(name="Loops")
    classes = Category(name="Classes")
    arrays = Category(name="Arrays")
    
    db.session.add_all([functions, loops, classes, arrays])
    db.session.commit()
    print(f"✅ Created {Category.query.count()} categories")
    
    # Create some cheats
    cheats = [
        Cheat(
            title="List Comprehension",
            code="[x for x in range(10)]",
            user_id=user.id,
            language_id=python.id,
            category_id=loops.id
        ),
        Cheat(
            title="Dict Comprehension",
            code="{k: v for k, v in items()}",
            user_id=user.id,
            language_id=python.id,
            category_id=loops.id
        ),
        Cheat(
            title="Lambda Function",
            code="lambda x: x * 2",
            user_id=user.id,
            language_id=python.id,
            category_id=functions.id
        ),
        Cheat(
            title="Arrow Function",
            code="const add = (a, b) => a + b",
            user_id=user.id,
            language_id=javascript.id,
            category_id=functions.id
        ),
        Cheat(
            title="Map Array",
            code="array.map(item => item * 2)",
            user_id=user.id,
            language_id=javascript.id,
            category_id=arrays.id
        ),
        Cheat(
            title="Ruby Block",
            code="[1,2,3].each { |n| puts n }",
            user_id=user.id,
            language_id=ruby.id,
            category_id=loops.id
        )
    ]
    
    db.session.add_all(cheats)
    db.session.commit()
    print(f"✅ Created {Cheat.query.count()} cheats")
    
    print("\n🎉 Seed complete!")
    print(f"   User: {user.email} / password: 1111")