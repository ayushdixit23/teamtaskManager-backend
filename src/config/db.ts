import pkg from "pg"
import { DATABASE_URL } from "./env.js";

const { Pool } = pkg;

const pool = new Pool({
    connectionString: DATABASE_URL,
    max: 10,
})

pool.connect()
    .then(client => {
        console.log("✅ PostgreSQL connected successfully");
        client.release();
    })
    .catch(err => console.error("❌ PostgreSQL connection error", err.stack));


export default pool;