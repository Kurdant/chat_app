import { BrowserRouter as Router, Route, Routes } from 'react-router';
import Home from './view/pages/home/home';
import Login from './view/pages/login/login';
import Chat from './view/pages/chat/chat';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/Chat' element={<Chat />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
