import pool from "../config/db.js";


export default class User {
    static async create({ name, email, password }: { name: string, email: string, password: string }) {
        const result = await pool.query(
            `INSERT INTO users (name, email, password)
     VALUES ($1, $2, $3)
     RETURNING *`,
            [name, email, password]
        );
        return result.rows[0];
    }

    static async findByEmail(email: string) {
        const result = await pool.query(
            `SELECT * FROM users WHERE email = $1`,
            [email]
        );
        return result.rows[0];
    }

    static async findById(id: number) {
        const result = await pool.query(
            `SELECT id, name , email, image_url FROM users WHERE id = $1`,
            [id]
        );
        return result.rows[0];
    }
    static async findAll() {
        const result = await pool.query("SELECT * FROM users")
        return result.rows[0];
    }
}