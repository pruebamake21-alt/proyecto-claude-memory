#!/usr/bin/env node
/**
 * OpenClaw Agent v2.0 - Sistema de Control Remoto con Lenguaje Natural
 * Procesa comandos en lenguaje natural y los ejecuta de forma segura
 */

const { Client } = require('pg');
const TelegramBot = require('node-telegram-bot-api');
const Anthropic = require('@anthropic-ai/sdk');
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

// Configuración
const CONFIG = {
    AUTHORIZED_CHAT_ID: 8300908705,
    TELEGRAM_TOKEN: '8485071572:AAFn9mfQx2Ov2QtmT7iv2VWYRbPE4taFmgs',
    DATABASE_URL: 'postgresql://postgres:957dd642b72c0a90@db.qltlbagluuwihjlcsyyx.supabase.co:5432/postgres',
    ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY || '',
    POLL_INTERVAL: 2000,

    // Comandos permitidos con sus descripciones para IA
    ALLOWED_COMMANDS: {
        'status': { cmd: 'status', desc: 'Mostrar estado del agente y sistema', shell: false },
        'ping': { cmd: 'ping', desc: 'Test de latencia a la base de datos', shell: false },
        'memory': { cmd: 'memory', desc: 'Uso de memoria del proceso', shell: false },
        'disk': { cmd: 'disk', desc: 'Espacio disponible en discos', shell: false },
        'uptime': { cmd: 'uptime', desc: 'Tiempo de actividad del sistema', shell: true, exec: 'uptime' },
        'ls': { cmd: 'ls', desc: 'Listar archivos del directorio actual', shell: true, exec: 'ls -la' },
        'dir': { cmd: 'dir', desc: 'Listar archivos (Windows)', shell: true, exec: 'dir /b' },
        'git status': { cmd: 'git status', desc: 'Estado del repositorio git', shell: true },
        'git log': { cmd: 'git log --oneline -5', desc: 'Últimos commits del repositorio', shell: true },
        'npm list': { cmd: 'npm list --depth=0', desc: 'Dependencias npm instaladas', shell: true },
        'node version': { cmd: 'node --version', desc: 'Versión de Node.js', shell: true },
        'npm version': { cmd: 'npm --version', desc: 'Versión de npm', shell: true },
        'help': { cmd: 'help', desc: 'Mostrar ayuda y comandos disponibles', shell: false }
    }
};

