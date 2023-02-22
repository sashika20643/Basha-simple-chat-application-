
const {MongoClient} = require('mongodb');

const uri = "mongodb+srv://sashika:DnQbd8BeR3CUcaj@cluster0.8nya5ng.mongodb.net/?retryWrites=true&w=majority";
const dbname = "chatapp";

const client = new MongoClient(uri);

async function main(){
   
try {
    // Connect to the MongoDB cluster
    await client.connect();
    console.log("Connected to database!");
    const db = client.db(dbname);
    return db;
    // Make the appropriate DB calls

} catch (e) {
    console.error(e);
}
}
module.exports=main();
