import './App.css';
import Login from './Login_SignUp/login';
import SignUp from './Login_SignUp/signup';
import Home from './Home';
import {Routes, Route} from 'react-router'
import ApprovalPanel from './AdminSection/ApprovalPage/approvalPanel';
import {createContext,useState, useEffect } from 'react';
export const UserContext = createContext();
export const UserProvider = ({ children }) => {
  const [email, setEmail] = useState(null);
  return (
    <UserContext.Provider value={{ email, setEmail }}>
      {children}
    </UserContext.Provider>
  );
};
function App() {
  return (
    <UserProvider>
      <Routes>
          <Route index element={<Home/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/signup' element={<SignUp/>}/>
          <Route path='/admin' element={<ApprovalPanel/>}/>
      </Routes>
    </UserProvider>
  );
}

export default App;
