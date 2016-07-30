var express = require('express');
var app = express();
var bodyParser = require('body-parser');

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
app.get('/todos/:id', function (req, res) {
    var todoid = parseInt(req.params.id,10);
    var found;
    todos.forEach(function (todo) {
        if (todo.id === todoid) {
            found = todo;
        }
    });
    if (!found) {
        res.status(404).send();
    } else {
        res.json(found);
    }
});

app.post('/todos', function(req, res){
    var body = req.body;
    //console.log('description..');
    body.id = todonextId++;
    todos.push(body);
    res.json(body);
    
});


app.listen(PORT, function () {
    console.log('server started at ' + PORT + '....');
})