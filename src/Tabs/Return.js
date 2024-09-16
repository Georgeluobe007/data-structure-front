import React,{useState} from 'react'
import '../Tabs/Return.css'
import axios from 'axios'
import {useMutation} from '@tanstack/react-query'
function Return() {
    const data = localStorage.getItem("retunnProduct")
    const accessData = JSON.parse(data)
    const removeData = accessData.NameOfItem;
    const compare = Number(accessData.count)
   const [countRemove,setCountRemove] = useState(0)

   const mutationFn = (data) => { 
    const response = axios.post('http://localhost:3004/returnSendDrink',data) 
    return response
   }
   const mutation = useMutation({
    mutationKey:["retunDrinks"],
    mutationFn:mutationFn,
    onError:(error) => {
      return error
    },
    onSuccess:(res) => {
      document.getElementById("remove-statement").style.display = "none"
      window.location.reload()
      return res
    }
   })
   const countDecrease = () => {
    setCountRemove(countRemove -1)
   }
   const countInCrease = () => {
    setCountRemove(countRemove +1)

   }
   const returnDrinks = () => {
    const AddToOfficeId = accessData.AddToOfficeId;
    const nameOfOffice = accessData.nameOfOffice;
    const NameOfItem = accessData.NameOfItem;
    const PriceOfItem = accessData.PriceOfItem;
    const SendToWetressId = accessData.SendToWetressId;
    const WaitressLogInId = accessData.WaitressLogInId;
    const drinkId = accessData.id
    const count = countRemove;
   const mutateValue = {
    AddToOfficeId:AddToOfficeId,
    NameOfItem:NameOfItem,
    PriceOfItem:PriceOfItem,
    SendToWetressId:SendToWetressId,
    WaitressLogInId:WaitressLogInId,
    count:count,
    drinkId:drinkId,
    nameOfOffice:nameOfOffice
   }
   mutation.mutate(mutateValue)
   }
  return (
    <div className='returnHead'>
        {mutation.isPending ? ("....loading"):(<>
      {mutation.error ? (<>{mutation.error.response.data.message}</>): null
      }
     </>)}
     {mutation.isSuccess ?  "you have successfully logged in":null}
       <div className='retunContainer'>
        <p id='remove-statement'>{`you want to remove some number of ${removeData}`}</p>
        <div className='button-align'>
        <button 
        disabled={countRemove === 0}
        onClick={countDecrease} className='negative-btn'>-</button>
        <p className='counter'>{countRemove}</p>
        <button 
        disabled={compare <= countRemove}
        onClick={countInCrease}  className='negative-btn2'>+</button>
        </div>
        <button onClick={returnDrinks} className='sendButton'>Send</button>
        </div> 
        </div>
       
        
  )
}

export default Return