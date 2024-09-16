import React from 'react'
import './BeforeDeleting.css'
import {useMutation} from "@tanstack/react-query"
import axios from 'axios'
function BeforeDeleting() {
  const tableIdData = localStorage.getItem("tableNameId")
  const mutationData = (data) => {
    const response = axios.delete(`http://localhost:3004/deleteTable/${tableIdData}`,data)
    return response
  }
  const mutation = useMutation({
    mutationKey: ["mutationDeleteIdividusl"],
    mutationFn: mutationData,
    onError:(error) => {
        return error
    },
    onSuccess:(response) => {
    window.location.reload()
    return response
    }
  })
  const deleteTableName = () => {
   mutation.mutate()
  }
  return (
    <div className='iportant-notics'>
    <p className='waring-text'>Please, make sure the costomer is aware of his/her amount before you delete this!!!</p>
    <button onClick={() => window.location.reload()} className='back-btn'>Back</button>
    <button onClick={deleteTableName} className='qust-btn'>Do you still want to delete this ?</button>
    </div>
  )
}

export default BeforeDeleting