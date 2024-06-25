const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const todoRoutes = require("./routes/todos");
const moment = require("moment");
const soment = require("moment-timezone");
require("dotenv").config();
const schedule = require("node-schedule");
const { default: axios } = require("axios");
const app = express();
const httpServer = http.createServer(app);
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

app.use(cors(corsOptions));
app.use(express.json());

const PORT = process.env.PORT || 4000;

app.use("/api/v1", todoRoutes);

const job = schedule.scheduleJob("0 1 * * *", async function () {
  try {
    // Make the API call using axios
    const response = await axios.get(
      "https://admin.play2earn.space/api/wallet-income"
    );
    setTimeout(async () => {
      try {
        await axios.get("https://admin.play2earn.space/api/bet-income");
      } catch (e) {
        console.log(e);
      }
    }, 1000);

    setTimeout(async () => {
      try {
        await axios.get("https://admin.play2earn.space/api/direct-income");
      } catch (e) {
        console.log(e);
      }
    }, 3000);
  } catch (error) {
    console.error("Error:", error.message);
  }
});

let twoMinTrxJob;
let threeMinTrxJob;

const array = [
  2, 20, 2, 30, 2, 60, 10, 2, 3, 18, 2, 17, 12, 40, 10, 2, 5, 3, 2, 2, 12, 13,
  10, 2, 2, 2, 20, 50, 2, 2,
];

function generateAndSendMessage() {
  const value = Math.floor(Math.random() * array.length - 1) + 1;
  const time = 20 || array[value] || 12;
  io.emit("message", time);

  let fly_time = 0;
  let milliseconds = 0;
  let seconds = 0;

  io.emit("setloder", false);
  io.emit("isFlying", true);

  const timerInterval = setInterval(() => {
    if (milliseconds === 100) {
      seconds += 1;
      milliseconds = 0;
    }

    io.emit("seconds", `${String(milliseconds).padStart(2, "0")}_${seconds}`);
    const newTime = fly_time + 1;

    if (newTime >= time * 1000) {
      clearInterval(timerInterval);
      fly_time = 0;
      milliseconds = 0;
      seconds = 0;
    }

    milliseconds += 1;
    fly_time = newTime;
  }, 100);

  setTimeout(() => {
    io.emit("isFlying", false);
    clearInterval(timerInterval);
  }, time * 1000);

  setTimeout(() => {
    clearInterval(timerInterval);
    io.emit("setcolorofdigit", true);
  }, (5 + ((time - 5) / 5 - 0.3) * 5) * 1000);

  setTimeout(() => {
    io.emit("setcolorofdigit", false);
    io.emit("setloder", true);
  }, time * 1000 + 3000);

  setTimeout(generateAndSendMessage, time * 1000 + 8000);
}

// color prediction game time generated every 1 min
function generatedTimeEveryAfterEveryOneMin() {
  const job = schedule.scheduleJob("* * * * * *", function () {
    const currentTime = new Date();
    const timeToSend =
      currentTime.getSeconds() > 0
        ? 60 - currentTime.getSeconds()
        : currentTime.getSeconds();
    io.emit("onemin", timeToSend); // Emit the formatted time
    if (timeToSend === 3) {
      // oneMinCheckResult();
      oneMinColorWinning();
    }
  });
}
function generatedTimeEveryAfterEveryOneMinForRollet() {
  let second = 59;
  let job = schedule.scheduleJob("* * * * * *", function () {
    io.emit("oneminrollet", second); // Emit the formatted time
    if (second === 0) {
      oneMinRolletResult();
      job?.cancel();
      setTimeout(() => {
        generatedTimeEveryAfterEveryOneMinForRollet();
      }, 10000);
    } else {
      second--;
    }
  });
}

const oneMinRolletResult = async () => {
  try {
    await axios.get(`https://admin.sunlottery.fun/api/roulette-result`);
  } catch (e) {
    console.log(e);
  }
};

const oneMinColorWinning = async () => {
  try {
    await axios.get(
      `https://admin.play2earn.space/api/colour_winning?id=1&gid=1`
    );
  } catch (e) {
    console.log(e);
  }
};

// color prediction game time generated every 3 min
const generatedTimeEveryAfterEveryThreeMin = () => {
  let min = 2;
  const rule = new schedule.RecurrenceRule();
  rule.second = new schedule.Range(0, 59);
  const job = schedule.scheduleJob("* * * * * *", function () {
    const currentTime = new Date().getSeconds(); // Get the current time
    const timeToSend = currentTime > 0 ? 60 - currentTime : currentTime;
    io.emit("threemin", `${min}_${timeToSend}`);
    if (min === 0 && timeToSend === 25) {
      // oneMinCheckResult2min();
      oneMinColorWinning2min();
    }
    if (currentTime === 0) {
      min--;
      if (min < 0) min = 2; // Reset min to 2 when it reaches 0
    }
  });
};

