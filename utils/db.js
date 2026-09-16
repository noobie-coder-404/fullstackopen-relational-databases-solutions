import { Sequelize } from "sequelize";
import { TEST_DATABASE_URL, DATABASE_URL, TESTING } from "./config.js";
const url = TESTING ? TEST_DATABASE_URL : DATABASE_URL;
export const sequelize = new Sequelize(url, {
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

export const connectToDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log("connected to database");
  } catch (error) {
    console.log("error occured");
    process.exit(1);
  }
};
