const dbConfig = require("../config/db.config");
require('dotenv').config();

const bycrypt = require('bcryptjs');
const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,
  port: dbConfig.PORT,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});

const models = {
    users: require("../models/user.js")(sequelize, Sequelize),
    monitors: require("../models/monitor.js")(sequelize, Sequelize),
    accounts: require("../models/account.js")(sequelize, Sequelize),
    proxies: require("../models/proxy.js")(sequelize, Sequelize),
    invoices: require("../models/invoice.js")(sequelize, Sequelize),
};

models.users.hasMany(models.monitors, { foreignKey: 'user_id'});
models.monitors.belongsTo(models.users, { foreignKey: 'user_id'});

models.users.hasMany(models.invoices, { foreignKey: 'receiver_id'});
models.invoices.belongsTo(models.users, { foreignKey: 'receiver_id'});

models.monitors.hasMany(models.invoices, { foreignKey: 'monitor_id'});
models.invoices.belongsTo(models.monitors, { foreignKey: 'monitor_id'});

//creating the associations between each model
Object.keys(models).forEach(modelName => {
    if ('associate' in models[modelName]) {
        models[modelName].associate(models);
    }
})

try {
    sequelize.authenticate().then(() => {
        console.info(' ------- Connection Established');
    });
    sequelize.sync({
        force: false,
        logging: false

    }).then(() => {
        console.info(' ------ All synchronised ')
    })
}
catch(err) {
    console.error(' ----Database connection Error -----', err.message);
}

if (process.env.ADMIN_INFO_SEED === 'true') {
    bycrypt.hash('admin', 10).then((encrypedPwd) => {
        models.users.create({
            email: "admin@admin.com",
            password: encrypedPwd,
            role: "admin"
        }).then(() => {
            console.log("---- Adding default admin into db");
        })
    })
    
}
models.Sequelize = Sequelize;
models.sequelize = sequelize;

module.exports = models;