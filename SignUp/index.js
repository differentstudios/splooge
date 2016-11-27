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


    var name = event.body.name;
    var email = event.body.email;
    var password = event.body.password;

    if (name === undefined || name === null || name === '') {
        var error = new Error("Name is either null or undefined");
        return callback(error);
    }

    if (email === undefined || email === null || email === '') {
        var error = new Error("Name is either null or undefined");
        return callback(error);
    }

    if (password === undefined || password === null || password === '') {
        var error = new Error("Name is either null or undefined");
        return callback(error);
    }

    var user = {
        name : name,
        email : email,
        password : hash(password)
    };

    var params = {
        TableName : 'splooge_users',
        Item : user
    }

    docClient.put(params, function(err) {
        if (err) {
            return callback(err);
        } else {
            return callback(null, user);
        }
    });

};




