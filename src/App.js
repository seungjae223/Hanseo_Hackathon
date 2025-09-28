import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom'; // 라우팅 관련 import
import Login from './jsx/Login';
import Mypage from './jsx/Mypage';
function App() {
  return (
    <div className="App">
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<Mypage/>}/>
            
          </Routes>
        </BrowserRouter>
    </div>
  );
}

export default App;
