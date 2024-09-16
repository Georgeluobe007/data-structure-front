import './App.css';
import React,{useState} from 'react';
import NavBar from './Components/NavBar';
import LogIn from './Human-resources/LogIn';
import {ContextAuth} from './Components/ContextApi'
import {Route,Routes} from 'react-router-dom'
import StartUo from './Human-resources/StartUo';
import AllStaffs from './Human-resources/AllStaffs';
import RegisterStaff from './Human-resources/RegisterStaff';
import SalaryList from './Human-resources/SalaryList';
import SingleStaff from './Human-resources/SingleStaff';
import AddToOffice from './Human-resources/AddToOffice';
import ItemPrice from './Human-resources/ItemPrice';
import LogInBarMan from './BarMan/LogInBarMan';
import BarManPage from './BarMan/BarManPage';
import AboutPage from './Components/AboutPage';
import LogInTab from './Tabs/LogInTab';
import CheackSales from './Tabs/CheackSales';
import FrontPage from './Tabs/FrontPage';
import CostomerTable from './Tabs/CostomerTable';
import CheckSalesBarMan from './BarMan/CheckSalesBarMan';
import ChangePassword from './BarMan/ChangePassword';
import HumanChangePassword from './Human-resources/HumanChangePassword';
import ChanngePasswordTab from './Tabs/ChanngePasswordTab';
function App() {

  const [hr,setHr] = useState({
   username: "" ,
   status:false,
   id: 0
  })
 
  const [office,setOffice] = useState({
    username: "" ,
    status:false,
    id: 0
   })
   const [logTab,setLogTab] = useState({
    username: "" ,
    status:false,
    id: 0
   })
  return (
    <div className="App">
    <ContextAuth.Provider value={{hr,setHr,office,setOffice,logTab,setLogTab}}> 
    <NavBar/>
    <Routes>
      <Route path='/hrlogIn' element={<LogIn/>}/>
      <Route path='/registerStaff' element={<RegisterStaff/>}/>
      <Route path='/allStaff' element={<AllStaffs/>}/>
      <Route path='/singleStaff' element={<SingleStaff/>}/>
      <Route path='/salary-list' element={<SalaryList/>}/>
      <Route path='/office' element={<AddToOffice/>}/>
      <Route path='/item-price' element={<ItemPrice/>}/>
      <Route path='/statistics' element={<StartUo/>}/>
      <Route path='/barmen' element={<LogInBarMan/>}/>
      <Route path='/barmamPage' element={<BarManPage/>}/>
      <Route path='/logInTab' element={<LogInTab/>}/>
      <Route path='/ckeckSales' element={<CheackSales/>}/>
      <Route path='/frontPage' element={<FrontPage/>}/>
      <Route path='/costomerTable' element={<CostomerTable/>}/>
      <Route path='/barmanSales' element={<CheckSalesBarMan/>}/>
      <Route path='/changePassword' element={<ChangePassword/>}/>
      <Route path='/passwordTab' element={<ChanngePasswordTab/>}/>
      <Route path='/humanChangePassword' element={<HumanChangePassword/>}/>
      <Route path='/' element={<AboutPage/>}/>
    </Routes>
    </ContextAuth.Provider>
    </div>
  );
}

export default App;
