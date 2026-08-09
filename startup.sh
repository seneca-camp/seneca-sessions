#!/bin/sh

npm run db:migrate
exec npm run start

