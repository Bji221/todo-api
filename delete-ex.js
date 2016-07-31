var todos = [
    {
        hey: 1
        , hello: 'abcd'
}
    , {
        hey: 2
        , hello: 'efgh'
}
            , ];

var i = -1;
todos.forEach(function(todo){
    i++;
    if(todo.hey === 2){
        todos.splice(i,1);
    }
});


console.log(todos);