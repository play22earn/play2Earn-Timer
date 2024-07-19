"user strict";
const { default: axios } = require("axios");
var sql = require("../config/db.config");
// const path = require("path");

module.exports = {
  randomStr: function (len, arr) {
    let ans = "";
    for (let i = len; i > 0; i--) {
      ans += arr[Math.floor(Math.random() * arr.length)];
    }
    return ans;
  },
  oneMinColorWining: async function () {
    try {
      await axios
        .get(`https://admin.play2earn.space/api/colour_winning?id=1&gid=1`)
        .then((result) => {})
        .catch((e) => {
          console.log(e);
        });
    } catch (e) {
      console.log(e);
    }
  },
  oneMinColorWinning2min: async function () {
    try {
      await axios
        .get(`https://admin.play2earn.space/api/colour_winning?id=2&gid=2`)
        .then((result) => {})
        .catch((e) => {
          console.log(e);
        });
    } catch (e) {
      console.log(e);
    }
  },
  oneMinColorWinning3sec: async function () {
    try {
      await axios
        .get(`https://admin.play2earn.space/api/colour_winning?id=3&gid=3`)
        .then((result) => {})
        .catch((e) => {
          console.log(e);
        });
    } catch (e) {
      console.log(e);
    }
  },
  oneMinTrxSendReleasNumber: async function (param) {
    const response = await axios
      .get(`https://admin.play2earn.space/api/trx-winning-result`, {
        params: param,
      })
      .then((result) => {})
      .catch((e) => {
        console.log(e);
      });
  },
  oneThreeTrxSendReleasNumber: async function (param) {
    const response = await axios
      .get(`https://admin.play2earn.space/api/trx-winning-result`, {
        params: param,
      })
      .then((result) => {})
      .catch((e) => {
        console.log(e);
      });
  },
  oneFiveTrxSendReleasNumber: async function (param) {
    const response = await axios
      .get(`https://admin.play2earn.space/api/trx-winning-result`, {
        params: param,
      })
      .then((result) => {})
      .catch((e) => {
        console.log(e);
      });
  },
  functionToreturnDummyResult: function (index) {
    const array = [
      {
        hash: "0000000003c9a564d25473a75f10663e28ec2af72e6e5f16d413ddekjdsflja45",
        number: 65234895,
        size: 68325,
        timestamp: 1721285448000,
        txTrieRoot: "25ff7WnEyFkEm9edoVw84FBoYoiYExudyCFzTUarVz2G1bPVjm",
        parentHash:
          "0000000003c9a5639ef20261042c150fd3885b7148a77d6428be9129622191a4",
        witnessId: 0,
        witnessAddress: "TJBtdYunmQkeK5KninwgcjuK1RPDhyUWBZ",
        nrOfTrx: 283,
        nrOfTrx: 283,
        witnessName: "JD Investment",
        version: "30",
        fee: 265.16438,
        confirmed: false,
        nrOfTrx: 283,
        witnessName: "JD Investment",
        version: "30",
        nrOfTrx: 283,
        witnessName: "JD Investment",
        version: "30",
        nrOfTrx: 283,
        witnessName: "JD Investment",
        witnessName: "JD Investment",
        version: "30",
        fee: 265.16438,
        confirmed: false,
        confirmations: 3,
        netUsage: 83776,
        energyUsage: 4107654,
        blockReward: 16,
        voteReward: 160,
        revert: false,
      },

      {
        hash: "0000000003c9a564d25473a75f10663e28ec2af72e6e5f16d413dde92d5sdlds4542",
        number: 65241369,
        size: 68325,
        timestamp: 1721285448000,
        txTrieRoot: "25ff7WnEyFkEm9edoVw84FBoYoiYExudyCFzTUarVz2G1bPVjm",
        parentHash:
          "0000000003c9a5639ef20261042c150fd3885b7148a77d6428be9129622191a4",
        witnessId: 0,
        witnessAddress: "TJBtdYunmQkeK5KninwgcjuK1RPDhyUWBZ",
        nrOfTrx: 283,
        nrOfTrx: 283,
        witnessName: "JD Investment",
        version: "30",
        fee: 265.16438,
        confirmed: false,
        nrOfTrx: 283,
        witnessName: "JD Investment",
        version: "30",
        nrOfTrx: 283,
        witnessName: "JD Investment",
        version: "30",
        nrOfTrx: 283,
        witnessName: "JD Investment",
        witnessName: "JD Investment",
        version: "30",
        fee: 265.16438,
        confirmed: false,
        confirmations: 3,
        netUsage: 83776,
        energyUsage: 4107654,
        blockReward: 16,
        voteReward: 160,
        revert: false,
      },

      {
        hash: "0000000003c9a564d25473a75f10663e28ec2af72e6e5f16d413dde9244fgh145",
        number: 68745213,
        size: 68325,
        timestamp: 1721285448000,
        txTrieRoot: "25ff7WnEyFkEm9edoVw84FBoYoiYExudyCFzTUarVz2G1bPVjm",
        parentHash:
          "0000000003c9a5639ef20261042c150fd3885b7148a77d6428be9129622191a4",
        witnessId: 0,
        witnessAddress: "TJBtdYunmQkeK5KninwgcjuK1RPDhyUWBZ",
        nrOfTrx: 283,
        nrOfTrx: 283,
        witnessName: "JD Investment",
        version: "30",
        fee: 265.16438,
        confirmed: false,
        nrOfTrx: 283,
        witnessName: "JD Investment",
        version: "30",
        nrOfTrx: 283,
        witnessName: "JD Investment",
        version: "30",
        nrOfTrx: 283,
        witnessName: "JD Investment",
        witnessName: "JD Investment",
        version: "30",
        fee: 265.16438,
        confirmed: false,
        confirmations: 3,
        netUsage: 83776,
        energyUsage: 4107654,
        blockReward: 16,
        voteReward: 160,
        revert: false,
      },
      {
        hash: "0000000003c9a564d25473a75f10663e28ec2af72e6e5f16d413dde92dgfhdfh451",
        number: 69532458,
        size: 68325,
        timestamp: 1721285448000,
        txTrieRoot: "25ff7WnEyFkEm9edoVw84FBoYoiYExudyCFzTUarVz2G1bPVjm",
        parentHash:
          "0000000003c9a5639ef20261042c150fd3885b7148a77d6428be9129622191a4",
        witnessId: 0,
        witnessAddress: "TJBtdYunmQkeK5KninwgcjuK1RPDhyUWBZ",
        nrOfTrx: 283,
        nrOfTrx: 283,
        witnessName: "JD Investment",
        version: "30",
        fee: 265.16438,
        confirmed: false,
        nrOfTrx: 283,
        witnessName: "JD Investment",
        version: "30",
        nrOfTrx: 283,
        witnessName: "JD Investment",
        version: "30",
        nrOfTrx: 283,
        witnessName: "JD Investment",
        witnessName: "JD Investment",
        version: "30",
        fee: 265.16438,
        confirmed: false,
        confirmations: 3,
        netUsage: 83776,
        energyUsage: 4107654,
        blockReward: 16,
        voteReward: 160,
        revert: false,
      },
      {
        hash: "0000000003c9a564d25473a75f10663e28ec2af72e6e5f16d413dde9244fgh145",
        number: 68745213,
        size: 68325,
        timestamp: 1721285448000,
        txTrieRoot: "25ff7WnEyFkEm9edoVw84FBoYoiYExudyCFzTUarVz2G1bPVjm",
        parentHash:
          "0000000003c9a5639ef20261042c150fd3885b7148a77d6428be9129622191a4",
        witnessId: 0,
        witnessAddress: "TJBtdYunmQkeK5KninwgcjuK1RPDhyUWBZ",
        nrOfTrx: 283,
        nrOfTrx: 283,
        witnessName: "JD Investment",
        version: "30",
        fee: 265.16438,
        confirmed: false,
        nrOfTrx: 283,
        witnessName: "JD Investment",
        version: "30",
        nrOfTrx: 283,
        witnessName: "JD Investment",
        version: "30",
        nrOfTrx: 283,
        witnessName: "JD Investment",
        witnessName: "JD Investment",
        version: "30",
        fee: 265.16438,
        confirmed: false,
        confirmations: 3,
        netUsage: 83776,
        energyUsage: 4107654,
        blockReward: 16,
        voteReward: 160,
        revert: false,
      },
    ];
    return array[index || 0];
  },

  queryDb: function (query, param) {
    return new Promise((resolve, reject) => {
      sql.query(query, param, (err, result) => {
        if (err) {
          //return reject(err);
          return console.log(err);
        }
        resolve(result);
      });
    });
  },
};
