import React from 'react'
import {STATES} from "../pages/state";
import Loader from "./Loader";

export default function ValidationBlock({state,title}){

    const compFromState=()=>{
        if(state===STATES.none){
            return  <div></div>
        }else if(state===STATES.valid){
            return <img src='/img/valid.png'/>
        }else if(state===STATES.unvalid){
            return <img src='/img/unvalid.png'/>
        }else if(state===STATES.loading){
          return <Loader />

        }
    }

  return  <div className='row validation-block'>
      <div className='col-8'>{title}</div>
        <div className='col-4  d-flex justify-content-center  align-items-center'>
            <div className="d-flex justify-content-center  align-items-center validation-block--result">
                {compFromState()}
            </div>
        </div>
    </div>
}
