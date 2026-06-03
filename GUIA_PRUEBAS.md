# 🧪 Guía de Pruebas del Sistema AppFinanzas

**Última actualización:** 2026-06-03

> Esta guía contiene pruebas incluyendo: autenticación JWT, cierre de sesión, transacciones de ingresos y gastos, presupuesto mensual, dashboard financiero, filtros y persistencia en PostgreSQL en la nube.

---

## ✨ Sprint 3: Nuevas Funcionalidades de Prueba

- ✅ HU-03 Cerrar sesión
- ✅ HU-13 Crear presupuesto mensual
- ✅ HU-14 Editar presupuesto
- ✅ HU-15 Visualizar estado del presupuesto
- ✅ HU-18 Visualizar dashboard
- ✅ Registro e inicio de sesión con JWT
- ✅ Transacciones de ingresos y gastos
- ✅ Filtros por fecha y por tipo de transacción
- ✅ Eliminación de transacciones

---

## ✅ Prueba 1: Acceder a la Aplicación y Verificar el Backend

1. Abre el navegador.
2. Ve a: **http://localhost:3000**.
3. Deberías ver la pantalla inicial de AppFinanzas con acceso a login y una indicación de estado del backend.
4. Confirma que el backend responde en:
   - **http://localhost:8081/actuator/health**

**Resultado esperado:**

- ✅ La interfaz principal carga correctamente.
- ✅ El backend responde con estado `UP`.

**✅ Si ves esto → Paso 1 EXITOSO**

---

## ✅ Prueba 2: Registrar un Nuevo Usuario

1. En la pantalla de inicio, ve a la opción de registro.
2. Llena el formulario con:
   - **Nombre**: `Usuario Prueba`
   - **Email**: `prueba@test.com`
   - **Contraseña**: `Test1234!`
3. Haz clic en **Registrarse**.

**Resultado esperado:**

- ✅ Toast o mensaje de éxito: `Usuario registrado exitosamente`.
- ✅ El usuario queda persistido en la base de datos.
- ✅ El sistema permite continuar al login.

**Validación real de contraseña:**

- Entre 8 y 10 caracteres.
- Al menos una mayúscula.
- Al menos una minúscula.
- Al menos un número.
- Al menos un símbolo.

**✅ Si funciona → Paso 2 EXITOSO**

---

## ✅ Prueba 3: Iniciar Sesión con el Usuario Creado

1. Ve a la pantalla de login.
2. Ingresa:
   - **Email**: `prueba@test.com`
   - **Contraseña**: `Test1234!`
3. Haz clic en **Iniciar Sesión**.

**Resultado esperado:**

- ✅ El backend devuelve `success: true`.
- ✅ Se almacena el token JWT en `localStorage`.
- ✅ Se almacena el usuario autenticado con `id`, `email` y `name`.
- ✅ La aplicación navega a la vista principal de gestión.

**Respuesta esperada del backend:**

```json
{
  "message": "Inicio de sesión exitoso",
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiJ9...",
    "id": 1,
    "email": "prueba@test.com",
    "name": "Usuario Prueba"
  }
}
```

**✅ Si funciona → Paso 3 EXITOSO**

---

## ✅ Prueba 4: Cerrar Sesión (HU-03)

1. Ya autenticado, haz clic en **Cerrar Sesión**.
2. Verifica que la aplicación vuelva a la pantalla de login o inicio.
3. Vuelve a intentar entrar a una ruta protegida o usar la app sin volver a autenticarse.

**Resultado esperado:**

- ✅ El frontend elimina el token y el usuario guardado.
- ✅ El backend invalida el token recibido.
- ✅ El usuario queda fuera de la sesión activa.
- ✅ No se deberían poder consumir de nuevo las acciones autenticadas hasta volver a iniciar sesión.

**Respuesta esperada del backend:**

```json
{
  "message": "Sesión cerrada exitosamente",
  "success": true,
  "data": null
}
```

**✅ Si funciona → Paso 4 EXITOSO**

---

## ✅ Prueba 5: Registrar un Gasto

### Rellenar el formulario:

