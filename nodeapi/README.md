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

## recommendation

### backend query
url: http://localhost:8080/api/signup

- signup

{   
    "name" : "yaotest",
    "email": "yaotest@gmail.com",
    "password": "yaotest123"
}


- add interests on the site
  url : http://localhost:8080/api/interests
  post :
  {
  "title" : "movie"
  }

- add interests to a user (need signin)
  url : http://localhost:8080/api/interests
  put:
  {
  "userId" : "600663b238348a4de0e3479c",
  "interests" : ["60048f9f79688a173976368d","60048fce79688a173976368e" ]
  }

- get profile of current user (need signin)
  url : http://localhost:8080/api/user/6004ad916370d81ad58ee23d
  get

- signout
  url: http://localhost:8080/api/signout
  get;
