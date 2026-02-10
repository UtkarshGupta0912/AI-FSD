

// function sum(a,b){
//     return a+b;
// }
// console.log(sum(12,23))

// let sum=(a,b)=>a+b;

// import {sum,dif} from './math.js'
// console.log(sum(12,13));
// console.log(dif(14,9));

// const fs=require('fs');

// console.log("Task started")


// fs.readFile('data.json','utf8',(err,data)=>{
//     if(err){
//         console.error(err);
//     }else{
//         console.log(data)
//     }
// });
// console.log("Task completed")

const http=require('http');

const server=http.createServer((req,res)=>{
    res.writeHead(200,{'Content-Type':'text/plain'});
    res.end('Hello World\n');
})

const PORT=3000;
server.listen(PORT,()=>{
    console.log(`Server is running at http://localhost:3000`);
});