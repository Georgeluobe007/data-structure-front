import React,{useEffect,useState,useContext} from 'react'
import axios from "axios"
import {Link} from "react-router-dom"
import {ContextAuth} from '../Components/ContextApi'
// import {HRM} from "../Human-resources/Data"
import '../ComponentCss/NavBar.css'
import {useNavigate} from 'react-router-dom'

function NavBar() {
  const navigate = useNavigate();
  // const hrm = HRM.userName
  const [myState,setMyState] = useState({});
  const mystate = myState.userName

  const {hr,setHr} = useContext(ContextAuth)
  const {office,setOffice} = useContext(ContextAuth)
  const {logTab,setLogTab} = useContext(ContextAuth)
 
  useEffect(() => {
   axios.get("http://192.168.67.253:3004/getWeb",{
    headers:{ 
      accessToken1:localStorage.getItem("token")
    }
   }).then((response) => { 
    if(response){
      setHr({username: response.data.userName,id:response.id,status:true})
     }
   })
   axios.get("http://localhost:3004/getOfficeWeb",{
    headers:{ 
      accessToken:localStorage.getItem("section-token")
    }
   }).then((res) => {
    if(res){
      setOffice({username: res.data.userName,id:res.data.userId,status:true})
    }
   })
   axios.get("http://localhost:3004/getWaitressLogIn",{ 
    headers:{ 
      LogInWatressToken:localStorage.getItem("TabTokens")
    }
   }).then((res) => {
    if(res){
      setLogTab({username: res.data.userName,id:res.data.userId,status:true})
    }
   })
  },[])
  const LogOut = () => {
     localStorage.removeItem("token")
    setHr({
      username: '',
      status:false,
      id:0
    })
    }
    const outOffice = () => {
      localStorage.removeItem("section-token");
      setOffice({
        username: '',
        status:false,
        id:0
      })
     
    }
    const LogOutTab = () => {
      localStorage.removeItem("TabTokens");
      setLogTab({
        username: '',
        status:false,
        id:0
      })
     
    }

  return (
    <div className='navContainer'>
      <div className='display'>
     {hr.status ? (<div className='hrNav'>
      <div><Link to="/registerStaff" className='HR' >Register Staff</Link></div>
      <div><Link to="/allStaff" className='HR'>Staff List</Link></div>
      <div><Link to="/statistics" className='HR'>Sales Statistics</Link></div>
      <div><Link to="/item-price" className='HR'>Item Price/Photo</Link></div>
      <div><Link to="/salary-list" className='HR'>Salary List.</Link></div>
      <div><Link to="/office" className='HR'>Sales Point</Link></div>
      <div><Link to="/humanChangePassword" className='HR'>Change password</Link></div>
      <div><Link to="/" className='HR' onClick={LogOut}>LogOut</Link></div>  
     </div>): ""}
    {office.status ? (<div className='officeLog'>
      <div><Link to="/barmamPage" className='OF'>DeskTop</Link></div>
      <div><Link to="/barmanSales" className='OF'>Check Sales</Link></div>
      <div><Link to="/changePassword" className='OF'>Change password</Link></div>
      <div><Link to="/" onClick={outOffice} className='OF'>Log Out</Link></div>
      </div>):""}

    {logTab.status ? (
       <div className='tabLog'>
        <div><Link to="/frontPage" className='TB' >Front Page</Link></div>
        <div><Link to="/ckeckSales" className='TB'>Statistic on Sales</Link></div>
        <div><Link to="/costomerTable" className='TB'>Costomers Tables</Link></div>
        <div><Link to="/passwordTab" className='TB'>Change password</Link></div>
        <div><Link to="/" className='TB' onClick={LogOutTab}>LogOut</Link></div>
       </div>
       
     
     ): ""}
    {hr.status === false && office.status === false && logTab.status === false &&
      <div className='statusFalse'>
        <div><Link to="/hrlogIn" className='status-false' >HR</Link></div>
        <div><Link to="/barmen" className='status-false'>Bar Man</Link></div>
        <div><Link to="/logInTab" className='status-false'>Waitress/Waiter</Link></div>
        <div><Link to="/" className='status-false'>About Us</Link></div>
      
      
     
    
   </div>
    }
    
      </div>
    </div>
  )
}

export default NavBar