import './SingleBill.css'
import { useEffect, useState } from 'react'
import {useNavigate} from 'react-router-dom'
import axios from 'axios'
import BeforeDeleting from './BeforeDeleting'
function SingleBill() {
 const tableNameId = localStorage.getItem("tableNameId")
 const [getSingleBill,setGetSingleBill] = useState([])
 const [sureDeleting,setSureDeletion] = useState(false)
 useEffect(() => {
  axios.get(`http://localhost:3004/getIndividualBill/${tableNameId}`).then((res) => {
    setGetSingleBill(res.data)
  })
 },[])
 const navigate = useNavigate();

 const result2 = Object.values(getSingleBill.reduce((c,{NameOfItem,SubTotal}) => {
    c[NameOfItem] = c[NameOfItem] || {NameOfItem,SubTotal:0}
    c[NameOfItem].SubTotal += parseInt(SubTotal)
    return c
  },{}))
  let totalPrice = 0;
  {result2.map((value) => {
    const addUpItem = [Number(value.SubTotal)]
   return addUpItem.forEach(item => totalPrice += item)
   })}
   const number = totalPrice;
   const option = { maximumFractionDigits: 2 };
   const formattedNumber = Intl.NumberFormat("en-US",option).format(number); 
  return (
    <div className='singleBill-ui'>
        <table className='figures'>
            <tr className='table-rol'>
                <th className='table-rol'>Name of Item</th>
                <th className='table-rol'>Price of Item</th>
                <th className='table-rol'>Qnty</th>
                <th className='table-rol'>Sub Total</th>
            </tr>
            <tr>
                <td className='table-rol'>
                {getSingleBill.map((value) => {
                  return <div>{value.NameOfItem}</div>
                  })}
                </td>
                <td className='table-rol'>
                {getSingleBill.map((value) => {
                     const number = value.PriceOfItem;
                     const option = { maximumFractionDigits: 2 };
                     const formattedNumber = Intl.NumberFormat("en-US",option).format(number); 
                  return <div>{formattedNumber}</div>
                  })}
                </td>
                <td className='table-rol'>
                {getSingleBill.map((value) => {
                  return <div>{value.Count}</div>
                  })}
                </td>
                <td className='table-rol'>
                {getSingleBill.map((value) => {
                     const number = value.SubTotal;
                     const option = { maximumFractionDigits: 2 };
                     const formattedNumber = Intl.NumberFormat("en-US",option).format(number); 
                  return <div>{formattedNumber}</div>
                  })}
                </td>
             </tr>
        </table>
       <div className='price'>TOTAL AMOUNT:<span className='price'>&#8358;</span>{formattedNumber}</div>
       <div className='print-goback-remove'>
        <button onClick={() => window.location.reload()} className='btn-print-goback-remove'>Go backt</button>
        <button onClick={() => setSureDeletion(!sureDeleting)} className='btn-print-goback-remove'>Remove</button>
        <button onClick={() => window.print()} className='btn-print-goback-remove'>Print</button>
       </div>
       {sureDeleting && <BeforeDeleting sureDeleting={setSureDeletion}/>}
    </div>
  )
}

export default SingleBill