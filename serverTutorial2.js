'use strict';
const express = require('express');
const app = express();

app.set('port', process.env.PORT || 3000);
app.use(express.static('public'));

//app.set('views', './views');//there is no need to this because our file where
// .ejs exist called views ,but if we called another name , we should specified
app.set('view engine', 'ejs');//view engine it's not a costum property , it's bult-in module in express
//like this we can use ejs files without specific file extention get mentioned 

app.get('/', (req, res, next) => {
    //res.sendFile(__dirname+ '/views/login.htm');//with sendFile you can send and serve file from our disc (serve a static file)
    res.render('login');//you should also change the extention of file to ejs
    // res.render('login',{
    //     pageTitle: 'mamma tua'   //like this you send attribiutes to ejs file.
    // });
});

app.listen(app.get('port'), ()=>{
    console.log('chatCat running on port ', app.get('port'));
});