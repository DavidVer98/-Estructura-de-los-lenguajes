
from bs4 import BeautifulSoup
import requests
import re
import pandas as pd


url_base = 'https://github.com/topics/'

#TIOBE
tiobe_pruebas = ['python', 'c','java','cpp','csharp','visual-basic','javascript','assembly','sql','php','r','delphi','go','swift','ruby','visual-basic-6','objective-c','perl','lua','matlab']
tiobe_lenguajes = ['python', 'C', 'Java', 'C++', 'C#','Visual Basic', 'JavaScript','Assembly language','SQL','PHP','R',
                   'Delphi/Object Pascal','Go','Swift','Ruby','Classic Visual Basic','Objective-C','Perl','Lua','MATLAB']
cant_repo_public = list()
rating_github = list()

# print(url_base+tiobe_lenguajes[0])

for i in tiobe_pruebas:
    page = requests.get(url_base+i)
    soup = BeautifulSoup(page.content, 'html.parser')
    repo_public = soup.find_all('h2', class_= 'h3 color-fg-muted')
    for cant in repo_public:
        # print(cant.text)
        cant_repo_public.append([int(s) for s in re.findall(r"[-+]?\d*\.\d+|\d+",cant.text.replace(',', ""))][0])
        # print(cant_repo_public)
print(cant_repo_public)
df = pd.DataFrame({'Lenguaje':tiobe_lenguajes,'Repositorios Publicos':cant_repo_public} ,index=(range(1,21)))
max = max(cant_repo_public)
min = min(cant_repo_public)
# print(max, min)

for i in cant_repo_public:
        rating = ((i - min) / (max - min) ) * 100
        rating_github.append(rating)

print(rating_github)
df_rating_github =pd.DataFrame({'Lenguaje':tiobe_lenguajes,'Rating Github':rating_github,'Repositorios Publicos':cant_repo_public} ,index=(range(1,21)))
df_rating_github_descendente = df_rating_github.sort_values(by=['Rating Github'],ascending=False)
print(df_rating_github_descendente)
df.to_csv('Respuesta.csv')
