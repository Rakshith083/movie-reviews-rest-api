var fs = require('fs');

var logger = require('tracer').colorConsole({
    transport: function (data) {
        console.log(data.output)
        fs.appendFile('./logs/server.log', data.rawoutput + '\n', err => {
            if (err) throw err
        })
    },
    level:process.env.LOGGER_LEVEL
})

module.exports = { logger };

