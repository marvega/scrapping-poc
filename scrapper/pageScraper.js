const Producto = require('../model/producto');


const scraperObject = {
    url: 'https://pcfactory.cl',
    async scraper(browser) {
        let data = [];
        let page = await browser.newPage();
        console.log(`Navigating to ${this.url}...`);
        // Navigate to the home page
        await page.goto(this.url);
        // get all PCF categories
        let pcfLinks = await page.$$eval('.categoria', (links) => {
            links = links.map(a => a.href);
            return links;
        });

        for (link in pcfLinks) {
            let url = pcfLinks[link];
            data.push(url);

            await page.goto(url);
            await page.waitForSelector('.contenedor-calugas');

            //first page for now
            let categoryProds = await page.$$eval('.center-caluga > a', (links) => {
                links = links.map(a => a.href);
                return links;
            });

            for (link in categoryProds) {
                let url = categoryProds[link];
                await page.goto(url);
                await page.waitForSelector('.contenedor-calugas');



                let sku = await page.$eval('.ficha_titulos > p > span', (s) => {
                    if (!s) return 0;
                    s = s.textContent.replace(/(\r\n\t|\n|\r|\t)/gm, "");
                    return s;
                });



                let name = await page.$eval('.ficha_titulos > h1', (s) => {
                    s = s.textContent.replace(/(\r\n\t|\n|\r|\t)/gm, "");
                    return s;
                });

                let precio_efectivo = await page.$eval('.ficha_precio_efectivo > h2', (s) => {
                    if (!s) return 0;
                    s = s.textContent.replace(/(\r\n\t|\n|\r|\t)/gm, "").replace(/[$.]/g, '');
                    return Number(s);
                });

                let precio_normal = await page.$eval('.ficha_precio_normal > h2', (s) => {
                    if (!s) return 0;
                    s = s.textContent.replace(/(\r\n\t|\n|\r|\t)/gm, "").replace(/[$.]/g, '');
                    return Number(s);
                });

                let precio_referencial = 0;
                try {
                    let precio_referencial = await page.$eval('.ficha_precio_referencial > h2', (s) => {
                        if (!s) return 0;
                        s = s.textContent.replace(/(\r\n\t|\n|\r|\t)/gm, "").replace(/[$.]/g, '');
                        return Number(s);
                    });
                } catch (e) {}


                let prod = new Producto({
                    sku,
                    name,
                    precio_efectivo,
                    precio_normal,
                    precio_referencial
                })

                try {

                    await prod.save();

                    // await prod.findOneAndUpdate({ sku: prod.sku }, {
                    //     name: prod.name,
                    //     precio_efectivo: prod.precio_efectivo,
                    //     precio_normal: prod.precio_normal,
                    //     precio_referencial: prod.precio_referencial
                    // }, {
                    //     upsert: true
                    // });
                } catch (err) {
                    if (err.name === 'MongoError' && err.code === 11000) {
                        console.log('Prod ya existe');
                    }
                }

                console.log(prod);
                data.push(prod);
            }

        }

        return data

    }
}

module.exports = scraperObject;