# How to run the project:

1. Clone the repository
2. to install all the necessary packages do:
```bash
npm init -y
npm install
```

## Requirements:
1. MongoDB Atlas Database
2. SSL Key and Certificate (.pem files)
3. .env file

### Inside the .env file:
- MONGODB_URI= Should look like this: mongodb+srv://(USERNAME):(PASSWORD)@(CLUATER_NAME).lhybfop.mongodb.net/(USER_DATABSE)?retryWrites=true&w=majority <br>
  Make sure to replace `(USERNAME)`, `(PASSWORD)`, `(CLUSTER_NAME)`, and `(USER_DATABASE)` with your actual MongoDB credentials and database details.
- SESSION_SECRET= A ssl session secret for https
- NODE_ENV= Your node enviorment
- DEFAULT_PROFILE_PICTURE= Url for a default profile picture

#### Note: Make sure you make a SSL folder inside server/, should look like this: /server/ssl/ (type it exactly like this)

- to run the code just do `` npm run dev ``