1. **Tipo de Transacción**: `GASTO`
2. **Descripción**: `Almuerzo en restaurante`
3. **Monto**: `150`
4. **Categoría**: `Alimentación`
5. **Fecha**: fecha actual

### Hacer clic en **Registrar Transacción**

**Resultado esperado:**

- ✅ Se registra el gasto correctamente.
- ✅ El gasto aparece en el historial.
- ✅ El dashboard se actualiza con el total gastado.
- ✅ El presupuesto reflejará el impacto en el gasto mensual.

**Respuesta esperada del backend:**

```json
{
  "message": "Gasto registrado",
  "success": true,
  "data": {
    "description": "Almuerzo en restaurante",
    "amount": 150,
    "categoryName": "ALIMENTACION",
    "type": "GASTO"
  }
}
```

**✅ Si todo funciona → Paso 5 EXITOSO**

---

## ✅ Prueba 6: Registrar un Ingreso

### Rellenar el formulario:

1. **Tipo de Transacción**: `INGRESO`
2. **Descripción**: `Salario mensual`
3. **Monto**: `2000`
4. **Categoría**: `Ingreso Fijo`
5. **Fecha**: fecha actual

### Hacer clic en **Registrar Transacción**

**Resultado esperado:**

- ✅ Se registra el ingreso correctamente.
- ✅ El ingreso aparece en el historial.
- ✅ El dashboard actualiza el total de ingresos.
- ✅ El presupuesto muestra la relación entre ingresos, gastos y saldo disponible.

**Categorías válidas para INGRESO:**

- `Ingreso Fijo`
- `Ingreso Extra`

**✅ Si todo funciona → Paso 6 EXITOSO**

---

## ✅ Prueba 7: Crear y Editar el Presupuesto Mensual (HU-13 y HU-14)

1. En la tarjeta de presupuesto, escribe un valor válido mayor a `0`.
2. Haz clic en **Editar Presupuesto**.
3. Vuelve a cambiar el valor y repite la acción para confirmar que se actualiza.

**Resultado esperado:**

- ✅ El presupuesto mensual se guarda correctamente para el mes actual.
- ✅ Si ya existía un presupuesto, se actualiza con el nuevo valor.
- ✅ El frontend muestra confirmación de guardado exitoso.
- ✅ El valor se refleja en la UI y en la base de datos.

**Validación real:**

- El presupuesto debe ser mayor a `0`.
- El presupuesto se guarda por `userId`, `año` y `mes`.

**Respuesta esperada del backend:**

```json
{
  "message": "Presupuesto guardado correctamente",
  "success": true,
  "data": {
    "limit": 1500,
    "year": 2026,
    "month": 6
  }
}
```

**✅ Si funciona → Paso 7 EXITOSO**

---

## ✅ Prueba 8: Visualizar el Estado del Presupuesto (HU-15)

1. Con un usuario autenticado, abre la sección de presupuesto o recarga la vista principal.
2. Verifica que se cargue el estado del presupuesto actual.

**Resultado esperado:**

- ✅ Se muestra el límite del presupuesto.
- ✅ Se muestran ingresos totales, gasto total, disponible y porcentaje usado.
- ✅ Se muestra el año y el mes del periodo actual.
- ✅ Si el gasto supera el límite, aparece una alerta visual.

**Respuesta esperada del backend:**

```json
{
  "budget": 1500,
  "totalIncome": 2000,
  "spent": 150,
  "remaining": 1350,
  "percentageUsed": 10,
  "year": 2026,
  "month": 6
}
```

**✅ Si funciona → Paso 8 EXITOSO**

---

## ✅ Prueba 9: Visualizar el Dashboard (HU-18)

1. Ya autenticado, entra a la vista principal de gestión financiera.
2. Verifica que el dashboard cargue información resumida.

**Resultado esperado:**

- ✅ Se muestra el total de ingresos.
- ✅ Se muestra el total de gastos.
- ✅ Se muestra el saldo disponible.
- ✅ Se muestra el presupuesto usado.
- ✅ Se muestran transacciones recientes.
- ✅ Se muestran categorías de gasto e ingreso.
- ✅ Se muestra la categoría top de gasto y la top de ingreso.
- ✅ Se muestra el ticket promedio.

