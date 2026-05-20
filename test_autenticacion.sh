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

# Variables (Sprint 2: Puerto actualizado a 8081)
BACKEND_URL="http://localhost:8081"
FRONTEND_URL="http://localhost:3000"
TEST_EMAIL="prueba_$(date +%s)@test.com"
TEST_PASSWORD="Prueba1!"
TEST_NAME="Usuario Prueba"

# Contadores de resultados
TESTS_PASSED=0
TESTS_FAILED=0

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
    ((TESTS_PASSED++))
else
    echo -e "   ${RED}❌ Registro fallido${NC}"
    echo "   Respuesta: $REGISTER_RESPONSE"
    ((TESTS_FAILED++))
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
    ((TESTS_PASSED++))
    # Extraer ID del usuario
    USER_ID=$(echo "$LOGIN_RESPONSE" | grep -o '"id":[0-9]*' | grep -o '[0-9]*')
    echo "   ID del usuario: $USER_ID"
else
    echo -e "   ${RED}❌ Login fallido${NC}"
    echo "   Respuesta: $LOGIN_RESPONSE"
    ((TESTS_FAILED++))
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
    ((TESTS_PASSED++))
    ERROR_MSG=$(echo "$WRONG_LOGIN" | grep -o '"message":"[^"]*' | cut -d'"' -f4)
    echo "   Mensaje: $ERROR_MSG"
else
    echo -e "   ${RED}❌ Debería haber rechazado las credenciales${NC}"
    ((TESTS_FAILED++))
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
    ((TESTS_PASSED++))
    ERROR_MSG=$(echo "$DUPLICATE" | grep -o '"message":"[^"]*' | cut -d'"' -f4)
    echo "   Mensaje: $ERROR_MSG"
else
    echo -e "   ${RED}❌ Debería rechazar email duplicado${NC}"
    ((TESTS_FAILED++))
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
    ((TESTS_PASSED++))
    ERROR_MSG=$(echo "$INVALID_PWD" | grep -o '"message":"[^"]*' | cut -d'"' -f4)
    echo "   Mensaje: $ERROR_MSG"
else
    echo -e "   ${RED}❌ Debería rechazar contraseña inválida${NC}"
    ((TESTS_FAILED++))
fi
echo ""

# Test 6: Acceso a endpoints (Sprint 2: /transactions en lugar de /expenses)
echo -e "${YELLOW}6️⃣  PRUEBA: Acceso a endpoints de la API${NC}"
echo ""

TRANSACTIONS=$(curl -s -w "\nHTTP_STATUS:%{http_code}" "$BACKEND_URL/transactions/user/1")
HTTP_STATUS=$(echo "$TRANSACTIONS" | grep "HTTP_STATUS:" | cut -d':' -f2)

if [ "$HTTP_STATUS" == "200" ] || [ "$HTTP_STATUS" == "401" ]; then
    echo -e "   ${GREEN}✅ Endpoint /transactions/user/{id} respondiendo (Status: $HTTP_STATUS)${NC}"
    ((TESTS_PASSED++))
else
    echo -e "   ${RED}❌ Endpoint devuelve status: $HTTP_STATUS${NC}"
    ((TESTS_FAILED++))
fi
echo ""

# Resumen
echo "╔════════════════════════════════════════════════════════════╗"
echo "║                        📊 RESUMEN                         ║"
echo "╠════════════════════════════════════════════════════════════╣"

if [ $TESTS_PASSED -gt 0 ]; then
    echo -e "║ ${GREEN}✅ Tests Pasados: $TESTS_PASSED${NC}                                    ║"
fi

if [ $TESTS_FAILED -gt 0 ]; then
    echo -e "║ ${RED}❌ Tests Fallidos: $TESTS_FAILED${NC}                                   ║"
fi

if [ $TESTS_FAILED -eq 0 ] && [ $TESTS_PASSED -eq 6 ]; then
    echo "╠════════════════════════════════════════════════════════════╣"
    echo "║ 🎉 TODOS LOS TESTS PASARON EXITOSAMENTE 🎉               ║"
    echo "╚════════════════════════════════════════════════════════════╝"
elif [ $TESTS_FAILED -gt 0 ]; then
    echo "╠════════════════════════════════════════════════════════════╣"
    echo -e "║ ${RED}⚠️  ALGUNOS TESTS FALLARON - VERIFICA EL BACKEND${NC}      ║"
    echo "║                                                            ║"
    echo "║ 📝 Asegúrate de que:                                     ║"
    echo "║    - Docker está corriendo: docker-compose up            ║"
    echo "║    - Backend en puerto 8081                              ║"
    echo "║    - Frontend en puerto 3000                             ║"
    echo "╚════════════════════════════════════════════════════════════╝"
else
    echo "╠════════════════════════════════════════════════════════════╣"
    echo "║ ✅ Tests Completados                                     ║"
    echo "╚════════════════════════════════════════════════════════════╝"
fi
echo ""
echo "🌐 Acceso a la aplicación:"
echo "   Frontend: $FRONTEND_URL"
echo "   Backend:  $BACKEND_URL"
echo ""
