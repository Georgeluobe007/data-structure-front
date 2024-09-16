import React,{useEffect,useState} from 'react'
import axios from 'axios'
import '../Tabs/CheackSales.css'
import Return from './Return';
function CheackSales() {
 const data = localStorage.getItem("tabLogIn");
 const [getItem,setGetItem] = useState([])
 const [getItemPrice,setGetItemPrice] = useState([])
 const [getWaiter,setGetWaiter] = useState([])
 const [returnBack,setReturnBack] = useState(false)
 useEffect(() => {
    axios.get(`http://localhost:3004/getItemWaiter/${data}`).then((response) => {
      setGetItem(response.data)
    })
    axios.get("http://localhost:3004/getItemPrice/").then((response) => {
      setGetItemPrice(response.data)
    })
    axios.get("http://localhost:3004/allWaitress").then((response) => {
      setGetWaiter(response.data)
     })
   },[])
   const singleConfirm = getItem.map((value) => { 
    return value
   })
  
   const result  = singleConfirm.filter((v,i,a) => a.findIndex(t => (t.nameOfOffice === v.nameOfOffice)) === i); 
   const addUpItem =  getItem.reduce((acc,current) => { 
    if(!acc[current.nameOfOffice]){
      acc[(current.nameOfOffice)] = {}
    }
    if(!acc[(current.nameOfOffice)][current.NameOfItem]){
      acc[(current.nameOfOffice)] [current.NameOfItem] = 0
    }
    acc[(current.nameOfOffice)] [current.NameOfItem] += parseInt(current.count);
    return acc;
  },{})

  const valueForPrice = getWaiter.map((waiter) => {
    const valueData = parseInt(data)
      if(waiter.id === valueData){
       return waiter.AddToOfficeId
      }
    })
   
   const dataPrice = getItemPrice.map((itemPrice) => {
    if(valueForPrice.includes(itemPrice.AddToOfficeId))
          if(itemPrice.NameOfItem === "Fish"){
          itemPrice.NameOfOffice = "Barbecue"
        }
       return itemPrice
   })
   const dataitem = getItem.map((item) => {
    return item
   })

   const itemResult = dataitem.map(item => { 
      const match = dataPrice.find(i => i.NameOfItem === item.NameOfItem && i.NameOfOffice  
        === item.nameOfOffice)
        return {...item,PriceOfItem:match ? match.PriceOfItem: null}
   })
   const addUpItem2 =  itemResult.reduce((acc,current) => { 
    if(!acc[current.nameOfOffice]){
      acc[(current.nameOfOffice)] = {}
    }
    if(!acc[(current.nameOfOffice)][current.NameOfItem]){
      acc[(current.nameOfOffice)] [current.NameOfItem] = 0
    }
    acc[(current.nameOfOffice)] [current.NameOfItem] = parseInt(current.PriceOfItem);
    return acc;
  },{})
  const sendBack = (id) => {
   localStorage.setItem("retunnProduct",JSON.stringify(id))
   
  }
  return (
    <div className='componentHead'>
      <div>
        {result.map((heading) => {
          return(
            <div className='pageUI'>
             <p className='nameofoffice'>{heading.nameOfOffice}</p>
             <table className='waitterCheack'>
                   <tr>
                    <th>Name of Drinks</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Sub Total</th>
                   </tr>
                <tr>
                  <td>
                    {itemResult.map((drinkName) => {
                      if(heading.nameOfOffice === drinkName.nameOfOffice)
                      return <div>{drinkName.NameOfItem}</div>
                      })}
                  </td>
                  <td>
                    {itemResult.map((drinkName) => {
                      if(heading.nameOfOffice === drinkName.nameOfOffice)
                      return <div style={{cursor:"pointer"}} 
                      onClick={() => (sendBack(drinkName),setReturnBack(!returnBack))}>{drinkName.count}</div>
                      })}
                  </td>
                  <td>
                    {itemResult.map((drinkName) => {
                      const number =  drinkName.PriceOfItem
                      const option = {maximumFractionDigits: 2}
                      const formattedNumber1 = Intl.NumberFormat("en-US",option).format(number);
                      if(heading.nameOfOffice === drinkName.nameOfOffice)
                      
                      return <div>{formattedNumber1}</div>
                      })}
                  </td>
                  <td>
                    {itemResult.map((drinkName) => {
                      if(heading.nameOfOffice === drinkName.nameOfOffice){
                        const price =  drinkName.PriceOfItem;
                        const quantity =  drinkName.count;
                        const multiply = price * quantity;
                        const number = multiply
                       const option = {maximumFractionDigits: 2}
                       const formattedNumber1 = Intl.NumberFormat("en-US",option).format(number);
                       return <div>{formattedNumber1}</div>
                      }
                    })}
                  </td>
                </tr>
            </table>
            
                          {Object.keys(addUpItem2).map((id) => {   
                           if(heading.nameOfOffice === id){
                            let totalWork = 0;
                             <div>
                             {Object.keys(addUpItem[id]).map((property) => {
                             const workTotal =  [addUpItem[id][property] * addUpItem2[id][property]]
                             workTotal.forEach(el => totalWork += el); 
                     
                            })}
                            </div>
                            const number = totalWork
                             const option = {maximumFractionDigits: 2}
                             const formattedNumber1 = Intl.NumberFormat("en-US",option).format(number);
                           
                             return <p className='sub-total'>TOTAL AMOUNT:<span>&#8358;</span>{formattedNumber1}</p>
                              }
                             
                            })}
                    
       </div>
     ) 
      })}
      </div>
     {returnBack &&  <Return returnBack = {setReturnBack}/>}
    </div>
  )
}

export default CheackSales