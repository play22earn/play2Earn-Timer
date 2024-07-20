const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config({ path: __dirname + "/.env" });
const app = express();
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const httpServer = http.createServer(app);
const allroutes = require("./controller/index");
const moment = require("moment");
const soment = require("moment-timezone");
const allRoutes = require("./routes/Routes");
const { functionToreturnDummyResult } = require("./helper/adminHelper");
const { default: axios } = require("axios");

const io = new Server(httpServer, {
  cors: {
    origin: "*",
    credentials: true,
    optionSuccessStatus: 200,
  },
});
const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};
const PORT = process.env.PORT || 2000;
app.use(cors(corsOptions));

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

app.use("/api/v1", allRoutes);
io.on("connection", (socket) => {});

let x = true;
let trx = true;

if (x) {
  // generateAndSendMessage();
  console.log("Waiting for the next minute to start...");
  const now = new Date();
  const secondsUntilNextMinute = 60 - now.getSeconds();
  console.log(
    "start after ",
    moment(new Date()).format("HH:mm:ss"),
    secondsUntilNextMinute
  );
  setTimeout(() => {
    // allroutes.generatedTimeEveryAfterEveryOneMinTRX(io);
    generatedTimeEveryAfterEveryOneMinTRX();
    allroutes.generatedTimeEveryAfterEveryOneMin(io);
    allroutes.generatedTimeEveryAfterEveryThreeMin(io);
    allroutes.generatedTimeEveryAfterEveryFiveMin(io);
    x = false;
  }, secondsUntilNextMinute * 1000);
}

if (trx) {
  const now = new Date();
  const nowIST = soment(now).tz("Asia/Kolkata");

  const currentMinute = nowIST.minutes();
  const currentSecond = nowIST.seconds();

  const minutesRemaining = 30 - currentMinute - 1;
  const secondsRemaining = 60 - currentSecond;

  const delay = (minutesRemaining * 60 + secondsRemaining) * 1000;
  console.log(minutesRemaining, secondsRemaining, delay);

  setTimeout(() => {
    allroutes.generatedTimeEveryAfterEveryThreeMinTRX(io);
    allroutes.generatedTimeEveryAfterEveryFiveMinTRX(io);
    trx = false;
  }, delay);
}
const generatedTimeEveryAfterEveryOneMinTRX = () => {
  //  let oneMinTrxJob = schedule.schedule("* * * * * *", function () {
  setInterval(() => {
    const currentTime = new Date();
    const timeToSend =
      currentTime.getSeconds() > 0
        ? 60 - currentTime.getSeconds()
        : currentTime.getSeconds();
    io.emit("onemintrx", timeToSend);
    if (timeToSend === 9) {
      const datetoAPISend = parseInt(new Date().getTime().toString());
      const actualtome = soment.tz("Asia/Kolkata");
      const time = actualtome;
      // .add(5, "hours").add(30, "minutes").valueOf();
      setTimeout(async () => {
        const res = await axios
          .get(
            `https://apilist.tronscanapi.com/api/block`,
            {
              params: {
                sort: "-balance",
                start: "0",
                limit: "20",
                producer: "",
                number: "",
                start_timestamp: datetoAPISend,
                end_timestamp: datetoAPISend,
              },
            },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          )
          .then(async (result) => {
            if (!result?.data?.data?.[0]) {
              const obj = result.data.data?.[0];
              allroutes.sendOneMinResultToDatabase(time, obj);
            } else {
              allroutes.sendOneMinResultToDatabase(
                time,
                functionToreturnDummyResult(
                  Math.floor(Math.random() * (4 - 0 + 1)) + 0
                )
              );
            }
          })
          .catch((e) => {
            console.log("error in tron api");
            allroutes.sendOneMinResultToDatabase(
              time,
              functionToreturnDummyResult(
                Math.floor(Math.random() * (4 - 0 + 1)) + 0
              )
            );
          });
      }, [4000]);
    }
  }, 1000);

  //  });
};

httpServer.listen(PORT, () => {
  console.log("Server listening on port", PORT);
});
