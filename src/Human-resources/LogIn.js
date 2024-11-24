import React,{useState,useContext} from 'react'
import '../Human-resources/LogIn.css'
import {ContextAuth} from '../Components/ContextApi'
import * as yup from 'yup'
import {yupResolver} from "@hookform/resolvers/yup"
import {useMutation} from '@tanstack/react-query'
import {useForm} from 'react-hook-form'
import axios from "axios"
import {useNavigate} from 'react-router-dom'
function LogIn() {

  const {setHr} = useContext(ContextAuth)
  const navigate = useNavigate();
  const schma = yup.object().shape({
    userName: yup.string().required("please put your user name"),
    password: yup.string().required("please put in password field")
  })
  const {handleSubmit,register,formState:{errors}} = useForm({
    resolver:yupResolver(schma)
  })
  const mutationFn = (data) => {
    const response = axios.post("http://192.168.67.253:3004/humanresouces",data);
    return response;
  }
  const mutation = useMutation({
    mutationKey:["mutationKey"],
    mutationFn:mutationFn,
    onError: (data) => {
      return data
    },
    onSuccess:(response) => {
     navigate("/statistics");
     localStorage.setItem("humanresocesId",response.data.id)   
       localStorage.setItem("token",response.data.token) 
      setHr({username:response.data.userName,id:response.data.id,status:true})
    
    }
  })
  const submit = (data) => {
    mutation.mutate(data)
  }
  return (
    <div className='containe-div'>
        <div className='container'>
        {mutation.isPending ? ("....loading"):(<>
      {mutation.error ? (<>{mutation.error.response.data.message}</>): null
      
      }
        </>)}
        {mutation.isSuccess ?  "you have successfully logged in":null}
            <p className='warning-message'>Only the HR is allowed to log In here</p>
        <form onSubmit={handleSubmit(submit)}>
            <div>
            <label>User Name:</label>
            <input type="text" className='input-user' {...register("userName")}/>
            </div>
            <div className='pass-div'>
            <label>Password:</label>
            <input type="password" className='input-password' {...register("password")}/>
            </div>
            <div className='pass-div'>
            <input type="submit" className='btn-submit'/>
            </div>
            {errors.userName && <p>{errors.userName.message}</p>}
            {errors.password && <p>{errors.password.message}</p>}
        </form>
        </div>
    </div>
  )
}

export default LogIn