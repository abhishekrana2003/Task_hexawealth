import './App.css';
import Login from './Login_SignUp/login';
import SignUp from './Login_SignUp/signup';
import Home from './Home';
import {Routes, Route} from 'react-router'
import AdminLogin from './AdminSection/LogIn/login';
import ApprovalPanel from './AdminSection/ApprovalPage/approvalPanel';
function App() {
  return (
    <Routes>
        <Route index element={<Home/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/signup' element={<SignUp/>}/>
        {/* <Route path='/admin/login' element={<AdminLogin/>}/> */}
        <Route path='/admin' element={<ApprovalPanel/>}/>

    </Routes>
  );
}

export default App;
