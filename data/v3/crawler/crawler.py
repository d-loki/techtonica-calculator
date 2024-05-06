# Import the requests library to send HTTP requests
# The io library manages file-related in/out operations.
import io
import os
# pathlib lets you point to specific directories. Use it to store the images in a folder.
from pathlib import Path

import pandas as pd
import progressbar
import requests
# Use Pillow to convert the Python object to an RGB image
from PIL import Image
from bs4 import BeautifulSoup


def get_items_data():
    # Scraping items data
    print("Scraping items data")
    url = "https://www.techtonica-calculator.com/seiten/Items.php"
    script_index = 5

    req = requests.get(url)
    soup = BeautifulSoup(req.text, 'html.parser')
    data = soup.find_all("script")

    # Extraction des données
    data = str(data[script_index])

    return data


def get_items_image():
    print("Scraping items images")
    url = "https://www.techtonica-calculator.com/seiten/Items.php"

    req = requests.get(url)
    soup = BeautifulSoup(req.text, 'html.parser')
    results = []

    base_url = 'https://www.techtonica-calculator.com/'
    for div in soup.findAll('div',
                            class_ = 'p2px m2l zentrieren rad10 backcolor_tiefdunkelblau color_orange border_blau s05'
                            ):
        href = div.find('a').get('href')
        item_id = href.split('=')[1]
        img_src = div.find('img').get('src')
        # Si la source commence par "../bilder/"
        if img_src is not None and img_src.startswith("../bilder/") and img_src not in results:
            # On ajoute l'URL de base et on ajoute la source sans les "../bilder"
            full_url = base_url + img_src[3:] + f'?id={item_id}'
            results.append(full_url)

    # Permet de checker les résultats
    df = pd.DataFrame({"links": results})
    df.to_csv("../raw_data/img_links.csv", index = False, encoding = "utf-8")

    for b in progressbar.progressbar(results):
        # Store the content from the URL to a variable
        image_content = requests.get(b).content
        # Create a byte object out of image_content and store it in the variable image_file
        image_file = io.BytesIO(image_content)
        # Use Pillow to convert the Python object to an RGB image
        image = Image.open(image_file).convert("RGB")

        item_id = b.split('=')[1]
        file_path = Path("../../../public/items", os.path.basename(item_id + ".png"))
        image.save(file_path, "PNG", quality = 80)

    return


def run_scraping():
    get_items_data()
    get_items_image()


def get_raw_items():
    with open("../raw_data/items.txt", "r") as f:
        data = f.read()

    return data


run_scraping()
