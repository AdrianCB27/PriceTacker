const puppeteer=require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());
const express = require('express');
const cors = require('cors');
const { get } = require('jquery');
const app = express();
app.use(express.json()); //Para que funcione el post
app.use(cors()); 
app.get('/api/:url', async (request, response) => {
    const urlCodificada = request.params.url;
    const url = decodeURIComponent(urlCodificada); //descodificamos la url
    console.log(url);
    if (url) {
        const objetoDatos=await primerScraping(url)
        response.status(200);
        response.json(objetoDatos);
    } else {
        response.status(404).end();
    }
});

/**
 * Funcion que hace el scraping de la pagina de amazon del producto que se le pasa por parámetro
 * @param {string} url 
 * @returns  objeto con los datos del producto para manipular en el frontend
 */
async function primerScraping(url) {
    try {

        const browser = await puppeteer.launch({ headless: true });

        const page = await browser.newPage();
        //por si acaso 
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
        await page.goto(url);
        
        const data = await page.evaluate(() => {

            let nombreProducto=document.querySelector('#productTitle').innerText.trim();

            let stock=document.querySelector('.a-size-medium.a-color-success').innerText.trim();
            
            const precioElement = document.querySelector(".a-offscreen");
            const srcImagen = document.querySelector("#landingImage").getAttribute('src');
            const listaDescripcion = document.querySelector("ul.a-unordered-list.a-vertical.a-spacing-mini"); 
            const arrayLista = Array.from(listaDescripcion.querySelectorAll('li')).map((elemento) => ({
                desc: elemento.innerText || 'Sin Titulo'
            
            }));

            return {
                precio: precioElement ? precioElement.textContent : null,
                src: srcImagen ? srcImagen : null,
                desc: arrayLista,
                nombre:nombreProducto ?nombreProducto :null,
                stock: stock!='En stock' ?'Sin stock':stock,
            };
        });

        await browser.close();
        // console.log(data);
        return data;
        
    } catch (error) {
        console.error("😣", error);
    }
}

app.get('/api2/:nombreProducto', async (request, response) => {
    const nombreProducto = request.params.nombreProducto;
    console.log(nombreProducto);
    if (nombreProducto) {
        const objetoDatos=await segundoScraping(nombreProducto)
        response.status(200);
        response.json(objetoDatos);
    } else {
        response.status(404).end();
    }
});

async function segundoScraping(nombreProducto) {
    try {
        const browser = await puppeteer.launch({ headless: true });

        const page = await browser.newPage();
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
        await page.goto("https://www.amazon.es/s?k="+nombreProducto);
        await page.waitForSelector('[role="listitem"]'); //esperamos a que cargue la lista de productos
        const data = await page.evaluate(() => {
            const listItems = Array.from(document.querySelectorAll('[role="listitem"]')).slice(1, 6);
            return listItems.map(item => {
                const title = item.querySelector('a h2 span').innerText;
                const urlImagen = item.querySelector('img').getAttribute('src');
                let price = (item.querySelector('.a-price-whole') ? item.querySelector('.a-price-whole').innerText : 'No disponible') + (item.querySelector('.a-price-fraction') ? item.querySelector('.a-price-fraction').innerText : '');
                price = price.replace(/\n/g, ''); // el precio viene con un \n al final asi que lo quitamos
                price=price.concat('€'); //añadimos el simbolo del euro
                const url = "https://www.amazon.es" + item.querySelector('a').getAttribute('href');
                return { title, price, url,urlImagen };
            });
            
        });
        browser.close();
        console.log(data);
        return data
        
    } catch (error) {
        console.error("😣", error);
        
    }
    
}
/**
 * Establece el puerto y se pone a escuchar peticiones
 */
const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})