const fs = require('fs')
const path = require('path')
const Sequelize = require('sequelize')
const db = {}

const sequelize = new Sequelize({
  host: 'localhost',
  port: '3307',
  database: 'caphochieu',
  username: 'root',
  password: '',
  dialect: 'mysql',
  define: {
    charset: 'utf8mb4',
    collate: 'utf8mb4_general_ci'
  }
})

fs
  .readdirSync(__dirname)
  .filter((file) =>
    file !== 'index.js'
  )
  .forEach((file) => {
    const model = sequelize.import(path.join(__dirname, file))
    db[model.name] = model
  })


Object.keys(db).forEach(function (modelName) {
  if ('associate' in db[modelName]) {
    db[modelName].associate(db)
  }
})

db.sequelize = sequelize
db.Sequelize = Sequelize

db.Role.hasMany(db.User, {
  foreignKey: 'role_id'
})
db.User.belongsTo(db.Role, {
  foreignKey: 'role_id'
})

db.Passport.hasOne(db.Archive, {
  foreignKey: 'passport_id'
})
db.Archive.belongsTo(db.Passport, {
})

sequelize
  .authenticate()
  .then(() => console.log('Connection has been established successfully.'))
  .catch(err => console.error('Unable to connect to the database:', err));

module.exports = db