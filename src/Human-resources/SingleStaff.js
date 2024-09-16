import React,{useEffect,useState} from 'react'
import axios from 'axios'
import {Image} from "cloudinary-react"
import Substract from './Substract'
import {useMutation} from '@tanstack/react-query'

import '../Human-resources/SingleStaff.css'
function SingleStaff() {
  const singleId = localStorage.getItem("singleId")
  const [singleData,setSingleData] = useState({})
  const [debt,setDebt] = useState([])
  const [minus,setMinus] = useState({})
  const [minusPage,setMinusPage] = useState({})
 
  useEffect(() => {
   axios.get(`http://localhost:3004/code/singleData/${singleId}`).then((res) => {
     setSingleData(res.data)
   })
   axios.get(`http://localhost:3004/get-debt/${singleId}`).then((res) => {
    setDebt(res.data)
  })
   axios.get(`http://localhost:3004/code/balance/${singleId}`).then((res) => {
    setMinus(res.data)
   })
  },[])

 
 const updateSalary = minus.salary

  const number = singleData.salary
  const option = {maximumFractionDigits: 2}
  const formattedNumber = Intl.NumberFormat("en-US",option).format(number); 


const debtors = debt.map((value) => {
  return parseInt(value.amount)
 })

 let sum = 0;
 debtors.forEach((el) => sum += el); 
 const numbersum = sum
 const optionsum = {maximumFractionDigits: 2}
 const formattedNumberSum = Intl.NumberFormat("en-US",optionsum).format(numbersum); 

 const salaryUpdated = updateSalary - sum
 const numberbalance = salaryUpdated
 const optionbalance = {maximumFractionDigits: 2}
 const formattedbalance = Intl.NumberFormat("en-US",optionbalance).format(numberbalance); 
                
            const mutationFn = (data) => {
             const response = axios.delete(`http://localhost:3004/deleteOne/${data}`);
             return response;
            }
          const mutation = useMutation({
            mutationKey:["kekTomuTation"],
            mutationFn: mutationFn,
            onError: (data) => {
              return data
            },
            onSuccess:(response) => {
              window.location.reload()
              return response;
             
             }
          })

            

  const deleteOne = (data) => {
  
   mutation.mutate(data)
  }
                 return (
                    <div className='singleData'>
                           {mutation.isPending ? ("....loading"):(<>
                            {mutation.error ? (<>{mutation.error}</>): null
                            }
                            </>)}
                    {mutation.isSuccess ?  "item has been delleted":null}
                    <div className='displeyUi'>
                    <p className='name'>{singleData.name}</p>
                    <div className='layOutDive'>
                      <div className='LeftSideLayout'>
                        <div className='d-reason'>
                        <p className='p-reason'>Reson for deduction</p>
                        <p className='p-reason'>{debt.map((value) => {
                           
                          return(
                            <p onClick={() => deleteOne(value.id)} className="delete">{value.description}</p>
                          )
                        })}</p>
                        </div>
                    
                        <div>
                          <p>Date</p>
                          <p>{debt.map((value) => {
                            const dateVar = new Date(value.createdAt);
                            return <p>{dateVar.toLocaleString()}</p> 
                          })}</p>
                        </div>
                        <div className='d-amount'>
                        <p className='p-reason'>Amount</p>
                        <p className='p-reason'>{debt.map((value) => {
                           const number = value.amount
                           const option = {maximumFractionDigits: 2}
                           const formattedNumber1 = Intl.NumberFormat("en-US",option).format(number); 
                          return(
                            <p>{formattedNumber1}</p>
                          )
                        })}</p>
                        </div>
                       </div>
                      <div className='RightSideLayout'>
                      <div className='d-debit' >
                        <p className='p-debit'>Debit</p>
                       <p><span>&#8358;</span>{formattedNumberSum}</p>
                      </div>
                       <div className='salary-space'>
                        <p className='p-salary'>Salary</p>
                        <p><span>&#8358;</span>{formattedNumber}</p>

                        <p>Bal:<span>&#8358;</span>{formattedbalance}</p>
                       </div>
                     </div>
                   </div>
                 </div>
                    <Substract/>
                    </div>
                  
             
  )
}

export default SingleStaff