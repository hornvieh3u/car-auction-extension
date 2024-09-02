// Creates the user schema with the various validations
module.exports = (sequelize, DataTypes) => {
  return sequelize.define('invoices', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      monitor_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'monitors',
            key: 'id'
        }
      },
      receiver_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'users',
            key: 'id'
        }
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
      }
  });
};
