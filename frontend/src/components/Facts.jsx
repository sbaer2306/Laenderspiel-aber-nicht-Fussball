import React, { useState } from 'react'
import '../css/FirstRound.css'

export const Facts = ({title, solution}) => {
    const [input, setInput] = useState("")
  return (
    <div className='container_fact_component'>
        <p className='title_fact'>{title}</p>
        <div className='textfield_container_fact rounded_shadow'>
            <input type='text' value={input} onChange={(e) => setInput(e.target.value)}/>
            <div className='icon_container'>
                <img src='#' alt="icon"/>
            </div>
        </div>
    </div>
  )
}
