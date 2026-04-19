# INTERNO.md - Decisiones de Negocio y Roadmap

> 📅 Última actualización: 2026-04-19
> 🔒 Este archivo es privado - No replicar en blueprints públicos

---

## Decisiones de Negocio

### 2026-04-19 - MCP GitHub

**Decisión:** Añadir MCP oficial de GitHub para permitir gestión de repositorios.

**Razón:** Poder crear, modificar y eliminar archivos en repositorios GitHub directamente desde Claude Code, así como gestionar issues, PRs y otras operaciones del repositorio.

**Impacto:**
- Nuevo MCP añadido en settings.json
- Blueprint actualizado
- Requiere `GITHUB_TOKEN` como variable de entorno

**Estado:** ✅ Implementado

---

## Roadmap

### Fase 1: Base Técnica ✅
- [x] Configuración MCPs (fetch, postgres, telegram)
- [x] Sistema OpenClaw v2.0
- [x] Blueprint de empresa

### Fase 2: Gestión de Repositorios 🔄
- [x] MCP GitHub configurado
- [ ] Prueba de operaciones (crear archivo, eliminar, commit)
- [ ] Integración con workflow existente

### Fase 3: Automatización
- [ ] Scripts automatizados para CI/CD
- [ ] Integración con monitoreo

---

## Notas Técnicas

- El MCP de GitHub usa el paquete oficial `@modelcontextprotocol/server-github`
- Necesita un Personal Access Token con permisos `repo` para operaciones completas
- El token se configura via variable de entorno `GITHUB_TOKEN`
