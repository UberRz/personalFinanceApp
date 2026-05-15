# Documentación Backend - AppFinanzas

Fecha: 2026-05-14

Documento de referencia del backend real del proyecto. Resume Swagger/OpenAPI, arquitectura hexagonal, endpoints, Docker y pruebas.

---

## 1. Swagger / OpenAPI

### Estado real

- Dependencia activa en `pom.xml`: `springdoc-openapi-starter-webmvc-ui` `2.8.5`.
- Ruta de OpenAPI: `http://localhost:8081/api-docs`.
- Swagger UI: `http://localhost:8081/swagger-ui.html` o `http://localhost:8081/swagger-ui/index.html`.
- El backend actual **no implementa JWT real**, por lo que no existe flujo de `Bearer Token` en Swagger.

### Anotaciones recomendadas

- `@Tag`
- `@Operation`
- `@ApiResponses`
- `@Schema`

### Ejemplo mínimo

```java
@RestController
@RequestMapping("/auth")
@Tag(name = "Auth", description = "Registro e inicio de sesión")
public class AuthController {

    @Operation(summary = "Iniciar sesión")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "OK"),
        @ApiResponse(responseCode = "400", description = "Datos inválidos")
    })
    @PostMapping("/login")
    public ResponseEntity<ApiResponse> login(@Valid @RequestBody LoginUserDTO dto) { ... }
}
```

### Ejemplos JSON reales

**Registro**

```json
{
  "email": "usuario@test.com",
  "password": "Test1234!",
  "name": "Usuario Test"
}
```

**Login**

```json
{
  "email": "usuario@test.com",
  "password": "Test1234!"
}
```

**Crear transacción**

```json
{
  "description": "Almuerzo en restaurante",
  "amount": 25.5,
  "category": "ALIMENTACION",
  "date": "2026-05-14",
  "type": "GASTO",
  "userId": 1
}
```

**Listado / historial**

```json
[
  {
    "id": 10,
    "description": "Almuerzo en restaurante",
    "amount": 25.5,
    "category": "ALIMENTACION",
    "date": "2026-05-14",
    "type": "GASTO",
    "userId": null
  }
]
```

### Buenas prácticas REST

- Documentar request/response con DTOs reales.
- Indicar códigos HTTP reales.
- Marcar explícitamente cualquier endpoint pendiente.

---

## 2. README organizado

### Descripción del proyecto

`AppFinanzas` es un backend para gestión de finanzas personales. Permite registrar usuarios, iniciar sesión, crear ingresos/gastos, filtrar historial y eliminar transacciones.

### Tecnologías utilizadas

- Spring Boot 3.5.13
- Java 17
- PostgreSQL
- Maven
- Docker / docker-compose
- springdoc-openapi
- JPA / Hibernate

### Arquitectura hexagonal

- **Domain**: `domain.model` con `User`, `Transaction`, `Income`, `Expense` y enums.
- **Application**: `application.usecase` con casos de uso.
- **Ports**: `domain.port.out` con interfaces de persistencia.
- **Adapters / Infrastructure**: `infrastructure.adapter.in.web` y `infrastructure.adapter.out.persistance`.

### Estructura real

- `domain/model` → entidades y enums.
- `domain/port/out` → puertos de persistencia.
- `application/usecase` → lógica de negocio.
- `infrastructure/adapter/in/web` → controladores y DTOs.
- `infrastructure/adapter/out/persistance` → JPA y repositorios.
- `config` → CORS, Jackson y Swagger.

### Instalación y ejecución

```bash
git clone https://github.com/UberRz/personalFinanceApp
cd personalFinanceApp/backend
mvn clean package
mvn spring-boot:run
```

La API escucha en `http://localhost:8081`.

### Variables de entorno relevantes

- `SPRING_DATASOURCE_URL`
- `SPRING_DATASOURCE_USERNAME` / `DB_USER`
- `SPRING_DATASOURCE_PASSWORD` / `DB_PASSWORD`
- `SERVER_PORT`
- `CORS_ALLOWED_ORIGINS`
- `springdoc.api-docs.path`
- `springdoc.swagger-ui.path`

### Swagger

- UI: `http://localhost:8081/swagger-ui.html`
- API docs: `http://localhost:8081/api-docs`

### Testing

```bash
cd backend
mvn test
```

### Endpoints principales

| Método | Ruta | Descripción |
| --- | --- | --- |
| POST | `/auth/register` | Registrar usuario |
| POST | `/auth/login` | Iniciar sesión |
| POST | `/transactions` | Crear transacción |
| GET | `/transactions/user/{userId}` | Listar transacciones del usuario |
| GET | `/transactions/history/{userId}` | Filtrar transacciones |
| DELETE | `/transactions/{id}` | Eliminar transacción |

### Troubleshooting

- CORS: revisar `CorsConfiguration`.
- DB: revisar `SPRING_DATASOURCE_URL`, usuario y contraseña.
- Login falla: revisar email y contraseña enviados al endpoint.
- Puerto ocupado: cambiar `SERVER_PORT` o liberar el puerto.

---

## 3. Diagramas y arquitectura hexagonal

### Idea general

La arquitectura hexagonal separa la lógica de negocio de los detalles técnicos. En este proyecto, el dominio no depende de Spring, y los controladores/repositorios actúan como adaptadores.

### Flujo de petición

1. El cliente llama a un controlador REST.
2. El controlador convierte el payload a DTO o modelo de dominio.
3. El caso de uso aplica las reglas de negocio.
4. El puerto de salida persiste o consulta datos.
5. El adaptador JPA usa PostgreSQL.

### Mapa breve de capas

