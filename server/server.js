const express = require("express");
const http = require("http");
const WebSocket = require ('ws');
const ws = new WebSocket ('wss://ws.bitstamp.net');
const app = express();
const port = process.env.PORT || 4001;
const index = require("./routes/index");
const socketIo = require("socket.io");
app.use(index);
const server = http.createServer(app);

let askQty = []
let askPrice = []
let bidQty = []
let bidPrice = []

const io = socketIo(server,{cors:{origin:"*"}});


ws.on('open', function open() {
    ws.send(JSON.stringify({
        "event": "bts:subscribe",
        "data": {
            "channel": "order_book_btcusd"
        }
    }));
 });
ws.on('message', async (data) => {
          try {
            if(data !== "Connected"){
                // console.log(data)
             const allData = await JSON.parse(data)
                extractData(allData)
            }
          } catch (error) {
              console.log(error)
          }
 });

const extractData = (data) => {

   const bids = data.data.bids
   const asks = data.data.asks

   if (bids !== undefined){
    bids.forEach(element => {
            bidPrice.push(element[0])
            bidQty.push(element[1])
     });
   }

   if (asks !== undefined){
    asks.forEach(element => {
        askPrice.push(element[0])
        askQty.push(element[1])
      });
   }
}

io.on("connection", socket => {
  console.log("New client connected");
    getApiAndEmit(socket);
  

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

const getApiAndEmit = async socket => {
  try {
    socket.emit("FromAPI", [{
    "bidQty":bidQty.slice(Math.max(bidPrice.length - 10 ,0)),
    "bidPrice":bidPrice.slice(Math.max(bidPrice.length - 10 ,0)),
    "askQty":askQty.slice(Math.max(bidPrice.length - 10 ,0)),
    "askPrice":askPrice.slice(Math.max(bidPrice.length - 10 ,0))
}])
   
  } catch (error) {
    console.error(`Error: ${error.code}`);
  }
};

server.listen(port, () => console.log(`Wee listen to port ${port}`));