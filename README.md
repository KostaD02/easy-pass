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
  - TODO: fill
- Server side:
  - [Express js](https://expressjs.com/)
  - [Mongoose](https://mongoosejs.com/)
  - [dotenv](https://www.npmjs.com/package/dotenv)
  - [nodemon](https://www.npmjs.com/package/nodemon) - Not used in code but usefull for developing.

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
> For secrets you could use node.js `crypto` built in function: `crypto.randomBytes(12).toString('base64')`

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

TODO: fill

## How to contribute

TODO: fill
