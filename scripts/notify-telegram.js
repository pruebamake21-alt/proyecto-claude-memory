const TelegramBot = require('node-telegram-bot-api');

const token = '8485071572:AAFn9mfQx2Ov2QtmT7iv2VWYRbPE4taFmgs';
const chatId = '8300908705';

const bot = new TelegramBot(token, { polling: false });

const message = `🦀 OpenClaw Agent OPERATIVO

✅ Base de datos: Conectada
✅ Webhook: Configurado
✅ Agente: Escuchando comandos

🔒 Solo tú (Chat ID: 8300908705) tienes control.

📱 Comandos disponibles:
• status - Estado del sistema
• ping - Test de latencia
• memory - Uso de memoria
• disk - Estado de discos
• git status - Estado del repo
• ls - Listar directorio

🦀 OpenClaw listo para recibir órdenes.`;

bot.sendMessage(chatId, message)
    .then(() => {
        console.log('✅ Mensaje enviado correctamente');
        process.exit(0);
    })
    .catch((err) => {
        console.error('❌ Error:', err.message);
        process.exit(1);
    });
