 - DOCKER
  - colima
  - docker-compose
  - node 
  - pnpm

  npx prisma init
  npx prisma generate
  npx prisma db push

  export TOKEN=$(curl -s -X POST http://localhost:3333/v1/auth/login -H "Content-Type: application/json" -d '{"email": "user@qa.com", "password": "senha123"}' | sed 's/.*"token":"\([^"]*\)".*/\1/')


curl -v -X POST http://localhost:3333/v1/payments \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -H "x-idempotency-key: manual-test-022" \
  -d '{"amount": 1000, "currency": "BRL"}'

  docker compose exec postgres psql -U qa_user -d payment_lab -c "SELECT id FROM \"Payment\";"