const oneMinCheckResult2min = async () => {
  try {
    await axios.get(`https://admin.play2earn.space/api/checkresult`);
  } catch (e) {
    console.log(e);
  }
};
const oneMinColorWinning2min = async () => {
  try {
    await axios.get(
      `https://admin.play2earn.space/api/colour_winning?id=2&gid=2`
    );
  } catch (e) {
    console.log(e);
  }
};

const generatedTimeEveryAfterEveryFiveMin = () => {
  let min = 4;
  const rule = new schedule.RecurrenceRule();
  rule.second = new schedule.Range(0, 59);
  const job = schedule.scheduleJob("* * * * * *", function () {
    const currentTime = new Date().getSeconds(); // Get the current time
    const timeToSend = currentTime > 0 ? 60 - currentTime : currentTime;
    io.emit("fivemin", `${min}_${timeToSend}`);

    if (
      timeToSend === 40 && // this is for sec
      min === 0 // this is for minut
    ) {
      // oneMinCheckResult3sec();
      oneMinColorWinning3sec();
    }
    ///
    if (currentTime === 0) {
      min--;
      if (min < 0) min = 4; // Reset min to 2 when it reaches 0
    }
  });
};

const oneMinCheckResult3sec = async () => {
  try {
    await axios.get(`https://admin.play2earn.space/api/checkresult`);
  } catch (e) {
    console.log(e);
  }
};
const oneMinColorWinning3sec = async () => {
  try {
    await axios.get(
      `https://admin.play2earn.space/api/colour_winning?id=3&gid=3`
    );
  } catch (e) {
    console.log(e);
  }
};

// color prediction game time generated every 1 min
function generatedTimeEveryAfterEveryOneMinTRX() {
  let three = 0;
  let five = 0;
  const rule = new schedule.RecurrenceRule();
  rule.second = new schedule.Range(0, 59);
  let oneMinTrxJob = schedule.scheduleJob(rule, function () {
    const currentTime = new Date();
    const timeToSend =
      currentTime.getSeconds() > 0
        ? 60 - currentTime.getSeconds()
        : currentTime.getSeconds();
    io.emit("onemintrx", timeToSend);
    if (timeToSend === 9) {
      const datetoAPISend = parseInt(new Date().getTime().toString());
      const actualtome = soment.tz("Asia/Kolkata");
      const time = actualtome.add(5, "hours").add(30, "minutes").valueOf();
      try {
        if (three === 2) {
          three = 0;
        } else {
          three++;
        }

        if (five === 4) {
          five = 0;
        } else {
          five++;
        }
        setTimeout(async () => {
          const res = await axios.get(
            `https://apilist.tronscanapi.com/api/block?sort=-balance&start=0&limit=20&producer=&number=&start_timestamp=${datetoAPISend}&end_timestamp=${datetoAPISend}`
          );
          if (res?.data?.data[0]) {
            const obj = res.data.data[0];
            const fd = new FormData();
            fd.append("hash", `**${obj.hash.slice(-4)}`);
            fd.append("digits", `${obj.hash.slice(-5)}`);
            fd.append("number", obj.number);
            fd.append("time", moment(time).format("HH:mm:ss"));

            const newString = obj.hash;
            let num = null;
            for (let i = newString.length - 1; i >= 0; i--) {
              if (!isNaN(parseInt(newString[i]))) {
                num = parseInt(newString[i]);
                break;
              }
            }
            fd.append("slotid", num);
            fd.append("overall", JSON.stringify(obj));
            //  trx 1
            try {
              const response = await axios.post(
                "https://admin.play2earn.space/api/insert-one-trx",
                fd
              );
            } catch (e) {
              console.log(e);
            }
            try {
              const response = await axios.get(
                `https://admin.play2earn.space/api/trx-winning-result?number=${num}&gameid=1`
              );
            } catch (e) {
              console.log(e);
            }
          }
        }, [4000]);
      } catch (e) {
        console.log(e);
      }
    }
  });
}

