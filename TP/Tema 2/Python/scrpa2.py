
import pandas as pd
import requests
from bs4 import BeautifulSoup as bs, BeautifulSoup
from selenium import webdriver
import time

url_base = "https://github.com/topics/angular"
page = requests.get(url_base)
driver = webdriver.Chrome("/usr/lib/chromium-browser/chromedriver")
driver.get(url_base)
lista_topics = list()
for i in range(10):
    driver.find_element_by_css_selector(".ajax-pagination-btn").click()
    time.sleep(1)
soup = BeautifulSoup(driver.page_source, 'html.parser')
prueba = soup.find_all("a", class_= "topic-tag")

driver.quit()
for index,i in enumerate(prueba):
    lista_topics.append(i.text.strip())
df =pd.DataFrame({'Topic':lista_topics} )

df =pd.DataFrame({'Topic':lista_topics} )
nro_apariciones = dict((i, lista_topics.count(i)) for i in lista_topics)
df.to_csv('Respuesta.csv')

df = pd.DataFrame([[key, nro_apariciones[key]] for key in nro_apariciones.keys()], columns=['Topic', 'Repeticiones'])
df_topics_descendente = df.sort_values(by=['Repeticiones'],ascending=False)
print(df_topics_descendente)