// Clientes
const pgClient = new Client({
    connectionString: CONFIG.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

const bot = new TelegramBot(CONFIG.TELEGRAM_TOKEN, { polling: false });
const anthropic = new Anthropic({ apiKey: CONFIG.ANTHROPIC_API_KEY });

// Estado
let isRunning = true;
let processedCount = 0;

// Construir prompt para IA
function buildSystemPrompt() {
    const commandsList = Object.entries(CONFIG.ALLOWED_COMMANDS)
        .map(([key, val]) => `- "${key}": ${val.desc}`)
        .join('\n');

    return `Eres el OpenClaw Agent, un asistente de control remoto.

Tu tarea es interpretar mensajes en lenguaje natural del usuario y mapearlos a comandos permitidos.

COMANDOS PERMITIDOS:
${commandsList}

INSTRUCCIONES:
1. Analiza la intención del usuario
2. Si el mensaje corresponde a un comando permitido, responde EXACTAMENTE con: COMMAND: <nombre_del_comando>
3. Si el usuario pregunta algo general o hace conversación, responde de forma amigable sin usar el prefijo COMMAND
4. Si el usuario pide algo que NO está en la lista de comandos permitidos, explica amablemente que solo puedes ejecutar ciertos comandos
5. Si el mensaje es ambiguo, pide aclaración

EJEMPLOS:
Usuario: "cómo estás?" -> Respuesta conversacional
Usuario: "muéstrame el estado" -> COMMAND: status
Usuario: "cuánta memoria hay" -> COMMAND: memory
Usuario: "qué archivos hay aquí" -> COMMAND: ls
Usuario: "estado del repo" -> COMMAND: git status
Usuario: "borra todo" -> Lo siento, no puedo ejecutar ese comando por seguridad.

Responde en español de forma concisa y profesional.`;
}

// Interpretar mensaje con IA
async function interpretCommand(userMessage) {
    // Si no hay API key, fallback a matching simple
    if (!CONFIG.ANTHROPIC_API_KEY) {
        return interpretCommandSimple(userMessage);
    }

    try {
        const response = await anthropic.messages.create({
            model: 'claude-3-haiku-20240307',
            max_tokens: 150,
            system: buildSystemPrompt(),
            messages: [{ role: 'user', content: userMessage }]
        });

        const text = response.content[0].text.trim();

        // Buscar si hay un comando en la respuesta
        const commandMatch = text.match(/^COMMAND:\s*(.+)$/im);
        if (commandMatch) {
            const cmd = commandMatch[1].trim().toLowerCase();
            // Verificar que el comando esté permitido
            for (const [key, val] of Object.entries(CONFIG.ALLOWED_COMMANDS)) {
                if (cmd === key || cmd === val.cmd) {
                    return { type: 'command', command: val.cmd, response: null };
                }
            }
            return { type: 'error', response: `Comando "${cmd}" no está en la lista de permitidos.` };
        }

        // Respuesta conversacional
        return { type: 'chat', response: text };

    } catch (error) {
        console.error('Error IA:', error.message);
        // Fallback a interpretación simple
        return interpretCommandSimple(userMessage);
    }
}

// Interpretación simple sin IA (fallback)
function interpretCommandSimple(message) {
    const lowerMsg = message.toLowerCase();

    // Mapeo de palabras clave a comandos
    const keywordMap = {
        'status': ['estado', 'cómo vas', 'cómo estás', 'status', 'qué tal', 'todo bien'],
        'ping': ['ping', 'latencia', 'conexión', 'responde', 'estás ahí'],
        'memory': ['memoria', 'ram', 'consumo', 'recursos'],
        'disk': ['disco', 'espacio', 'almacenamiento', 'gb', 'mb'],
        'uptime': ['uptime', 'tiempo', 'encendido', 'cuánto llevas'],
        'ls': ['archivos', 'ficheros', 'carpeta', 'directorio', 'listar', 'qué hay', 'ls'],
        'dir': ['archivos', 'directorio', 'listar'],
        'git status': ['git', 'repositorio', 'cambios', 'estado repo', 'status git'],
        'git log': ['commits', 'historial', 'cambios recientes', 'log', 'últimos commits'],
        'npm list': ['dependencias', 'paquetes', 'módulos', 'npm'],
        'node version': ['versión node', 'node.js', 'qué node'],
        'npm version': ['versión npm', 'qué npm'],
        'help': ['ayuda', 'help', 'comandos', 'qué puedes hacer', 'opciones']
    };

    for (const [cmd, keywords] of Object.entries(keywordMap)) {
        if (keywords.some(kw => lowerMsg.includes(kw))) {
            if (CONFIG.ALLOWED_COMMANDS[cmd]) {
                return { type: 'command', command: CONFIG.ALLOWED_COMMANDS[cmd].cmd, response: null };
            }
        }
    }

    // Comando exacto
    if (CONFIG.ALLOWED_COMMANDS[lowerMsg]) {
        return { type: 'command', command: CONFIG.ALLOWED_COMMANDS[lowerMsg].cmd, response: null };
    }

    // No se reconoció
    return { type: 'unknown', response: 'No entendí bien. Escribe "ayuda" para ver qué puedo hacer.' };
}

// Handlers de comandos
const commandHandlers = {
    status: async () => {
        return `🦀 OpenClaw Agent v2.0
🤖 Estado: Activo
📊 Comandos procesados: ${processedCount}
⏱️ Uptime: ${process.uptime().toFixed(0)}s
🧠 Modo: Lenguaje natural`;
    },

    ping: async () => {
        const start = Date.now();
        await pgClient.query('SELECT 1');
        const latency = Date.now() - start;
        return `🏓 Pong!\n📡 Latencia DB: ${latency}ms`;
    },

    memory: async () => {
        const used = process.memoryUsage();
        return `🧠 Memoria del Agent:\n` +
            `RSS: ${(used.rss / 1024 / 1024).toFixed(2)} MB\n` +
            `Heap: ${(used.heapUsed / 1024 / 1024).toFixed(2)} / ${(used.heapTotal / 1024 / 1024).toFixed(2)} MB`;
    },

    disk: async () => {
        try {
            const { stdout } = await execPromise('wmic logicaldisk get size,freespace,caption');
            return `💾 Estado de discos:\n\`\`\`\n${stdout}\`\`\``;
        } catch (e) {
            try {
                const { stdout } = await execPromise('df -h');
                return `💾 Estado de discos:\n\`\`\`\n${stdout}\`\`\``;
            } catch (e2) {
                return `💾 No pude obtener información de discos`;
            }
        }
    },

    uptime: async () => {
        try {
            const { stdout } = await execPromise('uptime');
            return `⏱️ Uptime del sistema:\n${stdout}`;
        } catch (e) {
            return `⏱️ Uptime del Agent: ${process.uptime().toFixed(0)}s`;
        }
    },

    ls: async () => {
        try {
            const { stdout } = await execPromise('ls -la');
            return `📁 Directorio actual:\n\`\`\`\n${stdout}\`\`\``;
        } catch (e) {
            const { stdout } = await execPromise('dir /b');
            return `📁 Directorio actual:\n\`\`\`\n${stdout}\`\`\``;
        }
    },

    dir: async () => {
        const { stdout } = await execPromise('dir /b');
        return `📁 Directorio actual:\n\`\`\`\n${stdout}\`\`\``;
    },

    'git status': async () => {
        try {
            const { stdout } = await execPromise('git status');
            return `📦 Git Status:\n\`\`\`\n${stdout}\`\`\``;
        } catch (e) {
            return `📦 Git Status: ${e.message}`;
        }
    },

    'git log --oneline -5': async () => {
        try {
            const { stdout } = await execPromise('git log --oneline -5');
            return `📜 Últimos commits:\n\`\`\`\n${stdout}\`\`\``;
        } catch (e) {
            return `📜 Error: ${e.message}`;
        }
    },

    'npm list --depth=0': async () => {
        try {
            const { stdout } = await execPromise('npm list --depth=0');
            return `📦 Dependencias:\n\`\`\`\n${stdout}\`\`\``;
        } catch (e) {
            return `📦 Dependencias:\n${e.stdout || e.message}`;
        }
    },

    'node --version': async () => {
        return `⬢ Node.js: ${process.version}`;
    },

    'npm --version': async () => {
        try {
            const { stdout } = await execPromise('npm --version');
            return `📦 npm: v${stdout.trim()}`;
        } catch (e) {
            return `📦 npm: versión no disponible`;
        }
    },

    help: async () => {
        const list = Object.entries(CONFIG.ALLOWED_COMMANDS)
            .map(([key, val]) => `• ${key} - ${val.desc}`)
            .join('\n');
        return `🦀 OpenClaw Agent - Comandos disponibles:\n\n${list}\n\n💡 También entiendo lenguaje natural. Pregúntame como quieras.`;
    }
};

// Procesar comando
async function processCommand(commandRow) {
    const { id, command, chat_id, username } = commandRow;

    console.log(`⚡ Procesando: "${command}" desde @${username}`);

    try {
        await pgClient.query(
            'UPDATE telegram_commands SET status = $1 WHERE id = $2',
            ['processing', id]
        );

        // Interpretar el mensaje (lenguaje natural)
        const interpretation = await interpretCommand(command);
        let result;

        if (interpretation.type === 'chat') {
            // Respuesta conversacional
            result = interpretation.response;
        } else if (interpretation.type === 'command') {
            // Ejecutar comando
            const cmd = interpretation.command;
            const handler = commandHandlers[cmd];
            if (handler) {
                result = await handler();
            } else {
                result = `Comando "${cmd}" no implementado.`;
            }
        } else if (interpretation.type === 'error') {
            result = `⚠️ ${interpretation.response}`;
        } else {
            result = interpretation.response || 'No entendí el mensaje. Escribe "ayuda" para ver opciones.';
        }

        await pgClient.query(
            'UPDATE telegram_commands SET status = $1, result = $2, executed_at = NOW() WHERE id = $3',
            ['completed', result, id]
        );

        await bot.sendMessage(chat_id, result, { parse_mode: 'Markdown' });

        processedCount++;
        console.log(`✅ Completado: ${command} → ${interpretation.type}`);

    } catch (error) {
        console.error(`❌ Error:`, error);

        await pgClient.query(
            'UPDATE telegram_commands SET status = $1, result = $2, executed_at = NOW() WHERE id = $3',
            ['failed', error.message, id]
        );

        await bot.sendMessage(chat_id, `❌ Error: ${error.message}`);
    }
}

// Loop principal
async function pollCommands() {
    while (isRunning) {
        try {
            const result = await pgClient.query(
                'SELECT * FROM telegram_commands WHERE status = $1 AND chat_id = $2 ORDER BY created_at ASC',
                ['pending', CONFIG.AUTHORIZED_CHAT_ID]
            );

            if (result.rows.length > 0) {
                console.log(`📥 ${result.rows.length} mensaje(s) pendiente(s)`);

                for (const row of result.rows) {
                    await processCommand(row);
                }
            }

            await new Promise(resolve => setTimeout(resolve, CONFIG.POLL_INTERVAL));

        } catch (error) {
            console.error('❌ Error en polling:', error);
            await new Promise(resolve => setTimeout(resolve, CONFIG.POLL_INTERVAL));
        }
    }
}

// Inicialización
async function init() {
    console.log('🦀 OpenClaw Agent v2.0 iniciando...');
    console.log(`🔒 Chat ID autorizado: ${CONFIG.AUTHORIZED_CHAT_ID}`);
    console.log(`🧠 Modo: Lenguaje natural ${CONFIG.ANTHROPIC_API_KEY ? '(Claude AI)' : '(Keyword matching)'}`);
    console.log(`⏱️ Polling cada ${CONFIG.POLL_INTERVAL}ms`);

    try {
        await pgClient.connect();
        console.log('✅ Conectado a PostgreSQL');

        const mode = CONFIG.ANTHROPIC_API_KEY ? 'IA (Claude)' : 'Keywords';
        await bot.sendMessage(
            CONFIG.AUTHORIZED_CHAT_ID,
            `🦀 *OpenClaw Agent v2.0 iniciado*\n\n` +
            `✅ Modo: *Lenguaje natural* (${mode})\n` +
            `🔒 Chat autorizado: \`${CONFIG.AUTHORIZED_CHAT_ID}\`\n\n` +
            `Puedes hablarme de forma natural. Ejemplos:\n` +
            `• "cómo estás?" → Saludo\n` +
            `• "muéstrame el estado" → Estado del sistema\n` +
            `• "qué archivos hay" → Listar directorio\n` +
            `• "ayuda" → Ver todos los comandos`,
            { parse_mode: 'Markdown' }
        );

        await pollCommands();

    } catch (error) {
        console.error('❌ Error inicializando:', error);
        process.exit(1);
    }
}

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('\n👋 Cerrando OpenClaw Agent...');
    isRunning = false;
    await pgClient.end();
    await bot.sendMessage(CONFIG.AUTHORIZED_CHAT_ID, '👋 OpenClaw Agent detenido');
    process.exit(0);
});

process.on('SIGTERM', async () => {
    isRunning = false;
    await pgClient.end();
    process.exit(0);
});

init();
