import React,{useState} from 'react'
import '../Human-resources/RegisterStaff.css'
import * as yup from 'yup'
import {yupResolver} from '@hookform/resolvers/yup'
import {useForm} from 'react-hook-form'
import axios from 'axios'
import {useMutation} from "@tanstack/react-query"
function RegisterStaff() {
    const [profileImage,setProfileImage] = useState('./dataPhoto/camera.jpg');
  const imageHandler  = (e) => {
    const fileReader = new FileReader();
    fileReader.onloadend = () => {
        if(fileReader.readyState === 2){
            setProfileImage(fileReader.result)
        }
    }
    fileReader.readAsDataURL(e.target.files[0]);
  }
  const schma = yup.object().shape({
    surName: yup.string().required("please fill in your surname"),
    name: yup.string().required("please fill your name"),
    age: yup.number().required("age field is needed"),
    addTab: yup.string().required("age field is needed"),
    passwordTab: yup.string().required("age field is needed"),
    salary: yup.number().required("salary field is needed"),
      file: yup.mixed().test("fileSize", "please profile image is needed", value => {
      return value && value.length;
      }),
 })


const {handleSubmit,register,formState:{errors}} = useForm({
   resolver:yupResolver(schma) 
})
 const formData = new FormData();
 formData.append("file",profileImage);
 formData.append('upload_preset',  'ulkg70ud')


const mutationFn = (data) => {
  const response = axios.post("http://localhost:3004/code/staffInfo",data,{
    headers:{
      accessToken1:localStorage.getItem("token")
    }
  }); 
  return response;
}
const mutation = useMutation({
  mutationKey:["mutationKey"],
  mutationFn:mutationFn,
  onError: (error) => {
   return error
  },
  onSuccess:(response) => {
  return response
  }
})
const submit = (data) => {
  axios.post("https://api.cloudinary.com/v1_1/georgecancode/image/upload",formData).then((response) => {
  const fileName = response.data.public_id;
  const staffData = {
    name:data.name,
    surname:data.surName,
    age:data.age,
    salary:data.salary,
    sex:data.sex,
    photo:fileName
     }
     mutation.mutate(staffData)
 })
}
return (
    
    <div className='register'>
         {mutation.isPending ? ("....loading"):(<>
      {mutation.error ? (<>{mutation.error.response.data.message}</>): null
      
      }
        </>)} 
        {mutation.isSuccess ?  "you have successfully registered this staff":null}
      <form className='reg-form' onSubmit={handleSubmit(submit)} >
        <div  onChange={imageHandler} className='circle' >
        <input type="file" id='profile-pix' className='profile-pix' {...register("file")}/>
        <label htmlFor='profile-pix' > 
        <img src={profileImage} className='camera' />
        </label>
        </div>
     
           <div className='twoFace'>
            <div className='left'>
            <div className='surname-name'>SurName:</div>
            <div className='name'>Name:</div>
            </div>

           <div className='right'>
           <input  type="text" className="surname" {...register("surName")}/>
            <input type="text" className="surname" {...register("name")}/>
            </div>
         </div>

     <div className='sexAgeSalary'>
         <div className='div-age'>
            <label className='label-age'>Age:</label>
            <input className='age' type="number"  {...register('age')}/>
           
        </div>
        <div className='sex-div'>
            <label className='sex-label'>Sex:</label>
            <select className='sex' {...register('sex')} >
           
            <option>Male</option>
            <option>Female</option>
            </select>
        </div>
        <div className='salary-div'>
            <label>Salary:</label>
            <input type="number" className='salary' {...register("salary")} />
            
        </div>
         </div>
         <input type="submit" className="btn"/>
         {errors.file && <p>{errors.file.message}</p>}
         {errors.name && <p>{errors.name.message}</p>}
         {errors.surName && <p>{errors.surName.message}</p>}
         {errors.age && <p>Please tell us your age</p>}
        
         {errors.salary && <p>Please fill in the salary field</p>}
      </form>
     </div>
  )
}

export default RegisterStaff