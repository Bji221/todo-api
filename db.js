/*
 * load all the modules in sequelize and return the db to server .js
 */
var Sequelize = require('sequelize');
var env = process.env.NODE_ENV || 'development';
var sequelize;

if (env === 'production') {
    //this is true only when in production - heroku
    sequelize = new Sequelize(process.env.DATABASE_URL, {
        'dialect' : 'postgres'
    });
}
else {
    sequelize = new Sequelize(undefined, undefined, undefined, {
        //'dialect' : 'sqlite', 
        'dialect': 'sqlite', //use this for heroku
        'storage': __dirname + '/data/dev-todo-api.sqlite'
    });
}
var db = {};
/*
 * load in sequelize models from separate file
 */
db.todo = sequelize.import(__dirname + '/models/todo.js');
db.user = sequelize.import(__dirname + '/models/user.js');

db.sequelize = sequelize;
db.Sequelize = Sequelize;
module.exports = db;