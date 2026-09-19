import { DataTypes } from "sequelize";

export const up = async ({ context: queryInterface }) => {
  await queryInterface.createTable("sessions", {
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
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
  });
  await queryInterface.addColumn("users", "disabled", {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false,
  });
};

export const down = async ({ context: queryInterface }) => {
  await queryInterface.dropTable("sessions");
  await queryInterface.removeColumn("users", "disabled");
};
