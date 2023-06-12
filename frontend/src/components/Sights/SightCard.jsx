import React from 'react'
import './SightCard.css'

const SightCard = ( {title, imageURL} ) => {
  return (
    <div className='SightCard-Container'>
      <div className='Image-Container'>
        <img src={imageURL} alt=''/>
      </div>
      <div className='SightCard-Title'>
        <h3>{title}</h3>
      </div>
    </div>
  )
}

export default SightCard
