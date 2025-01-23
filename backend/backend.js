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

        const page=await browser.newPage();
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
        await page.goto(url);
        
        //  console.log(await page.content());
         const data = await page.evaluate(() => {

            const precioElement = document.querySelector(".a-offscreen");
            const srcImagen=document.querySelector("#landingImage").getAttribute('src');
            const listaDescripcion=document.querySelectorAll(".a-unordered-list");
            const arrayLista=Array.from(listaDescripcion).map((elemento)=>({
                desc: elemento.querySelector('.a-spacing-mini')?.innerText || 'Sin Titulo'
            }));
            return { precio: precioElement ? precioElement.textContent : null,
                    src: srcImagen? srcImagen:null,
                desc:arrayLista};
         });
         


        
         
    

     
        // const productos = await page.evaluate(() => {
        //     // Seleccionar todos los productos
        //     const elementos = document.querySelectorAll('.product_pod');
      
        //     return Array.from(elementos).map(producto => ({
        //       titulo: producto.querySelector('h3 a')?.innerText || 'Sin título',
        //       precio: producto.querySelector('.price_color')?.innerText || 'Sin precio',
        //       disponibilidad: producto.querySelector('.instock.availability')?.innerText.trim() || 'Sin información',
        //     }));
        //   });
      
          await browser.close();
          console.log(data);
          return data;
        
    } catch (error) {
        console.error("😣",error)
    }
}

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})