import { config } from "dotenv";

config({ path: ".env.local" });

export const { PORT, DB_URL, JWT_SECRET } = process.env;
