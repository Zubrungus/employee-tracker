import dotenv from 'dotenv';
dotenv.config();
import pg from 'pg';
const {Pool} = pg;

//Details for connecting to database
const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: 'localhost',
    database: process.env.DB_NAME,
    port: 5432
});

//Connects to databse when ran
const connectToDb = async () => {
    try {
        await pool.connect();
        console.log('Connected to database.');
    }catch(err){
        console.error('Error: ', err);
        process.exit(1);
    }
};

export {pool, connectToDb}; 