- `AuthController` y `UserRegisterController` → entrada HTTP.
- `TransactionController` → entrada HTTP de transacciones.
- `RegisterUserUseCase`, `AuthenticateUserUseCase`, `RegisterTransactionUseCase`, `GetTransactionsUseCase`, `GetFilteredTransactionsUseCase`, `DeleteTransactionUseCase` → aplicación.
- `UserRepository`, `TransactionRepository` → puertos.
- `UserRepositoryImpl`, `TransactionRepositoryImpl` → persistencia.

### ER básico

```mermaid
erDiagram
  USERS ||--o{ TRANSACTIONS : owns

  USERS {
    BIGINT id PK
    VARCHAR email
    VARCHAR password
    VARCHAR full_name
    TIMESTAMP created_at
  }

  TRANSACTIONS {
    BIGINT id PK
    BIGINT user_id FK
    VARCHAR description
    DECIMAL amount
    VARCHAR category
    DATE transaction_date
    VARCHAR type
  }
```

---

## 4. Documentación de endpoints

### Formato de respuesta usado por el backend

El backend responde con `ApiResponse` en registro, login, creación y eliminación:

```json
{
  "message": "Las credenciales son incorrectas",
  "success": false,
  "data": null
}
```

### `POST /auth/register`

- **Descripción:** registra un usuario.
- **Headers:** `Content-Type: application/json`
- **Body:** `RegisterUserDTO`.
- **Response 201:**

```json
{
  "message": "Usuario registrado exitosamente",
  "success": true,
  "data": null
}
```

- **Errores reales:** email inválido, datos vacíos, email ya registrado.
- **Autenticación:** no requerida.

### `POST /auth/login`

- **Descripción:** autentica usuario.
- **Headers:** `Content-Type: application/json`
- **Body:** `LoginUserDTO`.
- **Response 200:**

```json
{
  "message": "Inicio de sesión exitoso",
  "success": true,
  "data": {
    "id": 1,
    "email": "usuario@test.com",
    "password": "Test1234!",
    "name": "Usuario Test",
    "createdAt": "2026-05-10T12:00:00"
  }
}
```

- **Errores reales:** email inválido o credenciales incorrectas.
- **Autenticación:** no requerida.

### `POST /transactions`

- **Descripción:** crea una transacción asociada a `userId`.
- **Headers:** `Content-Type: application/json`
- **Body:** `TransactionDTO`.
- **Response 201:** objeto `Income` o `Expense` serializado dentro de `ApiResponse.data`.

```json
{
  "message": "Gasto registrado",
  "success": true,
  "data": {
    "id": null,
    "description": "Almuerzo en restaurante",
    "amount": 25.5,
    "date": "2026-05-14",
    "type": "GASTO",
    "category": "ALIMENTACION",
    "categoryName": "ALIMENTACION"
  }
}
```

- **Validaciones reales:** `amount > 0`; `type` decide `Income` o `Expense`; `category` debe existir en el enum.
- **Autenticación:** no requerida.

### `GET /transactions/user/{userId}`

- **Descripción:** devuelve todas las transacciones del usuario.
- **Headers:** ninguno adicional.
- **Response 200:** lista de `TransactionDTO`.
- **Autenticación:** no requerida.

### `GET /transactions/history/{userId}`

- **Descripción:** devuelve historial filtrado.
- **Query params reales:** `type`, `startDate`, `endDate`.
- **Autenticación:** no requerida.

### `DELETE /transactions/{id}`

- **Descripción:** elimina una transacción.
- **Headers:** ninguno adicional.
- **Response 200:**

```json
{
  "message": "Eliminado correctamente",
  "success": true,
  "data": null
}
```

- **Autenticación:** no requerida.

### `PUT /transactions/{id}`

- **Estado:** no implementado en el backend actual.

---

## 5. Docker y despliegue

### docker-compose

- Backend: `8081`
- PostgreSQL: `5432`
- Frontend: `3000` si se usa en paralelo

### Comandos útiles

```bash
docker-compose up -d
docker-compose logs -f
docker-compose down
```

### Persistencia

Se usa volumen para PostgreSQL.

### Backup y restore

```bash
pg_dump -h <host> -U <user> -d <db> > backup.sql
psql -h <host> -U <user> -d <db> < backup.sql
```

### Buenas prácticas

- No versionar credenciales.
- Mantener variables sensibles fuera del repositorio.

---

## 6. Testing y validaciones

### Pruebas reales recomendadas

- Registro exitoso.
- Login correcto.
- Login con credenciales inválidas.
- Registro con email duplicado.
- Crear gasto o ingreso con `amount > 0`.
- Filtrar por tipo y fecha.
- Eliminar una transacción.

### Ejemplos `curl`

```bash
curl -X POST http://localhost:8081/auth/register -H "Content-Type: application/json" -d '{"email":"test@test.com","password":"Test1234!","name":"Test"}'
curl -X POST http://localhost:8081/auth/login -H "Content-Type: application/json" -d '{"email":"test@test.com","password":"Test1234!"}'
curl -X POST http://localhost:8081/transactions -H "Content-Type: application/json" -d '{"description":"Café","amount":25,"category":"ALIMENTACION","date":"2026-05-14","type":"GASTO","userId":1}'
```

### Verificación en base de datos

```sql
SELECT * FROM users;
SELECT * FROM transactions WHERE user_id = 1;
```

### Validaciones backend

- `User`: email obligatorio, contraseña obligatoria, nombre obligatorio, email válido, contraseña con mayúscula, minúscula, número y símbolo, entre 8 y 10 caracteres.
- `Transaction`: monto mayor a cero, fecha ISO `YYYY-MM-DD`, tipo `GASTO` o `INGRESO`, categoría válida.

### Nota sobre testing

La documentación se mantiene simple: `mvn test` y validación funcional básica. No se documentan herramientas avanzadas de testing.
