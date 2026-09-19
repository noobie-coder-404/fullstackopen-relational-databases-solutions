import { Model, DataTypes } from "sequelize";
import { sequelize } from "../utils/db.js";

class Session extends Model {}
Session.init(
  {
    id: {
      primaryKey: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
    },
    token: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
  },
  { sequelize, underscored: true, timestamps: false, modelName: "session" },
);

export { Session };
