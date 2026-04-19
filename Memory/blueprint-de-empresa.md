# Blueprint del Asistente "Empresa"

> 🧬 ADN completo del sistema para replicación total
> 📅 Generado: 2026-04-19
> 🔄 Actualizar automáticamente tras cambios técnicos

---

## 1. Identidad de la Empresa

| Campo | Valor |
|-------|-------|
| **Nombre** | Empresa |
| **Tipo** | Asistente del CEO de Akon Labs|
| **Filosofía** | Sistemas autónomos, documentación viva, replicación total |
| **Modo Operativo** | Empresa con blueprint replicable |

---

## 2. MCP Servers (Servicios de Conexión)

### 2.1 fetch
```json
{
  "mcpServers": {
    "fetch": {
      "command": "uvx",
      "args": ["mcp-server-fetch"]
    }
  }
}
```
**Propósito:** Web scraping y consumo de APIs externas

### 2.2 postgres
```json
{
  "mcpServers": {
    "postgres": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-postgres",
        "postgresql://postgres:957dd642b72c0a90@db.qltlbagluuwihjlcsyyx.supabase.co:5432/postgres"
      ]
    }
  }
}
```
**Propósito:** Conexión directa a PostgreSQL en Supabase
**Base de datos:** `postgres` en host `db.qltlbagluuwihjlcsyyx.supabase.co`

### 2.3 telegram
```json
{
  "mcpServers": {
    "telegram": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-telegram",
        "8485071572:AAFn9mfQx2Ov2QtmT7iv2VWYRbPE4taFmgs",
        "8300908705"
      ]
    }
  }
}
```
**Propósito:** Envío de notificaciones automatizadas
**Bot:** @MonitorSaaS_bot
**Chat ID:** 8300908705

