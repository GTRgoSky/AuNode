var fs = require('fs');

module.exports = function(app){

    var routeConfig = fs.readdirSync('./routes');

    for(var i = 0; i < routeConfig.length; i++){
        var item = routeConfig[i].replace('.js', '');

        if(item == 'index') item = '';
        
        app.use('/' + item, require('./routes/' + item.toLowerCase()));
    };
};
