const express = require('express');
const { PORT } = require('./config');

const databaseConfig = require('./config/database');
const expressConfig = require('./config/express');
const routesConfig = require('./config/routes');

start();

async function start() {
    const app = express();

    await databaseConfig(app);
    expressConfig(app);
    routesConfig(app);

    app.get('/', (req, res) => {
        res.send('It Works!');
    });

    app.listen(PORT, () => { console.log(`Application start at http://localhost:${PORT}`) });
};
