#!/usr/bin/env node
/**
 * Inicializa la base de datos para OpenClaw
 */

const { Client } = require('pg');

const pgClient = new Client({
    connectionString: 'postgresql://postgres:957dd642b72c0a90@db.qltlbagluuwihjlcsyyx.supabase.co:5432/postgres',
    ssl: { rejectUnauthorized: false }
});

async function initDB() {
    try {
        await pgClient.connect();
        console.log('✅ Conectado a PostgreSQL');

        // Crear tabla telegram_commands
        const createTableSQL = `
            CREATE TABLE IF NOT EXISTS telegram_commands (
                id BIGSERIAL PRIMARY KEY,
                message_id BIGINT NOT NULL,
                chat_id BIGINT NOT NULL,
                user_id BIGINT,
                username TEXT,
                command TEXT NOT NULL,
                status TEXT DEFAULT 'pending',
                result TEXT,
                executed_at TIMESTAMP WITH TIME ZONE,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );

            CREATE INDEX IF NOT EXISTS idx_telegram_commands_status ON telegram_commands(status);
            CREATE INDEX IF NOT EXISTS idx_telegram_commands_chat_id ON telegram_commands(chat_id);
            CREATE INDEX IF NOT EXISTS idx_telegram_commands_created_at ON telegram_commands(created_at DESC);

            ALTER TABLE telegram_commands ENABLE ROW LEVEL SECURITY;

            DROP POLICY IF EXISTS "Allow chat owner to read own commands" ON telegram_commands;
            CREATE POLICY "Allow chat owner to read own commands" ON telegram_commands
                FOR SELECT
                USING (chat_id = 8300908705);
        `;

        await pgClient.query(createTableSQL);
        console.log('✅ Tabla telegram_commands creada/actualizada');

        // Verificar que existe
        const result = await pgClient.query("SELECT COUNT(*) as count FROM telegram_commands");
        console.log(`📊 Registros actuales: ${result.rows[0].count}`);

        await pgClient.end();
        console.log('✅ Base de datos inicializada correctamente');

    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

initDB();
