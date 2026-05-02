const mongoose = require('mongoose');

const petSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    species: {
      type: String,
      trim: true
    },
    breed: {
      type: String,
      trim: true
    },
    age: {
      type: Number,
      min: 0
    },
    weight: {
      type: Number,
      min: 0
    },
    notes: {
      type: String,
      trim: true
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Pet', petSchema);

