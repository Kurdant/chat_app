import { BrowserRouter as Router, Route, Routes } from 'react-router';
import Home from './view/pages/home/home';
import Login from './view/pages/login/login';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
