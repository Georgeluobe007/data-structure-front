import React,{useEffect,useState} from 'react'
import axios from 'axios'
import '../Human-resources/AddToOffice.css'

function AddToOffice() {
 const [officeSent,setOfficeSent] = useState([]);
 const [remender,setRemender] = useState([]);
  useEffect(() => {
   axios.get("http://localhost:3004/getSentOffice",{}).then((res) => { 
      setOfficeSent(res.data)
     })
     axios.get("http://localhost:3004/getRemender").then((res) => {
      setRemender(res.data)
     })
  },[])


   const setMap = officeSent.map((value) => {
    return value.nameOfOffice
   })
   const setIdex = setMap.filter((v,i,n) => 
   n.indexOf(v) === i);

  const deleteItem = (id) => {
    const nameOfDrin = id.nameOfDrinks;
    const numbersOfBottles = id.numbersOfBottles;
    const create = id.create;
    const listId = id.id
    remender.map((val) => {
      let totalBottles = 0;
      let totalCreate = 0;
      if(nameOfDrin === val.NameOfItem){
        const unitBottles = val.BottlesOfAllCreate;
        const remainingCreate = val.NumbersOfCreate; 
        
        const ourBottles = [unitBottles,numbersOfBottles];
        ourBottles.forEach(val => totalBottles += Number(val))
        const ourCreate = [remainingCreate,create];
         ourCreate.forEach(val => totalCreate += Number(val))
      
        axios.put("http://localhost:3004/update",{
          NumbersOfCreate:totalCreate,
          BottlesOfAllCreate:totalBottles,
          NameOfItem:nameOfDrin
        }).then((res) => {
          if(res.data){
            window.location.reload()
            return res.data
          }
        })
       }
     })
   axios.delete(`http://localhost:3004/deleteSingle/${listId}`,{
    headers:{
      accessToken1:localStorage.getItem("token")
    }
   }).then((response) => {
   if(response){
    window.location.reload()
    return response.data 
   }
   })
   } 
  const deleteAll = () => {
   axios.delete("http://localhost:3004/deleteSalesPoint",{
    headers:{
      accessToken1:localStorage.getItem("token")
    }
   }).then((res) => {
    window.location.reload();
    return res.data;
   })
  }
  return (
    <div className='salesPoint'>
       <div className='page-center'>
       {setIdex.map((value) => {
        return (
          <div className='shops'>
           <li className='list'>{value}</li>
           <table className='officeTabe'>
            <tr>
              <th className='t-head'>Name Of Item(s)</th>
              <th className='t-head'>NO's Of Item(s)</th>
              <th className='t-head'>Units</th>
            </tr>
            <tr>
              <td >
              {officeSent.map((v) => {
                if(v.nameOfOffice === value){
                return(
                <div>{v.nameOfDrinks}</div>
                )
              }
            })}
              </td>
              <td>
              {officeSent.map((v) => {
                if(v.nameOfOffice === value){
                return(
                  <div>{v.create}</div>
                )
              }
             
            })}
              </td>
              <td>
              {officeSent.map((v) => {
                if(v.nameOfOffice === value){
                return(
                 <div className='delete-item'>
                   <div>{v.numbersOfBottles}</div>
                  <button onClick={() => deleteItem(v)} className ="delete-btn">delete</button>
                 </div>
                )
              }
            })}
           
              </td>
            </tr>
           </table>
            </div>
           )
        })} 
        {officeSent.length === 0 ? (<p className='addCart'>You haven't sent item to any of the section today</p>) : (
        <button onClick={deleteAll} className='remove-all'>Remove All</button>
        )}
       
       </div>
     </div>
  )
}

export default AddToOffice