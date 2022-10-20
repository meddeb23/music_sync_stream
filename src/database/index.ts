import { Sequelize } from "sequelize";

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./src/database/main.db",
  //   logging: false,
});

export default sequelize;
