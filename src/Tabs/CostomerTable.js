import React,{useEffect,useState} from 'react'
import axios from 'axios';
import SingleBill from './SingleBill';
import './CostomerTable.css'
import {useMutation} from "@tanstack/react-query"
function CostomerTable() {
  const data = localStorage.getItem("tabLogIn");
  const [getBill,setGetBill] = useState([])
  const [singleBill,setSingleBill] =useState(false)
  const [updateCount,setUpdateCount] = useState(0)
  useEffect(() => {
    axios.get(`http://localhost:3004/costomerBill/${data}`).then((res) => {
      setGetBill(res.data)
    })
   },[])
   const mutationUpdate = (data) => {
    const response = axios.put("http://localhost:3004/updateItem",data);
    return response
   }
   const mutation = useMutation({
    mutationKey: ["updateMutation"],
    mutationFn: mutationUpdate,
    onError:(error) => {
      return error
    },
    onSuccess: (res) => {
      return res
    }
   })
   const singleConfirm = getBill.map((value) => { 
    return value
   })
   const result  = singleConfirm.filter((v,i,a) => a.findIndex(t => (t.TableName === v.TableName)) === i); 
 const indidualBill = (id) => {
  const tableNameId = id.TableNameId
  localStorage.setItem("tableNameId",tableNameId);
 }
 const decreasingValue = (id) => {
  const counter = id.Count;
 const itemId = id.id;
 const tableName = id.TableName
const carts = singleConfirm;
const indexWork = carts.find(item => item.Count === counter && item.id === itemId && item.TableName === tableName); 
const index = carts.indexOf(indexWork);
const product = carts[index]; 
product.Count = parseInt(product.Count) - 1;
console.log(product.Count);
if(product.Count < 1){
  const indexWork = carts.filter(item => item.id !== itemId); 
   setGetBill(indexWork)
    axios.delete(`http://localhost:3004/deleteIndividually/${itemId}`)
}else{
  setUpdateCount(updateCount - product.Count)
  const counted = product.Count;
 product.SubTotal = product.Count * parseInt(product.PriceOfItem)
  const totalSub = product.SubTotal;
  const countedId = id.id;
  const mutationUpdate = {counted:counted,countedId:countedId,totalSub:totalSub}
  mutation.mutate(mutationUpdate)
} 
  
 }
 const increasingValue = (id) => {
 const counter = id.Count;
 const itemId = id.id;
 const tableName = id.TableName
const carts = singleConfirm;
const indexWork = carts.find(item => item.Count === counter && item.id === itemId && item.TableName === tableName); 
const index = carts.indexOf(indexWork);
const product = carts[index]; 
product.Count = parseInt(product.Count) + 1;
   setUpdateCount(updateCount + product.Count)
   const counted = product.Count;
  product.SubTotal = product.Count * parseInt(product.PriceOfItem)
   const totalSub = product.SubTotal;
   const countedId = id.id;
   const mutationUpdate = {counted:counted,countedId:countedId,totalSub:totalSub}
   mutation.mutate(mutationUpdate)
}

  return (
         <div className='costomer-contatiner'>
          {result.map((valueres) => {
            return <div>
                <p onClick={() => (indidualBill(valueres),setSingleBill(!singleBill))} className='nameOfCostomer'>{valueres.TableName}</p>
                <table className='ui-costomer'>
                  <tr>
                    <th>Name of Item</th>
                    <th>Price of Item</th>
                    <th>Count</th>
                    <th>SubTotal</th>
                  </tr>
                   <tr>
                    <td>
                    {getBill.map((billMap) => {
                    if(billMap.TableName === valueres.TableName){
                    return <div>{billMap.NameOfItem}</div>
                    }
                    })}
                    </td>
                    <td>
                    {getBill.map((billMap) => {
                    if(billMap.TableName === valueres.TableName){
                    return <div>{billMap.PriceOfItem}</div>
                    }
                    })}
                    </td>
                    <td>
                    {getBill.map((billMap) => {
                    if(billMap.TableName === valueres.TableName){
                      
                    return <div>
                      <button onClick={() => decreasingValue(billMap)} className='de-crease'>-</button>
                        {billMap.Count}
                        <button onClick={() => increasingValue(billMap)} className='in-crease'>+</button>
                      </div>
                    }
                    })}
                    </td>
                    <td>
                    {getBill.map((billMap) => {
                    if(billMap.TableName === valueres.TableName){
                    return <div>{billMap.SubTotal}</div>
                    }
                    })}
                    </td>
                   </tr>
                </table>
              </div>
            
          })}
       {singleBill && <SingleBill singleBill={setSingleBill}/>}
         </div>
  )
}

export default CostomerTable