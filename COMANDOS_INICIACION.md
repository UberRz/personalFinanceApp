# 🚀 Comandos de Iniciación - AppFinanzas 2026

Última actualización: **2026-05-03**

---

## ⚡ Inicio Rápido (Recomendado)

Para iniciar la aplicación con Docker Compose (recomendado):

```bash
cd C:\Users\User\Desktop\ProyectoFabricaEscuela

# Iniciar todos los servicios
docker-compose up -d

# Esperar 15-20 segundos para que todos inicien
# El frontend está en http://localhost:3000
# El backend está en http://localhost:8080
```

### Verificar que todo funciona:

```bash
# Ver estado de los contenedores
docker-compose ps

# Probar endpoint de backend (debe devolver [])
curl http://localhost:8080/expenses

# Acceder a la aplicación
# Abre en el navegador: http://localhost:3000
```

---

## 🛑 Detener la Aplicación

```bash
# Detener todos los servicios (mantiene datos)
docker-compose down

# Detener y eliminar datos (limpia volúmenes)
docker-compose down -v
```

---

## 🔄 Reconstruir Todo (si cambias código)

```bash
# Opción 1: Reconstruir sin caché (más lento pero garantiza cambios)
docker-compose build --no-cache
docker-compose up -d

# Opción 2: Solo reconstruir frontend
docker-compose build frontend
docker-compose up -d frontend

# Opción 3: Solo reconstruir backend
docker-compose build backend
docker-compose up -d backend
```

---

## 📊 Monitoreo y Logs

```bash
# Ver logs de todos los servicios
docker-compose logs

# Ver logs en tiempo real
docker-compose logs -f

# Ver logs solo del backend
docker-compose logs backend

# Ver logs solo del frontend
docker-compose logs frontend

# Ver logs solo de Postgres
docker-compose logs postgres
```

---

## 💾 Base de Datos

### Conectar a Postgres desde terminal:

```bash
# Acceder a la base de datos
docker exec -it appfinanzas_postgres psql -U appuser -d appfinanzas_db

# Dentro de psql:
\dt                          # Ver todas las tablas
SELECT * FROM expenses;      # Ver todos los gastos
\q                           # Salir
```

### Credenciales:

- **Usuario**: `appuser`
- **Contraseña**: `apppassword`
- **Base de datos**: `appfinanzas_db`
- **Puerto**: `5432` (solo accesible internamente en Docker)

---

## 🔧 Desarrollo Local (sin Docker)

Si prefieres ejecutar sin Docker:

### Backend (Spring Boot)

```bash
cd backend

# Compilar
mvn clean package

# Ejecutar (requiere Postgres corriendo en localhost:5432)
java -jar target/personalfinancialmanagement-0.0.1-SNAPSHOT.jar
```

### Frontend (React + Vite)

```bash
cd frontend

# Instalar dependencias
npm install

# Ejecutar en desarrollo (con hot reload)
npm run dev

# O compilar para producción
npm run build
```

---

## 📋 URLs de Acceso

| Componente | URL                            | Descripción                  |
| ---------- | ------------------------------ | ---------------------------- |
| Frontend   | http://localhost:3000          | Aplicación React             |
| Backend    | http://localhost:8080          | API REST (endpoints)         |
| Backend    | http://localhost:8080/expenses | Listar todos los movimientos |
| Postgres   | localhost:5432                 | Base de datos (interno)      |

---

## 🚨 Solución de Problemas

### Problema: Puertos en uso

```bash
# Windows - Ver qué está usando el puerto 3000
netstat -ano | findstr :3000

# Mac/Linux - Ver qué está usando el puerto 3000
lsof -i :3000

# Matar el proceso (obtén el PID primero)
# Windows:
taskkill /PID <PID> /F
```

### Problema: Contenedores no inician

```bash
# Limpiar todo y reintentar
docker-compose down -v
docker-compose build --no-cache
docker-compose up -d
```

