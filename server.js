var express = require('express');
var app = express();
var PORT = process.env.PORT || 3000;
var todos = [{
    id: 1
    , description: 'Talking to my mom'
    , completed: false
}, {
    id: 2
    , description: 'Have dinner'
    , completed: false
}, {
    id: 3
    , description: 'Have fun'
    , completed: true
}];
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
app.listen(PORT, function () {
    console.log('server started at ' + PORT + '....');
})