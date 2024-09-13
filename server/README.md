# Easy pass - server side

Server side code is based on:

- [Express js](https://expressjs.com/)
- [Mongoose](https://mongoosejs.com/)
- [dotenv](https://www.npmjs.com/package/dotenv)
- [nodemon](https://www.npmjs.com/package/nodemon) - Not used in code but usefull for developing.

## Setup env file

This is an example, how to set up env file:

```
touch .env
```

And past this code:

```
PORT = 3000
DATABASE_URL = mongodb://localhost:27017/easy-pass
SILENT_LEVEL = 2
SECRET_IV = q10wA5fbm1WLdK2984PoJA==
SECRET_KEY = VZCnhOUGozJJGOGRyr5kDw==
SECRET_PHRASE = PsKA53DqytgX6nlGDuEK8zqjlnZP/nurfBm7tnsXg3s=
```

Check first [README.md](https://github.com/KostaD02/easy-pass/blob/main/README.md) of repository to understand each value.

## How to run

Either run docker container or run script manually:

### Container

```
docker pull kostad02/easy-pass
docker compose -p -t
```

### Manual

For production:

```
npm start
```

For testing (live refresh):

```
npm run start:dev
```
