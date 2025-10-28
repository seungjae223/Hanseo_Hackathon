import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom'; // 라우팅 관련 import
import Login from './jsx/Login';
import Mypage from './jsx/Mypage';
import Start from './jsx/Start';
import Mainpage from './jsx/Mainpage';
function App() {
  return (
    <div className="App">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Start />} />
            <Route path="/main" element={<Mainpage />} /> {/* ✅ 경로 분리 */}
            <Route path="/my" element={<Mypage />} />
          </Routes>
        </BrowserRouter>
    </div>
  );
}

export default App;
