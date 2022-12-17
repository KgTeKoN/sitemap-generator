const { userDB, passwordDB, nameDB, hostDB, path } = require('../config');
let mysql  = require('mysql');
let fs = require('fs');
const { date } = require('./helps/date');
const {category} = require("./helps/departmantsCategories");

async function department_x_category_y (website) {
    const departCategory = await category();

    const dir = `${path}/sitemaps`;
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }

    let sitemapPart = 1;
    let countURL = 0;
    let writeStream = fs.createWriteStream(`${path}/sitemaps/sitemap-department-x-category-y_part_${sitemapPart}.xml`);
    writeStream.write('<?xml version="1.0" encoding="utf-8" standalone="yes" ?>');
    writeStream.write('\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"');
    writeStream.write('\n        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">');
    for (const depar in departCategory) {
        for (const categ of departCategory[depar]) {
            let connection = mysql.createConnection({
                host: hostDB,
                user: userDB,
                password: passwordDB,
                database: nameDB
            });
            await new Promise ((resolve, reject) => {
                const query = connection.query(`SELECT productid, photos FROM mpproducts WHERE departmentid = ${depar} AND categoryid = ${categ}`);
                query
                    .on('error', function (err) {
                        console.log(err);
                        connection.end();
                        throw new Error('Connection with db is wrong');
                    })
                    .on('result', function (row) {
                        connection.pause();

                        let photo = '';
                        if (row.photos) {
                            photo = row.photos.replace(/[\s,\",\[,\],\,,\']/g,'').split('uploads/')
                        }

                        countURL++;
                        writeStream.write('\n  <url>\n');
                        const escapedUrl = website + '/show-single-product?product_id=' + row.productid;
                        writeStream.write(`    <loc>${escapedUrl}</loc>\n`);
                        writeStream.write(`    <lastmod>${date()}</lastmod>\n`);
                        if (photo) {
                            for (const image of photo) {
                                if (image) {
                                    writeStream.write(`    <image:image>\n`);
                                    writeStream.write(`      <image:loc>${website}/uploads/${image}</image:loc>\n`);
                                    writeStream.write(`    </image:image>\n`);
                                }
                            }
                        }
                        writeStream.write(`    <changefreq>monthly</changefreq>\n`);
                        writeStream.write(`    <priority>0.9</priority>\n`);
                        writeStream.write('  </url>');
                        if (countURL === 40000) {
                            writeStream.write('\n</urlset>');
                            writeStream.end();
                            sitemapPart++;
                            writeStream = fs.createWriteStream(`${path}/sitemaps/sitemap-department-x-category-y_part_${sitemapPart}.xml`);
                            writeStream.write('<?xml version="1.0" encoding="utf-8" standalone="yes" ?>');
                            writeStream.write('\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"');
                            writeStream.write('\n        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">');
                            countURL = 0;
                        }

                        connection.resume();
                    })
                    .on('end', function () {
                        connection.end();
                        resolve(true)
                    });
            })
        }
    }
    writeStream.write('\n</urlset>');
    writeStream.end();
}

module.exports = { department_x_category_y };