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

const saveSub = async function (email, verification) {
  return new Promise((resolve, reject) => {
    const subs = new SubsModel({
      email,
      verification,
      authorized: false,
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

const signUp = async function (email) {
  return new Promise((resolve, reject) => {
    SubsModel.findOneAndUpdate(
      { email },
      {
        authorized: true,
        verification: null,
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

module.exports = { findSub, saveSub, signUp, updateSub };
