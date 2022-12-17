const mysql = require("mysql");
const {hostDB, userDB, passwordDB, nameDB} = require("../../config");

async function depart () {
    let connection = mysql.createConnection({
        host: hostDB,
        user: userDB,
        password: passwordDB,
        database: nameDB
    });

    const sqlquery = 'SELECT DISTINCT departmentid FROM mpproducts'
    const result = await new Promise((res, rej) => {
        connection.query({
            sql: sqlquery,
            value: []
        }, function (err, result) {
            if (err) {
                connection.end();
                rej(err)
            }
            res(result.map(el => '' + el.departmentid));
            connection.end();
        });
    })

    return result
}

async function category () {
    const departments = await depart();

    const categories = {};
    for (const key of departments) {
        let connection = mysql.createConnection({
            host: hostDB,
            user: userDB,
            password: passwordDB,
            database: nameDB
        });

        const sqlquery = 'SELECT DISTINCT categoryid FROM mpproducts WHERE departmentid = ' + key;
        let result = await new Promise((resolve, reject) => {
            connection.query({
                sql: sqlquery,
                value: []
            }, function (err, data) {
                if (err) {
                    connection.end();
                    reject(err)
                }
                const categoryArray = data.map(el => {
                    if (el && el.categoryid !== undefined) {
                        return el.categoryid
                    }
                })
                resolve(categoryArray);
                connection.end();
            });
        })
        categories[key] = result;
    };

    return categories
}

module.exports = { category }