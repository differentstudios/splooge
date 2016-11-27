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


    var post_id = event.query.post_id;

    if (post_id === undefined || post_id === null || post_id === '') {
        var error = new Error("post_id is either null or undefined");
        return callback(error);
    }

    var params = {
        TableName: "splooge_posts",
        Key: { post_id : post_id }
    };

    docClient.get(params, function(err, data) {
        if (err) {
            return callback(err);
        }
        else {

            console.log(data);
            post = data['Item'];
            //get comments now 
            if ( post === undefined) {
                var error = new Error("wrong post id");
                return callback(error);
            }
            else  {
                params = {
                    TableName : 'splooge_comments',
                    IndexName : "post_ide_index",
                    KeyConditionExpression: "post_id = :post_id",
                    ExpressionAttributeValues: {
                        ":post_id" : post_id
                    }
                }

                docClient.query(params, function(err, comment_items){
                    if (err) {
                        return callback(err)
                    } else {
                        var comments = comment_items['Items'];
                        post.comments = comments;
                        return callback(null, post);
                    }
                });
            }
        }
    });

};




