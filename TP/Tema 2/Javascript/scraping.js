// npm i fs-extra puppeteer   --> Librerias
// npm run start  ---> run scraping.js

const fs = require("fs-extra");
const puppeteer = require("puppeteer");
const url_base = "https://github.com/topics/angular";
const writeStream = fs.createWriteStream("estraccion_topics_30dias.txt");

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
    const topics = await page.evaluate(() => {
      return Array.from(
        document.querySelectorAll(".topic-tag.topic-tag-link.f6.mb-2")
      ).map((x) => x.textContent.trim());
    });
     // Se guarda los topics en un arhchivo .txt
    topics.forEach( x => writeStream.write(x +"\n"));
    console.log(topics);

    var repetidos = {};
    var topic_repetidos = [];
    // Array de asociativo
    topics.forEach(function (numero) {
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


