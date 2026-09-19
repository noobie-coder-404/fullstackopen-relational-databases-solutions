import { Sequelize } from "sequelize";
import { TEST_DATABASE_URL, DATABASE_URL, TESTING } from "./config.js";
import { Umzug, SequelizeStorage } from "umzug";
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

const runMigrations = async () => {
  const migrator = new Umzug({
    migrations: {
      glob: "migrations/*.js",
    },
    storage: new SequelizeStorage({
      sequelize,
      tableName: "migrations",
    }),
    context: sequelize.getQueryInterface(),
    logger: console,
  });
  const migrations = await migrator.up();
  console.log("Migrations up to date", {
    files: migrations.map((mig) => mig.name),
  });
};

export const connectToDatabase = async () => {
  try {
    await sequelize.authenticate();
    await runMigrations();
    console.log("connected to database");
  } catch (error) {
    console.log("error occured");
    console.log(error);
    process.exit(1);
  }
};
