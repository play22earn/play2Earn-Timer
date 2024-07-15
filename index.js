const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const todoRoutes = require("./routes/todos");
const moment = require("moment");
const soment = require("moment-timezone");
require("dotenv").config();
const mysql = require("mysql");
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

const pool = mysql.createPool({
  connectionLimit: 10,
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE_URL,
  multipleStatements: true,
  connectTimeout: 10000,
});

// Event listener for new connections
pool.on("connection", function (_conn) {
  if (_conn) {
    console.log(`Connected to the database via threadId ${_conn.threadId}!!`);
    _conn.query("SET SESSION auto_increment_increment=1");
  }
});

const job = schedule.scheduleJob("0 1 * * *", async function () {
  try {
    // Make the API call using axios
    const response = await axios.get(
      "https://admin.play2earn.space/api/Daily-salary-income"
    );
    // await axios.get(
    //   "https://admin.play2earn.space/api/wallet-income"
    // );
    setTimeout(async () => {
      try {
        await axios.get("https://admin.play2earn.space/api/bet-income");
      } catch (e) {
        console.log(e);
      }
    }, 1000);

    setTimeout(async () => {
      try {
        // await axios.get("https://admin.play2earn.space/api/direct-income");
        await axios.get(
          "https://admin.play2earn.space/api/daily-non-working-bonus"
        );
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
    if (timeToSend === 6) {
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
    if (min === 0 && timeToSend === 6) {
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
    if (min === 0 && timeToSend === 6) {
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

//////////////////////////////// promotion data ///////////////////////////////////////
app.get("/api/v1/promotiondata", async (req, res) => {
  pool.getConnection((err, con) => {
    if (err) {
      console.error("Error getting database connection: ", err);
      return res.status(500).json({
        msg: `Something went wrong ${err}`,
      });
    }
    const { id } = req.query;
    if (!id || isNaN(id)) {
      con.release();
      return res.status(400).json({
        message: "Id is missing or invalid",
      });
    }

    try {
      con.query("SELECT * FROM user", (err, result) => {
        if (err) {
          console.error(err);
          con.release();
          return res.status(500).json({
            msg: "Error in data fetching",
            error: err.message,
            er: err,
          });
        }

        const array = result.map((i) => ({
          ...i,
          count: 0,
          teamcount: 0,
          directReferrals: [],
        }));

        let new_data = updateReferralCountnew(array).find((i) => i.id == id);
        const levels = Array.from({ length: 22 }, (_, i) => `level_${i + 1}`);

        let direct_ids = new_data.directReferrals?.map((i) => i?.c_id);

        let indirect_ids = [];
        for (let i = levels.length - 1; i >= 0; i--) {
          let currentLevel = new_data?.teamMembersByLevel[levels[i - 1]];
          let nextLevel = new_data?.teamMembersByLevel[levels[i]];

          if (currentLevel && nextLevel) {
            let idsToRemove = currentLevel.map((item) => item.id);
            nextLevel = nextLevel.filter(
              (item) => !idsToRemove.includes(item.id)
            );
            new_data.teamMembersByLevel[levels[i]] = nextLevel;
          }
        }

        for (let i = 1; i <= 22; i++) {
          if (new_data.teamMembersByLevel[`level_${i}`]?.length > 0) {
            indirect_ids.push(
              ...new_data.teamMembersByLevel[`level_${i}`].map(
                (item) => item.id
              )
            );
          }
        }

        new_data = { ...new_data, deposit_member_amount: [] };

        const promises = [];
        for (let i = 1; i <= 22; i++) {
          if (new_data.teamMembersByLevel[`level_${i}`]?.length > 0) {
            let levelIds = new_data.teamMembersByLevel[`level_${i}`].map(
              (k) => k.id
            );
            const promise = new Promise((resolve, reject) => {
              con.query(
                `SELECT SUM(tr15_amt) AS total_amount, COUNT(*) AS total_member
                 FROM tr15_fund_request
                 WHERE tr15_status = 'Success' AND tr15_depo_type = 'Winzo' AND 
                 ${
                   levelIds.length > 0
                     ? `tr15_uid IN (${levelIds.join(",")})`
                     : "1 = 0"
                 }`,
                (err, resultteamamount) => {
                  if (err) {
                    console.error(err);
                    reject(err);
                  } else {
                    resolve(resultteamamount[0].total_amount || 0);
                  }
                }
              );
            });
            promises.push(promise);
          } else {
            promises.push(Promise.resolve(0));
          }
        }

        Promise.all(promises)
          .then((deposit_member_amounts) => {
            new_data.deposit_member_amount = deposit_member_amounts;
            con.query(
              `SELECT SUM(tr15_amt) AS total_amount,COUNT(DISTINCT tr15_uid) AS total_member FROM tr15_fund_request WHERE tr15_status = 'Success' AND tr15_depo_type = 'Winzo' AND
              ${
                direct_ids.length > 0
                  ? `tr15_uid IN (${direct_ids.join(",")})`
                  : "1 = 0"
              }`,
              (err, result) => {
                if (err) {
                  console.error(err);
                  return res.status(500).json({
                    msg: "Error in data fetching",
                    error: err.message,
                    er: err,
                  });
                }

                con.query(
                  `SELECT SUM(tr15_amt) AS total_amount,COUNT(DISTINCT tr15_uid) AS total_member FROM tr15_fund_request WHERE tr15_status = 'Success' AND tr15_depo_type = 'Winzo' AND 
                                ${
                                  indirect_ids.length > 0
                                    ? `tr15_uid IN (${indirect_ids.join(",")})`
                                    : "1 = 0"
                                }`,
                  (err, resultteam) => {
                    if (err) {
                      console.error(err);
                      return res.status(500).json({
                        msg: "Error in data fetching",
                        error: err.message,
                        er: err,
                      });
                    }
                    con.release();
                    // Ensure all levels up to 22 are initialized
                    for (let i = 1; i <= 22; i++) {
                      if (!new_data.teamMembersByLevel[`level_${i}`]) {
                        new_data.teamMembersByLevel[`level_${i}`] = [];
                      }
                    }
                    return res.status(200).json({
                      data: {
                        ...new_data,
                        deposit_member: result[0].total_member || 0,
                        deposit_recharge: result[0].total_amount || 0,
                        deposit_member_team: resultteam[0].total_member || 0,
                        deposit_recharge_team: resultteam[0].total_amount || 0,
                      },
                      msg: "Data fetched successfully",
                    });
                  }
                );
              }
            );
          })
          .catch((err) => {
            console.error(err);
            con.release();
            return res.status(500).json({
              msg: "Error in data fetching",
              error: err.message,
              er: err,
            });
          });
      });
    } catch (e) {
      con.release();
      console.error(e);
      return res.status(500).json({
        msg: "Error in data fetching",
        error: e.message,
      });
    }
  });
});

function updateReferralCountnew(users) {
  const countMap = {};
  const teamCountMap = {};

  users.forEach((user) => {
    countMap[user.id] = 0;
    teamCountMap[user.id] = 0;
    user.directReferrals = [];
  });

  users.forEach((user) => {
    if (countMap.hasOwnProperty(user.referral_user_id)) {
      countMap[user.referral_user_id]++;
    }
  });

  const updateTeamCountRecursively = (user) => {
    let totalChildrenCount = 0;
    if (countMap.hasOwnProperty(user.id)) {
      totalChildrenCount += countMap[user.id];
      users.forEach((u) => {
        if (u.referral_user_id === user.id) {
          if (user.referral_user_id !== null) {
            if (
              !user.directReferrals.some((referral) => referral.c_id === u.id)
            ) {
              user.directReferrals.push({
                user_name: u.full_name,
                mobile: u.mobile,
                c_id: u.id,
                id: u.username,
              });
            }
          }
          totalChildrenCount += updateTeamCountRecursively(u);
        }
      });
    }
    return totalChildrenCount;
  };

  users.forEach((user) => {
    if (countMap.hasOwnProperty(user.id)) {
      teamCountMap[user.id] = updateTeamCountRecursively(user);
    }
  });

  const updateUserLevelRecursively = (user, level, maxLevel) => {
    if (level === 0 || level > maxLevel) return [];

    const levelMembers = [];
    users.forEach((u) => {
      if (u.referral_user_id === user.id) {
        levelMembers.push({ full_name: u.full_name, id: u.id });
        const children = updateUserLevelRecursively(u, level + 1, maxLevel);
        levelMembers.push(...children);
      }
    });

    return levelMembers;
  };

  users.forEach((user) => {
    user.teamMembersByLevel = {};
    for (let i = 1; i <= 22; i++) {
      const levelMembers = updateUserLevelRecursively(user, 1, i);
      user.teamMembersByLevel[`level_${i}`] = levelMembers;
      if (levelMembers.length === 0) break;
    }
  });

  users.forEach((user) => {
    user.count = countMap.hasOwnProperty(user.id) ? countMap[user.id] : 0;
    user.teamcount = teamCountMap.hasOwnProperty(user.id)
      ? teamCountMap[user.id]
      : 0;
  });

  return users;
}

app.get("/", (req, res) => {
  res.send(`<h1>server running at port=====> ${PORT}</h1>`);
});

httpServer.listen(PORT, () => {
  console.log("Server listening on port", PORT);
});

// app.get("/api/v1/promotiondata", async (req, res) => {
//   pool.getConnection((err, con) => {
//     if (err) {
//       con.release();
//       console.error("Error getting database connection: ", err);
//       return res.status(500).json({
//         msg: `Something went wrong ${err}`,
//       });
//     }
//     const { id } = req.query;
//     if (!id || isNaN(id)) {
//       con.release();
//       return res.status(400).json({
//         message: "Id is missing or invalid",
//       });
//     }

//     try {
//       con.query("SELECT * FROM user", (err, result) => {
//         if (err) {
//           console.error(err);
//           con.release();
//           return res.status(500).json({
//             msg: "Error in data fetching",
//             error: err.message,
//             er: err,
//           });
//         }

//         const array = result.map((i) => ({
//           ...i,
//           count: 0,
//           teamcount: 0,
//           directReferrals: [],
//         }));

//         let new_data = updateReferralCountnew(array).find((i) => i.id == id);
//         const levels = Array.from({ length: 22 }, (_, i) => `level_${i + 1}`);

//         let direct_ids = new_data.directReferrals?.map((i) => i?.c_id);

//         let indirect_ids = [];
//         for (let i = levels.length - 1; i >= 0; i--) {
//           let currentLevel = new_data?.teamMembersByLevel[levels[i - 1]];
//           let nextLevel = new_data?.teamMembersByLevel[levels[i]];

//           if (currentLevel && nextLevel) {
//             let idsToRemove = currentLevel.map((item) => item.id);
//             nextLevel = nextLevel.filter(
//               (item) => !idsToRemove.includes(item.id)
//             );
//             new_data.teamMembersByLevel[levels[i]] = nextLevel;
//           }
//         }

//         for (let i = 1; i <= 22; i++) {
//           if (new_data.teamMembersByLevel[`level_${i}`]?.length > 0) {
//             indirect_ids.push(
//               ...new_data.teamMembersByLevel[`level_${i}`].map(
//                 (item) => item.id
//               )
//             );
//           }
//         }

//         new_data = { ...new_data, deposit_member_amount: [] };

//         const promises = [];
//         for (let i = 1; i <= 22; i++) {
//           if (new_data.teamMembersByLevel[`level_${i}`]?.length > 0) {
//             let levelIds = new_data.teamMembersByLevel[`level_${i}`].map(
//               (k) => k.id
//             );
//             const promise = new Promise((resolve, reject) => {
//               con.query(
//                 `SELECT SUM(tr15_amt) AS total_amount, COUNT(*) AS total_member
//                  FROM tr15_fund_request
//                  WHERE tr15_status = 'Success' AND tr15_depo_type = 'Winzo' AND
//                  ${
//                    levelIds.length > 0
//                      ? `tr15_uid IN (${levelIds.join(",")})`
//                      : "1 = 0"
//                  }`,
//                 (err, resultteamamount) => {
//                   if (err) {
//                     con.release();
//                     console.error(err);
//                     reject(err);
//                   } else {
//                     resolve(resultteamamount[0].total_amount || 0);
//                   }
//                 }
//               );
//             });
//             promises.push(promise);
//           } else {
//             promises.push(0);
//           }
//         }

//         Promise.all(promises)
//           .then((deposit_member_amounts) => {
//             new_data.deposit_member_amount = deposit_member_amounts;
//             con.query(
//               `SELECT SUM(tr15_amt) AS total_amount,COUNT(DISTINCT tr15_uid) AS total_member FROM tr15_fund_request WHERE tr15_status = 'Success' AND tr15_depo_type = 'Winzo' AND
//               ${
//                 direct_ids.length > 0
//                   ? `tr15_uid IN (${direct_ids.join(",")})`
//                   : "1 = 0"
//               }`,
//               (err, result) => {
//                 if (err) {
//                   con.release();
//                   console.error(err);
//                   return res.status(500).json({
//                     msg: "Error in data fetching",
//                     error: err.message,
//                     er: err,
//                   });
//                 }

//                 con.query(
//                   `SELECT SUM(tr15_amt) AS total_amount,COUNT(DISTINCT tr15_uid) AS total_member FROM tr15_fund_request WHERE tr15_status = 'Success' AND tr15_depo_type = 'Winzo' AND
//                                 ${
//                                   indirect_ids.length > 0
//                                     ? `tr15_uid IN (${indirect_ids.join(",")})`
//                                     : "1 = 0"
//                                 }`,

//                   (err, resultteam) => {
//                     if (err) {
//                       console.error(err);
//                       return res.status(500).json({
//                         msg: "Error in data fetching",
//                         error: err.message,
//                         er: err,
//                       });
//                     }
//                     con.release();
//                     return res.status(200).json({
//                       data: {
//                         ...new_data,
//                         deposit_member: result[0].total_member || 0,
//                         deposit_recharge: result[0].total_amount || 0,
//                         deposit_member_team: resultteam[0].total_member || 0,
//                         deposit_recharge_team: resultteam[0].total_amount || 0,
//                       },
//                       msg: "Data fetched successfully",
//                     });
//                   }
//                 );
//               }
//             );
//           })
//           .catch((err) => {
//             console.error(err);
//             con.release();
//             return res.status(500).json({
//               msg: "Error in data fetching",
//               error: err.message,
//               er: err,
//             });
//           });
//       });
//     } catch (e) {
//       con.release();
//       console.error(e);
//       return res.status(500).json({
//         msg: "Error in data fetching",
//         error: e.message,
//       });
//     }
//   });
// });

// function updateReferralCountnew(users) {
//   const countMap = {};
//   const teamCountMap = {};

//   // Initialize count for each user
//   users.forEach((user) => {
//     countMap[user.id] = 0;
//     teamCountMap[user.id] = 0;
//     user.directReferrals = []; // Initialize directReferrals array for each user
//   });

//   // Update count for each referral used
//   users.forEach((user) => {
//     // Check if referral_user_id exists in countMap
//     if (countMap.hasOwnProperty(user.referral_user_id)) {
//       // Increase the count for the referral_user_id by 1
//       countMap[user.referral_user_id]++;
//     }
//   });

//   // Update team count, deposit_member, and deposit_member_team count for each user recursively
//   const updateTeamCountRecursively = (user) => {
//     let totalChildrenCount = 0;

//     // Check if the user id exists in countMap
//     if (countMap.hasOwnProperty(user.id)) {
//       totalChildrenCount += countMap[user.id];

//       // Iterate through each user
//       users.forEach((u) => {
//         // Check if the user's referral_user_id matches the current user's id
//         if (u.referral_user_id === user.id) {
//           // Check if the user's referral_user_id is not null
//           if (user.referral_user_id !== null) {
//             // Check if the directReferrals array does not already contain the current user
//             if (
//               !user.directReferrals.some((referral) => referral.c_id === u.id)
//             ) {
//               // If not, add the user to the directReferrals array
//               user.directReferrals.push({
//                 user_name: u.full_name,
//                 mobile: u.mobile,
//                 c_id: u.id,
//                 id: u.username,
//               });
//             }
//           }
//           // Recursively update the team count for the current user
//           totalChildrenCount += updateTeamCountRecursively(u);
//         }
//       });
//     }

//     return totalChildrenCount;
//   };

//   users.forEach((user) => {
//     // Update teamCountMap if user.id exists in countMap
//     if (countMap.hasOwnProperty(user.id)) {
//       teamCountMap[user.id] = updateTeamCountRecursively(user);
//     }

//     // Add direct referral to the user's directReferrals array
//   });

//   const updateUserLevelRecursively = (user, level, maxLevel) => {
//     if (level === 0 || level > maxLevel) return []; // Return an empty array if we reached the desired level or exceeded the maximum level

//     const levelMembers = [];

//     // Iterate through each user
//     users.forEach((u) => {
//       // Check if the user's referral_user_id matches the current user's id
//       if (u.referral_user_id === user.id) {
//         // Add the user's full_name and id to the levelMembers array
//         levelMembers.push({ full_name: u.full_name, id: u.id });

//         // Recursively update the team members for the current user at the next level
//         const children = updateUserLevelRecursively(u, level + 1, maxLevel); // Increase level for the next level
//         levelMembers.push(...children); // Concatenate children to the current levelMembers array
//       }
//     });

//     return levelMembers;
//   };

//   users.forEach((user) => {
//     // Initialize arrays for each level of team members
//     user.teamMembersByLevel = {};

//     // Populate arrays with team members at each level
//     for (let i = 1; i <= 22; i++) {
//       const levelMembers = updateUserLevelRecursively(user, 1, i); // Start from level 1 and set the maximum level for this user
//       user.teamMembersByLevel[`level_${i}`] = levelMembers;
//       if (levelMembers.length === 0) break; // Stop populating arrays if no team members at this level
//     }
//   });
//   // Assign counts to each user
//   users.forEach((user) => {
//     // Update user properties with countMap, teamCountMap, depositMemberMap, depositMemberTeamMap,
//     // depositRechargeMap, and depositRechargeTeamMap if user.id exists in the respective maps
//     user.count = countMap.hasOwnProperty(user.id) ? countMap[user.id] : 0;
//     user.teamcount = teamCountMap.hasOwnProperty(user.id)
//       ? teamCountMap[user.id]
//       : 0;
//   });
//   return users;
// }
