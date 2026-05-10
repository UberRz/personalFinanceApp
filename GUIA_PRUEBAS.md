# 🧪 Guía de Pruebas del Sistema AppFinanzas

**Última actualización:** 2026-05-10 (Sprint 2)

> Esta guía contiene pruebas completas incluyendo autenticación, transacciones, filtros y validaciones.

---

## ✨ Sprint 2: Nuevas Funcionalidades de Prueba

- ✅ Autenticación (Registro e Inicio de Sesión)
- ✅ Transacciones de Ingresos y Gastos
- ✅ Filtros por Fecha
- ✅ Filtros por Tipo de Transacción
- ✅ Resumen de totales (ingresos y gastos)

---

## ✅ Prueba 1: Acceder a la Aplicación y Login

1. Abre el navegador
2. Ve a: **http://localhost:3000**
3. Deberías ver la página de Login con:
   - Título: "Iniciar Sesión"
   - Campo de Email
   - Campo de Contraseña
   - Botón "Iniciar Sesión"
   - Link "¿No tienes cuenta? Regístrate aquí"

**✅ Si ves esto → Paso 1 EXITOSO**

---

## ✅ Prueba 2: Registrar un Nuevo Usuario (Sprint 2)

1. En la página de Login, haz click en "¿No tienes cuenta? Regístrate aquí"
2. Llena el formulario con:
   - **Nombre**: "Usuario Prueba"
   - **Email**: "prueba@test.com"
   - **Contraseña**: "Test1234!" (debe cumplir requisitos)
3. Haz click en "Registrarse"

**Resultado esperado:**

- ✅ Toast de éxito: "Usuario registrado exitosamente"
- ✅ Redirige automáticamente a Login

**✅ Si funciona → Paso 2 EXITOSO**

---

## ✅ Prueba 3: Registrar un Gasto (Transacción Tipo GASTO)

### Rellenar el formulario:

1. **Tipo de Transacción**: "GASTO"
2. **Descripción**: "Almuerzo en restaurante"
3. **Monto**: 150
4. **Categoría**: "Alimentación" (disponible para GASTO)
5. **Fecha**: (fecha actual)

### Hacer click en "Registrar Transacción"

**Resultado esperado:**

- ✅ Toast de éxito: "Transacción registrada exitosamente"
- ✅ El gasto aparece en el historial
- ✅ El resumen actualiza:
  - Total Gastos: $150.00
  - Total Ingresos: $0.00
  - Balance: -$150.00
- ✅ Tipo mostrado: "Gasto" (en rojo)

**✅ Si todo funciona → Paso 3 EXITOSO**

---

## ✅ Prueba 4: Registrar un Ingreso (Sprint 2)

### Rellenar el formulario:

1. **Tipo de Transacción**: "INGRESO"
2. **Descripción**: "Salario mensual"
3. **Monto**: 2000
4. **Categoría**: "Ingreso Fijo"
5. **Fecha**: (fecha actual)

### Hacer click en "Registrar Transacción"

**Resultado esperado:**

- ✅ Toast de éxito: "Transacción registrada exitosamente"
- ✅ El ingreso aparece en el historial
- ✅ El resumen actualiza:
  - Total Ingresos: $2000.00
  - Total Gastos: $150.00 (del gasto anterior)
  - Balance: $1850.00
- ✅ Tipo mostrado: "Ingreso" (en verde)

**✅ Si todo funciona → Paso 4 EXITOSO**

---

## ✅ Prueba 5: Registrar Múltiples Transacciones

Registra estas transacciones adicionales:

**GASTOS:**
| Descripción       | Monto | Categoría       |
| ----------------- | ----- | --------------- |
| Pasaje transporte | 50    | Transporte      |
| Medicinas         | 100   | Salud           |
| Película          | 75    | Entretenimiento |
| Libros            | 200   | Educación       |

**INGRESOS:**
| Descripción | Monto | Categoría     |
| ----------- | ----- | ------------- |
| Bonificación| 500   | Ingreso Extra |
| Freelance   | 300   | Ingreso Extra |

**Resultado esperado:**

- ✅ Total Gastos: $575.00
- ✅ Total Ingresos: $2800.00
- ✅ Balance: $2225.00
- ✅ 9 transacciones en el historial

**✅ Si todo funciona → Paso 5 EXITOSO**

---

## ✅ Prueba 6: Filtrar por Tipo (Sprint 2)

1. Selecciona Tipo: "GASTO"
2. Click en "Aplicar Filtro"

**Resultado esperado:**
- ✅ Se muestran solo los gastos (5 transacciones)
- ✅ Los ingresos desaparecen

**✅ Si funciona → Paso 6 EXITOSO**

---

## ✅ Prueba 7: Filtrar por Rango de Fechas (Sprint 2)

1. Fecha Inicio: 01/05/2026
2. Fecha Fin: 10/05/2026
3. Click en "Aplicar Filtro"

**Resultado esperado:**
- ✅ Se muestran solo transacciones del rango

