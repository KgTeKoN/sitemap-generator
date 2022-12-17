const { path } = require('../config');
const fs = require("fs");
const { date } = require("./helps/date");
const { getAllLinks } = require("./helps/otherLinks");

async function root (website) {
    const dir = `${path}/sitemaps`;
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
    const links = await getAllLinks();
    let writeStream = fs.createWriteStream(`${path}/sitemaps/sitemap-root.xml`);
    writeStream.write('<?xml version="1.0" encoding="utf-8" standalone="yes" ?>');
    writeStream.write('\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
    writeStream.write('\n  <url>\n');
    writeStream.write(`    <loc>${website}</loc>\n`);
    writeStream.write(`    <lastmod>${date()}</lastmod>\n`);
    writeStream.write(`    <changefreq>monthly</changefreq>\n`);
    writeStream.write(`    <priority>1</priority>\n`);
    writeStream.write('  </url>');
    for (const key of links) {
        writeStream.write('\n  <url>\n');
        if (key.slice(0, 4) === 'http') {
            writeStream.write(`    <loc>${key}</loc>\n`);
        } else {
            writeStream.write(`    <loc>${website}${key}</loc>\n`);
        }
        writeStream.write(`    <lastmod>${date()}</lastmod>\n`);
        writeStream.write(`    <changefreq>monthly</changefreq>\n`);
        writeStream.write(`    <priority>0.9</priority>\n`);
        writeStream.write('  </url>');
    }
    writeStream.write('\n</urlset>');
    writeStream.end();
}

module.exports = { root }