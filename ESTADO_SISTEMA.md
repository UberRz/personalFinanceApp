# 🚀 Estado del Sistema AppFinanzas

## ✅ Estado Actual - 2026-06-03

**Sistema Operativo - Gestión Financiera con Autenticación JWT, Presupuesto y Dashboard** ✅

### Últimas Actualizaciones

- ✅ **Cambio de Base de Datos**: PostgreSQL en Render.com con persistencia en la nube.
- ✅ **Creación de Cuentas**: Registro de usuarios con validaciones reales en frontend y backend.
- ✅ **Inicio de Sesión**: Autenticación con JWT, almacenamiento en `localStorage` y retorno de token, id, email y nombre.
- ✅ **Cerrar Sesión**: Invalida el token en backend y limpia la sesión en frontend.
- ✅ **Ingresos y Gastos**: Registro de transacciones con categorías específicas por tipo.
- ✅ **Filtros por Fecha**: Rango de fechas configurable en el historial.
- ✅ **Filtros por Tipo**: Filtrado por `GASTO` e `INGRESO`.
- ✅ **Sistema de Categorías**: Categorías separadas para gastos e ingresos.
- ✅ **Gestión de Transacciones**: Crear, listar, filtrar y eliminar transacciones.
- ✅ **Presupuesto Mensual**: Crear, editar y consultar el presupuesto del mes actual.
- ✅ **Estado del Presupuesto**: Visualización de gasto, restante y porcentaje usado.
- ✅ **Dashboard Financiero**: Resumen con ingresos, gastos, balance, categorías y movimientos recientes.

---

## ✅ Servicios Activos

| Servicio       | Estado       | Puerto | URL                                  |
------------------------------------------------------------------------------- |
| **Frontend**  | ✅ Corriendo | 3000   | http://localhost:3000                 |
| *Backend**    | ✅ Corriendo | 8081   | http://localhost:8081                 |
| *PostgreSQL** | ✅ Healthy   | 5YeyiNt6qwMDRzSV3E1Cc1WcOwU65cqRU   | postgresql://appuser:YeyiNt6qwMDRzSV3E1Cc1WcOwU65cqRU@dpg-d7shkc37uimc73dpimvg-a.ohio-postgres.render.com:5432/appfinanzas_db_q1li |

---

## 🔐 Sistema de Autenticación, Presupuesto y Transacciones

### Endpoints Implementados

| Método | Endpoint                               | Descripción                              | Requiere Auth | Parámetros |
| ------ | -------------------------------------- | ---------------------------------------- | ------------- | ---------- |
| POST   | `/auth/register`                      | Registrar nuevo usuario                  | ❌            | email, password, name |
| POST   | `/auth/login`                         | Iniciar sesión y generar JWT             | ❌            | email, password |
| POST   | `/auth/logout`                        | Invalidar token JWT                       | ✅ Token      | Authorization: Bearer <token> |
| POST   | `/transactions`                       | Registrar gasto o ingreso                | ❌ / opcional | description, amount, category, date, type, userId |
| GET    | `/transactions/user/{userId}`         | Obtener todas las transacciones del usuario | ❌ / opcional | userId (path) |
| GET    | `/transactions/history/{userId}`      | Obtener transacciones filtradas          | ❌ / opcional | userId (path), type, startDate, endDate |
| DELETE | `/transactions/{id}`                  | Eliminar una transacción                 | ❌ / opcional | id (path) |
| GET    | `/transactions/budget-status/{userId}` | Obtener estado del presupuesto mensual    | ❌ / opcional | userId (path) |
| GET    | `/transactions/budget/{userId}`       | Obtener presupuesto mensual actual        | ❌ / opcional | userId (path) |
| POST   | `/transactions/budget`                | Crear presupuesto mensual                 | ❌ / opcional | userId, limit |
| PUT    | `/transactions/budget`                | Editar presupuesto mensual                | ❌ / opcional | userId, limit |
| GET    | `/dashboard/{userId}`                 | Obtener dashboard financiero              | ❌ / opcional | userId (path) |
| GET    | `/dashboard/me`                       | Obtener dashboard del usuario autenticado | ✅ Header X-User-Id | X-User-Id |

