const SubsModel = require("../DAL/model");

exports.findSub = function (email) {
  return new Promise((resolve, reject) => {
    SubsModel.findOne({ email: email.trim(), paid: true }, function (err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};
