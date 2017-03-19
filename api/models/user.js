"use strict";

module.exports = function (sequelize, DataTypes) {
  const User = sequelize.define("User", {
    _id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      unique: true
    },
    dateOfBirth: DataTypes.DATE
  }, {
    timestamps: false,
    classMethods: {
      associate: function (models) {
        User.hasMany(models.Task)
      }
    }
  });

  return User;
};
