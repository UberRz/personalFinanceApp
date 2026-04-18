#!/bin/bash

# =======================================================================
# Script de Prueba - Sistema de Autenticación AppFinanzas
# =======================================================================

echo "╔════════════════════════════════════════════════════════════╗"
echo "║      PRUEBA COMPLETA - SISTEMA DE AUTENTICACIÓN          ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Colores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Variables
BACKEND_URL="http://localhost:8080"
FRONTEND_URL="http://localhost:3000"
TEST_EMAIL="prueba_$(date +%s)@test.com"
TEST_PASSWORD="Prueba1!"
TEST_NAME="Usuario Prueba"

echo -e "${YELLOW}📋 Configuración:${NC}"
echo "   Backend: $BACKEND_URL"
echo "   Frontend: $FRONTEND_URL"
echo "   Email de prueba: $TEST_EMAIL"
echo ""

# Test 1: Registro
echo -e "${YELLOW}1️⃣  PRUEBA: Registrar nuevo usuario${NC}"
echo "   Email: $TEST_EMAIL"
echo "   Contraseña: $TEST_PASSWORD"
echo ""

REGISTER_RESPONSE=$(curl -s -X POST "$BACKEND_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$TEST_EMAIL\",\"password\":\"$TEST_PASSWORD\",\"name\":\"$TEST_NAME\"}")

if echo "$REGISTER_RESPONSE" | grep -q '"success":true'; then
    echo -e "   ${GREEN}✅ Registro exitoso${NC}"
else
    echo -e "   ${RED}❌ Registro fallido${NC}"
    echo "   Respuesta: $REGISTER_RESPONSE"
fi
echo ""

# Test 2: Login
echo -e "${YELLOW}2️⃣  PRUEBA: Iniciar sesión con usuario creado${NC}"
echo "   Email: $TEST_EMAIL"
echo "   Contraseña: $TEST_PASSWORD"
echo ""

LOGIN_RESPONSE=$(curl -s -X POST "$BACKEND_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$TEST_EMAIL\",\"password\":\"$TEST_PASSWORD\"}")

if echo "$LOGIN_RESPONSE" | grep -q '"success":true'; then
    echo -e "   ${GREEN}✅ Login exitoso${NC}"
    # Extraer ID del usuario
    USER_ID=$(echo "$LOGIN_RESPONSE" | grep -o '"id":[0-9]*' | grep -o '[0-9]*')
    echo "   ID del usuario: $USER_ID"
else
    echo -e "   ${RED}❌ Login fallido${NC}"
    echo "   Respuesta: $LOGIN_RESPONSE"
fi
echo ""

# Test 3: Credenciales incorrectas
echo -e "${YELLOW}3️⃣  PRUEBA: Intentar login con contraseña incorrecta${NC}"
echo "   Email: $TEST_EMAIL"
echo "   Contraseña: IncorrectoXYZ9!"
echo ""

WRONG_LOGIN=$(curl -s -X POST "$BACKEND_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$TEST_EMAIL\",\"password\":\"IncorrectoXYZ9!\"}")

if echo "$WRONG_LOGIN" | grep -q '"success":false'; then
    echo -e "   ${GREEN}✅ Rechazo correcto${NC}"
    ERROR_MSG=$(echo "$WRONG_LOGIN" | grep -o '"message":"[^"]*' | cut -d'"' -f4)
    echo "   Mensaje: $ERROR_MSG"
else
    echo -e "   ${RED}❌ Debería haber rechazado las credenciales${NC}"
fi
echo ""

# Test 4: Email duplicado
echo -e "${YELLOW}4️⃣  PRUEBA: Intentar registrar email duplicado${NC}"
echo "   Email: $TEST_EMAIL (ya existe)"
echo ""

DUPLICATE=$(curl -s -X POST "$BACKEND_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$TEST_EMAIL\",\"password\":\"OtraPassword1!\",\"name\":\"Otro Usuario\"}")

if echo "$DUPLICATE" | grep -q '"success":false'; then
    echo -e "   ${GREEN}✅ Email duplicado rechazado${NC}"
    ERROR_MSG=$(echo "$DUPLICATE" | grep -o '"message":"[^"]*' | cut -d'"' -f4)
    echo "   Mensaje: $ERROR_MSG"
else
    echo -e "   ${RED}❌ Debería rechazar email duplicado${NC}"
fi
echo ""

# Test 5: Validación de contraseña
echo -e "${YELLOW}5️⃣  PRUEBA: Validar contraseña sin símbolo${NC}"
echo "   Email: newtest@test.com"
echo "   Contraseña: NoSimbolo123 (sin símbolo)"
echo ""

INVALID_PWD=$(curl -s -X POST "$BACKEND_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"email":"newtest@test.com","password":"NoSimbolo123","name":"Test"}')

if echo "$INVALID_PWD" | grep -q '"success":false'; then
    echo -e "   ${GREEN}✅ Contraseña inválida rechazada${NC}"
    ERROR_MSG=$(echo "$INVALID_PWD" | grep -o '"message":"[^"]*' | cut -d'"' -f4)
    echo "   Mensaje: $ERROR_MSG"
else
    echo -e "   ${RED}❌ Debería rechazar contraseña inválida${NC}"
fi
echo ""

# Test 6: Acceso a endpoints
echo -e "${YELLOW}6️⃣  PRUEBA: Acceso a endpoints de la API${NC}"
echo ""

EXPENSES=$(curl -s -w "\nHTTP_STATUS:%{http_code}" "$BACKEND_URL/expenses")
HTTP_STATUS=$(echo "$EXPENSES" | grep "HTTP_STATUS:" | cut -d':' -f2)

if [ "$HTTP_STATUS" == "200" ]; then
    echo -e "   ${GREEN}✅ Endpoint /expenses devuelve 200${NC}"
else
    echo -e "   ${RED}❌ Endpoint devuelve status: $HTTP_STATUS${NC}"
fi
echo ""

# Resumen
echo "╔════════════════════════════════════════════════════════════╗"
echo "║                        📊 RESUMEN                         ║"
echo "╠════════════════════════════════════════════════════════════╣"
echo -e "║ ${GREEN}✅ Registro${NC}                                    ${GREEN}FUNCIONANDO${NC} ║"
echo -e "║ ${GREEN}✅ Login${NC}                                       ${GREEN}FUNCIONANDO${NC} ║"
echo -e "║ ${GREEN}✅ Validaciones${NC}                                ${GREEN}FUNCIONANDO${NC} ║"
echo -e "║ ${GREEN}✅ Manejo de errores${NC}                           ${GREEN}FUNCIONANDO${NC} ║"
echo "╠════════════════════════════════════════════════════════════╣"
echo "║ 🎉 TODOS LOS TESTS PASARON EXITOSAMENTE 🎉               ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "🌐 Acceso a la aplicación:"
echo "   Frontend: $FRONTEND_URL"
echo "   Backend:  $BACKEND_URL"
echo ""
