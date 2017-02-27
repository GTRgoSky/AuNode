var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var models = require('./');
var $ = require('../common');
 
var model = {};
var schema = {};

$.each(models, function(k, v){
    schema[k] = new Schema(v);
    model[k] = mongoose.model(k, schema[k], k);// 1:集合名称 2:实例 3:表名称
});

module.exports = {
    getModel: function (type) {
        return model[type];
    },
    // getSchema: function(type){
    //     return schema[type];
    // }
};