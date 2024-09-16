import React,{useState,useEffect} from 'react'
import axios from 'axios';
import "../BarMan/BarManPage.css"
import SendToWaitress from './SendToWaitress';
function BarManPage() {
  const data = localStorage.getItem("sections");
  const [sectionShare,setSectionShare] = useState([])
  const [getRemender,setGetRemender] = useState([])
  const [getWaitress,setgetWaitress] = useState([])
  const [waiterssPage,setWaiterssPage] = useState(false)
  useEffect(() => {
   axios.get(`http://localhost:3004/officeId/${data}`,{
    headers:{ 
        accessToken:localStorage.getItem("section-token")
      }
   }).then((response) => {
     setSectionShare(response.data)
   })
   axios.get(`http://localhost:3004/getBarRemender/${data}`).then((response) => {
    setGetRemender(response.data) 
   })
   axios.get(`http://localhost:3004/allWaitress/${data}`).then((response) => {
    setgetWaitress(response.data)
   })
  },[])

  const result  = sectionShare.filter((v,i,a) => a.findIndex(t => (t.nameOfDrinks === v.nameOfDrinks)) === i);
  
  const result2 = Object.values(sectionShare.reduce((c,{nameOfDrinks,create}) => {
    c[nameOfDrinks] = c[nameOfDrinks] || {nameOfDrinks,create:0}
    c[nameOfDrinks].create += parseInt(create)
    return c
  },{}))
  const result3 = Object.values(sectionShare.reduce((c,{nameOfDrinks,numbersOfBottles}) => {
    c[nameOfDrinks] = c[nameOfDrinks] || {nameOfDrinks,numbersOfBottles:0}
    c[nameOfDrinks].numbersOfBottles += parseInt(numbersOfBottles)
    return c
  },{}))
  const sendItemTo = (id) => {
   localStorage.setItem("waitressId",JSON.stringify(id))
  }
  return (
    <div className='shareItem'>
        <div className='left-side'>
            <table className='shareTable'>
                <tr>
                    <th>Names of Item</th>
                    <th>Create</th>
                    <th>Numbers of Drinks</th>
                    <th>Date</th>
                    <th>Time</th>
                </tr>
                <tr>
                    <td>{sectionShare.map((val) => { return <div>{val.nameOfDrinks}</div>})}</td>
                    <td>{sectionShare.map((val) => { return <div>{val.create}</div>})}</td>
                    <td>{sectionShare.map((val) => { return <div>{val.numbersOfBottles}</div>})}</td>
                    <td>{sectionShare.map((val) => {
                       const dateGiveItem = new Date(val.createdAt);
                       const getDate = dateGiveItem.toLocaleTimeString()
                        return <div>{getDate}</div>})}
                  </td>
                  <td>{sectionShare.map((val) => {
                       const dateGiveItem = new Date(val.createdAt);
                       const getDate = dateGiveItem.toLocaleDateString()
                        return <div>{getDate}</div>})}
                  </td>
                </tr>
            </table>
         <div className='item-list'>
         <ul className='list-item'>
              {getWaitress.map((waitressMap) => {
               return <li className='sendTo' 
               onClick={() => (sendItemTo(waitressMap),setWaiterssPage(!waiterssPage))}>
               {waitressMap.UserName}</li>
            })} 
         </ul>
         </div>
        </div>
        <div className='right-side'>
         <div className='right-side-container'>
         <div className='down-left-side'>
                <table className='totalTables'>
                    <tr>
                        <th>Names of Item</th>
                        <th>Total Creates</th>
                        <th>Total Bottles</th>
                    </tr>
                    <tr>
                        <td>{result.map((myResult) => {return <div>{myResult.nameOfDrinks}</div>})}</td>
                        <td>{result2.map((myResult) => {return <div>{myResult.create}</div>})}</td>
                        <td>{result3.map((myResult) => {return <div>{myResult.numbersOfBottles}</div>})}</td>
                    </tr>
                </table>
            </div>
            <div className='down-right-side'>
                <table className='table-remainder'>
                    <tr>
                        <th>Names of Item</th>
                        <th>Remainder</th>
                    </tr>
                    <tr>
                    <td>{getRemender.map((myResult) => {return <div>{myResult.nameOfDrinks}</div>})}</td>
                    <td>{getRemender.map((myResult) => {return <div>{myResult.numbersOfBottles}</div>})}</td>
                    </tr>
                </table>
            </div>
         </div>
        </div>
       {waiterssPage && <SendToWaitress waiterssPage = {setWaiterssPage}/>}
    </div>
  )
}

export default BarManPage