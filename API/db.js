const { MongoClient } = require('mongodb');

let db;

module.exports = {
    connectToDB: (cb) => {
        MongoClient.connect("mongodb://localhost:27017")
        .then((client) => {
            db = client.db("SmileTalk");
            return cb()
        })
        .catch(err => {
            console.log(err)
            return cb(err)
        })
    },
    getDB: () => {
        return db
    }
}