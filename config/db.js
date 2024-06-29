
const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
    host:process.env.DB_HOST,
    user: process.env.DB_USER,
    password :process.env.DB_PASSWORD,
    database:process.env.DB_NAME
});

// const pool = mysql.createPool({
//     host: 'lms-database.cjum8q0m8h5v.us-east-1.rds.amazonaws.com',
//     user: 'admin',
//     password: 'lmsdb2024',
//     database: 'lmsdb',
//     waitForConnections: true,
//     connectionLimit: 10,
//     queueLimit: 0
// });


// const pool = mysql.createPool({
//     host: 'lms-db.cjum8q0m8h5v.us-east-1.rds.amazonaws.com',
//     user: 'admin',
//     password: 'lmsdb2024',
//     database: 'lmsdb',
//     waitForConnections: true,
//     connectionLimit: 10,
//     queueLimit: 0
// });



// Test the database connection
pool.getConnection((err, connection) => {
    if (err) {
        console.error('Error connecting to the database:', err.message);
    } else {
        console.log('Database connected successfully.');
        connection.release();
    }
});


module.exports = pool.promise();