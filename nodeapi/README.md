## To run this project, do the following:

##### create .env with the following code (update credentials). Make sure to create .env in the root directory of the project. nodeapi/.env

```
APP_NAME=nodeapi
MONGO_URI=mongodb://localhost:27017/nodeapi
PORT=8080
JWT_SECRET=xxxxxx
CLIENT_URL=http://localhost:3000
REACT_APP_GOOGLE_CLIENT_ID=xxxxxx.apps.googleusercontent.com
```

##### Then run the following commands to start up the app

```
cd nodeapi
npm install
npm start
```

### Then go to react-front run front end.

follow README in react-front

### added backend query for recommendation system.

> install 2 packages first

```
npm i jaccard
npm i heap
```

- signup

> Post http://localhost:8080/api/signup

```json
{
  "name": "yaotest",
  "email": "yaotest@gmail.com",
  "password": "yaotest123"
}
```

- signin
  > Post http://localhost:8080/api/signin

```json
{
  "email": "yaotest@gmail.com",
  "password": "yaotest123"
}
```

- add interests on the site
  > Post http://localhost:8080/api/interests

```json
{
  "title": "movie"
}
```

- add interests to a user (need signin ,put the token in header)
  > Put http://localhost:8080/api/interests

```json
{
  "userId": "600663b238348a4de0e3479c",
  "interests": ["60048f9f79688a173976368d", "60048fce79688a173976368e"]
}
```

- get profile of current user (need signin)

  > Get http://localhost:8080/api/user/6004ad916370d81ad58ee23d

- friend recommend (need sign in ,put the token in header)

  > Get http://localhost:8080/api/user/:userId/recommendation

- signout
  > Get http://localhost:8080/api/signout
