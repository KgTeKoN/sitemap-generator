let fs = require('fs');
const { date } = require('./helps/date');
const { category } = require("./helps/departmantsCategories");
const { path } = require('../config');

async function categories (website) {
    const departCategory = await category();

    const dir = `${path}/sitemaps`;
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }

    let writeStream = fs.createWriteStream(`${path}/sitemaps/sitemap-categories.xml`);
    writeStream.write('<?xml version="1.0" encoding="utf-8" standalone="yes" ?>');
    writeStream.write('\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
    for (const depar in departCategory) {
        for (const categ of departCategory[depar]) {
            writeStream.write('\n  <url>\n');
            let escapedUrl = website + '/product-search-result-grid?search_text=&amp;search_department=' + depar + '&amp;filter_category=' + categ;
            writeStream.write(`    <loc>${escapedUrl}</loc>\n`);
            writeStream.write(`    <lastmod>${date()}</lastmod>\n`);
            writeStream.write(`    <changefreq>monthly</changefreq>\n`);
            writeStream.write(`    <priority>0.9</priority>\n`);
            writeStream.write('  </url>');
        }
    }

    writeStream.write('\n</urlset>');
    writeStream.end();
}

module.exports = { categories };