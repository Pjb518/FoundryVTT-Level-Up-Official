import json
from glob import glob

MODES_TO_TYPES = {
    0: "custom",
    1: "multiply",
    2: "add",
    3: "subtract",
    4: "downgrade",
    5: "upgrade",
    6: "override",
    7: "conditional",
}

def parse_file(file_path: string):
    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            data = json.load(file)
            return data

    except json.JSONDecodeError as e:
        print(f"Skipping invalid JSON File {file_path}: {e}")
    except FileNotFoundError:
        print(f"File not found: {file_path}")
        
def write_file(file_name: string, data: dict):
    with open(file_name, "w", encoding="utf-8") as file:
        json.dump(data, file, indent=4)

def get_files():
    files = glob("../packs/**/*.json")
    return files

def doc_is_actor(doc: object) -> bool:
    return (
        "system" in doc and "prototypeToken" in doc and "items" in doc
    )
    
def doc_is_item(doc: object) -> bool:
    return (
        "system" in doc and "type" in doc and not "text" in doc and not "pages" in doc and not doc_is_actor(doc)
    )

def migrate_effect(effect: dict) -> dict:
    # For each effect get changes
    changes: list(dict) = effect["changes"] or []
    migrated_changes = []

    # Set mode to correct type  
    for change in changes:
        mode = change.get("mode", 2)
        change["type"] = MODES_TO_TYPES.get(mode)
        del change["mode"]
        migrated_changes.append(change)
        
    # Set changes to system.changes
    effect.setdefault("system", {})["changes"] = changes
    del effect["changes"]

    return effect


def migrate_document(doc: object):
    # Get effects 
    isActor = doc_is_actor(doc)
    isItem = doc_is_item(doc)

    if (isActor):
        # Get actor effects
        effects = doc["effects"] or []
        migrated = []
        
        for effect in effects:
            new_effect = migrate_effect(effect)
            migrated.append(new_effect)
            
        # Set migrated actor effects
        doc["effects"] = migrated
        
        # Get item effects from actor
        items = doc["items"] or []
        
        for item in items:
            item_effects = item["effects"] or []
            migrated_item_effects = []

            for effect in item_effects:
                new_effect = migrate_effect(effect)
                migrated_item_effects.append(new_effect)
            
            item["effects"] = migrated_item_effects
    
    elif (isItem):
        effects = doc["effects"] or []
        migrated = []
        
        for effect in effects:
            new_effect = migrate_effect(effect)
            migrated.append(new_effect)
            
        doc["effects"] = migrated

    return doc


def main():
    files = get_files()

    for file in files:
        document = parse_file(file)
        migrated_document = migrate_document(document)
        write_file(file, migrated_document)

        




if __name__ == "__main__":
    main()