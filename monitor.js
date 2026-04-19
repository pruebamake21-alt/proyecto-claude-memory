const { Client } = require('pg');
const TelegramBot = require('node-telegram-bot-api');

// Configuración
const TELEGRAM_TOKEN = '8485071572:AAFn9mfQx2Ov2QtmT7iv2VWYRbPE4taFmgs';
const CHAT_ID = '8300908705';

// Conexión PostgreSQL directa a Supabase
const pgClient = new Client({
  connectionString: 'postgresql://postgres:957dd642b72c0a90@db.qltlbagluuwihjlcsyyx.supabase.co:5432/postgres',
  ssl: {
    rejectUnauthorized: false
  }
});

const bot = new TelegramBot(TELEGRAM_TOKEN, { polling: false });

async function checkWaitlist() {
  try {
    console.log('Conectando a PostgreSQL (Supabase)...');
    await pgClient.connect();

    // Consulta para contar usuarios en waitlist
    const result = await pgClient.query('SELECT COUNT(*) as total FROM waitlist');
    const count = parseInt(result.rows[0].total);

    await pgClient.end();

    const message = `📊 Reporte de Waitlist\n\nTotal de usuarios registrados: ${count}`;

    console.log('Enviando mensaje a Telegram...');
    await bot.sendMessage(CHAT_ID, message);

    console.log('✅ Mensaje enviado correctamente');
    console.log(`Usuarios en waitlist: ${count}`);

  } catch (error) {
    console.error('❌ Error:', error.message);

    // Enviar notificación de error por Telegram
    const errorMessage = `⚠️ Error en el monitor:\n\n${error.message}`;
    await bot.sendMessage(CHAT_ID, errorMessage).catch(console.error);

    process.exit(1);
  }
}

// Ejecutar el monitor
checkWaitlist();
