import axios from 'axios'
import React,{useEffect,useState} from 'react'
import {useMutation} from '@tanstack/react-query'
import "../BarMan/CheckSalesBarMan.css"
function CheckSalesBarMan() {
  const data = localStorage.getItem("sections");
  const [getAllItem,setGetAllItem] = useState([])
  const [getreturnDrinks,setGetreturnDrinks] = useState([])
  const [getRemender,setGetRemender] = useState([])

  useEffect(() => {
    axios.get(`http://localhost:3004/getAllConfirmation/${data}`,{
    }).then((response) => {
      setGetAllItem(response.data)
    })
    axios.get(`http://localhost:3004/getReturnDrinks/${data}`,{
    }).then((response) => {
      setGetreturnDrinks(response.data)
    })
    axios.get(`http://localhost:3004/getBarRemender/${data}`).then((response) => {
      setGetRemender(response.data) 
     })
  },[])

  const dataitem = getAllItem.map((item) => { 
    return item
   })
   const addUpItem2 =  dataitem.reduce((acc,current) => { 
    if(!acc[current.WaitressLogInId]){
      acc[(current.WaitressLogInId)] = {}
    }
    if(!acc[(current.WaitressLogInId)][current.NameOfItem]){
      acc[(current.WaitressLogInId)] [current.NameOfItem] = 0
    }
    acc[(current.WaitressLogInId)] [current.NameOfItem] = parseInt(current.count);
    return acc;
  },{})
 const notTrue = (id) => {
  const waterId = id.WaitressLogInId
   axios.delete(`http://localhost:3004/removeDrinks/${waterId}`).then((res) => {
    if(res.data){
      window.location.reload()
    }
   })
 }
//  const mutationFn = (mdata) => {
//   const response = axios.put("http://localhost:3004/returnDrinks",mdata)
//   return response
//  }
//  const mutation = useMutation({
//   mutationKey: ["removeMutation"],
//   mutationFn: mutationFn,
//   onError: (err) => {
//   return err
//   },
//   onSuccess: (res) => {
//     getreturnDrinks.map((rem) => {
//     console.log(rem);
//     })
//    return res
//   }
//  })
let addUp = 0
 const yesitTrue = (id) => {
  console.log(id.SendToWetressId);
  const count = Number(id.count);
  const SendToWetressId = Number(id.SendToWetressId);
  const drinkId = Number(id.drinkId)
  const AddToOfficeId = id.AddToOfficeId;
  const waterId = id.WaitressLogInId
  getAllItem.map((getitem) => {
    const itemId = getitem.id;
    if(itemId === drinkId){
      const prevCount = Number(getitem.count);
      const minuVal = prevCount - count;
      // const sendMutation = {count:minuVal,returnId:drinkId}
      // mutation.mutate(sendMutation)
      axios.put("http://localhost:3004/returnDrinks",{count:minuVal,returnId:drinkId}).then((val) => {
        if(val.data){
          getRemender.map((rem) => {
          const remId = rem.id;
          if(remId === SendToWetressId){
            const bottleRemain = Number(rem.numbersOfBottles);
            const numbersOfBottles = [bottleRemain,count];
            numbersOfBottles.forEach(item => addUp += item)
           axios.put(`http://localhost:3004/updateCount/${remId}`,
           {updateBottles:addUp,
            AddToOfficeId:AddToOfficeId
          }).then((response) => {

            if(response.data){
              axios.delete(`http://localhost:3004/removeDrinks/${waterId}`).then((last) => {
                if(last.data){
                  window.location.reload()
                }
              })
            }
           })
          }
          })
        }
      })
    }
  })
 }
  return (
    <div className='tab-container'>
    <div className='tab-table'>
      {Object.keys(addUpItem2).map((key) => (
       <div key={key}>
       <p className="tab-key">Tab Id: {key}</p>
       <table className='salesTable'>
        <tr className='sales-row'>
          <th>Name of item</th>
          <th>Count</th>
        </tr>
        <tr>
          <td>
          {Object.keys(addUpItem2[key]).map((val) => (
                <div key={val}>{val}</div>
               ))}
          </td>
          <td>
          {Object.keys(addUpItem2[key]).map((val) => (
                <div key={val}>{addUpItem2[key][val]}</div>
               ))}
          </td>
        </tr>
      </table>
    </div>
      ))}
      </div>
      <div className='returnee-container'>
      {getreturnDrinks.map((returnDrinks) => (
     <div className='returnee'>
     <div>
     <p className='retunee-text'>{`Tab ${returnDrinks.WaitressLogInId},is currently returning
      ${returnDrinks.count} bottles of ${returnDrinks.NameOfItem}. click Yes if you agree and No if you do not
      agree`}</p>
     </div>
        <div className='returnee-buttons'>
          <button className='notTrue' onClick={() => notTrue(returnDrinks)}>No</button>
          <button className='yesitTrue' onClick={() => yesitTrue(returnDrinks)}>Yes</button>
        </div>
        </div>
      ))}
      </div>
    </div> 
  )
}

export default CheckSalesBarMan