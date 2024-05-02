from bs4 import BeautifulSoup
import json

# Chemin vers le fichier HTML
html_file_path = "data/raw_data/smelter_mk1.html"
# Chemin pour enregistrer le fichier JSON
json_file_path = "data/smelter_mk1.json"

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

        # On split sur / et on prend le premier élément
        outputs_per_min = cells[3].get_text().strip().split("/")[0]
        inputs_per_min = cells[1].get_text().strip().split("/")[0]

        entry = {
            "efficiency": "100%",
            "outputs": [replace_spaces_with_underscores(cells[2].get_text().strip())],
            "outputs_per_min": [float(outputs_per_min)],
            "inputs": [replace_spaces_with_underscores(cells[0].get_text().strip())],
            "inputs_per_min": [float(inputs_per_min)],
                }
        # Ajout de la ligne au JSON
        data.append(entry)

# Écriture des données dans un fichier JSON
with open(json_file_path, 'w') as json_file:
    json.dump(data, json_file, indent=4)
