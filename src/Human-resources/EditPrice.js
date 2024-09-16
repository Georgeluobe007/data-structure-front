import React from 'react'
import * as yup from 'yup'
import {yupResolver} from '@hookform/resolvers/yup'
import {useForm} from 'react-hook-form'
import axios from 'axios'
import {useMutation} from "@tanstack/react-query"
import '../Human-resources/EditPrice.css'
import {Link} from 'react-router-dom'
function EditPrice({edit}) {
    const schema = yup.object().shape({
        newAmount: yup.number().required("name of tab is needed"),
    })
    const {handleSubmit,register,formState:{errors}} = useForm({
        resolver:yupResolver(schema)
      })
     const editPriceData = localStorage.getItem("EditPrice")
     const mutationFn = (data) => {
        const response = axios.put(`http://localhost:3004/editPrice/${editPriceData}`,data);
         return response;
      }
      const mutation = useMutation({
        mutationKey: ["editPrice"],
        mutationFn: mutationFn,
        onError: (error) => {
         return error
        },
        onSuccess:(res) => {
         return res
        }
      })
    
      const submit = (data) => {
        const newAmount = data.newAmount
       const changePrice = {newPrice:newAmount}
       mutation.mutate(changePrice)
      }

  return (
    <div className='editAmountComponent'>
  
        <div className='formEditComponent'>
        {mutation.isPending ? ("....loading"):(<>
          {mutation.error ? (<>{mutation.error}</>): null
          }
        </>)}
       <p className='muatation-message'> {mutation.isSuccess ?  "You have changed price for the item":null}</p>
        <form className='ourForm' onSubmit={handleSubmit(submit)}>
            <div className='input-submit'>
            <input type="number" className='priceInput' {...register("newAmount")}/>
            <input type="submit" className='Change-btn'/>
            </div>
           
            {errors.newAmount && <p>please put in number(s)</p>}
        </form>
      
        <p onClick={() => edit(false)} className='backTo'>BACK</p>
        </div>
    </div>
  
  )
}

export default EditPrice