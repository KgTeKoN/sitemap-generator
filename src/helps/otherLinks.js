let fs = require('fs');
const { path } = require('../../config')

function read_file(name){
    if(!fs.existsSync(name)){
        return(undefined);
    }
    try {
        const data = fs.readFileSync(name, {encoding: 'utf8'});
        return(data);
    } catch (err) {
        console.error(err);
        return(undefined);
    }
}

async function filterParser (data) {
    const result = data.split('href="').map(item => {
        let idx = item.indexOf('"');
        return item.slice(0, idx)
    }).filter(item => {
        if (item && item !== '/')
            return (
                !item.includes('product-search')
                &&
                !item.includes('DOCTYPE')
                &&
                !item.includes('Footer')
                &&
                !item.includes('#')
                &&
                !item.includes('void')
                &&
                (item.includes('.html')
                    ||
                    !item.includes('.')
                    ||
                    item.includes('http')
                )
            )
    }).map(item => {
        if((item.slice(0, 4) === 'http') || (item[0] === '/')) {
            return item
        }
        return '/' + item
    })

    return result
}

async function getAllLinks() {
    const pathname = path + '/..'
    const random_home_page = read_file(`${pathname}/html/random-home-page.html`);
    const header = read_file(`${pathname}/html/header.html`);
    const footer = read_file(`${pathname}/html/footer.html`);

    const parseHeader = await filterParser(header);
    const parseRandom = await filterParser(random_home_page);
    const parseFooter = await filterParser(footer);
    let uniqueLinks = new Set([...parseHeader, ...parseRandom, ...parseFooter]);

    return [...uniqueLinks]
}

module.exports = { getAllLinks }
