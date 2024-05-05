import json
import re

from v3.crawler.crawler import get_raw_items


# Fonction pour extraire les données du code PHP
def extract_data_from_php(php_code):
    data = []
    pattern = r"TMPthresh\.push\(\s*'(\w+)',\s*'(\d+)',\s*'([\w\s]+)',\s*'(\w+)',\s*'(\w+\.\w+)',\s*'(\d+)',\s*'(\d+\.\d+)',\s*'(\w+)'"
    matches = re.findall(pattern, php_code)
    for match in matches:
        input_, output_quantity, output_items, output_type, output_image, _, base_time, output_id = match
        item = next((item for item in data if item["input"] == input_), None)
        if item is None:
            item = {
                    "id"       : input_,
                    "input"    : input_,
                    "outputs"  : [],
                    "base_time": base_time
            }
            data.append(item)
        item["outputs"].append({
                "item"    : output_id,
                "quantity": output_quantity
        }
        )
    return data


def extract_data():
    data = extract_data_from_php(get_raw_items())

    # Chemin du fichier JSON de sortie
    output_json_path = "../dist/thresh.json"

    # Écriture des données dans le fichier JSON
    with open(output_json_path, "w") as json_file:
        json.dump(data, json_file, indent = 4)
