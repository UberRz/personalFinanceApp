# 🚀 Guía Rápida de Iniciación - AppFinanzas

**Última actualización:** 2026-06-03

> Esta guía te permitirá ejecutar la aplicación **AppFinanzas** con autenticación JWT, registro de ingresos y gastos, presupuesto mensual, dashboard financiero e integración con PostgreSQL en la nube.

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

- **PostgreSQL 15** (opcional - solo si ejecutas sin Docker, la BD está en la nube)
  - [Descargar PostgreSQL](https://www.postgresql.org/download/)

---

## ⚡ Inicio Rápido (Recomendado - con Docker)

### Paso 1: Clonar el Repositorio

```bash
git clone https://github.com/UberRz/personalFinanceApp.git
cd personalFinanceApp
```

### Paso 2: Iniciar los Servicios

```bash
docker-compose up -d
```

Este comando:

- ✅ Descarga las imágenes necesarias
- ✅ Construye los contenedores
- ✅ Inicia Frontend y Backend con la configuración definida en `docker-compose.yml`
- ✅ Conecta el backend con la base de datos PostgreSQL en la nube

### Paso 3: Esperar a que los Servicios Estén Listos

```bash
# Verificar estado
docker-compose ps

# Esperar ~30 segundos para que el backend termine de levantar
```

### Paso 4: Acceder a la Aplicación

Abre tu navegador con:

```
http://localhost:3000
```

Desde ahí podrás ir a login, registro, dashboard, historial, presupuesto y cierre de sesión.

---

## 📦 Instalación Manual (sin Docker)

Si prefieres ejecutar sin Docker, sigue estos pasos:

### Backend (Spring Boot)

```bash
cd backend

# Compilar el proyecto
mvn clean package

# Ejecutar (con puerto 8081)
mvn spring-boot:run
```

O también puedes ejecutar el JAR generado:

```bash
java -jar target/personalfinancialmanagement-0.0.1-SNAPSHOT.jar --server.port=8081
```

El backend estará disponible en: `http://localhost:8081`

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

### Base de Datos (PostgreSQL en la nube)

**⚠️ Configuración actual:** la base de datos se ejecuta en **Render.com** (nube).
No necesitas instalar PostgreSQL localmente para la configuración normal del proyecto. La aplicación se conecta automáticamente a:

```
Servidor: dpg-d7shkc37uimc73dpimvg-a.ohio-postgres.render.com
Puerto: 5432
Usuario: appuser
Database: appfinanzas_db_q1li
```

**Nota:** las credenciales están configuradas en `docker-compose.yml` y en `backend/src/main/resources/application.properties`.

---

## 🔍 Verificación de Instalación

### Con Docker:

```bash
# Ver todos los contenedores corriendo
docker ps

# Debe mostrar 2 contenedores principales:
# - appfinanzas_frontend (puerto 3000)
# - appfinanzas_backend (puerto 8081)
```

### Prueba de Conectividad

```bash
# Verificar que el backend responde
curl http://localhost:8081/actuator/health

# Verificar registro de usuario
curl -X POST http://localhost:8081/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"Test1234!","name":"Test User"}'

# Verificar login y recibir token JWT
curl -X POST http://localhost:8081/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"Test1234!"}'

# Verificar presupuesto mensual
curl http://localhost:8081/transactions/budget/1

# Verificar estado del presupuesto
curl http://localhost:8081/transactions/budget-status/1

# Verificar dashboard
curl http://localhost:8081/dashboard/1
```

### Acceso a la Aplicación

| Componente    | URL                   | Estado                                  |
| ------------- | --------------------- | ----------------------------------------|
| Frontend      | http://localhost:3000 | ✅ Debería cargar                       |
| Backend API   | http://localhost:8081 | ✅ Debería responder JSON / health      |
| Base de Datos | Render.com:5432       | ✅ En la nube (no local)                |

---

## 📁 Estructura del Proyecto

```
personalFinanceApp/
├── frontend/                               # React + TypeScript + Vite
│   ├── src/
│   │   ├── app/
│   │   │   ├── pages/                      # Páginas principales
│   │   │   │   ├── Home.tsx
│   │   │   │   ├── LoginPage.tsx
│   │   │   │   ├── RegisterPage.tsx
│   │   │   │   └── ExpensesPage.tsx       # Dashboard, historial, presupuesto y logout
│   │   │   ├── components/
│   │   │   │   ├── BudgetSummary.tsx       # Estado y edición del presupuesto
│   │   │   │   ├── Dashboard.tsx           # Resumen financiero y categorías
│   │   │   │   ├── ExpenseForm.tsx
│   │   │   │   ├── ExpenseList.tsx
│   │   │   │   └── ui/                     # Librería visual reutilizable
│   │   │   ├── services/
│   │   │   │   ├── authService.ts          # Registro, login, logout y token JWT
│   │   │   │   └── expenseService.ts       # Transacciones, presupuesto y dashboard
│   │   │   └── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   ├── vite.config.ts
│   └── Dockerfile
│
├── backend/                                # Spring Boot 3.5 + Java 17
│   ├── src/main/java/org/codefactory/team07/personalfinancialmanagement/
│   │   ├── application/                    # Casos de uso y servicios
│   │   │   ├── service/JwtService.java
│   │   │   └── usecase/
│   │   │       ├── AuthenticateUserUseCase.java
│   │   │       ├── RegisterUserUseCase.java
│   │   │       ├── RegisterTransactionUseCase.java
│   │   │       ├── GetTransactionsUseCase.java
│   │   │       ├── GetFilteredTransactionsUseCase.java
│   │   │       ├── DeleteTransactionUseCase.java
│   │   │       ├── DefineBudgetUseCase.java
│   │   │       ├── GetCurrentBudgetUseCase.java
│   │   │       ├── GetBudgetStatusUseCase.java
│   │   │       └── GetDashboardSummaryUseCase.java
│   │   ├── domain/                         # Modelos, enums, estrategias y puertos
│   │   │   ├── model/
│   │   │   ├── port/out/
│   │   │   └── strategy/
│   │   ├── infrastructure/                 # Adaptadores REST y persistencia JPA
│   │   │   ├── adapter/in/web/
│   │   │   │   ├── AuthController.java
│   │   │   │   ├── UserRegisterController.java
│   │   │   │   ├── TransactionController.java
│   │   │   │   ├── BudgetController.java
│   │   │   │   └── DashboardController.java
│   │   │   └── adapter/out/persistance/
│   │   └── config/
│   ├── pom.xml
│   └── Dockerfile
│
├── docker-compose.yml                       # Orquestación de frontend + backend
└── docs/
    └── backend/README_BACKEND.md            # Documentación técnica del backend
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

# Limpiar volúmenes (⚠️ elimina datos locales si existen)
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

# Ejecutar pruebas si están definidas
npm test
```

### Backend

```bash
cd backend

# Compilar
mvn clean package

# Ejecutar
mvn spring-boot:run

# Ejecutar pruebas
mvn test

# Ver versión de Maven
mvn --version
```

### Base de Datos

```bash
# Conectar a PostgreSQL en la nube (Render.com)
psql -h dpg-d7shkc37uimc73dpimvg-a.ohio-postgres.render.com \
     -U appuser \
     -d appfinanzas_db_q1li

# Dentro de psql:
\dt                                       # Ver todas las tablas
SELECT * FROM users;                      # Ver usuarios registrados
SELECT * FROM transactions;               # Ver todas las transacciones
SELECT * FROM monthly_budgets;            # Ver presupuestos mensuales
SELECT * FROM transactions WHERE user_id = 1;  # Ver transacciones de usuario
\q                                        # Salir
```

---

## 🔑 Variables de Entorno

### Docker (docker-compose.yml)

```yaml
SPRING_DATASOURCE_URL: jdbc:postgresql://dpg-d7shkc37uimc73dpimvg-a.ohio-postgres.render.com:5432/appfinanzas_db_q1li?sslmode=require
SPRING_DATASOURCE_USERNAME: appuser
SPRING_DATASOURCE_PASSWORD: YeyiNt6qwMDRzSV3E1Cc1WcOwU65cqRU
SERVER_PORT: 8081
VITE_API_URL: http://localhost:8081
```

### Frontend (opcional .env)

```bash
# URL del backend para desarrollo local
VITE_API_URL=http://localhost:8081
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
netstat -ano | findstr :8081

# Mac/Linux:
lsof -i :3000
lsof -i :8081

# Cambiar puerto en docker-compose.yml si hace falta
# Cambiar "3000:3000" por "3001:3000"
# O cambiar "8081:8081" por "8082:8081" (backend)
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

**Error:** el backend no responde o devuelve errores de conexión

**Solución:**

1. Verificar que la URL de PostgreSQL siga siendo válida
2. Revisar que `SPRING_DATASOURCE_URL`, `SPRING_DATASOURCE_USERNAME` y `SPRING_DATASOURCE_PASSWORD` coincidan con la configuración real
3. Confirmar que el backend está escuchando en `8081`

### Problema: Login, logout o dashboard no funcionan

**Error:** autenticación fallida o datos vacíos en la pantalla principal

**Solución:**

1. Verificar que el usuario esté registrado correctamente
2. Confirmar que el token JWT se guardó en `localStorage`
3. Revisar que el backend esté respondiendo en `http://localhost:8081/actuator/health`
4. Limpiar sesión y volver a iniciar con un usuario válido

### Problema: Presupuesto no se actualiza

**Error:** el monto cambia en pantalla pero no persiste

**Solución:**

1. Usar un valor mayor a `0`
2. Verificar que el usuario esté autenticado
3. Revisar la respuesta de `POST /transactions/budget`
4. Consultar `GET /transactions/budget/{userId}` y `GET /transactions/budget-status/{userId}`

### Problema: Frontend no carga

**URL:** `http://localhost:3000` no responde

**Solución:**

```bash
# Ver logs del frontend
docker-compose logs frontend

# Verificar instalación de dependencias
docker-compose build --no-cache frontend

# Reiniciar frontend
docker-compose up -d
```

---

## 📊 Configuración de Puertos

| Servicio   | Puerto | Protocolo | Acceso                    |
| ---------- | ------ | --------- | ------------------------- |
| Frontend   | 3000   | HTTP      | http://localhost:3000     |
| Backend    | 8081   | HTTP      | http://localhost:8081     |
| PostgreSQL | 5432   | TCP       | Render.com (nube)         |

---

## ✅ Checklist de Verificación

Después de iniciar, verifica lo siguiente:

- [ ] Docker está instalado: `docker --version`
- [ ] Docker Compose está instalado: `docker-compose --version`
- [ ] Contenedores están corriendo: `docker ps`
- [ ] Frontend carga: http://localhost:3000
- [ ] Backend responde: `curl http://localhost:8081/actuator/health`
- [ ] Puedes registrar un usuario exitosamente
- [ ] Puedes hacer login con el usuario creado
- [ ] Puedes cerrar sesión correctamente
- [ ] Puedes crear un gasto (`GASTO`) sin errores
- [ ] Puedes crear un ingreso (`INGRESO`) sin errores
- [ ] Puedes visualizar el dashboard financiero
- [ ] Puedes crear o editar el presupuesto mensual
- [ ] Puedes visualizar el estado del presupuesto mensual
- [ ] Puedes filtrar por tipo de transacción
- [ ] Puedes filtrar por rango de fechas
- [ ] Puedes eliminar transacciones correctamente

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
2. Frontend y backend quedan disponibles con la configuración del proyecto
3. La base de datos queda centralizada en PostgreSQL de Render

### Sin Docker:

1. Instalar cada componente por separado
2. Configurar `VITE_API_URL` y el backend manualmente
3. Más control pero más complejo

---

## 📞 Soporte y Recursos

### Documentación:

- [Documentación de Docker](https://docs.docker.com/)
- [React Documentation](https://react.dev/)
- [Spring Boot Guide](https://spring.io/projects/spring-boot)
- [PostgreSQL Manual](https://www.postgresql.org/docs/)

### Archivos Útiles en el Proyecto:

- `README.md` - Información general del proyecto
- `ESTADO_SISTEMA.md` - Estado actual del sistema
- `GUIA_PRUEBAS.md` - Casos y pasos de validación funcional
- `docs/backend/README_BACKEND.md` - Documentación técnica del backend
- `docker-compose.yml` - Configuración de servicios

---

## 🎯 Próximos Pasos

Después de ejecutar correctamente:

1. **Prueba la aplicación:**
   - Registra un usuario
   - Inicia sesión
   - Crea ingresos y gastos
   - Revisa el dashboard y el presupuesto
   - Prueba cerrar sesión y volver a entrar
