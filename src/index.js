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
        res.writeHead(204, {'Content-Type': 'image/x-icon'} );
        res.end();
        return;
    }

    const store = createStore(req);
    console.log(`Path: ${req.originalUrl}`)

    const promises = matchRoutes(Routes, req.originalUrl).map(({ route }) => {
        return route.loadData ? route.loadData(store) : null;
    }).map(promise => {
        if (promise) {
            return new Promise((resolve, reject) => {
                // If one of our requests goes wrong, we still want to render on the screen
                // So we always resolve the inner promise no matter what
                // An error message will be handled during the rendering of the actual application
                // This way our error code component will work no matter whether it's on the server side or browser side
                promise.then(resolve).catch(resolve); 
            })
        }
    })

    // console.log(promises);
    promises.forEach(p => console.log(p));

    Promise.all(promises).then(() => {
        const context = {};
        const content = renderer(req, store, context);

        console.log('Context', context);

        // This is specifically for when our browser side tries to redirect.
        // An object comes through on the context object which has the url, so we need to grab
        // that and redirect here on the server side. It's a hack to connect a client side React Router
        // Redirect to a server side redirect
        if (context.url) {
            return res.redirect(301, context.url);
        }

        if (context.notFound) {
            res.status(404);
        }
        console.log('sending content')
        res.send(content);
    }).catch(err => console.log(err));

});

app.listen(3000, () => {
    console.log("A magical kingdom is born on port 3000");
});