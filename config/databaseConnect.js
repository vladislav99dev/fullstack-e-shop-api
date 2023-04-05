const mongoose = require('mongoose')


const databaseConnect = (connection) => {
  return  mongoose.connect(connection)
}

module.exports = databaseConnect;