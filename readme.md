# Тестовое задание

## Описание
Было реализовано получение тарифов с WB API при запуске и каждый час, сохранение их в базу postgresql. 
Также был создан сервис для записи тарифов в Google Sheet, для которого нужно создать сервисный аккаунт и получить ключи доступа.
Для работы сервиса нужны email сервисного аккаунта и ключи доступа к сервисному аккаунту, что получить не удалось. 

Все настройки можно найти в файлах:
- docker-compose.yaml
- dockerfile
- package.json
- tsconfig.json
- src/config/env/env.ts
- src/config/knex/knexfile.ts

## Команды:

Для полного запуска приложения:
```bash
docker compose up -d --build
```

Запуск базы данных:
```bash
docker compose up -d --build postgres
```

Для выполнения миграций и сидов не из контейнера:
```bash
npm run knex:dev migrate latest
```

```bash
npm run knex:dev seed run
```
Также можно использовать и остальные команды (`migrate make <name>`,`migrate up`, `migrate down` и т.д.)

Для запуска приложения в режиме разработки:
```bash
npm run dev
```

Запуск проверки самого приложения:
```bash
docker compose up -d --build app
```

Для финальной проверки рекомендую:
```bash
docker compose down --rmi local --volumes
docker compose up --build
```
PS: С наилучшими пожеланиями!
