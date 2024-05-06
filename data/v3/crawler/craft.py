import json
import re

from v3.crawler.crawler import get_raw_items


def extract_data_from_php(php_code):
    data = []
    pattern = r"TMPcraft\.push\(\s*'(\w+)',\s*'(\d+)',\s*'([\w\s]+)',\s*'(\w+)',\s*'(\w+\.\w+)',\s*'([\d.]+)',\s*'(\d+)',\s*'(\d+)',\s*'(\w+)',\s*'(\d+)'"
    matches = re.findall(pattern, php_code)
    for match in matches:
        output_, quantity, input_items, input_type, input_image, base_production_speed, output_quantity, produced_in, input_id, recipe_id = match
        item = next((item for item in data if item["id"] == (output_ + "_" + recipe_id)), None)

        produced_in_text = "Assembler"
        if (produced_in == "23"):
            produced_in_text = "Blast_Smelter"
        elif (produced_in == "24"):
            produced_in_text = "Smelter"

        if item is None:
            item = {
                    "id"         : output_ + "_" + recipe_id,
                    "output"     : output_,
                    "quantity"   : output_quantity,
                    "inputs"     : [],
                    "base_time"  : base_production_speed,
                    "produced_in": produced_in_text
            }
            data.append(item)
        item["inputs"].append({
                "item"    : input_id,
                "quantity": quantity
        }
        )
    return data


def extract_data():
    # Extraction des données
    print("Extracting craft data...")
    data = extract_data_from_php(get_raw_items())

    # Chemin du fichier JSON de sortie
    output_json_path = "../dist/craft.json"

    # Écriture des données dans le fichier JSON
    with open(output_json_path, "w") as json_file:
        json.dump(data, json_file, indent = 4)
