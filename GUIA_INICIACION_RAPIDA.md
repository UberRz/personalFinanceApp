# 🚀 Guía Rápida de Iniciación - AppFinanzas

**Última actualización:** 2026-04-06

> Esta guía te permitirá ejecutar la aplicación **AppFinanzas** en un equipo nuevo con todos los componentes necesarios instalados.

---

## 📋 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado lo siguiente:

### Obligatorios:

- **Docker Desktop** (incluye Docker Engine y Docker Compose)
  - [Descargar Docker Desktop para Windows](https://www.docker.com/products/docker-desktop)
  - [Descargar Docker Desktop para Mac](https://www.docker.com/products/docker-desktop)
  - [Descargar Docker Desktop para Linux](https://docs.docker.com/engine/install/)

- **Git** (para clonar el repositorio)
  - [Descargar Git](https://git-scm.com/download)

### Opcional (si ejecutas sin Docker):

- **Node.js 18+** (para el frontend)
  - [Descargar Node.js](https://nodejs.org/)
- **Java 17+** (para el backend)
  - [Descargar OpenJDK 17](https://openjdk.java.net/projects/jdk/17/)

- **PostgreSQL 15** (para la base de datos)
  - [Descargar PostgreSQL](https://www.postgresql.org/download/)

---

## ⚡ Inicio Rápido (Recomendado - con Docker)

### Paso 1: Clonar el Repositorio

```bash
git clone <URL_DEL_REPOSITORIO>
cd ProyectoFabricaEscuela
```

### Paso 2: Iniciar los Servicios

```bash
docker-compose up -d
```

Este comando:

- ✅ Descarga las imágenes necesarias
- ✅ Construye los contenedores
- ✅ Inicia Frontend, Backend y PostgreSQL
- ✅ Configura la red automáticamente

### Paso 3: Esperar a que los Servicios Estén Listos

```bash
# Verificar estado
docker-compose ps

# Esperar ~30 segundos para que inicie completamente
```

### Paso 4: Acceder a la Aplicación

Abre tu navegador con:

```
http://localhost:3000
```

---

## 📦 Instalación Manual (sin Docker)

Si prefieres ejecutar sin Docker, sigue estos pasos:

### Backend (Spring Boot)

```bash
cd backend

# Compilar el proyecto
mvn clean package

# Ejecutar
java -jar target/personalfinancialmanagement-0.0.1-SNAPSHOT.jar
```

El backend estará disponible en: `http://localhost:8080`

### Frontend (React + Vite)

```bash
cd frontend

# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# O compilar para producción
npm run build
```

El frontend estará disponible en: `http://localhost:3000`

### Base de Datos (PostgreSQL)

```bash
# Iniciar PostgreSQL (si está instalado localmente)
# En Windows:
pg_ctl -D "C:\Program Files\PostgreSQL\15\data" start

# En Mac/Linux:
brew services start postgresql
# o
sudo systemctl start postgresql
```

Crear la base de datos:

```sql
CREATE DATABASE appfinanzas_db;
CREATE USER appuser WITH PASSWORD 'apppassword';
GRANT ALL PRIVILEGES ON DATABASE appfinanzas_db TO appuser;
```

---

## 🔍 Verificación de Instalación

### Con Docker:

```bash
# Ver todos los contenedores corriendo
docker ps

# Debe mostrar 3 contenedores:
# - appfinanzas_frontend (puerto 3000)
# - appfinanzas_backend (puerto 8080)
# - appfinanzas_postgres (puerto 5432)
```

### Prueba de Conectividad

```bash
# Verificar que el backend responde
curl http://localhost:8080/expenses

# Respuesta esperada:
# [] (array vacío)
```

### Acceso a la Aplicación

| Componente    | URL                   | Estado                    |
| ------------- | --------------------- | ------------------------- |
| Frontend      | http://localhost:3000 | ✅ Debería cargar         |
| Backend API   | http://localhost:8080 | ✅ Debería responder JSON |
| Base de Datos | localhost:5432        | ✅ Internamente accesible |

---

## 📁 Estructura del Proyecto

```
ProyectoFabricaEscuela/
├── frontend/                          # React + TypeScript
│   ├── src/
│   │   ├── app/
│   │   │   ├── pages/               # Páginas React
│   │   │   │   ├── Home.tsx
│   │   │   │   └── ExpensesPage.tsx
│   │   │   ├── components/          # Componentes reutilizables
│   │   │   ├── services/            # Servicios API
│   │   │   └── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   ├── vite.config.ts
│   └── Dockerfile
│
├── backend/                           # Spring Boot Java
│   ├── src/main/java/org/codefactory/
│   │   └── personalfinancialmanagement/
│   │       ├── application/         # Casos de uso
│   │       ├── domain/              # Modelos de dominio
│   │       ├── infrastructure/      # Controladores, DTOs
│   │       └── ...
│   ├── pom.xml
│   └── Dockerfile
│
├── docker-compose.yml                # Orquestación de servicios
└── README.md
```

---

## 🛠️ Comandos Útiles

### Docker

```bash
# Iniciar servicios
docker-compose up -d

# Detener servicios
docker-compose down

# Ver logs
docker-compose logs

# Ver logs en tiempo real
docker-compose logs -f

# Reiniciar servicios
docker-compose restart

# Reconstruir sin caché
docker-compose build --no-cache
docker-compose up -d

# Limpiar volúmenes (⚠️ elimina datos)
docker-compose down -v
```

### Frontend

```bash
cd frontend

# Instalar dependencias
npm install

# Compilar para desarrollo
npm run dev

# Compilar para producción
npm run build

# Ejecutar pruebas
npm test
```

### Backend

```bash
cd backend

# Compilar
mvn clean package

# Ejecutar
java -jar target/personalfinancialmanagement-0.0.1-SNAPSHOT.jar

# Ejecutar pruebas
mvn test

# Ver versión de Maven
mvn --version
```

### Base de Datos

```bash
# Conectar a PostgreSQL (con Docker)
docker exec -it appfinanzas_postgres psql -U appuser -d appfinanzas_db

# Dentro de psql:
\dt                          # Ver todas las tablas
SELECT * FROM expenses;      # Ver todos los gastos
\q                           # Salir
```

---

## 🔑 Variables de Entorno

### Docker (docker-compose.yml)

```yaml
POSTGRES_USER: appuser
POSTGRES_PASSWORD: apppassword
POSTGRES_DB: appfinanzas_db
DATABASE_URL: jdbc:postgresql://postgres:5432/appfinanzas_db
```

### Frontend (opcional .env)

```bash
REACT_APP_API_URL=http://localhost:8080
```

---

## 🚨 Solución de Problemas

### Problema: Puertos en uso

**Error:** `Address already in use`

**Solución:**

```bash
# Verificar qué está usando el puerto
# Windows:
netstat -ano | findstr :3000

# Mac/Linux:
lsof -i :3000

# Cambiar puerto en docker-compose.yml
# Cambiar "3000:3000" por "3001:3000"
```

### Problema: Docker no inicia

**Error:** `Cannot connect to Docker daemon`

**Solución:**

1. Asegúrate de que Docker Desktop está ejecutándose
2. Reinicia Docker Desktop
3. En Linux: `sudo systemctl start docker`

### Problema: Contenedores no se inician

**Error:** `docker-compose up -d` falla

**Solución:**

```bash
# Limpiar contenedores previos
docker-compose down -v

# Reconstruir
docker-compose build --no-cache

# Iniciar
docker-compose up -d
```

### Problema: Base de datos no se conecta

**Error:** `Connection refused` al backend

**Solución:**

1. Verificar que PostgreSQL está corriendo: `docker ps`
2. Esperar 30 segundos a que la BD inicialice
3. Reiniciar: `docker-compose restart appfinanzas_postgres`

### Problema: Frontend no carga

**URL:** `http://localhost:3000` no responde

**Solución:**

```bash
# Ver logs del frontend
docker-compose logs frontend

# Verificar que npm install completó exitosamente
docker-compose logs | grep "npm install"

# Reconstruir frontend
docker-compose build --no-cache frontend
docker-compose up -d
```

### Problema: node_modules no instalado

**Error:** `Cannot find module` en el frontend

**Solución:**

```bash
# Local (sin Docker):
cd frontend
npm install

# Docker:
# El Dockerfile ejecutará npm install automáticamente
# Si falla, reconstruir:
docker-compose build --no-cache frontend
```

---

## 📊 Configuración de Puertos

| Servicio   | Puerto | Protocolo | Acceso                |
| ---------- | ------ | --------- | --------------------- |
| Frontend   | 3000   | HTTP      | http://localhost:3000 |
| Backend    | 8080   | HTTP      | http://localhost:8080 |
| PostgreSQL | 5432   | TCP       | Interno (Docker)      |

---

## ✅ Checklist de Verificación

Después de iniciar, verifica lo siguiente:

- [ ] Docker está instalado: `docker --version`
- [ ] Docker Compose está instalado: `docker-compose --version`
- [ ] Contenedores están corriendo: `docker ps`
- [ ] Frontend carga: http://localhost:3000
- [ ] Backend responde: `curl http://localhost:8080/expenses`
- [ ] Puedes registrar un gasto sin errores
- [ ] Puedes ver el gasto en la tabla
- [ ] Puedes eliminar el gasto correctamente

---

## 🔄 Flujo Típico de Desarrollo

```bash
# 1. Iniciar servicios
docker-compose up -d

# 2. Hacer cambios en el código

# 3. Para cambios en Frontend:
# - Los cambios se reflejan automáticamente en desarrollo
# - Para producción: npm run build

# 4. Para cambios en Backend:
# - Reconstruir: docker-compose build backend
# - Reiniciar: docker-compose up -d

# 5. Ver logs en tiempo real
docker-compose logs -f

# 6. Cuando termines
docker-compose down
```

---

## 📈 Escala de la Aplicación

### Con Docker (Recomendado):

1. `docker-compose up -d` - Inicia rápidamente
2. Todos los servicios configurados automáticamente
3. Datos persisten en volúmenes Docker

### Sin Docker:

1. Instalar cada componente por separado
2. Configurar conexiones manualmente
3. Más control pero más complejo

---

## 📞 Soporte y Recursos

### Documentación:

- [Documentación de Docker](https://docs.docker.com/)
- [React Documentation](https://react.dev/)
- [Spring Boot Guide](https://spring.io/projects/spring-boot)
- [PostgreSQL Manual](https://www.postgresql.org/docs/)

### Archivos Útiles en el Proyecto:

- `README.md` - Información general
- `ESTADO_SISTEMA.md` - Estado actual del sistema
- `ERRORES_RESUELTOS.md` - Problemas conocidos resueltos
- `docker-compose.yml` - Configuración de servicios

---

## 🎯 Próximos Pasos

Después de ejecutar correctamente:

1. **Prueba la aplicación:**
   - Registra algunos gastos
   - Verifica que aparecen en la tabla
   - Intenta eliminarlos

2. **Revisa el código:**
   - Explora `frontend/src/` (React)
   - Explora `backend/src/` (Java/Spring Boot)

3. **Personaliza:**
   - Agregamore categorías en `Category.java`
   - Modifica estilos en `frontend/tailwind.css`
   - Ajusta límites de presupuesto

4. **Desplega:**
   - Sube a un servidor de producción
   - Configura un dominio
   - Usa HTTPS

---

**¡La aplicación está lista para usar! 🎉**

Si tienes problemas, revisa los logs con:

```bash
docker-compose logs
```

---

_Versión: 1.0 | Fecha: 2026-04-06_
