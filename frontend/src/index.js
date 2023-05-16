import React from 'react';
import AuthPage from './components/AuthPage/AuthPage'; 
import Dashboard from './components/Dashboard/Dashboard';
import { BrowserRouter as Routes, Route } from 'react-router-dom';

class App extends React.Component {
  render() {
    return (
        <Routes>
            <Route path="/" element={<h1 />}>
                <Route index element={<AuthPage />} />
                <Route path="dashboard" element={<Dashboard />} />
            </Route>
        </Routes>
    );
  }
}

export default App;