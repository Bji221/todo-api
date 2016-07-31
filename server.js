var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var _ = require('underscore');
var db = require('./db.js');
var PORT = process.env.PORT || 3000;
var todos = [];
var todonextId = 1;
var bcrypt = require('bcrypt');
//middleware to parse the incoming json
app.use(bodyParser.json());
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.get('/', function (req, res) {
    res.send('todo API root');
});
app.get('/todos', function (req, res) {
    var query = req.query;
    var where = {};
    if (query.hasOwnProperty('completed') && query.completed == 'true') {
        where.completed = true;
        console.log('completed---' + where.completed);
    }
    else if (query.hasOwnProperty('completed') && query.completed == 'false') {
        where.completed = false;
    }
    if (query.hasOwnProperty('q') && query.q.length > 0) {
        where.description = {
            $like: '%' + query.q + '%'
        }
    }
    else if (query.hasOwnProperty('q') && query.q.length <= 0) {
        res.status(400).send();
    }
    db.todo.findAll({
        where: where
    }).then(function (todos) {
        if (todos) {
            res.json(todos);
        }
        else {
            res.status(404).send();
        }
    }).catch(function (e) {
        res.status(500).send();
    });
    /*var queryparams = req.query;   
     * var filteredTodos = todos;
    if (queryparams.hasOwnProperty('completed') && queryparams.completed === 'true') {
        filteredTodos = _.where(filteredTodos, {
            completed: true
        });
    }
    else if (queryparams.hasOwnProperty('completed') && queryparams.completed == 'false') {
        filteredTodos = _.where(filteredTodos, {
            completed: false
        });
    }
    else if (queryparams.hasOwnProperty('completed')) {
        return res.status(404).send();
    }
    if (queryparams.hasOwnProperty('q') && queryparams.q.length > 0) {
        filteredTodos = _.filter(filteredTodos, function (todo) {
            return todo.description.toLowerCase().indexOf(queryparams.q.toLowerCase()) > -1;
        });
    }
    res.json(filteredTodos)*/
});
/*
 * refactor with _ as it has many in built functions like for searching, etc, eg., where(, findWhere() function
 */
app.get('/todos/:id', function (req, res) {
    var todoid = parseInt(req.params.id, 10);
    db.todo.findById(todoid).then(function (todo) {
        if (todo) {
            res.status(200).send(todo.toJSON());
        }
        else {
            res.status(404).send();
        }
    }).catch(function (e) {
        res.status(500).send(e);
    });
    //findwhere returns one match!
    /*var found = _.findWhere(todos, {
        id: todoid
    });   */
    /*todos.forEach(function (todo) {
        if (todo.id === todoid) {
            found = todo;
        }
    });*/
    /*if (!found) {
        res.status(404).send();
    }
    else {
        res.json(found);
    }*/
});
app.post('/todos', function (req, res) {
    var body = req.body;
    body = _.pick(req.body, 'description', 'completed');
    db.todo.create(body).then(function (todo) {
        res.status(200).send(todo.toJSON());
    }).catch(function (e) {
        res.status(400).json(e);
    });
    //console.log(cleanedTodo);
    /*
     * validate for correct properties, and make sure no additional prop is given in
     */
    /*if (!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length == 0) {
        return res.status(400).send();
        //400 bad data
    }
    body.description = body.description.trim();
    body.id = todonextId++;
    todos.push(body);
    res.json(body);*/
});
//Delete todos/:id
app.delete('/todos/:id', function (req, res) {
    var todoid = parseInt(req.params.id, 10);
    db.todo.destroy({
        where: {
            id: todoid
        }
    }).then(function (rowsDeleted) {
        if (rowsDeleted === 0) {
            res.status(404).json({
                error: 'no todo with id'
            });
        }
        else {
            res.status(204).send();
        }
    }, function () {
        res.status(500).send();
    });
    /*var matchedTodo = _.findWhere(todos, {
        id: todoid
    });
    if (!matchedTodo) {
        res.status(404).json({
            "error": "no todo found with given id"
        });
    }
    else {
        todos = _.without(todos, matchedTodo);
        res.json(matchedTodo);
        //json sends 200
    }*/
});
app.put('/todos/:id', function (req, res) {
    var todoid = parseInt(req.params.id, 10);
    var body = _.pick(req.body, 'description', 'completed');
    var attributes = {};
    if (body.hasOwnProperty('completed')) {
        attributes.completed = body.completed;
    }
    if (body.hasOwnProperty('description')) {
        attributes.description = body.description;
    }
    /*
     * we have to use instance methods not model methods
     * model methods are run on models on db... like real time...
     * instance methods are run on fetched models...
     */
    db.todo.findById(todoid).then(function (todo) {
        if (todo) {
            return todo.update(attributes);
        }
        else {
            res.status(400).send();
        }
    }, function () {
        res.status(500).send();
    }).then(function (todo) {
        //chain for update success and failing
        res.status(200).send(todo.toJSON());
    }, function (e) {
        res.status(400).json(e);
    });
    /*var matchedTodo = _.findWhere(todos, {
        id: todoid
    });
    var body = _.pick(req.body, 'description', 'completed');
    var validAttributes = {};
    if (!matchedTodo) {
        return res.send(404).send();
    }
    if (body.hasOwnProperty('completed') && (_.isBoolean(body.completed))) {
        validAttributes.completed = body.completed;
    }
    else if (body.hasOwnProperty('completed')) {
        return res.status(400).send();
    }
    else {
        //never provided attribute
    }
    if (body.hasOwnProperty('description') && (_.isString(body.description) && body.description.trim().length > 0)) {
        validAttributes.description = body.description;
    }
    else if (body.hasOwnProperty('description')) {
        return res.status(400).send();
    }
    _.extend(matchedTodo, validAttributes);
    res.json(matchedTodo);*/
    //objects - pass by reference
});
app.post('/users', function (req, res) {
    var body = _.pick(req.body, 'email', 'password');
    db.user.create(body).then(function (user) {
        res.json(user.toPublicJSON());
    }, function (e) {
        res.status(400).send(e);
    });
});
//post users/login
app.post('/users/login', function (req, res) {
    var body = _.pick(req.body, 'email', 'password');
    if (typeof body.email === 'string' && typeof body.password === 'string') {
        db.user.findOne({
            where: {
                email: body.email
            }
        }).then(function (user) {
            if (!user || !bcrypt.compareSync(body.password, user.get('password_hash'))) {
                //authentication is possible but failed! like a bad email it failed
                return res.status(401).send();
            }
            res.json(user.toPublicJSON());
        }).catch(function (e) {
            res.status(500).send(e);
        });
    }
    else {
        res.status(400).send();
    }
});
/*
 * sync the db and start the function when the sync has no failure
 */
db.sequelize.sync( /*{force:true}*/ ).then(function () {
    app.listen(PORT, function () {
        console.log('server started at ' + PORT + '....');
    });
});