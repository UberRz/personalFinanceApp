# 🧪 Guía de Pruebas del Sistema AppFinanzas

## ✅ Prueba 1: Acceder a la Aplicación

1. Abre el navegador
2. Ve a: **http://localhost:3000**
3. Deberías ver la página de bienvenida con:
   - Título: "¡Bienvenido a AppFinanzas!"
   - Icono de billetera
   - Información de la arquitectura
   - Botón "Comenzar a Registrar Gastos"

**✅ Si ves esto → Paso 1 EXITOSO**

---

## ✅ Prueba 2: Navegar a Gestión de Gastos

1. En la página Home, haz click en "Comenzar a Registrar Gastos"
2. Deberías llegar a la página de Gastos que muestra:
   - Bienvenida: "Gestión Financiera Personal"
   - Resumen de Presupuesto
   - Dos tabs: "Registrar Gasto" y "Historial de Gastos"

**✅ Si ves esto → Paso 2 EXITOSO**

---

## ✅ Prueba 3: Registrar un Gasto

### Rellenar el formulario:

1. **Descripción**: "Almuerzo en restaurante"
2. **Monto**: 150
3. **Categoría**: "Alimentación"
4. **Fecha**: (fecha actual)

### Hacer click en "Registrar Gasto"

**Resultado esperado:**

- ✅ Toast de éxito: "Gasto registrado exitosamente"
- ✅ El gasto aparece en el historial (Tab "Historial de Gastos")
- ✅ El total presupuesto se actualiza a $150.00
- ✅ La barra de progreso muestra 15% (150/1000)

**✅ Si todo funciona → Paso 3 EXITOSO**

---

## ✅ Prueba 4: Registrar Múltiples Gastos

Registra estos gastos adicionales:

| Descripción       | Monto | Categoría       |
| ----------------- | ----- | --------------- |
| Pasaje transporte | 50    | Transporte      |
| Medicinas         | 100   | Salud           |
| Película          | 75    | Entretenimiento |
| Libros            | 200   | Educación       |

**Resultado esperado:**

- ✅ Total presupuesto: $575.00
- ✅ Barra de progreso: 57.5%
- ✅ 5 gastos en el historial
- ✅ Todos ordenados por fecha más reciente

**✅ Si todo funciona → Paso 4 EXITOSO**

---

## ✅ Prueba 5: Verificar Alerta de Presupuesto

Registra un gasto que supere los $1,000:

1. Gasto: "Viaje" - Monto: $500
2. Click "Registrar Gasto"

**Resultado esperado:**

- ✅ Toast: "Gasto registrado. ¡ALERTA! Has superado tu presupuesto total."
- ✅ El resumen muestra: "¡Presupuesto Superado!" en rojo
- ✅ Total presupuesto: $1,075.00
- ✅ Barra de progreso: 107.5% (rojo)

**✅ Si aparece alerta → Paso 5 EXITOSO**

---

## ✅ Prueba 6: Eliminar un Gasto

1. En el tab "Historial de Gastos"
2. Localiza un gasto (ej: "Almuerzo en restaurante")
3. Haz click en el botón "Eliminar"

**Resultado esperado:**

- ✅ Toast: "Gasto eliminado correctamente"
- ✅ El gasto desaparece del historial
- ✅ El total presupuesto se actualiza (disminuye)
- ✅ Barra de progreso se recalcula

**✅ Si funciona → Paso 6 EXITOSO**

---

## ✅ Prueba 7: Validaciones del Formulario

### Intenta registrar sin valores válidos:

**Test 7a: Monto = 0**

- Resultado: ❌ Error: "El monto debe ser mayor a 0"

**Test 7b: Sin categoría**

- Resultado: ❌ Error: "La categoría no es válida"

**Test 7c: Sin fecha**

- Resultado: ❌ Error: "La fecha es obligatoria"

**✅ Si aparecen errores correctos → Paso 7 EXITOSO**

---

## ✅ Prueba 8: Verificar Base de Datos

Desde terminal, ejecuta:

```bash
docker exec appfinanzas_postgres psql -U appuser -d appfinanzas_db -c "SELECT * FROM expenses;"
```

**Resultado esperado:**

- ✅ Se muestran todos los gastos registrados
- ✅ Cada uno tiene: id, description, amount, category, date

**✅ Si aparecen los datos → Paso 8 EXITOSO**

---

## ✅ Prueba 9: Verificar Persistencia

1. Registra un gasto: "Café" - $25 - Categoría: "Alimentación"
2. Reinicia los servicios:
   ```bash
   docker-compose restart
   ```
3. Espera 15 segundos
4. Recarga la página en el navegador (F5)
5. Ve al tab "Historial de Gastos"

**Resultado esperado:**

- ✅ El gasto "Café" sigue apareciendo
- ✅ Todos los gastos anteriores siguen ahí
- ✅ El total presupuesto es correcto

**✅ Si los datos persisten → Paso 9 EXITOSO**

---

## ✅ Prueba 10: Verificar API Directamente

### Usa curl o Postman para probar:

**GET - Obtener todos los gastos:**

```bash
curl -X GET http://localhost:8080/expenses
```

**POST - Registrar nuevo gasto:**

```bash
curl -X POST http://localhost:8080/expenses \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Test desde API",
    "amount": 99.99,
    "category": "ENTRETENIMIENTO",
    "date": "2026-04-06"
  }'
```

**DELETE - Eliminar gasto (reemplaza {id} con un ID real):**

```bash
curl -X DELETE http://localhost:8080/expenses/1
```

**Resultado esperado:**

- ✅ GET retorna JSON con lista de gastos
- ✅ POST retorna mensaje de éxito
- ✅ DELETE retorna "Gasto eliminado correctamente"

**✅ Si API responde → Paso 10 EXITOSO**

---

## 📊 Resumen de Pruebas

| Prueba | Descripción         | Estado |
| ------ | ------------------- | ------ |
| 1      | Acceso a Home Page  | ⬜     |
| 2      | Navegación a Gastos | ⬜     |
| 3      | Registrar gasto     | ⬜     |
| 4      | Múltiples gastos    | ⬜     |
| 5      | Alerta presupuesto  | ⬜     |
| 6      | Eliminar gasto      | ⬜     |
| 7      | Validaciones        | ⬜     |
| 8      | Base de datos       | ⬜     |
| 9      | Persistencia        | ⬜     |
| 10     | API directa         | ⬜     |

**Total:** 10/10 pruebas

Marca con ✅ cada prueba que completes exitosamente.

---

## 🐛 Troubleshooting

### "El frontend no carga"

```bash
docker-compose logs frontend
docker ps | grep frontend
```

### "No puedo conectar al backend"

```bash
# Verifica que el backend esté corriendo
curl http://localhost:8080/actuator/health
```

### "Los datos no se guardan"

```bash
# Verifica que PostgreSQL esté responsive
docker exec appfinanzas_postgres pg_isready
```

### "Status "unhealthy" pero funciona"

- Esto es normal si no hay healthcheck. El servicio sigue funcionando.

---

## 📝 Notas

- Todos los datos se guardan en PostgreSQL
- El límite de presupuesto es $1,000
- Las 6 categorías son: Alimentación, Transporte, Vivienda, Entretenimiento, Salud, Educación
- Los datos persisten entre reinicios de contenedores
- Los volúmenes están en `./volumes/`
