## recommendation system

### backend query

// install package , npm i jaccard ; npm i heap (for function of friends recommendation)

url: http://localhost:8080/api/signup

- signup
  post:
  {  
   "name" : "yaotest",
  "email": "yaotest@gmail.com",
  "password": "yaotest123"
  }

- signin
  Post:
  {  
   "email": "yaotest@gmail.com",
  "password": "yaotest123"
  }

- add interests on the site
  url : http://localhost:8080/api/interests
  post :
  {
  "title" : "movie"
  }

- add interests to a user (need signin ,put the token in header)
  url : http://localhost:8080/api/interests
  put:
  {
  "userId" : "600663b238348a4de0e3479c",
  "interests" : ["60048f9f79688a173976368d","60048fce79688a173976368e" ]
  }

- get profile of current user (need signin)
  url : http://localhost:8080/api/user/6004ad916370d81ad58ee23d
  get

- friend recommend (need sign in ,put the token in header)
  http://localhost:8080/api/user/:userId/recommendation
  get:

- signout
  url: http://localhost:8080/api/signout
  get;
