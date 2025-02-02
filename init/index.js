const mongoose = require("mongoose");
const paywayUser = require("../models/User");
const initdata = require("./data");

const MONGO_URL = "mongodb://localhost:27017/payway";

main()
  .then(() => {
    console.log("connection successfull");
  })
  .catch((err) => {
    console.log("Error occurred at", err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await paywayUser.deleteMany({});
  initdata.data = initdata.data.map((obj) => ({
    ...obj,
    owner: "6776b7178edf626ea27afd9b",
  }));
  await paywayUser.insertMany(initdata.data);
  console.log("Data was saved ...");
};

initDB();
