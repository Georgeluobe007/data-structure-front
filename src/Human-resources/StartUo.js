import React,{useState,useEffect} from 'react'
import InputStore from './InputStore'
import axios from 'axios'
import '../Human-resources/InputStore.css'
import SendTo from './SendTo'
import EditCreate from './EditCreate'
import DeleteAll from './DeleteAll'
import RegisterProduct from './RegisterProduct'
import AddNewOffice from './AddNewOffice'
function StartUo() {
 
  const [store,setStore] = useState(false)
  const [sendItem,setSendItem] = useState(false)
  const [createEdited,setCreateEdited] = useState(false)
  const [getAllItem,setGetAllItem] = useState([])
  const [getRemender,setGetRemender] = useState([])
  const [deleteAll,setDeleteAll] = useState(false)
  const [regProduct,setRegProduct] = useState(false)
  const [section,setSection] = useState(false)

  useEffect(() => {
   axios.get("http://localhost:3004/getStore",{
    headers:{ 
      accessToken1:localStorage.getItem("token")
    }
   }).then((response) => {
    if(response.data){
     setGetAllItem(response.data)
    } 
   })
   axios.get("http://localhost:3004/getRemender",{
    headers:{
      accessToken1:localStorage.getItem("token")
    }
   }).then((res) => {
    if(res.data){
      setGetRemender(res.data);
    }
   })
  },[])  

  
     const allFileter = getAllItem.map((value) => { 
      return value
     })
    const result  = allFileter.filter((v,i,a) => a.findIndex(t => (t.NameOfItem === v.NameOfItem)) === i); 
   
    const result2 = Object.values(getAllItem.reduce((c,{NameOfItem,NumbersOfCreate}) => {
      c[NameOfItem] = c[NameOfItem] || {NameOfItem,NumbersOfCreate:0}
      c[NameOfItem].NumbersOfCreate += parseInt(NumbersOfCreate)
      return c
    },{}))
     const result3 = Object.values(getAllItem.reduce((c,{NameOfItem,BottlesOfAllCreate}) => {
      c[NameOfItem] = c[NameOfItem] || {NameOfItem,BottlesOfAllCreate:0}
      c[NameOfItem].BottlesOfAllCreate += parseInt(BottlesOfAllCreate);
      return c
    },{}))
   const editCreate = (id) => {
    localStorage.setItem( "editCreate", JSON.stringify(id))
  }

  return (
    <div className='starts'>  
     <div className='human-resources'>
      <table id='customers'>
        <tr>
          <th className='table-head'>Item(s)</th>
          <th className='table-head'>Date/Time</th>
          <th className='table-head'>Sub Create</th>
          <th className='table-head'>Sub Total Bottles</th>
         
        </tr>
             
        {getAllItem.map((value) => {
          const getDate = new Date(value.createdAt)
            return( 
              <tr className='t-row'>
              <td onClick={() =>( editCreate(value),setCreateEdited(!createEdited))} 
               className='editCreate'>{value.NameOfItem}</td>
              <td className='table-down'>{getDate.toLocaleString()}</td>
              <td className='table-down'>{value.NumbersOfCreate}</td>
              <td className='table-down'>{value.BottlesOfAllCreate}</td>
            </tr>
            )
          })}
        </table>
        <div className='letf-side-angle'>
        < button className='add-item-btn' onClick={() => setStore(!store)}>Add items to store</button>
         {getAllItem.length === 0 ? null : 
         < button  className='add-item-btn' onClick={() => setDeleteAll(!deleteAll)}>Default</button> 
         }
       <button  onClick={() => setRegProduct(!regProduct)} className='add-item-btn'>Register new product</button>
       <button  onClick={() => setSection(!section)} className='add-item-btn'>Add New Section</button>
        </div>
     </div>

     <div className='barman-kitchen'>
      <div>
         <table id='customer'>
         <tr>
          <th className='table-head-1'>Item(s)</th>
          <th className='table-head-1'>Total Create</th>
          <th className='table-head-1'>Total Bottles</th>
        </tr>
        {result.map((value,key) => {
          return <tr key={key.id}>
            <td>{value.NameOfItem}</td>
            {result2.map((val) => {
              if(value.NameOfItem === val.NameOfItem){
                return <td>{val.NumbersOfCreate}</td>
              }
            })}
            {result3.map((val2) => {
              if(value.NameOfItem === val2.NameOfItem){
                return <td>{val2.BottlesOfAllCreate}</td>
              }
            })} 
          </tr>
        })}
         </table>
         </div>
      

      <div>
         <table id='customer-remender'>
         <tr>
          <th className='table-head'>Item(s)</th>
          <th className='table-head'>Create Remainig</th>
          <th className='table-head'>Bottles Remaining</th>
        </tr>
         <tr>
          <td>{getRemender.map((val) => {return <div>{val.NameOfItem}</div>})}</td>
          <td>{getRemender.map((val) => {return <div>{val.NumbersOfCreate}</div>})}</td>
          <td>{getRemender.map((val) => {return <div>{val.BottlesOfAllCreate}</div>})}</td>
         </tr>
         </table>
         </div>
         < button className='add-item-btn' onClick={() => setSendItem(!sendItem)}>Send to offices</button>
         
     
     </div> 
     {store && <InputStore store={setStore}/>}
     {sendItem && <SendTo sendItem={setSendItem}/>}
     {createEdited && <EditCreate createEdited={setCreateEdited}/>} 
     {deleteAll && <DeleteAll deleteAll={setDeleteAll}/> }
     {regProduct && <RegisterProduct regProduct={setRegProduct}/>}
     {section && <AddNewOffice section={setSection}/>}
    </div>
  )
}

export default StartUo