### 2.4 github
```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-github"
      ],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_TOKEN}"
      }
    }
  }
}
```
**Propósito:** Gestión completa de repositorios GitHub (crear archivos, eliminar, repos, issues, PRs, búsqueda)
**Requiere:** Variable de entorno `GITHUB_TOKEN` con Personal Access Token de GitHub
**npm:** [@modelcontextprotocol/server-github](https://www.npmjs.com/package/@modelcontextprotocol/server-github)

---

## 3. Skills Propietarias

### 3.1 hola-mundo
- **Ubicación:** `.claude/skills/hola-mundo/SKILL.md`
- **Propósito:** Saludo inicial con onboarding de usuario
- **Comportamiento:** Di "¡Hola!" con energía, pregunta sobre el proyecto, ofrece ayuda

### 3.2 blueprint-gen
- **Ubicación:** `.claude/skills/blueprint-gen/SKILL.md`
- **Propósito:** Genera y mantiene RECETA.md (ADN del proyecto)
- **Funciones:**
  - Auditoría técnica del stack
  - Extracción de esquema DDL vía MCP Postgres
  - Mapeo de skills activas
  - Actualización incremental de documentación

### 3.3 generador-readme
- **Ubicación:** `.claude/skills/generador-readme/SKILL.md`
- **Propósito:** Genera README.md de alto impacto
- **Características:**
  - Análisis de stack tecnológico
  - Marketing sobre descripción técnica
  - Estructura AIDA (Atención -> Interés -> Deseo -> Acción)
  - Badges de shields.io
  - Roadmap sugerido

### 3.4 landing-saas
- **Ubicación:** `.claude/skills/landing-saas/SKILL.md`
- **Propósito:** Crea landing pages profesionales
- **Principios:**
  - Sin animaciones automáticas (transiciones suaves 0.3s)
  - Tipografía fuerte (sans-serif + serif)
  - Whitespace agresivo
  - Una CTA primaria
  - Máximo 3 colores + grises

---

## 4. Estructura de Archivos

```
proyecto-claude/
├── .claude/
│   ├── skills/
│   │   ├── hola-mundo/
│   │   │   └── SKILL.md
│   │   ├── blueprint-gen/
│   │   │   └── SKILL.md
│   │   ├── generador-readme/
│   │   │   └── SKILL.md
│   │   └── landing-saas/
│   │       ├── SKILL.md
│   │       ├── assets/
│   │       │   └── logo.png
│   │       ├── design-tokens/
│   │       │   └── brand.json
│   │       ├── examples/
│   │       │   └── good-landing.html
│   │       └── templates/
│   │           └── estructura.md
│   └── settings.json          # Configuración de MCPs
├── CLAUDE.md                  # Identidad de la Empresa
├── blueprint-de-empresa.md    # Este archivo (Blueprint)
├── RECETA.md                  # ADN técnico del proyecto actual
├── INTERNO.md                 # Decisiones de negocio y roadmap
├── monitor.js                 # Script de monitoreo
├── package.json               # Dependencias Node.js
├── hola-mundo.md              # Archivo de prueba MCP GitHub
└── node_modules/              # Instalado
```

---

## 5. Dependencias Node.js

```json
{
  "dependencies": {
    "pg": "^8.20.0",
    "node-telegram-bot-api": "^0.64.0"
  }
}
```

**Uso:** Conexión a PostgreSQL + envío de notificaciones Telegram

---

## 6. Scripts y Herramientas

### 6.1 monitor.js
**Función:** Conecta a Supabase, cuenta usuarios en waitlist, envía reporte por Telegram
**Ejecución:** `node monitor.js` o `npm start`

---

## 7. Variables de Entorno Requeridas

| Variable | Descripción | Ubicación |
|----------|-------------|-----------|
| `SUPABASE_URL` | URL del proyecto Supabase | MCP postgres settings.json |
| `SUPABASE_KEY` | Clave anónima de servicio | No hardcodeada - MCP |
| `TELEGRAM_BOT_TOKEN` | Token del bot | MCP telegram settings.json |
| `TELEGRAM_CHAT_ID` | ID del chat destino | MCP telegram settings.json |
| `GITHUB_TOKEN` | Personal Access Token GitHub | MCP github settings.json |

---

## 8. Protocolos Operativos

### 8.1 Sincronización Automática
**Trigger:** Cualquier cambio técnico significativo
**Acción:** Actualizar `blueprint-de-empresa.md`
**Secciones a actualizar:**
- MCPs (settings.json)
- Skills (.claude/skills/)
- Dependencias (package.json)
- Estructura de archivos

### 8.2 Protocolo de Cierre Estándar
Toda skill DEBE:
1. Invocar `blueprint-gen` para actualizar RECETA.md
2. Registrar cambios en INTERNO.md
3. Confirmar sincronización al usuario

---

## 9. Historial de Cambios

| Fecha | Cambio | Descripción |
|-------|--------|-------------|
| 2026-04-19 | Inicialización | Creación del blueprint completo de la empresa |
| 2026-04-19 | MCPs | Configuración de fetch, postgres y telegram |
| 2026-04-19 | Skills | 4 skills activas documentadas |
| 2026-04-19 | Monitor | Script de monitoreo operativo |
| 2026-04-19 | OpenClaw | Sistema de control remoto bidireccional vía Telegram |
| 2026-04-19 | OpenClaw v2.0 | Soporte para lenguaje natural con Claude AI |
| 2026-04-19 | MCP GitHub | Añadido servidor MCP para gestión de repositorios GitHub |

---

## 10. Sistema OpenClaw (Control Remoto Bidireccional)

Sistema de control remoto que permite ejecutar comandos desde Telegram usando lenguaje natural.

**Versión actual:** v2.0 con soporte de IA (Claude)
**Características:**
- Acepta comandos tradicionales y lenguaje natural
- Usa Claude AI para interpretar intenciones (con API key)
- Fallback a keyword matching si no hay IA configurada
- Respuestas conversacionales para mensajes no-comandos

### 10.1 Arquitectura

```
Usuario (Telegram) → Webhook → Edge Function → PostgreSQL → OpenClaw Agent → Ejecución → Respuesta Telegram
```

### 10.2 Componentes

#### A. Tabla `telegram_commands` (PostgreSQL)
| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | BIGSERIAL | PK autoincremental |
| `message_id` | BIGINT | ID del mensaje en Telegram |
| `chat_id` | BIGINT | Chat ID del remitente (filtrado: 8300908705) |
| `user_id` | BIGINT | User ID del remitente |
| `username` | TEXT | @username del remitente |
| `command` | TEXT | Comando recibido |
| `status` | TEXT | pending, processing, completed, failed |
| `result` | TEXT | Resultado de la ejecución |
| `executed_at` | TIMESTAMP | Hora de ejecución |
| `created_at` | TIMESTAMP | Hora de recepción |

#### B. Edge Function `telegram-webhook`
**Ubicación:** `supabase/functions/telegram-webhook/`
**Función:** Recibe webhooks de Telegram, filtra por Chat ID autorizado (8300908705), guarda comandos
**Seguridad:** JWT desactivado, filtro explícito de Chat ID
**Deploy:**
```bash
supabase functions deploy telegram-webhook
```

#### C. OpenClaw Agent (Script Local)
**Archivo:** `openclaw-agent.js`
**Función:** Vigila tabla `telegram_commands`, interpreta lenguaje natural, ejecuta comandos, responde vía Telegram

**Modos de operación:**
1. **Con ANTHROPIC_API_KEY:** Usa Claude AI para interpretar intenciones
2. **Sin API key:** Usa keyword matching (fallback)

**Comandos soportados (lenguaje natural o exacto):**
| Comando | Ejemplos de lenguaje natural |
|---------|------------------------------|
| `status` | "cómo estás", "muéstrame el estado", "qué tal" |
| `ping` | "ping", "estás ahí", "responde" |
| `memory` | "cuánta memoria", "recursos", "consumo" |
| `disk` | "espacio en disco", "almacenamiento" |
| `uptime` | "tiempo encendido", "cuánto llevas" |
| `ls` | "qué archivos hay", "listar carpeta" |
| `git status` | "estado del repo", "qué cambios hay" |
| `git log` | "últimos commits", "historial" |
| `npm list` | "qué dependencias", "paquetes instalados" |
| `help` | "ayuda", "qué puedes hacer" |

**Ejecución:**
```bash
# Básico (modo keyword)
node openclaw-agent.js

# Con IA (requiere API key)
set ANTHROPIC_API_KEY=sk-ant-api... && node openclaw-agent.js
```

### 10.3 Scripts Auxiliares

| Script | Función |
|--------|---------|
| `scripts/setup-webhook.js` | Configura el webhook de Telegram con URL de Edge Function |
| `scripts/test-openclaw.js` | Inserta comandos de prueba en la base de datos |

### 10.4 Configuración del Webhook

1. **Deploy Edge Function:**
   ```bash
   supabase functions deploy telegram-webhook --no-verify-jwt
   ```

2. **Obtener URL:**
   ```
   https://[PROJECT_ID].supabase.co/functions/v1/telegram-webhook
   ```

3. **Configurar Webhook:**
   ```bash
   node scripts/setup-webhook.js
   # Ingresar URL cuando se solicite
   ```

4. **Iniciar Agent:**
   ```bash
   node openclaw-agent.js
   ```

### 10.5 Seguridad

- 🔒 **Filtrado por Chat ID:** Solo Chat ID 8300908705 puede enviar comandos
- 🔒 **Whitelist de comandos:** Solo comandos explícitamente permitidos se ejecutan
- 🔒 **RLS en PostgreSQL:** La tabla tiene RLS activado para el dueño
- 🔒 **Sin JWT:** Edge Function acepta requests sin autenticación pero filtra por Chat ID

### 10.6 Estructura de Archivos Agregada

```
proyecto-claude/
├── supabase/
│   └── functions/
│       └── telegram-webhook/
│           ├── index.ts
│           └── config.toml
├── sql/
│   └── create_telegram_commands.sql
├── scripts/
│   ├── setup-webhook.js
│   └── test-openclaw.js
├── openclaw-agent.js
└── ...
```

---

## 11. Replicación del Sistema

Para replicar este sistema en un nuevo entorno:

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Configurar MCPs:** Copiar `.claude/settings.json` con las credenciales actualizadas

3. **Copiar Skills:** Replicar estructura `.claude/skills/`

4. **Crear tabla OpenClaw:**
   ```bash
   # Ejecutar SQL en Supabase
   psql [DATABASE_URL] -f sql/create_telegram_commands.sql
   ```

5. **Deploy Edge Function:**
   ```bash
   supabase functions deploy telegram-webhook --no-verify-jwt
   ```

6. **Configurar Webhook:**
   ```bash
   node scripts/setup-webhook.js
   ```

7. **Iniciar Agent:**
   ```bash
   node openclaw-agent.js
   ```

8. **Verificar conexiones:**
   - Test PostgreSQL: `node monitor.js`
   - Test Telegram: Debe enviar mensaje de prueba
   - Test OpenClaw: Enviar comando desde Telegram

9. **Documentar:** Ejecutar skills `blueprint-gen` y `generador-readme`

---

🧬 **ADN Empresarial Completo** - Listo para replicación
📋 **Mantenido por:** Nébula Digital Solutions
🔄 **Auto-actualizable:** Sí, mediante regla en CLAUDE.md
