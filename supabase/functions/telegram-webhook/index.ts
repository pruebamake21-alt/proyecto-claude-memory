// Edge Function: Recibe webhooks de Telegram y guarda comandos
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface TelegramUpdate {
  message?: {
    message_id: number
    from?: {
      id: number
      username?: string
      first_name?: string
    }
    chat?: {
      id: number
    }
    text?: string
    date: number
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const update: TelegramUpdate = await req.json()

    // Validar que hay mensaje
    if (!update.message || !update.message.text) {
      return new Response(JSON.stringify({ ok: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const chatId = update.message.chat?.id
    const userId = update.message.from?.id
    const username = update.message.from?.username || 'unknown'
    const text = update.message.text.trim()
    const messageId = update.message.message_id

    // 🔒 FILTRO DE SEGURIDAD: Solo permitir Chat ID autorizado
    const AUTHORIZED_CHAT_ID = 8300908705

    if (chatId !== AUTHORIZED_CHAT_ID && userId !== AUTHORIZED_CHAT_ID) {
      console.log(`🚫 Acceso denegado para Chat ID: ${chatId}, User ID: ${userId}`)
      return new Response(JSON.stringify({ ok: true, error: 'Unauthorized' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Crear cliente Supabase con service role
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Guardar comando en la tabla
    const { error } = await supabase
      .from('telegram_commands')
      .insert({
        message_id: messageId,
        chat_id: chatId,
        user_id: userId,
        username: username,
        command: text,
        status: 'pending',
        created_at: new Date().toISOString()
      })

    if (error) {
      console.error('Error guardando comando:', error)
      return new Response(JSON.stringify({ ok: false, error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    console.log(`✅ Comando recibido: "${text}" de ${username} (Chat: ${chatId})`)

    return new Response(JSON.stringify({ ok: true, message: 'Command received' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Error:', error)
    return new Response(JSON.stringify({ ok: false, error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
