require('fs').readdirSync(__dirname + '/').forEach(function(file) {
if (file.match(/\.js$/) !== null && file !== 'index.js') {
    var name = file.replace('.js', '');

    name = name.split("_").map(r=>{
        return capitalizeFirstLetter(r)
    }).join("")
    exports[capitalizeFirstLetter(name)] = require('./' + file);
}
});

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}