var aws = require('aws-sdk');
aws.config.update({region: 'us-east-1'});
var async = require('async');
var docClient = new aws.DynamoDB.DocumentClient();
var ddb = new aws.DynamoDB();
var md5 = require('md5');


function hash(password) {
    return md5(password);
}

exports.handler = function(event, context, callback) {



    var email = event.body.email;
    var password = event.body.password;

    if (email === undefined || email === null || email === '') {
        var error = new Error("email is either null or undefined");
        return callback(error);
    }

    if (password === undefined || password === null || password === '') {
        var error = new Error("password is either null or undefined");
        return callback(error);
    }

    var params = {
        TableName : 'splooge_users',
        Key : { "email" : email }
    }

    docClient.get(params, function(err, user_item) {
        if (err) {
            return callback(err);
        } else {
            var user = user_item['Item'];
            if (user != undefined) {
                var hashed_password = hash(password);
                if ( hashed_password === user.password) {
                    var res = { user : user};
                    return callback(null, res);
                } else {
                    var error = new Error("Wrong password");
                    return callback(error);
                }

            }
            else {
                var error = new Error("User with that email doesn't exist");
                return callback(error);
            }
        }
    });

};




