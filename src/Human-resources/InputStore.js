import React,{useState,useEffect} from 'react'
import {useMutation} from "@tanstack/react-query"
import axios from 'axios'


function InputStore({store}) {
  const [choose,setChoose] = useState()
  const [drinks,setDrinks] = useState([])
  const [create,setCreate] = useState() 
  useEffect(() => {
  axios.get("http://localhost:3004/getRegProduct").then((response) => {
    setDrinks(response.data)
  })
  },[])

  const select = document.getElementById("number-select")
  for(let i = 0; i <= 1000; i++){
    const option = document.createElement("option")
     option.getAttribute('value',i)
     option.innerHTML = i;
     if (select) {
      select.appendChild(option);
}
   
  } 
 const mutationFn = (data) => {
 const response = axios.post("http://localhost:3004/store",data,{ 
  headers:{
    accessToken1:localStorage.getItem("token")
  }
 });
 const response1 = axios.post("http://localhost:3004/minusItems",data,{
  headers:{
    accessToken1:localStorage.getItem("token")
  }
 }); 
  return response1,response  
 }


 const mutation = useMutation({
    mutationKey:["storeHouseMutation"],
    mutationFn: mutationFn,
    onError: (error) => {
      return error
    },
    onSuccess: (res) => {
      window.location.reload()
     return res
    }
 })
const SendToStore = () => {
  const chooseItems = choose;
   drinks.map((value) => {  
  if(chooseItems === value.ProductName){
   const total = create * value.quantity; 

   const data = {
    NameOfItem:chooseItems,
    NumbersOfCreate:create,
    BottlesOfAllCreate:total
 }
 mutation.mutate(data);
   }
  }) 
 
}

return (
    <div className='store-page'>
          {mutation.isPending ? ("....loading"):(<>
         {mutation.error ? (<>{mutation.error.response.data.message}</>): null}
        </>)}
        {mutation.isSuccess ?  "you have successfully send item to store":null}
        <div className='input-store'>
         <div className='store-position'>
         <div >
         <select className='select-drink' id='value-select' onChange={(e) => setChoose(e.target.value)}>
         <option value=''>Item(s)</option>
             {drinks.map((drinksValue) => {
             return <option>{drinksValue.ProductName}</option>
         })}
         </select>
    
        </div>
    
        <select className='select-create' id= "number-select" onChange={(e) => setCreate(e.target.value)}>
            <option value="">Create</option>
          </select>
         <button className='btn-store' onClick={SendToStore}>Send</button>
          </div>
          
          </div>
          <button className='remove'  onClick={() => store(false)}>Remove</button>
        
      </div>
      
  )
}

export default InputStore