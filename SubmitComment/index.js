var aws = require('aws-sdk');
aws.config.update({region: 'us-east-1'});
var async = require('async');
var docClient = new aws.DynamoDB.DocumentClient();
var ddb = new aws.DynamoDB();
var md5 = require('md5');

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


    var post_id = event.body.post_id;
    var comment_text = event.body.comment_text;
    var comment_id = generateUID();
    var creation_date = getDateTime();
    var comment_by = event.body.comment_by; 

    if (post_id === undefined || post_id === null || post_id === '') {
        var error = new Error("post_id is either null or undefined");
        return callback(error);
    }

    if (comment_text === undefined || comment_text === null || comment_text === '') {
        var error = new Error("comment_text is either null or undefined");
        return callback(error);
    }

    if (comment_by === undefined || comment_by === null || comment_by === '') {
        var error = new Error("lat is either null or undefined");
        return callback(error);
    }

    var params = {
        TableName : 'splooge_users',
        Key : {'email' : comment_by}
    }

    docClient.get(params, function(err, data){
        if (err) {
            return callback(err);
        } else {
            var user = data.Item; 
            if ( user === undefined) {
                var err = new Error("Couldn't find user");
                return callback(err);
            } else {
                var name = user.name;
                var comment = {
                    post_id : post_id, 
                    comment_by : comment_by,
                    comment_text : comment_text,
                    creation_date : creation_date, 
                    comment_id : comment_id,
                    commenter_name : name
                };

                var params = {
                    TableName : 'splooge_comments',
                    Item : comment
                }

                docClient.put(params, function(err) {
                    if (err) {
                        return callback(err);
                    } else {
                        return callback(null, comment);
                    }
                });
            }
        }
    });
};




