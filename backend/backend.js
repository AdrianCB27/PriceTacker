const puppeteer=require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const $=require('jquery');
puppeteer.use(StealthPlugin());

const express = require('express');
const cors = require('cors');
const app = express();
app.use(express.json()); //Para que funcione el post
app.use(cors()); //Para que no pete el cors cuando se despliega

app.get('/api/:url', async (request, response) => {
    const urlCodificada = request.params.url;
    const url = decodeURIComponent(urlCodificada); //descodificamos la url
    console.log(url);
    if (url) {
        const objetoDatos=await scraping(url)
        response.status(200);
        response.json(objetoDatos);
    } else {
        response.status(404).end();
    }
});

async function scraping(url) {
    try {
        const browser = await puppeteer.launch({ headless: true });

        const page = await browser.newPage();
        //por si acaso 
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
        await page.goto(url);
        
        const data = await page.evaluate(() => {
            const nombreProducto=document.querySelector('#productTitle').innerText.trim();
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
                stock: stock!='En stock' ?'Sin stock':stock
            };
        });

        await browser.close();
        console.log(data);
        return data;
        
    } catch (error) {
        console.error("😣", error);
    }
}



const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})