const generatedTimeEveryAfterEveryThreeMinTRX = () => {
  let min = 2;
  twoMinTrxJob = schedule.scheduleJob("* * * * * *", function () {
    const currentTime = new Date().getSeconds(); // Get the current time
    const timeToSend = currentTime > 0 ? 60 - currentTime : currentTime;
    io.emit("threemintrx", `${min}_${timeToSend}`);
    if (min === 0 && timeToSend === 9) {
      const datetoAPISend = parseInt(new Date().getTime().toString());
      const actualtome = soment.tz("Asia/Kolkata");
      const time = actualtome.add(5, "hours").add(30, "minutes").valueOf();
      try {
        setTimeout(async () => {
          const res = await axios.get(
            `https://apilist.tronscanapi.com/api/block?sort=-balance&start=0&limit=20&producer=&number=&start_timestamp=${datetoAPISend}&end_timestamp=${datetoAPISend}`
          );
          if (res?.data?.data[0]) {
            const obj = res.data.data[0];
            const fd = new FormData();
            fd.append("hash", `**${obj.hash.slice(-4)}`);
            fd.append("digits", `${obj.hash.slice(-5)}`);
            fd.append("number", obj.number);
            fd.append("time", moment(time).format("HH:mm:ss"));
            const newString = obj.hash;
            let num = null;
            for (let i = newString.length - 1; i >= 0; i--) {
              if (!isNaN(parseInt(newString[i]))) {
                num = parseInt(newString[i]);
                break;
              }
            }
            fd.append("slotid", num);
            fd.append("overall", JSON.stringify(obj));
            //  trx 3
            try {
              const response = await axios.post(
                "https://admin.play2earn.space/api/insert-three-trx",
                fd
              );
            } catch (e) {
              console.log(e);
            }
            try {
              const response = await axios.get(
                `https://admin.play2earn.space/api/trx-winning-result?number=${num}&gameid=2`
              );
            } catch (e) {
              console.log(e);
            }
          }
        }, [4000]);
      } catch (e) {
        console.log(e);
      }
    }
    if (currentTime === 0) {
      min--;
      if (min < 0) min = 2; // Reset min to 2 when it reaches 0
    }
  });
};

const generatedTimeEveryAfterEveryFiveMinTRX = () => {
  let min = 4;
  threeMinTrxJob = schedule.scheduleJob("* * * * * *", function () {
    const currentTime = new Date().getSeconds(); // Get the current time
    const timeToSend = currentTime > 0 ? 60 - currentTime : currentTime;
    io.emit("fivemintrx", `${min}_${timeToSend}`);
    if (min === 0 && timeToSend === 9) {
      const datetoAPISend = parseInt(new Date().getTime().toString());
      const actualtome = soment.tz("Asia/Kolkata");
      const time = actualtome.add(5, "hours").add(30, "minutes").valueOf();
      try {
        setTimeout(async () => {
          const res = await axios.get(
            `https://apilist.tronscanapi.com/api/block?sort=-balance&start=0&limit=20&producer=&number=&start_timestamp=${datetoAPISend}&end_timestamp=${datetoAPISend}`
          );
          if (res?.data?.data[0]) {
            const obj = res.data.data[0];
            const fd = new FormData();
            fd.append("hash", `**${obj.hash.slice(-4)}`);
            fd.append("digits", `${obj.hash.slice(-5)}`);
            fd.append("number", obj.number);
            fd.append("time", moment(time).format("HH:mm:ss"));
            const newString = obj.hash;
            let num = null;
            for (let i = newString.length - 1; i >= 0; i--) {
              if (!isNaN(parseInt(newString[i]))) {
                num = parseInt(newString[i]);
                break;
              }
            }
            fd.append("slotid", num);
            fd.append("overall", JSON.stringify(obj));
            //  trx 3
            try {
              const response = await axios.post(
                "https://admin.play2earn.space/api/insert-five-trx",
                fd
              );
            } catch (e) {
              console.log(e);
            }
            try {
              const response = await axios.get(
                `https://admin.play2earn.space/api/trx-winning-result?number=${num}&gameid=3`
              );
            } catch (e) {
              console.log(e);
            }
          }
        }, [4000]);
      } catch (e) {
        console.log(e);
      }
    }
    if (currentTime === 0) {
      min--;
      if (min < 0) min = 4; // Reset min to 4 when it reaches 0
    }
  });
};

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
    // generatedTimeEveryAfterEveryOneMinForRollet()
    generatedTimeEveryAfterEveryOneMinTRX();
    generatedTimeEveryAfterEveryOneMin();
    generatedTimeEveryAfterEveryThreeMin();
    generatedTimeEveryAfterEveryFiveMin();
    x = false;
  }, secondsUntilNextMinute * 1000);
}

const finalRescheduleJob = schedule.scheduleJob(
  "15,30,45,0 * * * *",
  function () {
    twoMinTrxJob?.cancel();
    threeMinTrxJob?.cancel();
    generatedTimeEveryAfterEveryThreeMinTRX();
    generatedTimeEveryAfterEveryFiveMinTRX();
  }
);

app.get("/", (req, res) => {
  res.send(`<h1>server running at port=====> ${PORT}</h1>`);
});

httpServer.listen(PORT, () => {
  console.log("Server listening on port", PORT);
});
