const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TodoSchema = Schema({
  todo: {
    type: String,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  created_by: {
    type: Date,
    default: Date.now(),
  },
});

const TodoModel = mongoose.model('Todo', TodoSchema);

module.exports = TodoModel;
