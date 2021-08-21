const mongoose = require('mongoose');

const bankSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  namaBank: {
    type: String,
    required: true,
  },
  nomorRekening: {
    type: String,
    requred: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Bank', bankSchema);
