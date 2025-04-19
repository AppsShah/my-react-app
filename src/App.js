// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SearchPage from './SearchPage';
import SelectPage from './SelectPage';
import './styles.css'; // Import the CSS file

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<SelectPage />} />
        <Route path="/details/:result" element={<SearchPage />} />
      </Routes>
    </Router>
  );
}

export default App;
