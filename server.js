var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var _ = require('underscore');

var PORT = process.env.PORT || 3000;
var todos = [];
var todonextId = 1;

//middleware to parse the incoming json
app.use(bodyParser.json());

app.get('/', function (req, res) {
    res.send('todo API root');
});
app.get('/todos', function (req, res) {
    res.json(todos);
});


/*
 * refactor with _ as it has many in built functions like for searching, etc, eg., where(, findWhere() function
 */

app.get('/todos/:id', function (req, res) {
    var todoid = parseInt(req.params.id,10);
    
    //findwhere returns one match!
    var found = _.findWhere(todos, {id:todoid});
    
    /*todos.forEach(function (todo) {
        if (todo.id === todoid) {
            found = todo;
        }
    });*/
    
    
    if (!found) {
        res.status(404).send();
    } else {
        res.json(found);
    }
});

app.post('/todos', function(req, res){
    
    var body = req.body;
        
    body = _.pick(req.body, 'description', 'completed');
    //console.log(cleanedTodo);
    /*
     * validate for correct properties, and make sure no additional prop is given in
     */
    if(!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length == 0 ){
        return res.status(400).send();
        //400 bad data
    }
    
    body.description = body.description.trim();
    
    body.id = todonextId++;
    todos.push(body);
    res.json(body);
    
});


//Delete todos/:id

app.delete('/todos/:id', function(req, res){
    
    var todoid = parseInt(req.params.id, 10);
    var matchedTodo = _.findWhere(todos, {id:todoid});
    
    if(!matchedTodo ){
        res.status(404).json({"error": "no todo found with given id"});
    } else{
        todos = _.without(todos, matchedTodo);
        res.json(matchedTodo);
        //json sends 200
    }
});



app.listen(PORT, function () {
    console.log('server started at ' + PORT + '....');
})