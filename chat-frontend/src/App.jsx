import { BrowserRouter as Router, Route, Routes } from 'react-router';
import Home from './view/pages/home/home';
import Login from './view/pages/login/login';
import Chat from './view/pages/chat/chat';
import Amis from './view/pages/amis/amis';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/Chat' element={<Chat />} />
          <Route path='/Amis' element={<Amis />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
