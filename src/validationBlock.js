import React from 'react'
import {STATES} from "./state";

export default function ValidationBlock({state,title}){

    const compFromState=()=>{
        if(state===STATES.none){
            return  <div>__________</div>
        }else if(state===STATES.valid){
            return <img src='/img/valid.png'/>
        }else if(state===STATES.unvalid){
            return <img src='/img/unvalid.png'/>
        }else if(state===STATES.loading){
            return <div className="lds-hourglass"></div>
        }
    }

  return  <div className='block'>
      <div>{title}</div>
        <div>
            {compFromState()}
        </div>
    </div>
}