**✅ Si funciona → Paso 7 EXITOSO**

---

## ✅ Prueba 8: Eliminar una Transacción

1. En el tab "Historial"
2. Localiza una transacción (ej: "Almuerzo en restaurante" - $150)
3. Haz click en el botón "Eliminar"

**Resultado esperado:**

- ✅ Toast: "Transacción eliminada correctamente"
- ✅ La transacción desaparece del historial
- ✅ El resumen se actualiza

**✅ Si funciona → Paso 8 EXITOSO**

---

## ✅ Prueba 9: Validaciones del Formulario

**Test 9a: Monto = 0**
- Resultado: ❌ Error: "El monto debe ser mayor a 0"

**Test 9b: Sin categoría**
- Resultado: ❌ Error: "Selecciona una categoría válida"

**Test 9c: Sin fecha**
- Resultado: ❌ Error: "La fecha es obligatoria"

**✅ Si aparecen errores correctos → Paso 9 EXITOSO**

---

## ✅ Prueba 10: Verificar Base de Datos (Sprint 2)

```bash
psql -h dpg-d7shkc37uimc73dpimvg-a.ohio-postgres.render.com \
     -U appuser -d appfinanzas_db_q1li \
     -c "SELECT * FROM transactions;"
```

**Resultado esperado:**
- ✅ Se muestran todas las transacciones

**✅ Si aparecen los datos → Paso 10 EXITOSO**

---

## ✅ Prueba 11: Verificar Persistencia

1. Registra un gasto: "Café" - $25
2. Reinicia: `docker-compose restart`
3. Recarga: F5

**Resultado esperado:**
- ✅ El gasto sigue apareciendo

**✅ Si persisten → Paso 11 EXITOSO**

---

## ✅ Prueba 12: Verificar API (Sprint 2)

**Puerto: 8081** (cambió de 8080)

```bash
# REGISTRAR USUARIO
curl -X POST http://localhost:8081/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"api@test.com","password":"ApiTest1234!","name":"API Test"}'

# OBTENER TRANSACCIONES
curl http://localhost:8081/transactions/user/1

# REGISTRAR GASTO
curl -X POST http://localhost:8081/transactions \
  -H "Content-Type: application/json" \
  -d '{"description":"Test","amount":50,"category":"ALIMENTACION","date":"2026-05-10","type":"GASTO","userId":1}'

# ELIMINAR
curl -X DELETE http://localhost:8081/transactions/1
```

**Resultado esperado:**
- ✅ Todos los endpoints responden
- ✅ Puerto es 8081

**✅ Si API funciona → Paso 12 EXITOSO**

---

---

## 📊 Resumen de Pruebas - Sprint 2

| Prueba | Descripción                | Estado |
| ------ | -------------------------- | ------ |
| 1      | Acceso a Login             | ⬜     |
| 2      | Registrar usuario          | ⬜     |
| 3      | Registrar gasto            | ⬜     |
| 4      | Registrar ingreso          | ⬜     |
| 5      | Múltiples transacciones    | ⬜     |
| 6      | Filtrar por tipo           | ⬜     |
| 7      | Filtrar por fechas         | ⬜     |
| 8      | Eliminar transacción       | ⬜     |
| 9      | Validaciones               | ⬜     |
| 10     | BD en la nube              | ⬜     |
| 11     | Persistencia               | ⬜     |
| 12     | API (puerto 8081)          | ⬜     |

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
# ✨ Sprint 2: Puerto cambió a 8081
curl http://localhost:8081/transactions/user/1

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

### "Los datos no se guardan"

```bash
# ✨ Sprint 2: BD está en Render.com (nube)
# Verifica conexión
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

### Cambios principales desde Sprint 1:
- ✨ **Autenticación**: Registro e inicio de sesión con email y contraseña
- ✨ **BD en la nube**: Render.com PostgreSQL (no local)
- ✨ **Puerto cambiado**: 8081 (anteriormente 8080)
- ✨ **Tipos de transacciones**: GASTO e INGRESO separados
- ✨ **Categorías dinámicas**: Diferentes según tipo de transacción
- ✨ **Filtros**: Por tipo y por rango de fechas

### Características:
- Los datos se guardan en PostgreSQL en Render.com
- El balance es: Total Ingresos - Total Gastos
- Cada usuario solo ve sus propias transacciones
- Validación de categorías según tipo (GASTO/INGRESO)
- Las fechas se pueden filtrar por rango

### Categorías por Tipo:

**GASTO:**
- Alimentación
- Transporte
- Entretenimiento
- Salud
- Educación
- Vivienda

**INGRESO:**
- Ingreso Fijo
- Ingreso Extra

### Contraseña Requerida (Sprint 2):
- Mínimo 8 caracteres
- Máximo 10 caracteres
- Al menos 1 MAYÚSCULA
- Al menos 1 minúscula
- Al menos 1 NÚMERO
- Al menos 1 símbolo especial (!@#$%^&*)