### Problema: Frontend dice "Cannot find module 'lightningcss'"

Este fue un problema de binarios nativos. Ya está resuelto en `vite.config.ts` (desactivamos el plugin de Tailwind Vite temporalmente).

Si reaparece:

```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm rebuild lightningcss --update-binary
npm run build
```

---

## 🔄 Flujo Típico de Desarrollo

```bash
# 1. Iniciar todo
docker-compose up -d

# 2. Hacer cambios en el código

# 3. Para cambios en FRONTEND:
# - Los cambios se reflejan automáticamente en dev mode
# - Para producción (Docker): reconstruir
docker-compose build frontend
docker-compose up -d frontend

# 4. Para cambios en BACKEND:
docker-compose build backend
docker-compose up -d backend

# 5. Ver logs en tiempo real
docker-compose logs -f

# 6. Cuando termines
docker-compose down
```

---

## 📝 Arquitectura del Proyecto

```
ProyectoFabricaEscuela/
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/     # Componentes React (ExpenseForm, ExpenseList, etc.)
│   │   │   ├── pages/          # Páginas (Home.tsx, ExpensesPage.tsx)
│   │   │   ├── services/       # Servicios API (expenseService.ts, authService.ts)
│   │   │   └── App.tsx
│   │   └── main.tsx
│   ├── vite.config.ts          # Configuración Vite
│   └── Dockerfile              # Imagen Docker frontend
│
├── backend/
│   ├── src/main/java/org/codefactory/team07/
│   │   └── personalfinancialmanagement/
│   │       ├── domain/         # Modelos (Expense, Income, TransactionType)
│   │       ├── application/    # Casos de uso (RegisterExpenseUseCase)
│   │       └── infrastructure/ # Controladores, DTOs, Repositorios
│   ├── pom.xml                 # Dependencias Maven
│   └── Dockerfile              # Imagen Docker backend
│
├── docker-compose.yml          # Orquestación de servicios
└── volumes/
    ├── backend/logs/           # Logs del backend (volumen persistente)
    └── db/backups/             # Backups de base de datos
```

---

## ✅ Checklist de Verificación

Después de iniciar, asegúrate de que:

- [ ] `docker-compose ps` muestra 3 contenedores en estado "Up"
- [ ] Frontend en http://localhost:3000 carga correctamente
- [ ] Backend en http://localhost:8080/expenses responde `[]`
- [ ] Puedes registrar un gasto en la UI (sin errores en consola)
- [ ] El gasto aparece en la tabla
- [ ] Puedes cambiar entre "GASTO" e "INGRESO"
- [ ] Las categorías cambian según el tipo

---

## 📞 Referencias Rápidas

**Documentación oficial:**

- [Docker Docs](https://docs.docker.com/)
- [Docker Compose Docs](https://docs.docker.com/compose/)
- [React Docs](https://react.dev/)
- [Spring Boot Docs](https://spring.io/projects/spring-boot)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)

**Archivos importantes en el proyecto:**

- `GUIA_INICIACION_RAPIDA.md` - Guía completa de setup
- `ESTADO_SISTEMA.md` - Estado actual del sistema
- `docker-compose.yml` - Configuración de servicios
- `backend/pom.xml` - Dependencias Java
- `frontend/package.json` - Dependencias Node

---

## 🎯 Cambios Recientes (2026-05-03)

- ✅ Agregado modelo `Income` al backend
- ✅ Agregado tipo de transacción `TransactionType` (GASTO/INGRESO)
- ✅ Frontend actualizado para soportar ingresos
- ✅ Resuelto problema de `lightningcss` en Windows
- ✅ Base de datos recreada con credenciales correctas
- ✅ Docker Compose configurado para iniciar todo junto

---

**¡Sistema listo para usar! 🎉**

Para cualquier problema, revisa los logs:

```bash
docker-compose logs
```

_Versión: 1.1 | Fecha: 2026-05-03 | Hora: 16:56 UTC_
