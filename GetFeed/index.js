var aws = require('aws-sdk');
aws.config.update({region: 'us-east-1'});
var async = require('async');
var docClient = new aws.DynamoDB.DocumentClient();
var ddb = new aws.DynamoDB();
var md5 = require('md5');


function hash(password) {
    return md5(password);
}

function genRand() {
    return Math.floor(Math.random()*89999+10000);
}

function generateUID() {
    return genRand().toString() + genRand().toString();
}

function getDateTime() {

    var date = new Date();

    var year = date.getFullYear();

    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;

    var day  = date.getDate();
    day = (day < 10 ? "0" : "") + day;

    return month + "/" + day + "/" + year;

}


exports.handler = function(event, context, callback) {

    var params = {
        TableName: "splooge_posts"
    };

    docClient.scan(params, function(err, data) {
        if (err) {
            return callback(err);
        }
        else {
            console.log(data);
            return callback(null, data.Items);
        }
    });

};




