import axios from 'axios';
import React, { useEffect,useState} from 'react'
import {useMutation} from '@tanstack/react-query'
import '../BarMan/SendToWaitress.css'

function SendToWaitress() {
    const data = localStorage.getItem("sections");
    const [sectionShare,setSectionShare] = useState([])
    const [isActive,setIsActive] = useState([])
    const [arr,setArr] = useState([])
    const [count,setCount] = useState(0)
    const waitressData = localStorage.getItem("waitressId")
    const getId = JSON.parse(waitressData);

    useEffect(() => {
        axios.get(`http://localhost:3004/getBarRemender/${data}`,{
           }).then((response) => {
             setSectionShare(response.data)
           })
        //    axios.get(`http://localhost:3004/getBarRemender/${data}`).then((response) => {
        //     setGetRemender(response.data)
        //    })
    },[])
    // const result2 = Object.values(sectionShare.reduce((c,{nameOfDrinks,create}) => {
    //     c[nameOfDrinks] = c[nameOfDrinks] || {nameOfDrinks,create:0}
    //     c[nameOfDrinks].create += parseInt(create)
    //     return c
    //   },{}))
   
    const focus = (id) => {
     const myId = id.id
     const AddToOfficeId = id.AddToOfficeId
     const mycount = 1
     const nameOfDrinks = id.nameOfDrinks
     const numbersOfBottles = id.numbersOfBottles
     const nameOfOffice = id.nameOfOffice
     const myArray = 
     {count:mycount,
     nameOfDrinks:nameOfDrinks,
     numbersOfBottles:numbersOfBottles,
     nameOfOffice:nameOfOffice,
     id:myId,
     AddToOfficeId:AddToOfficeId}
     arr.push(myArray)
     const newSelectedRows = [...isActive];
    if(newSelectedRows.includes(id.id)){
     newSelectedRows.splice(newSelectedRows.indexOf(id.id),1)
     }else{
     newSelectedRows.push(id.id)
     setIsActive(newSelectedRows)
    }
    }
  const minusBtn = (id) => {
    const myId = id.id
    const indexWork = arr.find(item => item.id === myId)
    const index = arr.indexOf(indexWork);
    const product = arr[index];
    product.count = parseInt(product.count) - 1;
    if(product.count < 1){
        const remove = arr.filter(item => item.id!== myId)
        setArr(remove)
    }else{
        setCount(product.count)  
    }
  }
  const plusBtn = (id) => {
    const myId = id.id
    const indexWork = arr.find(item => item.id === myId)
    const index = arr.indexOf(indexWork);
    const product = arr[index];
    product.count = parseInt(product.count) + 1;
    setCount(product.count)
  }
  const mutationFn = (data) => {
  const response = axios.post("http://localhost:3004/sendDrinks",data)
  return response
  }
  const mutation = useMutation({
    mutationKey:["sendItemToWaitress"],
    mutationFn: mutationFn,
    onError: (error) => {
        return error
    },
    onSuccess: (res) => {
    arr.map((sub) => {
    const idEdit = sub.id
    const AddToOfficeId = sub.AddToOfficeId
    const numbersOfBottles = Number(sub.numbersOfBottles)
    const counter = sub.count;
    const subStartct = numbersOfBottles - counter
    axios.put(`http://localhost:3004/updateCount/${idEdit}`,{
        updateBottles:subStartct,
        AddToOfficeId:AddToOfficeId
       })
      })
      window.location.reload()
     return res
    }
  })
  const sendItemToWaitress = () => {
   arr.map((mapCart) => {
    const AddToOfficeId = mapCart.AddToOfficeId
    const count = mapCart.count
    const nameOfDrinks = mapCart.nameOfDrinks
    const nameOfOffice = mapCart.nameOfOffice
    const sendWaitressId = mapCart.id
    const waitressId = getId.id
    const sendMutation = 
    {AddToOfficeId:AddToOfficeId,
    count:count,
    NameOfItem:nameOfDrinks,
    nameOfOffice:nameOfOffice,
    SendToWetressId:sendWaitressId,
    WaitressLogInId:waitressId
   }
   mutation.mutate(sendMutation)
  })
  }
  return (
    <div className='waitress-page'>
      <div>
        <p className='message'>
        {mutation.isPending ? ("....loading"):(<>
         {mutation.error ? (<>{mutation.error.response.data.message}</>): null} </>)}
         {mutation.isSuccess ?  "you have sent item to a waitress":null}
        </p>
        {arr.length > 0 ? (<div>
            {arr.map((valArr) => {
            return <div className='set-btn'>
              <p className='myDrinksName'>{valArr.nameOfDrinks}</p>
              <div className='control-btn'>
              <button onClick={() => minusBtn(valArr)} className='minus-btn'>-</button>
              <p className='counter'>{valArr.count}</p>
              <button onClick={() => plusBtn(valArr)} className='plus-btn'>+</button>
              </div>
            </div>
        })}
         <button onClick={sendItemToWaitress} className='send-item'>Send Item</button>
        </div>):(null)}
      
         </div>
     {sectionShare.map((drinks) => {
        return <div>
        <button
        disabled={isActive.includes(drinks.id)}
        style={{backgroundColor:isActive.includes(drinks.id) ? "green":""}} 
         className='nameOfItem' onClick={() => focus(drinks)}>{drinks.nameOfDrinks}</button>
        </div>
      })}
   
    
    </div>
  )
}

export default SendToWaitress