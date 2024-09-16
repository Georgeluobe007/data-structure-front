import React,{useState,useEffect,useRef} from 'react'
import axios from "axios";
import {useMutation} from "@tanstack/react-query"
function SendTo({sendItem}) {
  const [isActive, setIsActive] = useState([]);
  const [isActive2,setIsActive2] = useState([])
  const [create,setCreate] = useState() 
  const [allOffice,setAllOffice] = useState([])
  const [remender,setRemender] = useState([])
  const [regDrinks,setRegDrinks] = useState([])

  useEffect(() => {
   axios.get("http://localhost:3004/office").then((response) => {
    if(response.data){
      setAllOffice(response.data)
    }
   })
   axios.get("http://localhost:3004/getRemender").then((res) => {
    if(res.data){
      setRemender(res.data) 
    }
   }) 
   axios.get("http://localhost:3004/getRegProduct").then((res) => {
    setRegDrinks(res.data)
   })
 },[])
 
const drinkPage = localStorage.getItem("drinks")
const data = JSON.parse(drinkPage)
const Myid = data.id
const officePage = localStorage.getItem("sendOffice")
const officedata = JSON.parse(officePage)
const id = officedata.id  
const mutationFn = (data) => {
  const response = axios.post(`http://localhost:3004/sendToOffice/${id}`,data);
  const response1 = axios.post(`http://localhost:3004/wetressRemender/${id}`,data); 
   return{ response,response1}
  }
  const mutation = useMutation({
    mutationKey:["officeMutation","remainderMutation"],
    mutationFn: mutationFn,
    onError: (error) => {
      return error
    },
    onSuccess: (res) => {
      window.location.reload()
     return res
    }
 })

const select = document.getElementById("select")
 for(let i = 0; i <= 1000; i++){
  const option = document.createElement("option")
   option.getAttribute('value',i)
   option.innerHTML = i;
   if (select) {
    select.appendChild(option);
  }
 } 

 const itemName = data.NameOfItem 
 const totalCreate = Number(data.NumbersOfCreate);
//  console.log(totalCreate);
 const BottlesOfAllCreate = data.BottlesOfAllCreate
 const remaining = totalCreate - create;
  const [message,setMessage] = useState("")
  const sendToOffice = () => {
   if(create > totalCreate){
    return setMessage("you don't have enough stock to send")
   }else{
    regDrinks.map((value) => { 
      if(itemName === value.ProductName){
        const bottlePerCreate = value.quantity
        const allBottles = bottlePerCreate * create;
       const remainingBottles = BottlesOfAllCreate - allBottles;
       axios.put(`http://localhost:3004/remender/${Myid}`,{
        NumbersOfCreate:remaining,
        BottlesOfAllCreate: remainingBottles
    }).then((res) => {
      if(res.data) {
       window.location.reload()
      }else{
        console.log("data is not working");
      }
    })
      }
  })
   }

   const officeName = officedata.officeName;
    const nameOfItems = data.NameOfItem
    regDrinks.map((value) => {
      if(nameOfItems === value.ProductName){
         const total = create * value.quantity;
          
          const Ourdata = {
          nameOfOffice:officeName,
          create:create,
          numbersOfBottles:total,
          nameOfDrinks:nameOfItems
         
         }
       
        mutation.mutate(Ourdata);
      }
    })
    
}

const addNameOfItem = (id) => {  
localStorage.setItem("drinks",JSON.stringify(id)) 
const newSelectedRows = [isActive2];
if(newSelectedRows.includes(id.id)){
  newSelectedRows.splice(newSelectedRows.indexOf(id.id),1)

}else{
  newSelectedRows.push(id.id)
  setIsActive2(newSelectedRows)
 }
}

const offices = (id) =>{    
   localStorage.setItem("sendOffice",JSON.stringify(id));
  const newSelectedRows = [isActive];
  if(newSelectedRows.includes(id.id)){
    newSelectedRows.splice(newSelectedRows.indexOf(id.id),1)

  }else{
    newSelectedRows.push(id.id)
    setIsActive(newSelectedRows)
   }
}

  return (
    <div className='store-page1'>
       {mutation.isPending ? ("....loading"):(<>
      {mutation.error ? (<>{mutation.error.response.data.message}</>): null
      
      }
        </>)}
        {mutation.isSuccess ?  "you have successfully sent item to office":null}
       <div className='input-store'>
       <div className='store-position1'>
       {message}

          <table id='sentOffice'>
            <tr>
              <th>Items</th>
              <th>Send To</th>
              <th>No.Create</th>
            </tr>

            <tr>
              <td>
              {remender.map((value) => {
               return <div>
                <button 
                  style={{backgroundColor:isActive2.includes(value.id) ? "green":""}}  
                  onClick={() => addNameOfItem(value)}
                  className='nameOfItem-btn'>
                  {value.NameOfItem}
                </button>
               </div>
               })}
              </td>
              <td>
              {allOffice.map((val,key) => {
              return <div key={key} >
                <button 
                 style={{backgroundColor:isActive.includes(val.id) ? "green":""}} 
                 onClick={() => offices(val)}  
                 className='officeName-btn'>{val.officeName}
                </button>
              </div>
              })}
              </td>
              <td>
              <select className='select-create' id= "select" onChange={(e) => setCreate(e.target.value)}>
              <option value="">Create</option>
            </select>
              </td>
            </tr>
          </table>
           </div>
           <button className='sendOffice-btn' onClick={sendToOffice}>Send</button>
          </div>
      </div>  
  )
}

export default SendTo