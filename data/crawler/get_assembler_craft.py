from bs4 import BeautifulSoup
import json

# Chemin vers le fichier HTML
html_file_path = "data/raw_data/assembler_mk1.html"
# Chemin pour enregistrer le fichier JSON
json_file_path = "data/assembler_mk1.json"

# Initialisation de la structure JSON
data = []

# Fonction pour remplacer les espaces par des underscores
def replace_spaces_with_underscores(text):
    return text.replace(" ", "_")

# Ouverture du fichier HTML en mode lecture
with open(html_file_path, 'r') as file:
    # Lecture du contenu HTML
    html_content = file.read()

    # Analyse du contenu HTML
    soup = BeautifulSoup(html_content, 'html.parser')

    # Récupération des lignes du tableau
    rows = soup.find_all('tr')

    # Ignorer la première ligne (titres des colonnes)
    for row in rows[1:]:
        # Extraction des cellules de la ligne
        cells = row.find_all('td')
        # Création d'un dictionnaire pour stocker les données de chaque ligne
        entry = {
            "efficiency": cells[0].get_text().strip(),
            "outputs": [replace_spaces_with_underscores(cells[1].get_text().strip())],
            "outputs_per_min": [float(cells[2].get_text().strip())],
            "inputs": [replace_spaces_with_underscores(value.strip()) for value in cells[3].get_text().strip().split(",")],
            "inputs_per_min": [float(value.strip()) for value in cells[4].get_text().strip().split(",")]
                }
        # Ajout de la ligne au JSON
        data.append(entry)

# Écriture des données dans un fichier JSON
with open(json_file_path, 'w') as json_file:
    json.dump(data, json_file, indent=4)
