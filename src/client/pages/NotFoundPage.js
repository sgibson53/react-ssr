import React from 'react';

// We need to default staticContext to an empty object because only the
// server side uses the static router. On the client side it will not exist!
const NotFoundPage = ({ staticContext = {} }) => { 
  staticContext.notFound = true;
  return <h1>Oooops, route not found.</h1>;
}

export default {
  component: NotFoundPage
};