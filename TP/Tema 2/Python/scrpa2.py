from datetime import datetime,timedelta

import pandas as pd
import requests
from bs4 import BeautifulSoup as bs, BeautifulSoup
from selenium import webdriver
import time

url_base = "https://github.com/topics/angular"
page = requests.get(url_base)
driver = webdriver.Chrome("/usr/lib/chromium-browser/chromedriver")
driver.get(url_base)

lista_topics_f = list()
lista_topics = list()
lista_fecha = list()

for i in range(10):
    driver.find_element_by_css_selector(".ajax-pagination-btn").click()
    time.sleep(1)

topics_sinfiltrar = list()


soup = BeautifulSoup(driver.page_source, 'html.parser')

# Se busca el primer div que contiene a los topics
for element in soup.findAll('div', attrs={'class':'d-flex flex-wrap border-bottom color-border-muted px-3 pt-2 pb-2'}):
    topics_sinfiltrar.append((element.text.split()))

driver.quit()

# etiqueta li que contiene a la fecha de cada topic
fecha_li = soup.select('li.mr-4 > relative-time')

# Se guardata todas las fechas encontradas
for index,i in enumerate(fecha_li):
    lista_fecha.append(i.attrs['datetime'])

# Fecha actual
current_time = datetime.now()
now = datetime.now().strftime("%Y-%m-%dT%H:%M:%SZ")
fecha_actual = datetime.strptime(now,"%Y-%m-%dT%H:%M:%SZ")

contador=0

# Se calcula que la fecha no sea superiro a 30 dias
for i in lista_fecha:
    fecha_del_topic = datetime.strptime(lista_fecha[contador], "%Y-%m-%dT%H:%M:%SZ")
    diferencia = fecha_actual - fecha_del_topic
    if (diferencia.days < 30):
        lista_topics.append(topics_sinfiltrar[contador])
    contador = contador + 1
contador=0

# Se guarda en una nueva lista los topics ya procesados con las restriccion de fecha
while contador < len(lista_topics):
    for x in  lista_topics[contador]:
        lista_topics_f.append(x)
    contador += 1

# Se guarda los datos en un .cvs
df =pd.DataFrame({'Topic':lista_topics_f} )
nro_apariciones = dict((i, lista_topics_f.count(i)) for i in lista_topics_f)
df.to_csv('Respuesta.csv')

df = pd.DataFrame([[key, nro_apariciones[key]] for key in nro_apariciones.keys()], columns=['Topic', 'Repeticiones'])
df_topics_descendente = df.sort_values(by=['Repeticiones'],ascending=False)
print(df_topics_descendente)



