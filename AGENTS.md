# Reglas de Memoria y Contexto del Agente (AGENTS.md)

Este archivo establece las directrices agnósticas de comportamiento, memoria y contexto para cualquier modelo de Inteligencia Artificial (Antigravity, Ollama, GPT, Claude, Cursor, Windsurf, etc.) que trabaje en este proyecto.

## 🧠 Gestión de Memoria y Bóveda Documental

1. **Consulta Previa de Contexto**:
   - Antes de realizar modificaciones arquitectónicas o implementar nuevos módulos en la aplicación, el Agente DEBE consultar `.docs/context.md` y revisar los registros en `.docs/adr/`.

2. **Registro de Decisiones y Bitácora**:
   - Al finalizar una tarea técnica relevante o refactorización significativa, el Agente DEBE agregar un registro breve en `.docs/memory-log.md` detallando:
     - **Fecha y resumen de la tarea**
     - **Decisiones tomadas y archivos modificados**
     - **Deuda técnica o siguientes pasos**

3. **Creación de ADRs (Architectural Decision Records)**:
   - Toda nueva decisión de diseño estructural (elección de estado global, nuevo servicio backend, cambio de base de datos) debe documentarse en un nuevo archivo dentro de `.docs/adr/adr-XXX-nombre.md`.

4. **Exclusión de Metadatos Internos**:
   - Queda estrictamente prohibido escanear, leer o indexar carpetas de configuración de Obsidian como `.obsidian/` o carpetas compiladas como `node_modules/`, `dist/`, `build/`.
