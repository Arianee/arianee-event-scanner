import React from 'react'

export default function Loader({title}){
    return <div className='d-flex justify-content-center flex-column align-items-center'>
        <div className="lds-circle">
            <div></div>
        </div>
        <div className='main-font'>{title}</div>
    </div>
}
