import React from 'react'
import * as yup from 'yup'
import {yupResolver} from "@hookform/resolvers/yup"
import {useMutation} from '@tanstack/react-query'
import {useForm} from 'react-hook-form'
import axios from 'axios'
import {useNavigate} from 'react-router-dom'
import '../Human-resources/AddNewOffice.css'
function AddNewOffice() {

    let navigate = useNavigate()
    const schema = yup.object().shape({
     addToOffice: yup.string().required("this field is required"),
     password: yup.string().required("this field is required") 
    })
    const {handleSubmit,register,formState:{errors}} = useForm({
      resolver:yupResolver(schema)
    })
    const myMutationFn = (data) => {
    const response = axios.post("http://localhost:3004/addoffice",data,{
    headers:{
    accessToken1:localStorage.getItem("token")
    }
    });
    return response;
    }
    const mutation = useMutation({
        mutationKey:["addToOfficekey"],
        mutationFn: myMutationFn,
        onError: (data) => {
          return data.message;
        },
        onSuccess: (res) => {
          window.location.reload()
         return res.data;
        }
       })
       const submit = (data) => {
        const addtoOffice = data.addToOffice;
        const password = data.password;
        const myData = {officeName:addtoOffice,password:password}
        mutation.mutate(myData)
      }
  return (
    <div className='newSection'>
                  <p style={{color:"white"}}>
                  {mutation.isPending ? ("....loading"):(<>
                  {mutation.error ? (<>{mutation.error.response.data.message}</>): null}
                  </>)}
                  </p>
                  <p style={{color:"white"}}>{mutation.isSuccess ?  "You have added an office":null}</p>
        
        <form onSubmit={handleSubmit(submit)}>
                <div className='reg-item'>
                <div className='label-reg'>
                <label className='labels'>Section Name:</label>
                <label className='labels'>Password:</label>
                </div>
                <div className='input-reg'>
                <input  className='reg-input' type="text" {...register("addToOffice")}/>
                <input  className='reg-input' type="password" {...register("password")} />
                </div>
                </div>
               {errors.addToOffice&&<p style={{color:"white"}}>{errors.addToOffice.message}</p>}
               {errors.password&&<p style={{color:"white"}}>{errors.password.message}</p>}
               <input className='set-product-btn' type="submit"/>
      </form> 
       
    </div>
  )
}

export default AddNewOffice