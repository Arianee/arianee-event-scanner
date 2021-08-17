import React from 'react'
import {STATES} from "../pages/state";
import Loader from "./Loader";

export default function ValidationBlock({state}){

    const compFromState=()=>{
        if(state===STATES.none){
            return  <div className='d-flex justify-content-center'>Scan a proof of ownership qr code</div>
        }else if(state===STATES.valid){
            return <img class='validation-block--image' src='/img/valid.png'/>
        }else if(state===STATES.unvalid){
            return <img class='validation-block--image' src='/img/unvalid.png'/>
        }else if(state===STATES.loading){
          return <Loader />

        }
    }

    //
  return  <div className='d-flex flex-column justify-content-center align-items-center' style={{flex:1}}>
      {compFromState()}
    </div>
}
