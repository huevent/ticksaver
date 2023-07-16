const { WebsocketClient } = require('bybit-api');
const {MongoClient, ObjectId} = require('mongodb');

const API_KEY = 'AfY3qvIypOj6xnScmY';
const PRIVATE_KEY = 'O4Bbv94tTghR5zTbZ2LGBggGo0XUVo68pPMB';
const BTCUSD_TICK = 100;

// connect strings
const LOCAL_URL = 'mongodb://hu:C8wD48@127.0.0.1:38148';
const REMOTE_URL = 'mongodb://alaherus:@C8wD48$@195.80.51.195:38148';

const wsConfig = {
  key: API_KEY,
  secret: PRIVATE_KEY,
  market: 'v5',
};

let prevTick = 0;
let prevTime = 0;
let fact = {};
let id = 0;

const monClient = new MongoClient(REMOTE_URL);

const dbConnect = async () => {
  try {
    await monClient.connect();
    console.log(`Успешное подключение`);
  } catch (e) {
    console.log(`Ошибка подключения к bd:
    --------------------------
    ${e}`);
  }
};

dbConnect();

const Insert = async () => {
  try {
      //await monClient.connect();
      let date = new Date(fact.ts);
      let handl = monClient.db('bybit').collection(`btcusd-${date.getMonth()}:${date.getDate()}`);
      await handl.insertOne(fact);

      //await monClient.close()

  } catch (e) {
      console.log(`Ошибка вставки документа:
      --------------------------------------
      ${e}`)
  }
}

const ws = new WebsocketClient(wsConfig);

ws.subscribeV5(['tickers.BTCUSDT'], 'spot');

ws.on('update', (data) => {
  let dp = +data.data.lastPrice * BTCUSD_TICK - prevTick;
    if(prevTick) {
      if(Math.abs(dp) > 1) {
        fact._id = new ObjectId;
        fact.ts = data.ts;
        fact.pc = +data.data.lastPrice;
        fact.dt = data.ts - prevTime;
        fact.dp = dp;
        prevTick = +data.data.lastPrice * BTCUSD_TICK;
        Insert();
       }
    } else {
      prevTick = +data.data.lastPrice * BTCUSD_TICK;
      prevTime = data.ts;
    }
  });
  
  
ws.on('open', ({ wsKey, event }) => {
    console.log('connection open for websocket with ID: ' + wsKey);
  });
  
ws.on('response', (response) => {
    console.log('response', response);
  });
  
ws.on('close', () => {
    console.log('connection closed');
  });
  
ws.on('error', (err) => {
    console.error('error', err);
  });

  