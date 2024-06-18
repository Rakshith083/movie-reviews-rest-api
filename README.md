# movie-reviews-rest-api
This rest-api application built on express and using sequelize as ORM.

# Project description
This is a movie-review application where users can see the ratings and reviews for movies and also users can post their reviews for any movies.
When application is starting, Some sample data will be added to the db.(only mysql and postgresql supported.If you want to connect to any other db, It is recommended to visit the sequilize official site and add the required npm packages).

By default all db configurations are pointing to localhost, If db is hosted in other Ip, provide the correct configurations on env.bat file.

You have an option to add your own movies, users, reviews.
By default authentication is a local JWT authentication.
Supported authentication strategies : JWT (local), OpenId-Connect(oidc).

Provde the JWT_SECRET in env.bat file.

# Configuring OpenId-Connect authenntication,
    1. Provde the CLIENT_ID and CLIENT_SECRET in env.bat file.
    2. Set APP_AUTH_TYPE to oidc in env.bat file.
    3. Provide sme default encryted password for DEFAULT_PASSWORD in env.bat file.
    3. Provide the oidc client endpoints in oidc.json file.(path: ./config/oidc.json)

# Quick Start
# To run this app, clone the repository and install dependencies:
    $ git clone https://github.com/Rakshith083/movie-reviews-rest-api.git
    $ cd movie-reviews-rest-api
    $ npm install

# Start the server.
    $ env.bat
    $ node .

Note: For linux machines, You should export all the variables from the env.bat file.

# Features
    1. API support.
    2. Supports 2 different auth strategies.
        a. Jwt local authentication
        b. OpenIdD-Connect
    3. Advanced logging
        a. Beautiful color logs can be seen in the console
        b. logs wil be written to log file also. (./logs/server.log)

# NodeJs,Express,Sequelize,OpenID-Connect,Passport