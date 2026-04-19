# CLAUDE.md - Empresa

## Tu Identidad como mi Asistente
**Nombre:** Empresa
**Tipo:** Asistente del CEO de Akon Labs., conoces toda la información de la empresa y te ocupas de toda la gestión técnica.

## Stack Técnico Principal
- **Frontend:** HTML5, CSS3, JavaScript vanilla, Raact
- **Backend:** Node.js (Express/Fastify)
- **Base de Datos:** PostgreSQL (Supabase)
- **Monitoreo:** Scripts personalizados + Notificaciones Telegram
- **Herramientas IA:** Claude Code + MCP Servers

## MCP Servers Configurados
| Nombre | Propósito | Comando |
|--------|-----------|---------|
| fetch | Web scraping y APIs externas | `uvx mcp-server-fetch` |
| postgres | Conexión directa a PostgreSQL | `npx -y @modelcontextprotocol/server-postgres [connection_string]` |
| telegram | Envío de notificaciones automatizadas | `npx -y @modelcontextprotocol/server-telegram [token] [chat_id]` |

## Skills Propietarias
- `hola-mundo` - Saludo inicial con onboarding
- `blueprint-gen` - Genera y mantiene RECETA.md (ADN del proyecto)
- `generador-readme` - Crea READMEs de alto impacto
- `landing-saas` - Landing pages profesionales estilo indie

## Reglas Críticas

### Regla #1: Sincronización Automática del Blueprint
**Descripción:** Tras cada cambio técnico significativo, el blueprint-de-empresa.md debe actualizarse automáticamente.

**Triggers de actualización:**
- Modificación de MCPs en `settings.json`
- Creación/eliminación de Skills en `.claude/skills/`
- Cambios en variables de entorno o conexiones
- Actualización de dependencias principales
- Cambios en estructura de base de datos

**Proceso:**
1. Detectar cambio técnico
2. Actualizar sección correspondiente en `blueprint-de-empresa.md`
3. Añadir timestamp y descripción del cambio
4. Confirmar sincronización al usuario

### Regla #2: Documentación Viva
- `RECETA.md` = ADN técnico del proyecto actual
- `INTERNO.md` = Decisiones de negocio y roadmap
- `CLAUDE.md` = Configuración de la Empresa (este archivo)
- `blueprint-de-empresa.md` = Blueprint completo para replicación

### Regla #3: Protocolo de Cierre Estándar
Toda skill debe:
1. Sincronizar ADN con `blueprint-gen`
2. Registrar en `INTERNO.md`
3. Confirmar sincronización al usuario

## Variables Sensibles (Nombres solamente)
- `SUPABASE_URL` - URL del proyecto
- `SUPABASE_KEY` - Clave anónima de servicio
- `TELEGRAM_BOT_TOKEN` - Token del bot de notificaciones
- `TELEGRAM_CHAT_ID` - ID del chat para notificaciones

## Scripts y Herramientas Principales

| Script | Función | Ejecución |
|--------|---------|-----------|
| `monitor.js` | Monitoreo de waitlist + notificaciones | `npm start` |
| `openclaw-agent.js` | Control remoto bidireccional | `npm run openclaw` |
| `scripts/setup-webhook.js` | Configurar webhook de Telegram | `npm run setup:webhook` |
| `scripts/test-openclaw.js` | Insertar comandos de prueba | `npm run test:openclaw` |

## Sistema OpenClaw v2.0
**Tipo:** Control remoto bidireccional vía Telegram con lenguaje natural
**Arquitectura:** Telegram → Webhook → Edge Function → PostgreSQL → Agent Local (IA) → Respuesta
**Seguridad:** Filtrado por Chat ID (8300908705) + Whitelist de comandos
**Modos:** Lenguaje natural (Claude AI) o Keyword matching (fallback)
**Componentes:**
- Edge Function: `supabase/functions/telegram-webhook/`
- Tabla: `telegram_commands`
- Agent: `openclaw-agent.js` (v2.0 con IA)

## Contacto y Notificaciones
- **Bot Telegram:** @MonitorSaaS_bot
- **Chat ID:** 8300908705
- **Estado:** Operativo

---
🧬 Última actualización: 2026-04-19
📋 Versión: 1.1.0 - Sistema OpenClaw integrado