**✅ Si funciona → Paso 9 EXITOSO**

---

## ✅ Prueba 10: Filtrar por Tipo y por Rango de Fechas

### Filtro por tipo

1. En la pestaña de historial, selecciona `GASTO`.
2. Aplica el filtro.

**Resultado esperado:**

- ✅ Solo aparecen transacciones de tipo gasto.

### Filtro por rango de fechas

1. Define fecha de inicio.
2. Define fecha final.
3. Aplica el filtro.

**Resultado esperado:**

- ✅ Solo aparecen movimientos dentro del rango indicado.

**✅ Si funciona → Paso 10 EXITOSO**

---

## ✅ Prueba 11: Eliminar una Transacción

1. En el historial, localiza una transacción creada previamente.
2. Haz clic en **Eliminar**.

**Resultado esperado:**

- ✅ El backend responde con eliminación exitosa.
- ✅ La transacción desaparece del historial.
- ✅ Se actualizan los totales del dashboard y del presupuesto.

**Respuesta esperada del backend:**

```json
{
  "message": "Eliminado correctamente",
  "success": true,
  "data": null
}
```

**✅ Si funciona → Paso 11 EXITOSO**

---

## ✅ Prueba 12: Verificar API, Base de Datos y Persistencia

### Pruebas API

```bash
# Registrar usuario
curl -X POST http://localhost:8081/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"api@test.com","password":"ApiTest1234!","name":"API Test"}'

# Iniciar sesión
curl -X POST http://localhost:8081/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"api@test.com","password":"ApiTest1234!"}'

# Cerrar sesión (usa el token real obtenido en login)
curl -X POST http://localhost:8081/auth/logout \
  -H "Authorization: Bearer <TOKEN_REAL>"

# Registrar gasto
curl -X POST http://localhost:8081/transactions \
  -H "Content-Type: application/json" \
  -d '{"description":"Test","amount":50,"category":"ALIMENTACION","date":"2026-06-03","type":"GASTO","userId":1}'

# Consultar historial
curl http://localhost:8081/transactions/user/1

# Consultar presupuesto
curl http://localhost:8081/transactions/budget/1

# Consultar estado del presupuesto
curl http://localhost:8081/transactions/budget-status/1

# Consultar dashboard
curl http://localhost:8081/dashboard/1

# Eliminar transacción
curl -X DELETE http://localhost:8081/transactions/1
```

### Verificación en base de datos

```bash
psql -h dpg-d7shkc37uimc73dpimvg-a.ohio-postgres.render.com \
     -U appuser -d appfinanzas_db_q1li \
     -c "SELECT * FROM users;"

psql -h dpg-d7shkc37uimc73dpimvg-a.ohio-postgres.render.com \
     -U appuser -d appfinanzas_db_q1li \
     -c "SELECT * FROM transactions;"

psql -h dpg-d7shkc37uimc73dpimvg-a.ohio-postgres.render.com \
     -U appuser -d appfinanzas_db_q1li \
     -c "SELECT * FROM monthly_budgets;"
```

### Persistencia esperada

1. Registra un usuario.
2. Registra un gasto o ingreso.
3. Define el presupuesto mensual.
4. Reinicia los servicios.
5. Vuelve a consultar el historial, el presupuesto y el dashboard.

**Resultado esperado:**

- ✅ Los datos siguen disponibles después del reinicio.
- ✅ El presupuesto mensual persiste en `monthly_budgets`.
- ✅ El dashboard sigue reflejando los datos guardados.

**✅ Si API, BD y persistencia funcionan → Paso 12 EXITOSO**

---

## 📊 Resumen de Pruebas - Sprint 3

