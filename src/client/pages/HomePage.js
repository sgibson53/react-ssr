import React from 'react';

const Home = () => {
    return (
        <div>
            <div> I'm the VERY BEST home component!</div>
            <button onClick={() => console.log('Hi There!')}>Press Me</button>
        </div>
    );
}

export default {component: Home};