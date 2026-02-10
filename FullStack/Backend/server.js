// console.log("Hello World");

// const fs = require("fs");
// fs.readFile("data.txt", "utf-8", (err, data) => {
//     if(err){
//         console.log("Error message: ", err);
//         return;
//     } else {
//         console.log("Data: ", data);
//     }
// });

// var a = 10;
// var b = 20;
// function add(a, b) {
//     return a + b;
// }

// var result = add(a, b);
// console.log("The result is: ", result);

// var a = 10;
// var b = 20;

// const add = (a, b) => {
//     return a + b;
// }

// console.log("The result is: ", add(a, b));

// setTimeout(function() {
//     console.log("Hello World");
// }, 1);

// Complete Normal Code
// function processData(name, callback) {
//     console.log("Processing data for: ", name);

//     //Simulating a time-consuming task
//     setTimeout(function() {
//         console.log("Data processed for: ", name);
//         callback(name);
//     }, 2000);
// }

// // Callback function
// function showResult(result) {
//     console.log("Callback received data for:", result);
// }

// // Function call
// processData("Anuraag", showResult);

// Complete code using Arrow function
// const processData = (studentName) => {
//     console.log("Processing data for: ", studentName);
//     console.log("Data processed for: ", studentName);
//     return studentName;
// }

// const showResult = (result) => {
//     console.log("Callback received data for: ", result);
// }

// const result = processData("Anuraag");
// showResult(result);

// const fs = require("fs");

// fs.readFile("data.txt", "utf-8", (err, data) => {
//     if(err){
//         console.log("Error message: ", err);
//         return;
//     } else {
//         console.log("Data: ", data);
//     }
// });

// fs.writeFile("data.txt", "Hello World", (err) => {
//     if(err){
//         console.log("Error message: ", err);
//         return;
//     } else {
//         console.log("File written successfully");
//     }
// });

// fs.appendFile("data.txt", "\nWelcome to my World", (err) => {
//     if(err){
//         console.log("Error message: ", err);
//         return;
//     } else {
//         console.log("File appended successfully: ");
//     }
// });

// fs.copyFile("data.txt", "data_copy.txt", (err) => {
//     if(err){
//         console.log("Error message: ", err);
//         return;
//     } else {
//         console.log("File copied successfully");
//     }
// });

// fs.rename("data_copy.txt", "data_renamed.txt", (err) => {
//     if(err){
//         console.log("Error message: ", err);
//         return;
//     } else {
//         console.log("File renamed successfully");
//     }
// });

// fs.rm("data_renamed.txt", (err) => {
//     if(err){
//         console.log("Error message: ", err);
//         return;
//     } else {
//         console.log("File deleted successfully");
//     }
// });

// const http = require("http");

// const server = http.createServer((req, res) => {

//     if(req.url === "/") {
//         res.write("Welcome to Home Page");
//     }

//     else if (req.url === "/login") {
//         res.write("Login successfully");
//     } 

//     else if (req.url === "/dashboard") {
//         res.write("Dashboard Loaded");
//     }

//     else if (req.url === "/data") {
//         res.write("Fetching Data...");
//     }
     
//     else {
//         res.write("404 Page Not Found");
//     }

//     res.end();
// });

// server.listen(3000, () => {
//     console.log("Server is running on port 3000");
// });

// const http = require("http");

// const path = require("path");

// const fs = require("fs");

// const server = http.createServer((req, res) => {
//     let filePath = path.join(__dirname, "public", req.url === "/" ? "index.html" : req.url);
//     let extname = path.extname(filePath);
//     let contentType = "text/html";

//     switch(extname) {
//         case ".js":
//             contentType = "text/javascript";
//             break;
//         case ".css":
//             contentType = "text/css";
//             break;
//         case ".json":
//             contentType = "application/json";
//             break;
//         case ".png":
//             contentType = "image/png";
//             break;
//         case ".jpg":
//             contentType = "image/jpg";
//             break;
//     }

//     fs.readFile(filePath, (err, content) => {
//         if(err) {
//             if(err.code === "ENOENT") {
//                 fs.readFile(path.join(__dirname, "public", "404.html"), (err, content) => {
//                     res.writeHead(404, {"Content-Type": "text/html"});
//                     res.end(content, "utf-8");
//                 });
//             } else {
//                 res.writeHead(500);
//                 res.end("Server Error: " + err.code);
//             }
//         } else {
//             res.writeHead(200, {"Content-Type": contentType});
//             res.end(content, "utf-8");
//         }
//     });
// });

// server.listen(3000, () => {
//     console.log("Server is running on port 3000");
// });

// Using url module to parse query parameters

// const url = require("url");

// const myUrl = "http://localhost:3000/data?id=10&name=Anuraag";
// const parsedUrl = url.parse(myUrl, true);

// console.log(parsedUrl.query);

// Importing os module to get system information

// const os = require("os");

// console.log(os.platform());   // win32, darwin, linux
// console.log(os.arch());       // x64
// console.log(os.totalmem());   // Total RAM
// console.log(os.freemem());    // Free RAM
// console.log(os.cpus().length); // CPU cores

// Hashing a password using crypto module

const crypto = require("crypto");

const password = "mypassword";

const hash = crypto.createHash("sha256")
    .update(password)
    .digest("hex");

console.log(hash);

// Generating a random token using crypto module
// const crypto = require("crypto");

// function generateToken() {
//     return crypto.randomBytes(16).toString("hex");
// }

// console.log(generateToken());