### Categorías de Transacciones

#### Categorías de Gastos
- 🍔 **ALIMENTACION** - Comida y bebidas
- 🚗 **TRANSPORTE** - Gasolina, transporte público
- 🏠 **VIVIENDA** - Alquiler, servicios
- 🎮 **ENTRETENIMIENTO** - Diversión y ocio
- 🏥 **SALUD** - Medicinas y médico
- 📚 **EDUCACION** - Cursos y libros

#### Categorías de Ingresos
- 💼 **INGRESO_FIJO** - Salario regular
- 💰 **INGRESO_EXTRA** - Bonos y otros ingresos

### Flujo de Autenticación

```
1. Usuario accede a http://localhost:3000
   ↓
2. App verifica isAuthenticated()
   ↓ NO
3. Muestra Login Page / Register Page
   ↓ Usuario registra o inicia sesión
   ↓
4. Backend valida credenciales
   ↓
5. Devuelve token JWT + datos del usuario
   ↓
6. Frontend guarda token y usuario en localStorage
   ↓ SÍ
7. Muestra Home / ExpensesPage con dashboard, presupuesto e historial
```

### Requisitos de Contraseña

✅ 8-10 caracteres  
✅ Mayúsculas (A-Z)  
✅ Minúsculas (a-z)  
✅ Números (0-9)  
✅ Símbolos especiales  

**Ejemplo válido:** `Test1234!`

---

## 📊 Funcionalidades Implementadas

### 1. Sistema de Registro y Sesión
- ✅ Validación de email con formato correcto.
- ✅ Validación de contraseña con reglas robustas.
- ✅ Prevención de duplicados por email.
- ✅ Mensajes de error descriptivos.
- ✅ Login con JWT.
- ✅ Logout funcional con invalidación del token.
- ✅ Persistencia de sesión en `localStorage`.

### 2. Gestión de Transacciones
- ✅ **Crear Transacciones**: gastos e ingresos con categorías específicas.
- ✅ **Listar Transacciones**: vista de transacciones del usuario.
- ✅ **Filtrado Dinámico**:
  - Por tipo (`GASTO` / `INGRESO`).
  - Por rango de fechas (`startDate` / `endDate`).
  - Combinación de filtros.
- ✅ **Eliminar Transacciones**: borrado de registros.
- ✅ **Resumen Financiero**:
  - Total de ingresos.
  - Total de gastos.
  - Balance neto.

### 3. Gestión de Presupuesto
- ✅ **Crear presupuesto mensual** para el mes actual.
- ✅ **Editar presupuesto mensual** existente.
- ✅ **Visualizar estado del presupuesto**.
- ✅ **Ver presupuesto restante**.
- ✅ **Ver porcentaje usado**.

### 4. Dashboard Financiero
- ✅ **Dashboard resumido** por usuario.
- ✅ **Movimientos recientes**.
- ✅ **Categorías de gasto e ingreso**.
- ✅ **Categoría de gasto principal**.
- ✅ **Categoría de ingreso principal**.
- ✅ **Ticket promedio**.

### 5. Interfaz de Usuario
- ✅ **Componentes Principales**:
  - LoginPage - Formulario de acceso.
  - RegisterPage - Formulario de registro.
  - Home - Pantalla principal con estado del backend.
  - ExpensesPage - Gestión de transacciones, presupuesto y dashboard.
- ✅ **ExpenseForm**: formulario para crear transacciones.
- ✅ **ExpenseList**: tabla de transacciones filtradas.
- ✅ **BudgetSummary**: resumen y edición del presupuesto.
- ✅ **Dashboard**: resumen financiero visual.
- ✅ **Filtros**: interfaz para aplicar filtros por fecha y tipo.

---

## ✅ Verificación de Servicios

### Backend (Spring Boot)

