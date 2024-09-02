// Creates the user schema with the various validations
module.exports = (sequelize, DataTypes) => {
    return sequelize.define('monitors', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        lot_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        bid_price: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        vin_code: {
            type: DataTypes.STRING,
            allowNull: false
        },
        type: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'bid'
        },
        user_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'users',
                key: 'id'
            }
        }
    });
};