| Prueba | Descripción                       | Estado |
| ------ | --------------------------------- | ------ |
| 1      | Acceso a la aplicación            | ⬜     |
| 2      | Registrar usuario                 | ⬜     |
| 3      | Iniciar sesión                    | ⬜     |
| 4      | Cerrar sesión                     | ⬜     |
| 5      | Registrar gasto                   | ⬜     |
| 6      | Registrar ingreso                 | ⬜     |
| 7      | Crear y editar presupuesto        | ⬜     |
| 8      | Visualizar estado del presupuesto | ⬜     |
| 9      | Visualizar dashboard              | ⬜     |
| 10     | Filtrar por tipo y fechas         | ⬜     |
| 11     | Eliminar transacción              | ⬜     |
| 12     | API, BD y persistencia            | ⬜     |

**Total:** 12/12 pruebas

Marca con ✅ cada prueba que completes exitosamente.

---

## 🐛 Troubleshooting - Sprint 2

### "El frontend no carga"

```bash
docker-compose logs frontend
docker ps | grep appfinanzas_frontend
```

### "No puedo conectar al backend (puerto 8081)"

```bash
# Verifica que el backend responde
curl http://localhost:8081/actuator/health

# Ver logs
docker-compose logs backend
```

### "El login falla"

```bash
# Verifica que el usuario existe en la BD en la nube
psql -h dpg-d7shkc37uimc73dpimvg-a.ohio-postgres.render.com \
     -U appuser -d appfinanzas_db_q1li \
     -c "SELECT * FROM users;"
```

### "El logout falla"

```bash
# Verifica que se envíe el token JWT correcto
curl -X POST http://localhost:8081/auth/logout \
  -H "Authorization: Bearer <TOKEN_REAL>"
```

### "El presupuesto no se guarda"

```bash
# Verifica el endpoint del presupuesto
curl http://localhost:8081/transactions/budget/1

# Verifica el estado del presupuesto
curl http://localhost:8081/transactions/budget-status/1
```

### "Los datos no se guardan"

```bash
# BD en Render.com (nube)
psql -h dpg-d7shkc37uimc73dpimvg-a.ohio-postgres.render.com \
     -U appuser -d appfinanzas_db_q1li \
     -c "SELECT NOW();"
```

### "Puerto 8081 en uso"

```bash
# Windows
netstat -ano | findstr :8081

# Mac/Linux
lsof -i :8081
```

---

## 📝 Notas - Sprint 2

### Cambios principales incorporados en esta versión:

- ✨ **HU-03 Cerrar sesión**: el backend invalida el token JWT y el frontend limpia la sesión.
- ✨ **HU-13 Crear presupuesto mensual**: se guarda presupuesto por usuario y mes.
- ✨ **HU-14 Editar presupuesto**: el mismo endpoint actualiza el presupuesto existente.
- ✨ **HU-15 Visualizar estado del presupuesto**: se muestran límite, gastado, restante y porcentaje usado.
- ✨ **HU-18 Visualizar dashboard**: se muestra un resumen financiero con categorías, totales y transacciones recientes.
- ✨ **Autenticación**: registro e inicio de sesión con email, contraseña y JWT.
- ✨ **BD en la nube**: PostgreSQL en Render.com.
- ✨ **Puerto del backend**: 8081.
- ✨ **Tipos de transacciones**: `GASTO` e `INGRESO`.
- ✨ **Categorías dinámicas** según el tipo de transacción.
- ✨ **Filtros**: por tipo y por rango de fechas.

### Características verificadas:

- Los datos se guardan en PostgreSQL en Render.com.
- Cada usuario ve sus propias transacciones, presupuesto y dashboard.
- El dashboard resume ingresos, gastos, disponibilidad y categorías.
- El presupuesto mensual se consulta y modifica desde la UI.
- Las fechas se pueden filtrar por rango en el historial.

### Categorías por tipo:

**GASTO:**
- Alimentación
- Transporte
- Vivienda
- Entretenimiento
- Salud
- Educación

**INGRESO:**
- Ingreso Fijo
- Ingreso Extra

### Contraseña requerida:

- Mínimo 8 caracteres
- Máximo 10 caracteres
- Al menos 1 MAYÚSCULA
- Al menos 1 minúscula
- Al menos 1 NÚMERO
- Al menos 1 símbolo especial
