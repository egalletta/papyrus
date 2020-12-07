from time import sleep
from typing import Dict
import pyqrcode
import png
from PIL import Image
from thermalprinter import *
from bs4 import BeautifulSoup
import requests
import textwrap
import os

URL = "http://papyrus.galletta.xyz"
KEY = os.environ.get('PAPYRUS_KEY')
if KEY == "":
    print("Please supply PAPYRUS_KEY env variable")
    exit(1)


def main():
    while True:
        story = get_story()
        if story:
            print("Story Found.")
            url = pyqrcode.create(story['link'])
            url.png("story.png", scale=5)
            with ThermalPrinter(port='/dev/serial0') as printer:
                printer.out(story['title'], justify='C', size='M', bold=True)
                print(story['title'])
                printer.out("by " + story['author'], justify='C', size='M')
                print("by {}".format(story['author']))
                printer.feed(1)
                # printer.image(Image.open('story.png'))
                words = BeautifulSoup(story['content']).get_text(
                    '\n').replace("’", "'").replace('“', '"').replace('”', '"')
                paragraphs = words.split('\n')
                for paragraph in paragraphs:
                    print("Starting new paragraph")
                    lines = textwrap.wrap(paragraph, width=32)
                    for line in lines:
                        printer.out(line, justify='L', size='S')
                        print(line)
                    printer.feed(1)
                    print('\n')
                    sleep(1)
                printer.feed(4)
        else:
            print("No story found.")
        sleep(5)


def get_story() -> Dict:
    story = requests.post(URL + "/print", headers={"key": KEY})
    if story.status_code == 200:
        return story.json()
    else:
        return None


main()
