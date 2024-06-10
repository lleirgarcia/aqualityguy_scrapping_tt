const { MongoClient } = require('mongodb');

class MongoOperations {
    constructor() {
        this.uri = "mongodb://localhost:27017";
        this.client = new MongoClient(this.uri, { useNewUrlParser: true, useUnifiedTopology: true });
        this.database = null;
    }

    async connect() {
        await this.client.connect();
        this.database = this.client.db("socialMedia");
    }

    async insertComments(commentsData) {
        if (!this.database) {
            console.log("Database not connected!");
            return;
        }
        const commentsCollection = this.database.collection("tikTokComments");
        await commentsCollection.insertMany(commentsData);
    }

    async close() {
        await this.client.close();
    }
}

module.exports = MongoOperations;
