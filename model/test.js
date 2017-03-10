/**
 * Created by duoyi on 2017/3/8.
 */
// var Sequelize = require('sequelize')

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('role', {
    id: {
      type: DataTypes.STRING(50),
      primaryKey: true,
      allowNull: false
    },
    birth: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    }
  }, {
    tableName: 'role',
    freezeTableName: true,
    timestamps: false
  })
}
