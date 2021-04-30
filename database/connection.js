const mysql = require("mysql");

//se le da paramentros a la conexion
const mysqlConnection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "alpine",
    database: "employees",
    multipleStatements: true,
});

//se inicia la conexion
mysqlConnection.connect((err) => {
    //revisa si no ocurrio algun error
    if (err) {
        console.log("BD: conexión fallida: " + err);
    } else {
        console.log("BD: conexión exitosa");
    }
});

module.exports = mysqlConnection;