import re
import json

# Fonction pour extraire les paramètres d'une ligne
def extract_parameters(line):
    # Expression régulière pour rechercher les valeurs entre les guillemets simples et doubles
    pattern = r"'(.*?)'"
    # Recherche de toutes les correspondances dans la ligne
    matches = re.findall(pattern, line)

    return matches

def extract_info(file_path):
    with open(file_path, 'r') as file:
        data = file.readlines()

    # TMPItems.push('Mining_Drill','Mining Drill','Magnetizes tip simultaneously excavates and collects.<br />Must be built at ore veins.','50','1','1','0','0.0','0.75','3','3','5','5','3','0.0','','','','0.41670001','','0','0','0','','Machines','Mining_Drill_1.png','Mining Drill');
    pattern = r"TMPItems.push\('(.*?)'\)"
    pattern = r"TMPItems.push\('(.*?)'"
    items = []

    for line in data:
        if 'TMPItems.push(' in line:
            # Extraction des paramètres de la ligne
            parameters = extract_parameters(line)
            name = parameters[0]
            stacksize = parameters[3]
            items.append({"name": name, "stacksize": stacksize})

    return items

def save_to_json(items, json_file_path):
    with open(json_file_path, 'w') as json_file:
        json.dump(items, json_file)

items = extract_info('data/raw_data/items.html')
save_to_json(items, 'data/items.json')
