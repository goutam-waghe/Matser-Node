import app from "./app.js";
import dbConnection from "./config/dbconnection.js";
dbConnection();
const port = process.env.PORT || 5000;
app.listen(port, function () {
  console.log("server is running on ", port);
});
