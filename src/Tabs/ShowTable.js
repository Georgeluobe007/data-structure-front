import React,{useEffect,useState} from 'react'
 import axios from 'axios'
 import {useMutation} from "@tanstack/react-query"
function ShowTable({showTable}) {
  const [mytableName,setMyTableName] = useState([])
  const data = localStorage.getItem("tabLogIn");
  const tableData = localStorage.getItem("tableItem")
  const dataTable = JSON.parse(tableData);
  const NameOfItem = dataTable.NameOfItem;
  const PriceOfItem = dataTable.PriceOfItem;




  useEffect(() => {
   axios.get(`http://localhost:3004/getTableName/${data}`).then((res) => {
    setMyTableName(res.data)
   })
  },[])
 const mutationTable = (dataMutation) => {
  const ressponse = axios.post("http://localhost:3004/showBill/",dataMutation)
  return ressponse
 }
 const mutation = useMutation({
  mutationKey:["tableMutationKey"],
  mutationFn: mutationTable,
  onError: (error) => {
  return error
  },
  onSuccess:(res) => {
    window.location.reload()
   return res
  }
 })
 let counter = 1;
  const sendTableItem = (id) => {
    const tableNameId = id.id
    const WaitressLogInId = id.WaitressLogInId;
    const officeName = id.officeName

    const mutationValue = {
      WaitressLogInId:WaitressLogInId,
      TableName:officeName,
      NameOfItem:NameOfItem,
      PriceOfItem:PriceOfItem,
      count:counter,
      SubTotal:PriceOfItem,
      TableNameId:tableNameId
    } 
   mutation.mutate(mutationValue)
   
  }
  return (
    <div className='showTable-container'>
      {mytableName.map((value,keys) => {
        return <div key={keys}>
         <button onClick={() => sendTableItem(value)} className='showMyTable'>{value.officeName}</button>
        </div>
      })}
       
      </div>
  )
}

export default ShowTable