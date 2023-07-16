const {MongoClient} = require('mongodb');

// connect strings
const LOCAL_URL = 'mongodb://hu:C8wD48@127.0.0.1:38148';
const REMOTE_URL = 'mongodb://alaherus:@C8wD48$@195.80.51.195:38148';

const monClient = new MongoClient(LOCAL_URL);


const Insert = async (arg) => {
    try {
        await monClient.connect()
 
        const btcusd = monClient.db('bybit').collection('btcusd');
        await btcusd.insertOne(arg);
 
    } catch (e) {
        console.log(e)
    }
 }


//--------------------------------------------------------
module.exports = { monClient, Insert };