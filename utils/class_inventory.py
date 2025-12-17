import os
import re
import json
from collections import defaultdict

def scan_react_files(root_dir):
    """
    Find all className uses in React components
    """
    class_inventory = defaultdict(lambda: {'files': [], 'count': 0})
    
    # Pattern to find className="..." or className={...}
    pattern = r'className=["\']([^"\']+)["\']|className=\{["\']([^"\']+)["\']\}'
    
    for root, dirs, files in os.walk(root_dir):
        # Skip node_modules, dist, etc
        dirs[:] = [d for d in dirs if d not in ['node_modules', 'dist', 'build', '.git', '__pycache__', 'venv']]
        
        for file in files:
            if file.endswith(('.jsx', '.js', '.tsx', '.ts')):
                filepath = os.path.join(root, file)
                rel_path = os.path.relpath(filepath, root_dir)
                
                try:
                    with open(filepath, 'r', encoding='utf-8') as f:
                        content = f.read()
                        matches = re.findall(pattern, content)
                        
                        for match in matches:
                            # match is a tuple, get the non-empty group
                            classes = match[0] or match[1]
                            # Split by spaces for multiple classes
                            for classname in classes.split():
                                if classname:
                                    class_inventory[classname]['files'].append(rel_path)
                                    class_inventory[classname]['count'] += 1
                except Exception as e:
                    print(f"Error reading {rel_path}: {e}")
    
    return class_inventory

def categorize_classes(inventory):
    """
    Organize into: shared, service-specific, component-specific
    """
    categorized = {
        'shared': {},      # Used in 3+ different files
        'service': {},     # Used in 2 files
        'component': {}    # Used in only 1 file
    }
    
    for classname, data in inventory.items():
        unique_files = list(set(data['files']))
        count = len(unique_files)
        
        if count >= 3:
            categorized['shared'][classname] = unique_files
        elif count == 2:
            categorized['service'][classname] = unique_files
        else:
            categorized['component'][classname] = unique_files
    
    return categorized

def generate_spreadsheet(categorized, output_file='class_inventory.csv'):
    """
    Create CSV like your spreadsheet
    """
    import csv
    
    with open(output_file, 'w', newline='') as f:
        writer = csv.writer(f)
        writer.writerow(['CATEGORY', 'CLASSNAME', 'FILE_COUNT', 'APPEARS_IN'])
        
        # Shared Classes
        writer.writerow([])
        writer.writerow(['SHARED CLASSES (3+ files)'])
        writer.writerow(['', 'CLASSNAME', 'FILE_COUNT', 'FILES'])
        for classname, files in sorted(categorized['shared'].items()):
            writer.writerow(['', classname, len(files), '; '.join(files)])
        
        # Service Classes
        writer.writerow([])
        writer.writerow(['SERVICE CLASSES (2 files)'])
        writer.writerow(['', 'CLASSNAME', 'FILE_COUNT', 'FILES'])
        for classname, files in sorted(categorized['service'].items()):
            writer.writerow(['', classname, len(files), '; '.join(files)])
        
        # Component Classes
        writer.writerow([])
        writer.writerow(['COMPONENT CLASSES (1 file)'])
        writer.writerow(['', 'CLASSNAME', 'FILE_COUNT', 'FILES'])
        for classname, files in sorted(categorized['component'].items()):
            writer.writerow(['', classname, len(files), '; '.join(files)])

def print_summary(categorized, inventory):
    """
    Print a nice terminal summary
    """
    print("\n" + "="*60)
    print("CLASS INVENTORY SUMMARY - GOTO PROJECT")
    print("="*60)
    
    total_classes = len(inventory)
    print(f"\n📊 TOTAL UNIQUE CLASSES FOUND: {total_classes}")
    
    print(f"\n📦 SHARED CLASSES (used in 3+ files): {len(categorized['shared'])}")
    if categorized['shared']:
        for classname in sorted(list(categorized['shared'].keys())[:10]):
            file_count = len(categorized['shared'][classname])
            print(f"   • {classname} ({file_count} files)")
        if len(categorized['shared']) > 10:
            print(f"   ... and {len(categorized['shared']) - 10} more")
    
    print(f"\n🔧 SERVICE CLASSES (used in 2 files): {len(categorized['service'])}")
    if categorized['service']:
        for classname in sorted(list(categorized['service'].keys())[:10]):
            print(f"   • {classname}")
        if len(categorized['service']) > 10:
            print(f"   ... and {len(categorized['service']) - 10} more")
    
    print(f"\n🎯 COMPONENT CLASSES (used in 1 file): {len(categorized['component'])}")
    
    print("\n" + "="*60)
    print("✅ Files generated:")
    print("   • class_inventory.csv   (open in Excel/Numbers)")
    print("   • class_inventory.json  (for programmatic use)")
    print("="*60 + "\n")

# Run it
if __name__ == '__main__':
    # Scan the client/src directory
    root = './client/src'
    
    if not os.path.exists(root):
        print(f"❌ Error: Directory '{root}' not found!")
        print("💡 Make sure you're running this from the 'goto' project root")
        exit(1)
    
    print(f"🔍 Scanning {root} for className usage...\n")
    
    inventory = scan_react_files(root)
    
    if not inventory:
        print("⚠️  No classes found! Check if your components use className attributes.")
        exit(0)
    
    categorized = categorize_classes(inventory)
    
    generate_spreadsheet(categorized)
    
    # Save JSON for programmatic use
    with open('class_inventory.json', 'w') as f:
        json.dump(categorized, f, indent=2)
    
    print_summary(categorized, inventory)