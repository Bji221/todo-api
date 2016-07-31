var bcrypt = require('bcrypt');
var _ = require('underscore');
module.exports = function (sequelize, DataTypes) {
    var user =  sequelize.define('user', {
        email: {
            type: DataTypes.STRING
            , allowNull: false
            , unique: true
            , validate: {
                isEmail: true
            }
        }
        , salt: {
            // to make the hash different even if you have same password strings
            type: DataTypes.STRING
        }
        , password_hash: {
            type: DataTypes.STRING
        }
        , password: {
            //we will have password but wont be saved on db
            type: DataTypes.VIRTUAL
            , allowNull: false
            , validate: {
                len: [5, 20]
                    //look for numbers and special characters validation
            }
            , set: function (value) {
                var salt = bcrypt.genSaltSync(10);
                var hashedPassword = bcrypt.hashSync(value, salt);
                this.setDataValue('password', value);
                this.setDataValue('salt', salt);
                this.setDataValue('password_hash', hashedPassword);
            }
        }
    }, {
        hooks: {
            beforeValidate: function (user, options) {
                //first name - trim spaces,
                // age , etc
                if (typeof user.email == 'string') {
                    user.email = user.email.toLowerCase();
                }
            }
        }
        , classMethods: {
            authenticate: function (body) {
                return new Promise(function (resolve, reject) {
                    if (typeof body.email === 'string' && typeof body.password === 'string') {
                        user.findOne({
                            where: {
                                email: body.email
                            }
                        }).then(function (user) {
                            if (!user || !bcrypt.compareSync(body.password, user.get('password_hash'))) {
                                //authentication is possible but failed! like a bad email it failed
                                return reject();
                            }
                           return resolve(user);
                            //res.json(user.toPublicJSON());
                        }).catch(function (e) {
                            return reject();
                            //res.status(500).send(e);
                        });
                    }
                    else {
                       return reject();
                        //res.status(400).send();
                    }
                });
            }
        }
        , instanceMethods: {
            //instance method            
            toPublicJSON: function () {
                var json = this.toJSON();
                return _.pick(json, 'id', 'email');
            }
        }
    });
    return user;
};