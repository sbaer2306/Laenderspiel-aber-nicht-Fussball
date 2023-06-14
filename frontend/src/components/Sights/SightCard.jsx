import React from 'react'
import './SightCard.css'
import { Text, Button, Input, Spinner, Box } from '@chakra-ui/react';

const SightCard = ( {title, imageURL} ) => {
  return (
    <div className='SightCard-Container'>
      <div className='Image-Container'>
        <img src={imageURL} alt=''/>
      </div>
      <div className='SightCard-Title'>
        <Text m={2} fontSize='m'>{title}</Text>
      </div>
    </div>
  )
}

export default SightCard
