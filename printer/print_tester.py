from time import sleep
from typing import Dict
import pyqrcode
from bs4 import BeautifulSoup
import requests

def main():
  while True:
    story = get_story()
    if story:
        print(story['title'])
        print("by " + story['author'])
        words = BeautifulSoup(story['content']).get_text('\n').replace("’","'").replace('“','"').replace('”','"')
        paragraphs = words.split('\n')
        for paragraph in paragraphs:
            words = paragraph.split()
            count = 0
            next_line = ""
            for word in words:
                if (count + len(word) + 1) <= 32:
                    next_line += word + " "
                    count += len(word) + 1
                else:
                    print(next_line)
                    count = 0
                    next_line = word + " "
            print(next_line)
            print('\n\n')
        print('\n\n\n')

def get_story() -> Dict:
  with open("KEY", "r") as file:
    key = file.read().replace('\n', "")
  story = requests.post("http://192.168.1.243:5000/print", headers={"key":key})
  if story.status_code == 200:
    return story.json()
  else:
    return None

main()
