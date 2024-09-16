import React from 'react'
import "../Human-resources/RegisterProduct.css"
import * as yup from 'yup'
import {yupResolver} from "@hookform/resolvers/yup"
import {useMutation} from '@tanstack/react-query'
import {useForm} from 'react-hook-form'
import axios from "axios"

function RegisterProduct() {
  const schma = yup.object().shape({
    productName: yup.string().required("Please fill in the product name"),
    quantity: yup.number().required("please quantity required")
  })
  const {handleSubmit,register,formState:{errors}} = useForm({
    resolver:yupResolver(schma)
  })
  const mutationFn = (mutationData) => {
    const response = axios.post("http://localhost:3004/registerProduct",mutationData);
    return response
  }
  const mutation = useMutation({
    mutationKey:["productReg"],
    mutationFn: mutationFn,
    onError:(error) => {
    return error
    },
    onSuccess:(res) => {
      return res
    }
  })
  const submit = (data) => {
    const productName = data.productName
    const quantity = data.quantity
    mutation.mutate({productName:productName,quantity:quantity})
  }
  return (
    <div className='product-reg'>
             <p style={{color:"white",width:"15rem"}}>
             {mutation.isPending ? ("....loading"):(<>
             {mutation.error ? (<>{mutation.error.response.data.message}</>): null}
             </>)}
             </p>
             <p style={{color:"white"}}>{mutation.isSuccess ?  "you have successfully register a product":null}</p>
               <form onSubmit={handleSubmit(submit)}>
               <div className='reg-item'>
                <div className='label-reg'>
                <label className='labels'>Product Name:</label>
                <label className='labels'>Qnty(create):</label>
                </div>
                <div className='input-reg'>
                <input type="text" className='reg-input' {...register("productName")}/>
                <input type="number" className='reg-input-2' {...register("quantity")}/>
                </div>
                </div>
                {errors.productName && <p style={{color:"white"}}>{errors.productName.message}</p>}
                {errors.quantity && <p style={{color:"white"}}>Please fill in numbers</p>}
                <input type="submit" className='set-product-btn'/>
            </form>
    </div>
  )
}

export default RegisterProduct