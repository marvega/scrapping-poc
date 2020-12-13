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

                let name = await page.$eval('.ficha_titulos > h1', (titulo) => {
                    console.log(titulo);
                    titulo = titulo.textContent.replace(/(\r\n\t|\n|\r|\t)/gm, "");
                    console.log(titulo);
                    return titulo;
                });



            }

        }

        return data

    }
}

module.exports = scraperObject;