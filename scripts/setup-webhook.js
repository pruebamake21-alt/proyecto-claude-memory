#!/usr/bin/env node
/**
 * Configura el webhook de Telegram para la Edge Function
 */

const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const TELEGRAM_TOKEN = '8485071572:AAFn9mfQx2Ov2QtmT7iv2VWYRbPE4taFmgs';

async function setupWebhook() {
    console.log('🔗 Configuración del Webhook de Telegram\n');
    console.log('Para configurar el webhook necesitas:');
    console.log('1. URL de tu Edge Function (ej: https://qltlbagluuwihjlcsyyx.supabase.co/functions/v1/telegram-webhook)');
    console.log('2. El token del bot ya está configurado\n');

    rl.question('Ingresa la URL de tu Edge Function: ', async (url) => {
        if (!url || !url.includes('supabase.co')) {
            console.log('❌ URL inválida. Debe ser una URL de Supabase Edge Function.');
            rl.close();
            return;
        }

        try {
            // Configurar webhook
            const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/setWebhook`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    url: url,
                    allowed_updates: ['message']
                })
            });

            const data = await response.json();

            if (data.ok) {
                console.log('\n✅ Webhook configurado correctamente');
                console.log(`📡 URL: ${url}`);
                console.log('\n🧪 Prueba enviando un mensaje a tu bot @MonitorSaaS_bot');
            } else {
                console.log('\n❌ Error:', data.description);
            }

            // Verificar estado
            const infoResponse = await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/getWebhookInfo`);
            const info = await infoResponse.json();
            console.log('\n📊 Estado del webhook:', JSON.stringify(info, null, 2));

        } catch (error) {
            console.error('❌ Error:', error.message);
        }

        rl.close();
    });
}

setupWebhook();
