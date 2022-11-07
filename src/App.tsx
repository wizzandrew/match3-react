import React from "react";
type AppProps = { num: number };

function App({num}: AppProps) {
    return (
        <h1>Total Number: {num}</h1>
    );
}

export default App; 