import json
from app import create_app
from app.extensions import db
from app.models import Cheat, Language, Category

app = create_app()
with app.app_context():
    data = {
        "languages": [{"id": l.id, "name": l.name} for l in Language.query.all()],
        "categories": [{"id": c.id, "name": c.name} for c in Category.query.all()],
        "cheats": [
            {
                "title": ch.title,
                "code": ch.code,
                "notes": ch.notes,
                "language_id": ch.language_id,
                "category_id": ch.category_id
            } for ch in Cheat.query.all()
        ]
    }
    
    with open('backup_data.json', 'w') as f:
        json.dump(data, f, indent=4)
    print("✓ Data exported to backup_data.json")