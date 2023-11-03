//i installe nodemon : tool give me the ability to restart the app automatcly everytime i save changes 
//use this command to install it : npm install -g nodemon 
//and to run , you should use "nodemon app.js", not "node app.js"
//i our case here , we will write just nodemon because nodemon will go and
//use our spicific comman line in package.json {"start": "node server.js"} 
//to install express : {npm install express --save}, it will install the last version of express 
'use strict';
const express = require('express');
const app = express();//we invoking the core of express method
//like this we create an istance of express application, this the top level application 
//it's sufficien fo simple application , or you can build multiple application and plug 
//them into this top level instance, issentially this is the core where everything plugs in .
app.set('port', process.env.PORT || 3000);//here we are setting our port in a variable istand of wirtting a hard 3000 in app.listen

let helloMiddelware = (req, res, next) => {//next for midelware
    req.hello = "Hello it's me! , i was wondering.......you get the idea!";
    next();//you should call the next function every time to get sure that continues to process the route handler
}

app.use(helloMiddelware);//we put our Middelware in use , like this we can use it 

//we can also specifi the route into the use of the middelware
//app.use('/',helloMiddelware)
// '/' it's mean it will invoked into every rout 
//app.use('/dashboard',helloMiddelware)
// '/dashboard' it's mean that it will be used exclusively into 
//this route even if the middelware is called into other route 

app.get('/', (req, res, next) => {// next here for multiple Route Handler Functions, to pre-process data
    res.send('<h1>Hello Express MaxmosPrime</h1>');
});
app.get('/dashboard', (req, res, next)=>{
    res.send('<h1>Hello Express DashBoard , MiddelWare sayes : '+ req.hello +'</h1>')
});
// app.listen(3000, ()=>{
//     console.log('chatCat running on port ', 3000);
// });
app.listen(app.get('port'), ()=>{
    console.log('chatCat running on port ', app.get('port'));
});