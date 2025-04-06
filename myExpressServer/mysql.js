import mysql from 'mysql2';

const mysqlDB = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Maayan123',
    database: 'myproject'
});

mysqlDB.connect(err => {
    if (err) {
        console.error('MySQL connection failed:', err);
        return;
    }
    console.log('Connected to MySQL');
});

export default mysqlDB;