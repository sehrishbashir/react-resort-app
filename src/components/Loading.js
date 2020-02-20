import React from 'react'
import loader from '../images//gif/loading-arrow.gif'

export default function Loading() {
    return (
        <div className="loading">
            <h6>Rooms Data Loading...</h6>
            <img src={loader}/>
        </div>
    )
}
