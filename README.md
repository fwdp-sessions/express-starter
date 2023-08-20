# Express Starter Pack

## Features

- All inputs are validated via Zod
- Authentication and Authorization
-

## Generate a key 2048 or 4096 Key Length pair

The terminal way

Generate Private and Public Key for Access Token

`openssl genrsa -out filename.pem 2048`

```bash
openssl genrsa -out keys/access_private_key.pem 2048
```

```bash
openssl rsa -in keys/access_private_key.pem -pubout -out keys/access_public_key.pem
```

Encoding keys in terminal to base64

```bash
cat keys/access_private_key.pem | base64
```

```bash
cat keys/access_private_key.pem | base64
```

Or use the browser

[Base64 Encode](https://www.base64encode.org/)

Test your encoded keys and decode them here
[Base64 Decode](https://www.base64decode.org/)

```bash
https://www.base64encode.org/
```

Do the same thing for the refresh tokens

### Exposed Public Routes

POST - `/api/auth/register`

Accepts the following as the body defined on the `userSchema`

`/api/auth/login`
