// Creates the user schema with the various validations
module.exports = (sequelize, DataTypes) => {
  return sequelize.define('proxies', {
      id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
      },
      ip: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true
      },
      port: {
          type: DataTypes.INTEGER,
          allowNull: false,
      },
      domain: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true
      }
  });
};
