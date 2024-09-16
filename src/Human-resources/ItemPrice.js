import React,{useEffect,useState} from 'react'
import * as yup from 'yup'
import {yupResolver} from '@hookform/resolvers/yup'
import {useForm} from 'react-hook-form'
import axios from 'axios'
import {useMutation} from "@tanstack/react-query"
import '../Human-resources/ItemPrice.css'
import EditPrice from './EditPrice'
function ItemPrice() {
  const schema = yup.object().shape({
    nameOfTab: yup.string().required("Tab name id needed"),
    tabPassword: yup.string().required("Please,password field in needed"),
    })
    const {handleSubmit,register,formState:{errors}} = useForm({
    resolver:yupResolver(schema)
  })
  
  const [office,setOffice] = useState([])
  const [priceInput,setPriceInput] = useState("");
  const [addCart,setAddCart] = useState([]);
  const [addCart2,setAddCart2] = useState([]);
  const [addCart3,setAddCart3] = useState([]);
  const [getPrice,setGetPrice] = useState([]);
  const [editPrice,setEditPrice] = useState(false)
  const [regDrinks,setRegDrinks] = useState([])
  useEffect(() => {
   axios.get("http://localhost:3004/office").then((res) => {
    setOffice(res.data)
   })
   axios.get("http://localhost:3004/getItemPrice").then((res) => {
    setGetPrice(res.data)
   })
   axios.get("http://localhost:3004/getRegProduct").then((res) => {
    setRegDrinks(res.data)
   })
  },[])
  const findIndexOf = getPrice.map((indexValue) => {
    return indexValue.NameOfOffice
  })
//    const eachValue = findIndexOf.filter((val,index,num) => 
//    num.findIndex(value => (value.NameOfOffice === val.NameOfOffice) === index )
// )
 const officePriceData = localStorage.getItem("officeNamePrice") 
 const getOfficeData = JSON.parse(officePriceData)
 const nameofOfficeData = getOfficeData.officeName;
 const nameOfOfficeId = getOfficeData.id;
const officeData = localStorage.getItem("officeNamePrice3") 
const nameofDrinkeData = localStorage.getItem("officeDrinkPrice") 
const setIdex = findIndexOf.filter((v,i,n) => 
n.indexOf(v) === i);
  const mutationFn = (data) => {
    const response = axios.post(`http://localhost:3004/signWaiter/${officeData}`,data);
     return response;
  }


  const mutation = useMutation({
    mutationKey: ["sendToTab"],
    mutationFn: mutationFn,
    onError: (error) => {
     return error
    },
    onSuccess:(res) => {
      setTimeout(() => {
        document.getElementById("mutationmessage").style.display = "none"
        window.location.reload();
      },5000)
     return res
    }
  })
  const submit = (data) => {
    const tabName = data.nameOfTab;
    const tabPassword = data.tabPassword;
    const tabInfor = {userName:tabName,password:tabPassword}
    document.getElementById("reg-tab").style.display = "none"
    mutation.mutate(tabInfor)
  }
  const sendOfficeName = (id) => {
    const officeName = id;
     localStorage.setItem("officeNamePrice",JSON.stringify(officeName))
    const newSelectedRows = [addCart];
    if(newSelectedRows.includes(id.id)){
      newSelectedRows.splice(newSelectedRows.indexOf(id.id),1)
  
    }else{
      newSelectedRows.push(id.id)
      setAddCart(newSelectedRows)
     }
  }
  const sendOfficeName3 = (id) => {
    const officeName = id.id;
    console.log(id);
     localStorage.setItem("officeNamePrice3",officeName)
    const newSelectedRows = [addCart3];
    if(newSelectedRows.includes(id.id)){
      newSelectedRows.splice(newSelectedRows.indexOf(id.id),1)
  
    }else{
      newSelectedRows.push(id.id)
      setAddCart3(newSelectedRows)
     }
  }
  const sendOfficeDrink = (id) => {
    const nameOfDrink = id.ProductName;
    localStorage.setItem("officeDrinkPrice",nameOfDrink)
     const newSelectedRows = [addCart2];
    if(newSelectedRows.includes(id.id)){
      newSelectedRows.splice(newSelectedRows.indexOf(id.id),1)
       
    }else{
      newSelectedRows.push(id.id)
      setAddCart2(newSelectedRows)
     }
  }
  const mutationPrice = (data) => {
   const request = axios.post("http://localhost:3004/price",data)
   return request
  }
  const priceMutation = useMutation({
    mutationKey: ["mutationPriceKey"],
    mutationFn: mutationPrice,
    onError:(error) => {
     return error
    },
    onSuccess:(res) => {
      window.location.reload()
     return res
    }
  })
  const submitPrice = () => {
      const amount = priceInput;
      const mutattionPrice = {
      NameOfItem:nameofDrinkeData,
      NameOfOffice:nameofOfficeData,  
      AddToOfficeId:nameOfOfficeId,
      PriceOfItem: amount
     }
     priceMutation.mutate(mutattionPrice)  
  }
  const EditOurPrice = (id) => {
   localStorage.setItem("EditPrice",id)
  }
  return (
    <div className='item-price-column'>
    <div className='item-price'> 
        <div className='get-photo'>
         {setIdex.map((setIndexVal) => {
          return <div>
            <p className='differentiateName'>{setIndexVal}</p>
            <div className='gridWork'>
            {getPrice.map((associatePrice) => {
               const number = associatePrice.PriceOfItem
               const option = {maximumFractionDigits: 2}
               const formattedNumber1 = Intl.NumberFormat("en-US",option).format(number);
              if(associatePrice.NameOfOffice === setIndexVal){
                return <div className='allDiv'>
                  <div className='button-div-p-button'>
                  <button className='name-of-item'>{associatePrice.NameOfItem}</button>
                  <div className='editPrice-editButton'>
                  <p> <span>&#8358;</span> {formattedNumber1}</p>
                  <p className='EditPrice'onClick={() => (EditOurPrice(associatePrice.id),setEditPrice(!editPrice))}>Edit Price</p>
                  </div>
                  </div>
                </div>
              }
            })}
            </div>
          </div>
         })}
        </div>
        <div className='sent-photo'>
         <div className='regTab'>
          <div id='mutationmessage'>
          {mutation.isPending ? ("....loading"):(<>
          {mutation.error ? (<>{mutation.error.response.data.message}</>): null
          }
        </>)}
        {mutation.isSuccess ?  "You have registerd a tab":null}
          </div>
        <p id ='reg-tab'>Register a tab and asign it to a section here !!!</p>
         <form className='formInput' onSubmit={handleSubmit(submit)}>
            <input type="text" placeholder='Tab Name' className="inputForm"{...register("nameOfTab")}/>
            <input type="password"  placeholder='Tab Password' className="inputForm" {...register("tabPassword")}/>
            {office.map((mapOffice) => {
              const myItemExept = [mapOffice.officeName]
              const arr = myItemExept.filter(item => item !== "Barbecue")
               return <button 
                disabled={mapOffice.officeName === "Barbecue"}
                style={{backgroundColor:addCart3.includes(mapOffice.id) ? "brown":""}} 
                onClick={() => sendOfficeName3(mapOffice)} 
               className='office-button2'>
               {arr} 
               </button>
              })}
            {errors.nameOfTab && <p>{errors.nameOfTab.message}</p>}
            {errors.tabPassword && <p>{errors.tabPassword.message}</p>}
            </form>
          <p className='addAmountProduct'>Add Amount to Product here !!!</p>
          {priceMutation.isPending ? ("....loading"):(<>
          {priceMutation.error ? (<>{priceMutation.error.response.data.error}</>): null
          }
        </>)}
        {priceMutation.isSuccess ? "Price has been given":null}
          <div className='price-div' id='price-div'>
            <div className='officeName'>
              
              {office.map((mapOffice) => {
                const myItemExept = [mapOffice.officeName]
                const arr = myItemExept.filter(item => item !== "Barbecue")
               return <button 
               disabled={mapOffice.officeName === "Barbecue"}
               style={{backgroundColor:addCart.includes(mapOffice.id) ? "green":""}} 
               onClick={() => sendOfficeName(mapOffice)}
               className='office-button'>
               {arr}
               </button>
              })}
            </div>
            <div className='officeDrink'>
             {regDrinks.map((mapDrinks) => {
              console.log(mapDrinks);
              return <button  
              style={{backgroundColor:addCart2.includes(mapDrinks.id) ? "green":""}} 
              onClick={() => sendOfficeDrink(mapDrinks)}  
              className='drink-button'>
              {mapDrinks.ProductName}
              </button>
            })}
          </div>
          <div>
               <input type="number"
                className='inputfor-price'
                onChange={(e) => setPriceInput(e.target.value)}
                placeholder="add price"
                />
               <button className='form-submit-btn' onClick={ submitPrice}>Submit</button>
          
          </div>
          </div>
         </div>
        </div> 
      </div>
      {editPrice && <EditPrice edit={setEditPrice}/>}
      </div>
  )
}

export default ItemPrice