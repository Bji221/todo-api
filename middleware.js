module.exports = function (db) {
    /*this takes in the token generated. db is passed in*/
    return {
        //checks for the existence of the token 
        requireAuthentication: function (req, res, next) {
            console.log('midd auth!');
            var token = req.get('Auth');
            console.log('token--'+token)
            //get the user with token
            db.user.findByToken(token).then(
                function(user){
                    req.user = user;
                    console.log(user);
                    next();
                }, function(){
                    res.status(401).send();
                }
            );
        }
    };
};
                
            