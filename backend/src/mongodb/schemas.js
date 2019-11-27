const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  language: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  messages: {
    type: Object,
    required: true,
    default: Object,
  },
});

UserSchema.pre('save', function (next) {
  const user = this;
  bcrypt.hash(user.password, 10, (err, hash) => {
    if (err) {
      return next(err);
    }
    user.password = hash;
    next();
  });
});

UserSchema.statics.authenticate = (email, password, callback) => (
  user.findOne({ email })
    .exec((err, user) => {
      if (err) {
        return callback(err);
      } if (!user) {
        return callback(401);
      }

      return bcrypt.compare(password, user.password, (_, result) => (
        (result === true)
          ? callback(null, user)
          : callback()
      ));
    })
);

const user = mongoose.model('User', UserSchema);

module.exports = user;
