# Easy pass

Easy pass is self-hosting app for password managment.
There are many great inspirations [vaultwarden](https://www.vaultwarden.net/), [passbolt](https://www.passbolt.com/), [bitwarden](https://bitwarden.com/) and others.

But i was strugling to self-host them by myself, because of configurate https 😂.
Because of that created **easy-pass**, idea is simple to have self-hosted password manager without https configuration, reverse proxy and similar things.

> [!TIP]
> I suggset to learn how to setup https because it's more secure context than just http.

## How does it works?

Client side sends request to Server, which will generate random password based, will encrypt it with `aes-256-cbc` algorithm, where will be used `SECRET_PHRASE` and `SECRET_IV`.

> [!IMPORTANT]
> For security reasons each request from client needs `X-Secret`. it should be matched `SECRET_KEY` value, otherwise it will not work.

## Dependencies

Unfortunately can't build everything from scratch, here is all dependencies:

- Client side:
  - [Boostrap CSS](https://getbootstrap.com/)
  - [SweetAlert2](https://sweetalert2.github.io/)
- Server side:
  - [Express js](https://expressjs.com/)
  - [Mongoose](https://mongoosejs.com/)
  - [dotenv](https://www.npmjs.com/package/dotenv)
  - [nodemon](https://www.npmjs.com/package/nodemon) - Not used in code but usefull for developing.

All dependencies are required to installed only once for server side, after that you can use it without internet. For client side SweetAlert2 is injected with minified code but bootstrap css not, if you go offline with client side, it could work but you will miss some styles from boostrap 😢

In future will update client side code to have **zero** dependencies with better UI/UX.

## Environment variables

| name          | description                                                                                                   | type     | example                                | default |
| ------------- | ------------------------------------------------------------------------------------------------------------- | -------- | -------------------------------------- | ------- |
| PORT          | Server port                                                                                                   | `number` | `3000`                                 | `3000`  |
| DATABASE_URL  | URL for database connection                                                                                   | `string` | `mongodb://localhost:27017/easy-pass`  | nothing |
| SILENT_LEVEL  | Value for showing console outputs                                                                             | `number` | `0`                                    | `0`     |
| SECRET_KEY    | Secret key which should be matched for each request                                                           | `string` | Something strong, 5-30 char            | nothing |
| SECRET_PHRASE | Secret phrase which will be used for encrypt/decrypt                                                          | `string` | Something strong, exactly 32 character | nothing |
| SECRET_IV     | Secret [IV](https://csrc.nist.gov/glossary/term/initialization_vector) which will be used for encrypt/decrypt | `string` | Something strong, exactly 16 character | nothing |

> [!TIP]
> For secrets you could use node.js `crypto` built in function: `crypto.randomBytes(16).toString('base64')`

### Example env

```
PORT = 3000
DATABASE_URL = mongodb://localhost:27017/easy-pass
SILENT_LEVEL = 2
SECRET_IV = q10wA5fbm1WLdK2984PoJA==
SECRET_KEY = VZCnhOUGozJJGOGRyr5kDw==
SECRET_PHRASE = PsKA53DqytgX6nlGDuEK8zqjlnZP/nurfBm7tnsXg3s=
```

## Silent level

Silent level is used to display `console` outputs. Some of logs are forced to see exact reason why application stopped.

| level | description                |
| ----- | -------------------------- |
| `0`   | Nothing will be logged     |
| `1`   | Only errors will be logged |
| `2`   | Everything will be logged  |

## How to setup

You have to install [docker](https://www.docker.com/) and [docker compose](https://docs.docker.com/compose/).

After that run this scripts:

```
mkdir easy-pass
cd easy-pass
docker pull kostad02/easy-pass:latest
curl -o docker-compose.yml https://raw.githubusercontent.com/KostaD02/easy-pass/main/server/docker-compose.yml
```

> [!CAUTION]
> It's better to edit secret values than using "default" ones.

```
nano docker-compose.yml # edit all secret codes accordingly.
```

After updating secret values

```
docker compose up -d
```

Thats it! Now lets check if container is running:

```
docker ps
```

You should see 2 container:

```
CONTAINER ID   IMAGE                                                COMMAND                  CREATED          STATUS                  PORTS                                                 NAMES
c90bbd620142   kostad02/easy-pass:latest                            "docker-entrypoint.s…"   17 seconds ago   Up 17 seconds           0.0.0.0:3000->3000/tcp, :::3000->3000/tcp             easy-pass
e064d2eee39f   mongo:latest                                         "docker-entrypoint.s…"   17 seconds ago   Up 17 seconds           27017/tcp                                             easy-pass-db
```

Open browser and write your `http://your_localhost_ip:3000`.

![Example of easy-pass](view.png)

Input same `SECRET_KEY` what you wrote in `docker-compose.yml`.

## How to contribute

Currently server side code is working perfectly but about client side can't say same. I will add new features when I have time, but you don't have to wait - add them yourself! Fork it and submit pull requests.

## To Do

Here is few idea which will be implemented in future, you could open issue for that as well.

- Update client side design.
- Seperate client side from server side:
  - Create new PWA application (for better experience with mobile).
  - Create container for new application
- Add backup support.