- ✅ Spring Boot 3.5.13 iniciado.
- ✅ Tomcat escuchando puerto 8081.
- ✅ JPA con Hibernate activo.
- ✅ HikariCP pool de conexiones activo.
- ✅ Arquitectura hexagonal implementada.
- ✅ JWT implementado para login y logout.
- ✅ Use Cases (Casos de Uso) implementados:
  - `AuthenticateUserUseCase` - Login.
  - `RegisterUserUseCase` - Registro.
  - `RegisterTransactionUseCase` - Crear transacción.
  - `GetTransactionsUseCase` - Obtener transacciones.
  - `GetFilteredTransactionsUseCase` - Filtrar transacciones.
  - `DeleteTransactionUseCase` - Eliminar transacción.
  - `DefineBudgetUseCase` - Crear/editar presupuesto.
  - `GetCurrentBudgetUseCase` - Obtener presupuesto actual.
  - `GetBudgetStatusUseCase` - Obtener estado del presupuesto.
  - `GetDashboardSummaryUseCase` - Obtener dashboard.

### Base de Datos

- ✅ PostgreSQL 15 en Render.com (nube).
- ✅ Base de datos `appfinanzas_db_q1li` disponible.
- ✅ Tablas activas:
  - `users` - Usuarios registrados.
  - `transactions` - Gastos e ingresos.
  - `monthly_budgets` - Presupuestos mensuales.
- ✅ Datos persistentes en la nube.
- ✅ SSL/TLS habilitado.

### Frontend

- ✅ React 18.3 + TypeScript 5.5 corriendo.
- ✅ Vite dev server escuchando puerto 3000.
- ✅ Componentes compilados y funcionales.
- ✅ Servicios:
  - `authService` - Registro, login, logout y usuario autenticado.
  - `expenseService` - Transacciones, dashboard y presupuesto.
- ✅ Conexión con backend (puerto 8081) establecida.
- ✅ Validaciones en cliente y servidor.

---

## 🔌 Conectividad

```
Frontend (localhost:3000)
    ↓ HTTP requests (CORS habilitado)
Backend (localhost:8081)
    ↓ JWT / Authorization + consultas REST
PostgreSQL en la nube (Render.com:5432)
```

### Verificación Manual

#### 1. Registro de Usuario
```bash
curl -X POST http://localhost:8081/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email":"usuario@test.com",
    "password":"SecurePass123!",
    "name":"Usuario Test"
  }'
```

**Respuesta esperada (201 Created):**
```json
{
  "message": "Usuario registrado exitosamente",
  "success": true,
  "data": null
}
```

#### 2. Inicio de Sesión
```bash
curl -X POST http://localhost:8081/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email":"usuario@test.com",
    "password":"SecurePass123!"
  }'
```

**Respuesta esperada (200 OK):**
```json
{
  "message": "Inicio de sesión exitoso",
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiJ9...",
    "id": 1,
    "email": "usuario@test.com",
    "name": "Usuario Test"
  }
}
```

#### 3. Cerrar Sesión
```bash
curl -X POST http://localhost:8081/auth/logout \
  -H "Authorization: Bearer <TOKEN_REAL>"
```

#### 4. Registrar Gasto
```bash
curl -X POST http://localhost:8081/transactions \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Almuerzo",
    "amount": 25.50,
    "category": "ALIMENTACION",
    "date": "2026-06-03",
    "type": "GASTO",
    "userId": 1
  }'
```

#### 5. Registrar Ingreso
```bash
curl -X POST http://localhost:8081/transactions \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Salario mensual",
    "amount": 2500.00,
    "category": "INGRESO_FIJO",
    "date": "2026-06-01",
    "type": "INGRESO",
    "userId": 1
  }'
```

#### 6. Obtener Todas las Transacciones
```bash
curl http://localhost:8081/transactions/user/1
```

#### 7. Obtener Transacciones Filtradas por Fecha
```bash
curl "http://localhost:8081/transactions/history/1?startDate=2026-06-01&endDate=2026-06-30"
```

#### 8. Obtener Solo Gastos
```bash
curl "http://localhost:8081/transactions/history/1?type=GASTO"
```

#### 9. Obtener el Presupuesto Actual
```bash
curl http://localhost:8081/transactions/budget/1
```

#### 10. Obtener el Estado del Presupuesto
```bash
curl http://localhost:8081/transactions/budget-status/1
```

#### 11. Obtener el Dashboard
```bash
curl http://localhost:8081/dashboard/1
```

#### 12. Eliminar Transacción
```bash
curl -X DELETE http://localhost:8081/transactions/1
```

