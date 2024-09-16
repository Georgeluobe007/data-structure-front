import React,{useEffect,useState} from 'react'
import '../Human-resources/SingleStaff.css'
import {useMutation} from '@tanstack/react-query'
import {useForm} from "react-hook-form"
import {yupResolver} from "@hookform/resolvers/yup"
import * as yup from 'yup'
import axios from 'axios'

function Substract({minus}) {
    const staffId = localStorage.getItem("singleId")
    const schma = yup.object().shape({
        description: yup.string().required("please fill in the description box"),
        amount:yup.number().required("please put amount")
    })
    const {handleSubmit,register,formState:{errors}} = useForm({
        resolver:yupResolver(schma)
    })
    const [staffSalary,setStaffSalary] = useState({})
    const mutationFn = (data) => {
        const response = axios.post(`http://localhost:3004/singleStaffPost/${staffId}`,data)
        return response
    }
    const mutation = useMutation({
        mutationKey:["mutationKey"],
        mutationFn:mutationFn,
        onSuccess:(response) => {
          window.location.reload();
          return response
        }
      })

   

    const submit = (data) => {
       mutation.mutate(data)
    }
  return (
    <div className='description'>
           {mutation.isPending ? ("....loading"):(<>
           {mutation.isError ? (<>A network error could have occur please try again</>): null} </>)}
           {mutation.isSuccess ?  "you have successfully registered this staff":null}
        <form className='formdescription' onSubmit={handleSubmit(submit)}>
            <textarea name="" id="" cols="30" rows="5" placeholder='Please give us a reason......'{...register("description")}/>
            <input type="number" className='input-amount'{...register("amount")}/>
            <input type="submit" className='debit-btn'/>
            {errors.description && <p>{errors.description.message}</p>}
            {errors.amount && <div>Please put amount</div>}
        </form>

    </div>
  )
}

export default Substract