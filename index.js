const express = require('express');
const path = require('path');
const bodyParser = require('body-parser').urlencoded({ extended: false });
const app = express();
app.set('port', process.env.PORT || 5000);

const server = app.listen(app.get('port'),()=>{
    console.log("Servidor en puerto: ",server.address().port);
});


//Renderizar con ejs
app.set('view engine', 'ejs');
app.engine("html", require("ejs").renderFile);

//Para sólo utilizar el nombre de la dirección
app.set('views', path.join(__dirname,'views'));

//Acceder archivos estaticos
app.use("/public",express.static("public"));
app.use(bodyParser);

//Rutas
const main = require("./routes/main");


//Utilizacion
app.use(main);

