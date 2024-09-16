import React,{useEffect,useState} from 'react'
import axios from 'axios';
import {useMutation} from "@tanstack/react-query"
function DeleteAll({deleteAll}) {
 
const mutationFn = (data) => {
 const response = axios.delete("http://localhost:3004/delete",data);
 const response1 = axios.delete("http://localhost:3004/deleteAll",data)
 return {response,response1}
}
const mutation = useMutation({
 mutationKey:["deeleMutation"],
 mutationFn: mutationFn,
 onError: (error) => {
   return error
 },
 onSuccess:(res) => {
  window.location.reload();
   return res
 }
})
  const deleteAllPage = () => {
    mutation.mutate()
  }
  return (
    <div className='deleteAllDiv'>
      {mutation.isPending ? ("....loading"):(<>
      {mutation.error ? (<>{mutation.error.message}</>): null }
      </>)}
      {mutation.isSuccess ?  "item deleted":null}
        <div className='deleteall'>
        <p>WARNING !!!</p>
        <p>Please note that, by clicking on the yes button  ,<br/>all that you have in you dataBase will be gone</p>
        <p>Do you still want to delete ?</p>
        </div>
        <div>
         <button onClick={() => deleteAll(false)} className='editCreate-btn'>NO</button>
         <button onClick={deleteAllPage} className='deleteCreate-btn'>YES</button>
        </div>
    </div>
  )
}

export default DeleteAll