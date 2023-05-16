const SubsModel = require("../DAL/model");

const findSub = function (email) {
  return new Promise((resolve, reject) => {
    SubsModel.findOne({ email: email.trim() }, function (err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

const saveSub = async function (email) {
  return new Promise((resolve, reject) => {
    const subs = new SubsModel({
      email,
      paid: false,
      firstFriday: "",
    });

    subs.save(function (err) {
      if (err) {
        reject(err);
      }
    });

    resolve(subs);
  });
};

const updateSub = async function (obj) {
  return new Promise((resolve, reject) => {
    SubsModel.findOneAndUpdate(
      { email: obj.email },
      {
        firstFriday: obj.date,
      },
      function (err, data) {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      }
    );
  });
};

module.exports = { findSub, saveSub, updateSub };
