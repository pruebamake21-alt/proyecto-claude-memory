-- Tabla para comandos recibidos desde Telegram
CREATE TABLE IF NOT EXISTS telegram_commands (
    id BIGSERIAL PRIMARY KEY,
    message_id BIGINT NOT NULL,
    chat_id BIGINT NOT NULL,
    user_id BIGINT,
    username TEXT,
    command TEXT NOT NULL,
    status TEXT DEFAULT 'pending', -- pending, processing, completed, failed
    result TEXT, -- resultado del comando ejecutado
    executed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para búsquedas eficientes
CREATE INDEX IF NOT EXISTS idx_telegram_commands_status ON telegram_commands(status);
CREATE INDEX IF NOT EXISTS idx_telegram_commands_chat_id ON telegram_commands(chat_id);
CREATE INDEX IF NOT EXISTS idx_telegram_commands_created_at ON telegram_commands(created_at DESC);

-- Política RLS: Solo permitir inserciones desde Edge Functions (service role)
ALTER TABLE telegram_commands ENABLE ROW LEVEL SECURITY;

-- Permitir lectura solo al dueño del chat
CREATE POLICY "Allow chat owner to read own commands" ON telegram_commands
    FOR SELECT
    USING (chat_id = 8300908705);

COMMENT ON TABLE telegram_commands IS 'Comandos recibidos desde Telegram Webhook para sistema OpenClaw';
