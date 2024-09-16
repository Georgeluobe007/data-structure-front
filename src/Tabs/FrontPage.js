import React,{useEffect,useState} from 'react'
import {useForm} from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import axios from "axios"
import ShowTable from './ShowTable'
import {useMutation} from "@tanstack/react-query"
import '../Tabs/FrontPage.css'
function FrontPage() {
  const data = localStorage.getItem("tabLogIn");
  const [getDrinks,setGetDrinks] = useState([])
  const [remender,setRemender] = useState([])
  const [getWaiter,setGetWaiter] = useState([])
  const [getPrice,setgetPrice] = useState([])
  const [showTable,setShowTable] = useState(false)
 
 const schema = yup.object().shape({
  table: yup.string().required("please put table name")
 })
 const {handleSubmit,formState:{errors},register} = useForm({
  resolver:yupResolver(schema)
 })

  useEffect(() => {
   axios.get(`http://localhost:3004/getSendDrinks/${data}`).then((response) => {
    setGetDrinks(response.data)
   })
   axios.get("http://localhost:3004/getAllRender").then((response) => {
    setRemender(response.data)
   })
   axios.get("http://localhost:3004/allWaitress").then((response) => {
    setGetWaiter(response.data)
   })
   axios.get("http://localhost:3004/getItemPrice").then((response) => {
    setgetPrice(response.data)
   })
   },[])
   const mutationFnkey = (MYdata) => {
    const response = axios.post(`http://localhost:3004/confirm/${data}`,MYdata)
     return response
   }
   const mutation = useMutation({
    mutationKey: ['confirmKey'],
    mutationFn: mutationFnkey,
    onError: (error) => {
      return error
    },
    onSuccess:(res) => {
      window.location.reload()
       return res.data
    }
   })
   const mutationTable = (tableData) => {
    const request = axios.post(`http://localhost:3004/nameTable/${data}`,tableData);
    return request
   }
   const tableMutation = useMutation({
     mutationKey:["tableMutationKey"],
     mutationFn: mutationTable,
     onError:(error) => {
      return error
     },
     onSuccess:(res) => {
      return res
     }
   })
   const accepted = () => {
    getDrinks.map((value) => {
      const nameOfItem = value.NameOfItem
      const AddToOfficeId = value.AddToOfficeId
      const SendToWetressId = value.SendToWetressId
      const count = parseInt(value.count)
      const officeName = value.nameOfOffice

      const confimation = {
        NameOfItem:nameOfItem,
        AddToOfficeId:AddToOfficeId,
        SendToWetressId:SendToWetressId,
        count:count,
        nameOfOffice:officeName
      }
      mutation.mutate(confimation)
    })
    axios.delete(`http://localhost:3004/itemRemoveOndata/${data}`).then((response) => {
      return response.data
    })
   }
  
   const idontAccept = () => {
      remender.map((remainVal) => {
      const subValBottles = Number(remainVal.numbersOfBottles)
      getDrinks.map((credit) => {
           if(remainVal.id === credit.SendToWetressId){
             const drinksId = credit.SendToWetressId;  
             const count = Number(credit.count);
             const office = credit.AddToOfficeId
              const addUp = subValBottles + count;
            
              axios.put(`http://localhost:3004/updateCount/${drinksId}`,{
                       updateBottles:addUp,
                       AddToOfficeId:office
             })
           }
      })
    })

     axios.delete(`http://localhost:3004/itemRemoveOndata/${data}`).then((response) => {
      window.location.reload();
      return response.data
    })
   }
 
 const valueForPrice = getWaiter.map((waiter) => {
  const valueData = parseInt(data)
    if(waiter.id === valueData){
     return waiter.AddToOfficeId
    }
  })
  const submitMyTableData = (submitData) => {
   const tableNameSubmit = submitData.table;
   const myDataWork = data;
   const mutattionData = {
    mytabeName: tableNameSubmit,
    waiterId: myDataWork
  }
    tableMutation.mutate(mutattionData)
   }
   const showTableName = (id) => {
    localStorage.setItem("tableItem",JSON.stringify(id));
   }
  return (
    <div className='frontPageContainer'>
        <div className='left-side'>
        {getPrice.map((priceValue) => {
        return (
          <div>
          <div onClick={() => (showTableName(priceValue),setShowTable(!showTable))}>{valueForPrice.includes(priceValue.AddToOfficeId)&&<div className='contatiner-box'>
            {priceValue.NameOfItem}
            </div>}</div>
          
          </div>
          )
        })}
       {showTable && <ShowTable showTable={setShowTable}/>}
      </div>
    <div className='right-side'>
    {mutation.isPending ? ("....loading"):(<>
    {mutation.error ? (<>{mutation.error.response.data.message}</>): null}
    </>)}
    {mutation.isSuccess ?  "you have acknowledged it":null}
      <div className='acknowledgePage'>
      <table  className='itemTable'>
      {getDrinks.length > 0 && 
        <tr>
        <th>Name Of Item</th>
        <th>Quantity</th> 
        </tr>
      }
      <tr>
        <td>{getDrinks.map((value) => {
          return <div>{value.NameOfItem}</div>
        })}
        </td>
        <td>{getDrinks.map((value) => {
          return <div>{value.count}</div>
        })}
        </td>
      </tr>
     </table>
      {getDrinks.length > 0 && 
          <div>
          <button onClick={idontAccept} className='acceptNot'>I don't Accept</button>
          <button onClick={accepted} className='accepted'>I Accepted</button>
         </div>
      }
      </div>
       <div className='tableName'>
       {tableMutation.isPending ? ("....loading"):(<>
       {tableMutation.error ? (<>{tableMutation.error.response.data.message}</>): null}
       </>)}
          {tableMutation.isSuccess ?  "you have saved this table name":null}
          <form onSubmit={handleSubmit(submitMyTableData)}>
          <input type="text" {...register("table")} className='table-input' placeholder='e.g Emeka'/>
          <input type='submit' className='table-btn'/>  
          {errors.table && <p>{errors.table.message}</p>}
        </form>
       </div>
      </div>
    
    </div>
  )
}

export default FrontPage