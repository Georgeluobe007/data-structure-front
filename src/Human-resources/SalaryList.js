import React,{useEffect,useState} from 'react'
import axios from 'axios'
import "../Human-resources/SalaryList.css"
export default function SalaryList() {
const [staffData,setStaffData] = useState([])
const [minus,setMinus] = useState([])
  useEffect(() => {
   axios.get("http://localhost:3004/code/staffsData",{
    headers:{
      accessToken1:localStorage.getItem("token")
    }
   }).then((res) => { 
    setStaffData(res.data);
   })
   axios.get("http://localhost:3004/allDebtors",{
    headers:{
      accessToken1:localStorage.getItem("token")
    }
   }).then((res) => {
    setMinus(res.data)
   })
  },[])
 
 
// const eachValue = minus.filter((val,index,num) => 
//   num.findIndex(value => (value.StaffsFileId === val.StaffsFileId) === index )
// )  



let result = Object.values(minus.reduce((c, {StaffsFileId,amount}) => {
  c[StaffsFileId] = c[StaffsFileId] || {StaffsFileId,amount: 0};
  c[StaffsFileId].amount += parseInt(amount); 
  return c;
}, {})); 

    const removeAll = () => {
      axios.delete("http://localhost:3004/default",{
            headers:{
            accessToken1:localStorage.getItem("token")
           }
      }).then((del) => {
      return del.data
      })
      // mutation.mutate()
    }
       return (
       <div>
         <div>{staffData.map((value) => {
          const number = value.salary
          const option = {maximumFractionDigits: 2}
          const formattedNumber1 = Intl.NumberFormat("en-US",option).format(number);
          return <div>
            <div className='salaryUI'>
              <ul>
                <li><div className='surname'>{value.surname} {value.name}</div></li>
                {/* <li><div className='name'>{value.name}</div></li> */}
              </ul>
            
           
            <div className='salary'>
              <p className='p-salary'>Salary:</p>
              <span>&#8358;</span> {formattedNumber1}
            </div>
          </div>
            {result.map((res) => {
              if(res.StaffsFileId === value.id){
                const number = res.amount
                const option = {maximumFractionDigits: 2}
                const formattedNumber2 = Intl.NumberFormat("en-US",option).format(number);
                const avalableBalance = value.salary - res.amount
                const number1 = avalableBalance
                const option1 = {maximumFractionDigits: 2}
                const formattedNumber3 = Intl.NumberFormat("en-US",option1).format(number1);
                return <div>
                  <div className='deb-balance'>
                    <div>
                      <p>Debt:</p>
                      <span>&#8358;</span> {formattedNumber2}
                      </div>
                     <div>
                      <p>Ava Bal :</p>
                      <span>&#8358;</span> {formattedNumber3}
                      </div>
                 
                  </div>
                 
                  </div>
              }
            })}
            
          </div>
        })}</div>
        {minus.length === 0 ? null : <button onClick={removeAll} className='default-btn'>Default</button>}
       </div>
         )
         }
