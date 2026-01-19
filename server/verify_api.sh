#!/bin/bash
API_URL="http://localhost:5000/api"

echo "Checking Root..."
curl -v http://localhost:5000/

RAND=$((RANDOM))
echo -e "\nRegistering..."
REGISTER_RES=$(curl -v -X POST $API_URL/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"testuser$RAND\",\"email\":\"test$RAND@example.com\",\"password\":\"password123\"}")
echo $REGISTER_RES

echo -e "\nLogging in..."
LOGIN_RES=$(curl -s -X POST $API_URL/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"test$RAND@example.com\",\"password\":\"password123\"}")
echo $LOGIN_RES

TOKEN=$(echo $LOGIN_RES | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

echo -e "\nToken: $TOKEN"

if [ -z "$TOKEN" ]; then
  echo "Login failed"
  exit 1
fi

echo -e "\nFetching Posts..."
curl -s $API_URL/posts
