var express = require('express');
var bodyParser = require('body-parser');
var { userRoutes } = require('./routes/user-routes');
var { authToutes } = require('./routes/auth-routes');
var { movieRoutes } = require('./routes/movie-routes')
const { databaseConnect, sequelize } = require('./config/database');
const { logger } = require('./lib/logger')
UPDATE_DATABASE = process.env.UPDATE_DATABASE == "true";
const server_port = process.env.SERVER_PORT || 3000;
var app = express();
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
var fs = require('fs');
const { dataLoad } = require('./lib/utils');
const { reviewRoutes } = require('./routes/review-routes');
fs.mkdir('logs', () => { });
app.use('/api/users', userRoutes);
app.use('/api/auth', authToutes);
app.use('/api/movies', movieRoutes);
app.use('/api/reviews', reviewRoutes)

process.on('unhandledRejection', (err, promise) => {
    logger.error(err);
})

process.on('uncaughtException', (err, promise) => {
    logger.error(err);
})

app.listen(server_port, async () => {
    logger.info("Server is listening at port", server_port)
    await databaseConnect().then(async () => {
        try {
            await sequelize.sync({ alter: UPDATE_DATABASE }).then(() => {
                logger.info("All models synced");
                dataLoad();
            })
        } catch (error) {
            logger.error(error)
        }
    });
})