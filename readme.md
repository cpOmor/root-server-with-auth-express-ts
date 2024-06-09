how can clone the repository

```bash
git clone https://github.com/OmarDevZon/sms-server.git
```

goto file

```bash
cd sms-server
```

```bash
npm install
```

set envelopment (very impotent) pleas check now .env.example

```bash
NODE_ENV = "production"
MONGO_PROD = true
PORT = 5000
WELCOME_MESSAGE = "Welcome to the API"
MONGO_URI_DEV = 'mongodb://127.0.0.1:27017/<DATABASE_NAME>'
MONGO_URI_PROD = 'mongodb+srv://<USER_NAME>:<PASSWORD>@cluster0.phxmwjo.mongodb.net/<DATABASE_NAME>?retryWrites=true&w=majority'
CLIENT_URL = 'HOST_NAME'
BCRYPT_SALT_ROUNDS = 12
JWT_ACCESS_SECRET = "<ACCESS_SECRET>"
JWT_REFRESH_SECRET = "<REFRESH_SECRET>"
JWT_ACCESS_EXPIRES_IN = "365d"
JWT_REFRESH_EXPIRES_IN = "5M"
CLOUDINARY_CLOUD_NAME = '<CLOUD_NAME>'
CLOUDINARY_API_KEY = '<CLOUD_API_KEY>'
CLOUDINARY_API_SECRET = '<CLOUD_API_SECRET>'
SMTP_MAIL =  '<SMTP_MAIL>'
SMTP_PASSWORD = '<SMTP_PASSWORD>'
TWILIO_ACCOUNT_SID = "<TWILIO_ACCOUNT_SID>"
TWILIO_AUTH_TOKEN = "<TWILIO_AUTH_TOKEN>"
TWILIO_PHONE_NUMBER = "<TWILIO_PHONE_NUMBER>"


```

---

### base url

```bash
http://localhost:5000/
```

### user account create url

```bash
{{base_url}}/user/create-user
```

### login user url

```bash
{{base_url}}/auth/login
```

### find all user

```bash
{{base_url}}/user
```

### find single user by mail 

```bash
{{base_url}}/user/<email>
```
