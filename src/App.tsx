import React from 'react';
import WeatherContainer from './Components/WeatherContainer';
// src/index.js or src/App.js
import 'primereact/resources/themes/saga-blue/theme.css';  // or another theme
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';


function App() {
  return (
    <div className="App">
      <WeatherContainer />
    </div>
  );
}

export default App;
