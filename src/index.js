import 'babel-polyfill'; // Helper functions for babel, helps with async/await and other things
import express from 'express';
import { matchRoutes } from 'react-router-config';
import proxy from 'express-http-proxy';
import Routes from './client/Routes';
import renderer from './helpers/renderer';
import createStore from './helpers/createStore';

const app = express();

app.use('/api', proxy('http://react-ssr-api.herokuapp.com', {
    proxyReqOptDecorator(opts) {
        opts.headers['x-forwarded-host'] = 'localhost:3000';
        return opts;
    }
}));
app.use(express.static('public'));

app.use('*', (req, res) => {

    // control for favicon
    if (req.originalUrl === '/favicon.ico') {
        res.writeHead(200, {'Content-Type': 'image/x-icon'} );
        res.end();
        console.log('favicon requested');
        return;
    }

    const store = createStore(req);
    console.log(`Path: ${req.originalUrl}`)
    const promises = matchRoutes(Routes, req.originalUrl).map(({ route }) => {
        return route.loadData ? route.loadData(store) : null;
    });

    // console.log(promises);
    promises.forEach(p => console.log(p));

    Promise.all(promises).then(() => {
        console.log("finished");
        res.send(renderer(req, store));
    });

});

app.listen(3000, () => {
    console.log("A magical kingdom is born on port 3000");
});