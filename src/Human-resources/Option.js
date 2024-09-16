import React from 'react'
import "../Human-resources/Options.css"
import {useNavigate} from 'react-router-dom'
import {useMutation} from '@tanstack/react-query'
import axios from 'axios'
function Option({option}) {

    const singleId = localStorage.getItem("singleId")
    const mutationFn = (data) => {
        const response = axios.delete(`http://localhost:3004/code/removerStaff/${data}`)
        return response
    }
    const mutation = useMutation({
        mutationKey:["optionMutation"],
        mutationFn: mutationFn,
        onError: (error) => {
            return error
          },
          onSuccess: (res) => {
            window.location.reload()
          return res
          }
        })
    const removeStaff = (id) => {
      mutation.mutate(id)
    }

    const navigate = useNavigate()
    const moveTosingleFile = () => {
        navigate("/singleStaff");
    }

  return ( 
    <div onClick={() => option(true)} className="shape">
         {mutation.isPending ? ("....loading"):(<>
           {mutation.isError ? (<>A network error could have occur please try again</>): null} </>)}
           {mutation.isSuccess ?  "you have successfully deleted staff account":null}
        <div className='shap-options'>
            <div className='buttons'>
                <button className='go-file' onClick={moveTosingleFile}>Go to this person's file</button>
                <button className='remove-data'onClick={() => removeStaff(singleId)}>Remove this personfrom data-base</button>
            </div>
        </div>
    </div>
  )
}

export default Option