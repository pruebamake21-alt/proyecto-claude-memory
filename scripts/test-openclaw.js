#!/usr/bin/env node
/**
 * Script de prueba para OpenClaw
 * Inserta comandos de prueba directamente en la base de datos
 */

const { Client } = require('pg');

const pgClient = new Client({
    connectionString: 'postgresql://postgres:957dd642b72c0a90@db.qltlbagluuwihjlcsyyx.supabase.co:5432/postgres',
    ssl: { rejectUnauthorized: false }
});

async function insertTestCommands() {
    try {
        await pgClient.connect();
        console.log('✅ Conectado a PostgreSQL');

        // Insertar comandos de prueba
        const testCommands = [
            { command: 'status', description: 'Estado del agente' },
            { command: 'ping', description: 'Test de latencia' },
            { command: 'memory', description: 'Uso de memoria' },
            { command: 'disk', description: 'Estado de discos' },
            { command: 'git status', description: 'Estado del repositorio' }
        ];

        for (const test of testCommands) {
            await pgClient.query(
                `INSERT INTO telegram_commands (message_id, chat_id, user_id, username, command, status, created_at)
                 VALUES ($1, $2, $3, $4, $5, $6, NOW())`,
                [
                    Date.now(), // message_id simulado
                    8300908705, // chat_id autorizado
                    8300908705, // user_id
                    'test_user', // username
                    test.command,
                    'pending'
                ]
            );
            console.log(`📝 Insertado: "${test.command}" - ${test.description}`);
        }

        console.log('\n✅ Comandos de prueba insertados');
        console.log('⏳ El OpenClaw Agent los procesará automáticamente');

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await pgClient.end();
    }
}

insertTestCommands();
