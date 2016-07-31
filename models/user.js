var bcrypt = require('bcrypt');
var _ = require('underscore');
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('user', {
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
        , instanceMethods: {
            
                toPublicJSON: function () {
                    var json = this.toJSON();
                    return _.pick(json, 'id', 'email');
                }
            
        }
    });
}