module.exports = function (sequelize, DataTypes) {
  return sequelize.define('plan', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    content: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    note: {
      type: DataTypes.STRING(255),
      allowNull: false
    }
  }, {
    tableName: 'plan',
    freezeTableName: true,
    timestamps: false
  })
}
