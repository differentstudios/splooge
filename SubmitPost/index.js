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


    var post_by = event.body.post_by;
    var post_text = event.body.post_text;
    var lat = event.body.lat;
    var lon = event.body.lon;
    var post_id = generateUID();
    var creation_date = getDateTime();

    if (post_by === undefined || post_by === null || post_by === '') {
        var error = new Error("post_by is either null or undefined");
        return callback(error);
    }

    if (post_text === undefined || post_text === null || post_text === '') {
        var error = new Error("post_text is either null or undefined");
        return callback(error);
    }

    if (lat === undefined || lat === null || lat === '') {
        var error = new Error("lat is either null or undefined");
        return callback(error);
    }

    if (lon === undefined || lon === null || lon === '') {
        var error = new Error("lon is either null or undefined");
        return callback(error);
    }

    var params = {
        TableName : 'splooge_users',
        Key : {'email' : post_by}
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
                var post = {
                    post_by : post_by,
                    post_text : post_text,
                    lat : lat,
                    lon : lon,
                    post_id : post_id, 
                    creation_date : creation_date, 
                    poster_name : name
                };

                var params = {
                    TableName : 'splooge_posts',
                    Item : post
                }

                docClient.put(params, function(err) {
                    if (err) {
                        return callback(err);
                    } else {
                        return callback(null, post);
                    }
                });
            }
        }
    });

};




