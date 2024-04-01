import dotenv from "dotenv";
import connectDatabase from "./db/index.js";
import app  from "./app.js";

dotenv.config({
  path: "./env",
});


connectDatabase()

  .then((response) => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is runing at port ${process.env.PORT}`);
    });
  })
  .catch((error) => console.log("MONGO CONNECTION FAILED !! ", error));
