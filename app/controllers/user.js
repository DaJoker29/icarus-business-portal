const user = require('../models').USER;

function fetchUser(req, res) {
  user.findOne({ _id: req.user._id }, (err, doc) => {
    if (err) {
      console.log(err);
      return res.sendStatus(500);
    } else if (null === doc) {
      console.log('No user found...');
      return res.sendStatus(404);
    }
    return res.json(doc);
  });
}

function changeInfo(req, res) {
  if (req.user && req.body) {
    const { _id } = req.user;
    const { firstName, lastName, organization, phone } = req.body;
    const options = { new: true, upsert: true };
    user.findByIdAndUpdate(
      _id,
      { firstName, lastName, organization, phone },
      options,
      (err, doc) => {
        if (err) {
          console.log(err);
          return res.sendStatus(500);
        } else if (null === doc) {
          console.log('No user found');
          return res.sendStatus(404);
        }
        return res.json(doc);
      },
    );
  }
  return res.sendStatus(404);
}

// function changePassword(req, res) {
//   return;
// };

module.exports.FETCH_USER = fetchUser;
module.exports.CHANGE_INFO = changeInfo;
// module.exports.CHANGE_PASSWORD = changePassword;
