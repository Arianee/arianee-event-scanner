import React from 'react'

export default function Loader({title}){
    return <div className='d-flex justify-content-center flex-column align-items-center'>
        <div className="lds-hourglass"></div>
        <div>{title}</div>
    </div>
}
