# Import the requests library to send HTTP requests
import requests
from bs4 import BeautifulSoup
import pandas as pd
# The io library manages file-related in/out operations.
import io
# Use Pillow to convert the Python object to an RGB image
from PIL import Image
# hashlib allows you to get hashes. Let's use 'sha1' to name the images.
import hashlib
# pathlib lets you point to specific directories. Use it to store the images in a folder.
from pathlib import Path

def get_items_data():
    # Scraping items data
    url = "https://www.techtonica-calculator.com/seiten/Items.php"
    script_index = 5

    req = requests.get(url)
    soup = BeautifulSoup(req.text, 'html.parser')
    data = soup.find_all("script")

    # Extraction des données
    data = str(data[script_index])

    return data

def get_items_image():
    # Scraping items image
    url = "https://www.techtonica-calculator.com/seiten/Items.php"

    req = requests.get(url)
    soup = BeautifulSoup(req.text, 'html.parser')
    results = []

    base_url = 'https://www.techtonica-calculator.com/'
    for a in soup.findAll('img'):
        # Si la source commence par "../bilder/"
        src = a.get("src")
        if src is not None and src.startswith("../bilder/") and src not in results:
            # On ajoute l'URL de base et on ajoute la source sans les "../bilder"
            full_url = base_url + src[3:]
            results.append(full_url)

    # Permet de checker les résultats
    df = pd.DataFrame({"links": results})
    df.to_csv("../raw_data/img_links.csv", index = False, encoding = "utf-8")

    print(results)
    for b in results:
        # Store the content from the URL to a variable
        image_content = requests.get(b).content
        # Create a byte object out of image_content and store it in the variable image_file
        image_file = io.BytesIO(image_content)
        # Use Pillow to convert the Python object to an RGB image
        image = Image.open(image_file).convert("RGB")
        # Set a file_path variable that points to your directory.
        # Create a file based on the sha1 hash of 'image_content'.
        # Use .hexdigest to convert it into a string.
        file_path = Path("../dist/images", hashlib.sha1(image_content).hexdigest()[:10] + ".png")
        image.save(file_path, "PNG", quality = 80)

    return


def run_scraping():
    get_items_data()
    get_items_image()


def get_raw_items():
    with open("../raw_data/items.txt", "r") as f:
        data = f.read()

    return data


get_items_image()
