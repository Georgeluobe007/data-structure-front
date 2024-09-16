import React from 'react'
import * as yup from 'yup'
import {yupResolver} from "@hookform/resolvers/yup"
import {useMutation} from '@tanstack/react-query'
import {useForm} from 'react-hook-form'
import axios from "axios"
import {useNavigate} from 'react-router-dom'
function ChanngePasswordTab() {
    const schma = yup.object().shape({
        userName: yup.string().required("please put in your recent password"),
        password: yup.string().required("change password")
      })
      const navigate = useNavigate()
      const officeId = localStorage.getItem("tabLogIn")
      const {handleSubmit,register,formState:{errors}} = useForm({
        resolver:yupResolver(schma)
      })
      const mutationFn = (data) => {
        const response = axios.put(`http://localhost:3004/passwordChange/${officeId}`,data);
        return response;
      }
      const mutation = useMutation({
        mutationKey:["restPassOffice"],
        mutationFn:mutationFn,
        onError: (data) => {
          return data
        },
        onSuccess:(response) => {
          navigate("/frontPage");
        return response;
       }
     })
      
        const submit = (data) => {
          const userName = data.userName
          const password = data.password
          const myData = {oldPassword:userName,newPassword:password} 
          mutation.mutate(myData)
         
        }
      return (
        <div>
           <p className='warning-message'>Password Reset</p>
            {mutation.isPending ? ("....loading"):(<>
            {mutation.error ? (<>{mutation.error.response.data.message}</>): null}
            </>)}
            <form onSubmit={handleSubmit(submit)}>
                <div>
                <label>Old password:</label>
                <input type="text" className='input-user' {...register("userName")}/>
                </div>
                <div className='pass-div'>
                <label>New password:</label>
                <input type="text" className='input-password' {...register("password")}/>
                </div>
                <div className='pass-div'>
                <input type="submit" className='btn-submit'/>
                </div>
                {errors.userName && <p>{errors.userName.message}</p>}
                {errors.password && <p>{errors.password.message}</p>}
            </form>
        </div>
      )
}

export default ChanngePasswordTab