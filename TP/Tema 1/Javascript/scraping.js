// npm i fs-extra puppeteer jsdom  --> Librerias
// npm run start  ---> run scraping.js

const fs = require("fs-extra");
const puppeteer = require("puppeteer");
const jsdom = require("jsdom");


const tiobe_github = [
  "python","c","java","cpp","csharp","visual-basic","javascript","assembly","sql","php","r",
   "delphi","go","swift","ruby","visual-basic-6","objective-c","perl","lua","matlab",
];
const tiobe_lenguajes = [
  "python","C","Java","C++","C#","Visual Basic","JavaScript","Assembly language","SQL","PHP","R",
  "Delphi/Object Pascal","Go","Swift","Ruby","Classic Visual Basic","Objective-C","Perl","Lua","MATLAB",
];

const url_base = "https://github.com/topics/";


const writeStream = fs.createWriteStream("Respuesta.csv");
var reg = /(\d+)/g;
var nro_apariciones = [];
let valor;
let count = 0;

(async () => {
  try {
    writeStream.write("Lenguaje|Numero de Apariciones\n");
    // Abrimos una instancia del puppeteer y accedemos a la url de github/topic
    for (var i = 0; i < 20; i++) {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      const response = await page.goto(url_base + tiobe_github[i]);
      const body = await response.text();

      // Creamos una instancia del resultado devuelto por puppeter para parsearlo con jsdom
      const {
        window: { document },
      } = new jsdom.JSDOM(body);

      document.querySelectorAll(".h3").forEach(function (element) {
        valor = parseInt(element.textContent.replace(",", "").match(reg)[0]);
        nro_apariciones.push(valor);  
        writeStream.write(`${tiobe_lenguajes[count]}|${valor}\n`);
        count++;
      }),
        // Cerramos el puppeteer
        await browser.close();
    }

    var valor_maximo = Math.max(...nro_apariciones);
    var valor_minimo = Math.min(...nro_apariciones);
    var rating_github = [];

    nro_apariciones.forEach(function (element, i) {
      var rating = ((element - valor_minimo) / (valor_maximo - valor_minimo)) * 100;
      rating_github.push({
        lenguaje: tiobe_lenguajes[i],
        rating: rating,
        nro_apariciones: nro_apariciones[i],
      });
    });

    Array.prototype.sortBy = function (p) {
      return this.slice(0).sort(function (a, b) {
        return a[p] < b[p] ? 1 : a[p] > b[p] ? -1 : 0;
      });
    };

    rating_github.sortBy("rating");
    var dictstring = JSON.stringify(rating_github.sortBy("rating"));
    fs.writeFile("grafica.json", dictstring, function (err, result) {
      if (err) console.log("error", err);
    });

    console.log(rating_github.sortBy("rating"));

  } catch (error) {
    console.error(error);
  }
})();
