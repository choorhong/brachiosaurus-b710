# Backend

## Env file:
```
PORT=8080
MONGO_URI=
NODE_ENV=development
DB_HOST='127.0.0.1'
DB_USERNAME=<any_username>
DB_PASSWORD=<any_password>
DB_NAME=<any_db_name>
```

## How to run:
1. `yarn install`
2. `yarn start`

## How to setup database:
Skip to step 3 if you have postgres installed.

1. Download and install [Postgres](https://postgresapp.com/).
2. Open up the Postgres app and click "initialize".
3. Open up your `~/.zshrc` file and paste `export PATH=$PATH:/Applications/Postgres.app/Contents/Versions/latest/bin` inside.
4. Save the file and run `source ~/.zshrc`.

If you are using an existing admin user as `DB_USERNAME` then skip below steps.

1. Type `psql` in your terminal. You can see existing users with `\du`.
2. Create an admin user with `CREATE ROLE <DB_USERNAME> WITH LOGIN SUPERUSER PASSWORD <DB_PASSWORD>;`. Use any username and password as longs as they are the same in env file.

## Database
- Create database command
  ```
  npx sequelize-cli db:create
  ```

- Create migrations command
  ```
  npx sequelize-cli migration:create --name <migration_name>
  ```

- Run migrations command
  ```
  npx sequelize-cli db:migrate
  ```
