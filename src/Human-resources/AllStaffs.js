import React,{useEffect,useState} from 'react'
import axios from 'axios'
import '../Human-resources/AllStaffs.css'
import {Image} from 'cloudinary-react'
import {useNavigate} from 'react-router-dom'
import Option from './Option'
function AllStaffs() {

    const [staffData,setStaffData] = useState([])
    useEffect(() => {
     axios.get("http://localhost:3004/code/getStaffs",{
      headers:{
        accessToken1:localStorage.getItem("token")
      }
     }).then((res) => { 
        setStaffData(res.data)
       
     })
    },[])
    const navigate = useNavigate()
    const handleClick = (id) => {
       localStorage.setItem("singleId",id)
      
    }
    const [options,setOptions] = useState(false)
  return (
    <div className='setStaffs'>
       {staffData.map(value => {
        const number = value.salary;
        const option = { maximumFractionDigits: 2 };
        const formattedNumber = Intl.NumberFormat("en-US",option).format(number); 
        return <div key={value.id} className="staff_info">
            <table>
                <tr>
                    <th style={{height:"7rem"}}>
                    <div className='left'>
                     <p className='surname-left'>Surname: {value.surname}</p>
                     <p className='surname-left'>Name: {value.name}</p>
                     <p className='surname-left'>Age: {value.age}</p>
                     <p className='surname-left'>Sex: {value.sex}</p>
                     <p className='surname-left'>Salary: {formattedNumber}</p>
                    </div>
                    </th>
                    <th style={{height:"7rem"}}>
                    <div onClick={() => (handleClick(value.id),setOptions(!options))} >
                     <Image cloudName="georgecancode"  public_id={value.photo} 
                     style={{with:"5rem",height:"7rem"}}/>
                    </div>
                    </th>
                </tr>
            </table>
           
            
           
        </div>
       })}
       {options && <Option option={setOptions}/>}
    </div>
  )
}

export default AllStaffs