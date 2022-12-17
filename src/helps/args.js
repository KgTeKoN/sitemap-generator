require('dotenv').config()

const getArgs = (args) => {
    const res = {};
    const [executer, file, ...rest] = args;
    rest.forEach((value, index, array) => {
        if (value.charAt(0) === '-') {
            if (index === array.length - 1) {
                res[value.substring(1)] = true;
            } else if (array[index+1].charAt(0) !== '-') {
                res[value.substring(1)] = array [index + 1];
            } else {
                res[value.substring(1)] = true;
            }
        }
    })
    return res
}

const inputWebsite = () => {
    const args = getArgs(process.argv);
    if (args.w) {
        return args.w
    }
}
module.exports = { getArgs, inputWebsite }