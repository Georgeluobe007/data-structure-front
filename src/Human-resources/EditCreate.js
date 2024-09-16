import React,{useState,useEffect} from 'react'
import {useMutation} from '@tanstack/react-query'
import axios from 'axios'
import {useNavigate} from "react-router-dom"

function EditCreate({createEdited}) {
const data = localStorage.getItem("editCreate")
const id = JSON.parse(data)
const NameOfItem = id.NameOfItem
const OurBottlesOfAllCreate = id.BottlesOfAllCreate
const OurNumbersOfCreate = id.NumbersOfCreate

const valId = id.id






const [getRemender,setGetRemender] = useState([])
useEffect(() => {
  axios.get("http://localhost:3004/getRemender").then((res) => {
   setGetRemender(res.data)
 })
},[])
 const navigate = useNavigate();
 const mutationFn = (data) => {
  const response = axios.delete(`http://localhost:3004/deleteItem/${valId}`,data)
  return response
 }
 const mutation = useMutation({
  mutationKey:["editCreateMutation"],
  mutationFn: mutationFn,
  onError:(error) => {
   return error
  },
  onSuccess: (res) => {
   window.location.reload();
   return res
  }
})

  const deleteCreate = () => {
   mutation.mutate(id)
   getRemender.map((val) => {
    if(NameOfItem === val.NameOfItem){ 
      const avalaibleCreate =  val.NumbersOfCreate - OurNumbersOfCreate;
      const avalableBottle =   val.BottlesOfAllCreate - OurBottlesOfAllCreate;

      axios.put("http://localhost:3004/update",{
        NumbersOfCreate:avalaibleCreate,
        BottlesOfAllCreate:avalableBottle,
        NameOfItem:NameOfItem
      }).then((res) => {
        if(res.data){
          console.log("we have remove the item")
        }
      })
    }
   })

  } 
  return (
    <div className='createEdited'>
      {mutation.isPending ? ("....loading"):(<>
      {mutation.error ? (<>{mutation.error.message}</>): null }
      </>)}
      {mutation.isSuccess ?  "item deleted":null}
      <p style={{backgroundColor:"blue",color:"white"}}>Do you want to delete this item ??</p>
       <div className='buttons-space'>
        <button onClick={() => createEdited(false)} className='editCreate-btn'>NO</button>
         <button onClick={deleteCreate} className='deleteCreate-btn'>YES</button>
       </div>
    </div>
  )
}

export default EditCreate