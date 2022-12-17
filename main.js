const { departments } = require('./src/sitemap-department');
const { categories } = require('./src/sitemap-categories');
const { department_x_category_y } = require("./src/sitemap-department-x-category-y");
const { inputWebsite } = require('./src/helps/args');
const { URL } = require('./config');
const { root } = require('./src/sitemap-root');
const { index } = require('./src/sitemap');

async function sitemapgenerator() {
    const website = inputWebsite() || URL;
    await departments(website);
    await categories(website);
    await department_x_category_y(website);
    await root(website);
    await index();
};

sitemapgenerator();