const { path } = require('../config');
const fs = require("fs");
const { date } = require("./helps/date");
const { getFiles } = require("./helps/getFiles");

async function index () {
    const dir = `${path}/sitemaps`;
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }

    const files = await getFiles(dir);
    let writeStream = fs.createWriteStream(`${path}/sitemaps/sitemap.xml`);
    writeStream.write('<?xml version="1.0" encoding="utf-8" standalone="yes" ?>');
    writeStream.write('\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
    for (const file of files) {
        if(file !== 'sitemap.xml') {
            writeStream.write('\n  <sitemap>\n');
            writeStream.write(`    <loc>http://www.openmarket.ae/${file}</loc>\n`);
            writeStream.write(`    <lastmod>${date()}</lastmod>\n`);
            writeStream.write('  </sitemap>');
        }
    }
    writeStream.write('\n</sitemapindex>');
    writeStream.end();
}

module.exports = { index }