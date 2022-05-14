// npm i fs-extra puppeteer   --> Librerias
// npm run start  ---> run scraping.js

const fs = require("fs-extra");
const puppeteer = require("puppeteer");
const url_base = "https://github.com/topics/angular";
const writeStream = fs.createWriteStream("estraccion_topics_30dias.txt");
const fecha_actual = new Date();


(async () => {
  try {
    // Abrimos una instancia del puppeteer y accedemos a la url de github/topic
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url_base);
    // Se presiona 10 veces el boton "Loading more…" con un timepo de 1s de espera
    for (var i = 0; i < 10; i++) {
      await page.click('[data-disable-with="Loading more…"]');
      await page.waitForTimeout(1000);
    }
    // Se extrea las fechas de los topics
    const fecha_p = await page.evaluate(()=>{
      retorno=[];
      fechas = document.querySelectorAll('ul li.mr-4 relative-time')
      fechas.forEach(function(FechaActual){
        FechaActual.getAttribute("datetime")
        retorno.push(FechaActual.getAttribute("datetime"))
      })
      return retorno
    })
    // Se extrea los topics pero con formato string 
    const topics_p = await page.evaluate(()=>{
      retorno=[];    
      topicp = document.querySelectorAll('article div.d-flex.flex-wrap.border-bottom.color-border-muted.px-3.pt-2.pb-2')
      topicp.forEach(function(topicsp){
        retorno.push(topicsp.textContent)
      })
      return retorno
    })
  
    var lista_topics = [];
    var count = 0;

    // Se guarda los topics sin formatos que sean menor a 30 dias
    fecha_p.forEach(function (item, index){
      fecha_topic = new Date(item)
      if( getDaysBetweenDates(fecha_topic,fecha_actual) < 30){
        lista_topics.push(topics_p[index])
      }

    })
    // Se guarda en una lista nueva los topics ya procesados y con las fechas verificadas
    var lista_topics_f = []
    while( count < lista_topics.length)
    {
      aux = lista_topics[count].match(/("[^"]+"|[^"\s]+)/g)
      aux.forEach(x=>{
        lista_topics_f.push(x)
      })
      count++;
    }
   
    // Funcion para calcular la diferencia entre las fechas 
    function getDaysBetweenDates(d0, d1) {
      var msPerDay = 8.64e7;
      // Copy dates so don't mess them up
      var x0 = new Date(d0);
      var x1 = new Date(d1);
      // Set to noon - avoid DST errors
      x0.setHours(12,0,0);
      x1.setHours(12,0,0);
      // Round to remove daylight saving errors
      return Math.round( (x1 - x0) / msPerDay );
    }

    // Se guarda los topics en un arhchivo .txt
    lista_topics_f.forEach( x => writeStream.write(x +"\n"));
   
    var repetidos = {};
    var topic_repetidos = [];
    
    // Array de asociativo
    lista_topics_f.forEach(function (numero) {
      repetidos[numero] = (repetidos[numero] || 0) + 1;
    });

    Object.keys(repetidos).forEach(function (element) {
      topic_repetidos.push({
        topic: element,
        repeticiones: repetidos[element],
      });
    });

    // Ordenar objeto
    Array.prototype.sortBy = function (p) {
      return this.slice(0).sort(function (a, b) {
        return a[p] < b[p] ? 1 : a[p] > b[p] ? -1 : 0;
      });
    };

    console.log(topic_repetidos.sortBy("repeticiones"));
    var nro_apariciones = JSON.stringify(
      topic_repetidos.sortBy("repeticiones")
    );
    // JSON para la grafica
    fs.writeFile("grafica.json", nro_apariciones, function (err, result) {
      if (err) console.log("error", err);
    });

    browser.close();
  } catch (error) {
    console.error(error);
  }
})();