---

## 👤 Usuarios de Prueba

| Email                    | Contraseña    | Nombre         | Status |
| ---------------------- - | ------------- | -------------- | ------ |
| `demo@example.com`       | `Demo1234!`   | Demo User      | ✅     |
| `prueba@test.com`        | `Prueba123!`  | Usuario Prueba | ✅     |
| `admin@appfinanzas.com`  | `Admin1234!`  | Admin User     | ✅     |

> **Nota**: puedes crear nuevos usuarios registrándote a través de la aplicación.

---

## 📁 Estructura de Base de Datos

### Tabla: users
```sql
CREATE TABLE users (
  id BIGINT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP
);
```

### Tabla: transactions
```sql
CREATE TABLE transactions (
  id BIGINT PRIMARY KEY,
  user_id BIGINT NOT NULL,
  description VARCHAR(255) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  category VARCHAR(50) NOT NULL,
  type VARCHAR(20) NOT NULL,
  transaction_date DATE NOT NULL,
  created_at TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### Tabla: monthly_budgets
```sql
CREATE TABLE monthly_budgets (
  id BIGINT PRIMARY KEY,
  user_id BIGINT NOT NULL,
  year INT NOT NULL,
  month INT NOT NULL,
  budget_limit DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

---

## 🚀 Comandos Útiles

### Reiniciar servicios

```bash
# Iniciar todos los servicios (modo background)
docker-compose up -d

# Detener todos los servicios
docker-compose down

# Ver logs del backend
docker-compose logs -f backend

# Ver logs del frontend
docker-compose logs -f frontend

# Verificar estado de servicios
docker-compose ps

# Reconstruir imágenes
docker-compose build --no-cache

# Reiniciar un servicio específico
docker-compose restart backend
```

### Acceder a la base de datos

```bash
# Conectar a PostgreSQL en Render (requiere credenciales)
psql -h dpg-d7shkc37uimc73dpimvg-a.ohio-postgres.render.com \
     -U appuser \
     -d appfinanzas_db_q1li \
     -c "SELECT * FROM users;"

# Ver transacciones
psql -h dpg-d7shkc37uimc73dpimvg-a.ohio-postgres.render.com \
     -U appuser \
     -d appfinanzas_db_q1li \
     -c "SELECT * FROM transactions ORDER BY created_at DESC;"

# Ver presupuestos
psql -h dpg-d7shkc37uimc73dpimvg-a.ohio-postgres.render.com \
     -U appuser \
     -d appfinanzas_db_q1li \
     -c "SELECT * FROM monthly_budgets ORDER BY updated_at DESC;"
```

### Compilación Manual (sin Docker)

```bash
# Backend
cd backend
mvn clean package
mvn spring-boot:run

# Frontend
cd frontend
npm install
npm run dev
```
docker-compose restart
```

### Ver logs en tiempo real

```bash
docker-compose logs -f
```

### Ver logs específicos

```bash
docker-compose logs backend
docker-compose logs frontend
docker-compose logs postgres
```

### Detener todo

```bash
docker-compose down
```

### Limpiar todo (incluyendo volúmenes)

```bash
docker-compose down -v
```

### Reiniciar desde cero

```bash
docker-compose down -v && docker-compose up -d
```


---

## 📋 Checklist de Validación - Sprint 2

### Autenticación
- [x] Registro de usuarios con validación de email
- [x] Validación de contraseña (requisitos robustos)
- [x] Prevención de emails duplicados
- [x] Login con autenticación JWT
- [x] Persistencia de sesión en `localStorage`
- [x] Logout funcional
- [x] Protección de acciones por usuario autenticado en frontend

### Transacciones
- [x] Crear gastos con categorías específicas
- [x] Crear ingresos con categorías específicas
- [x] Listar todas las transacciones
- [x] Filtrar por tipo de transacción (`GASTO` / `INGRESO`)
- [x] Filtrar por rango de fechas (`startDate` / `endDate`)
- [x] Combinación de múltiples filtros
- [x] Eliminar transacciones
- [x] Cálculo de totales (ingresos y gastos)
- [x] Dashboard con resumen financiero

### Presupuesto
- [x] Crear presupuesto mensual
- [x] Editar presupuesto mensual
- [x] Consultar estado del presupuesto
- [x] Consultar presupuesto actual

### Base de Datos
- [x] PostgreSQL en la nube (Render.com)
- [x] Tabla `users` creada
- [x] Tabla `transactions` creada
- [x] Tabla `monthly_budgets` creada
- [x] Relaciones entre tablas (FK)
- [x] Datos persistentes
- [x] SSL/TLS habilitado

### Infraestructura
- [x] Docker-compose configurado
- [x] Frontend corriendo en puerto 3000
- [x] Backend corriendo en puerto 8081
- [x] Base de datos en la nube
- [x] CORS habilitado
- [x] Conexión segura (SSL)
- [x] Red Docker personalizada

---

## 🔍 Monitoreo y Estado

**Última actualización:** 2026-06-03  
**Estado General:** ✅ **OPERATIVO**

### Componentes Activos
- ✅ Frontend (React + TypeScript)
- ✅ Backend (Spring Boot + Java)
- ✅ Base de Datos (PostgreSQL en la nube)
- ✅ Autenticación JWT y cierre de sesión
- ✅ Gestión de Transacciones
- ✅ Sistema de Filtros
- ✅ Sistema de Presupuesto Mensual
- ✅ Dashboard Financiero

### Observaciones Operativas
- El backend escucha en `8081`.
- El frontend consume el backend mediante `VITE_API_URL`.
- El backend expone `actuator/health` para verificación rápida.
- El presupuesto se calcula por usuario y por mes actual.

---

## 📈 Roadmap - Sprint (Próximo)

- 🔄 Implementar edición de transacciones desde la UI.
- 📊 Gráficos y análisis históricos de gastos.
- 💱 Conversión de monedas.
- 📱 Responsive design refinado.
- 🔔 Notificaciones proactivas de presupuesto.
- 📧 Exportación a CSV/PDF.
- 🔒 Recuperación de contraseña.
- 👥 Gestión avanzada de perfiles de usuario.
- 💳 Integración con métodos de pago.
- 📱 App móvil (React Native).

---

## 💾 Información de Backups

### Base de Datos en la Nube
Los backups están gestionados automáticamente por Render.com:
- Backups automáticos según la política del proveedor.
- Restauración desde snapshots del servicio.

### Backup Manual Local (si fuera necesario)
```bash
# Crear backup
pg_dump -h dpg-d7shkc37uimc73dpimvg-a.ohio-postgres.render.com \
  -U appuser \
  -d appfinanzas_db_q1li > backup_$(date +%Y%m%d_%H%M%S).sql

# Restaurar backup
psql -h dpg-d7shkc37uimc73dpimvg-a.ohio-postgres.render.com \
     -U appuser \
     -d appfinanzas_db_q1li < backup_20260603_120000.sql
```

---

## 🎯 Resumen de Cambios - Sprint 3

### ✨ Nuevas Características
| Característica | Descripción | Estado |
| --- | --- | --- |
| Cambio de BD | Migración a PostgreSQL en Render.com | ✅ |
| Creación de Cuentas | Registro de usuarios con validaciones | ✅ |
| Inicio de Sesión | Autenticación JWT | ✅ |
| Cerrar Sesión | Invalidación de token JWT | ✅ |
| Ingresos y Gastos | Dos tipos de transacciones | ✅ |
| Filtros por Fecha | Rango de fechas personalizable | ✅ |
| Filtros por Tipo | Filtrado por tipo de transacción | ✅ |
| Presupuesto Mensual | Creación y edición del presupuesto | ✅ |
| Estado de Presupuesto | Visualización de gasto y restante | ✅ |
| Dashboard | Resumen visual de finanzas | ✅ |

### 🔧 Cambios Técnicos
- Backend: Spring Boot 3.5.13 con arquitectura hexagonal.
- Frontend: React 18.3 + TypeScript 5.5 + Vite.
- Database: PostgreSQL 15 en Render.com.
- Container: Docker + Docker Compose.
- Autenticación: JWT + `localStorage`.
- API: REST con filtros dinámicos y presupuesto mensual.