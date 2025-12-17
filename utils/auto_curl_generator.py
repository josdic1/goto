from app import create_app
from flask_restful import Api
from app.serializers import (
    user_schema, users_schema,
    cheat_schema, cheats_schema,
    language_schema, languages_schema,
    category_schema, categories_schema
)
import json

app = create_app()
api = Api(app)

SCHEMA_MAP = {
    "users": user_schema,
    "cheats": cheat_schema,
    "languages": language_schema,
    "categories": category_schema
}

def extract_schema_fields(schema):
    if schema is None:
        return []
    return [f for f in getattr(schema, "fields", {}) if f not in ("id", "_password_hash")]

def generate_curl_commands():
    base_url = "http://localhost:5555"
    commands = []
    for rule in app.url_map.iter_rules():
        if rule.endpoint == "static":
            continue
        methods = [m for m in rule.methods if m in ["GET","POST","PATCH","PUT","DELETE"]]
        for method in methods:
            url = str(rule)
            curl_cmd = f"curl -X {method} {base_url}{url}"
            schema = None
            for key,s in SCHEMA_MAP.items():
                if key in url:
                    schema = s
                    break
            if method in ["POST","PATCH","PUT"] and schema:
                fields = extract_schema_fields(schema)
                if fields:
                    data = {f: f"<{f}_value>" for f in fields}
                    curl_cmd += f" -H 'Content-Type: application/json' -d '{json.dumps(data)}'"
            if url in ["/logout","/check_session"]:
                curl_cmd += " -b 'session=<cookie>'"
            commands.append({
                "header": f"{method} {url}",
                "curl": curl_cmd
            })
    return commands

@app.route("/curl")
def curl_page():
    commands = generate_curl_commands()
    html = """
    <html>
    <head>
        <title>cURL Commands</title>
        <style>
            body { font-family: monospace; padding: 20px; background: #1a1a1a; color: #0f0; }
            h1 { color: #0ff; }
            .cmd-box { background: #2a2a2a; padding: 15px; border-radius: 5px; margin: 10px 0; position: relative; }
            .header { color: #0ff; font-weight: bold; margin-bottom: 8px; }
            .curl { color: #0f0; word-wrap: break-word; }
            .copy-btn { 
                position: absolute; 
                top: 10px; 
                right: 10px; 
                background: #0ff; 
                color: #000; 
                border: none; 
                padding: 5px 10px; 
                cursor: pointer; 
                border-radius: 3px;
                font-family: monospace;
            }
            .copy-btn:hover { background: #0f0; }
            .copy-btn.copied { background: #0f0; }
        </style>
    </head>
    <body>
        <h1>cURL Commands</h1>
    """
    
    for i, cmd in enumerate(commands):
        escaped_curl = cmd["curl"].replace("'", "\\'")
        html += f"""
        <div class="cmd-box">
            <button class="copy-btn" onclick="copyCmd(this, '{escaped_curl}')">Copy</button>
            <div class="header">{cmd["header"]}</div>
            <div class="curl">{cmd["curl"]}</div>
        </div>
        """
    
    html += """
        <script>
            function copyCmd(btn, text) {
                navigator.clipboard.writeText(text);
                btn.textContent = 'Copied!';
                btn.classList.add('copied');
                setTimeout(() => {
                    btn.textContent = 'Copy';
                    btn.classList.remove('copied');
                }, 1500);
            }
        </script>
    </body>
    </html>
    """
    return html

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5555, debug=True)