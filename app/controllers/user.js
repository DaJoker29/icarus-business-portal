const user = require('../models').USER;

/* TODO: Refactor Error Handling */
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

/* TODO: Allow user to Change Info*/
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

/* TODO: Add a Change Password Feature */

// module.exports.CHANGE_PASSWORD = changePassword;
module.exports.FETCH_USER = fetchUser;
module.exports.CHANGE_INFO = changeInfo;
