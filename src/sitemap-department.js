const { userDB, passwordDB, nameDB, hostDB, path } = require('../config');
let mysql  = require('mysql');
let fs = require('fs');
const { date } = require('./helps/date');

async function departments (website) {
    let connection = mysql.createConnection({
        host: hostDB,
        user: userDB,
        password: passwordDB,
        database: nameDB
    });

    const dir = `${path}/sitemaps`;
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }

    let writeStream = fs.createWriteStream(`${path}/sitemaps/sitemap-departments.xml`);
    writeStream.write('<?xml version="1.0" encoding="utf-8" standalone="yes" ?>');
    writeStream.write('\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
    let query = connection.query('SELECT DISTINCT departmentid FROM mpproducts');
    query
        .on('error', function(err) {
            console.log(err);
            connection.end();
            throw new Error('Connection with db is wrong');
        })
        .on('result', function(row) {
            connection.pause();

            writeStream.write('\n  <url>\n');
            const escapedUrl = website + '/product-search-result-grid?search_text=&amp;search_department=' + row.departmentid;
            writeStream.write(`    <loc>${escapedUrl}</loc>\n`);
            writeStream.write(`    <lastmod>${date()}</lastmod>\n`);
            writeStream.write(`    <changefreq>monthly</changefreq>\n`);
            writeStream.write(`    <priority>0.9</priority>\n`);
            writeStream.write('  </url>');

            connection.resume();
        })
        .on('end', function() {
            writeStream.write('\n</urlset>');
            writeStream.end();
            connection.end();
        });
}

module.exports = { departments };