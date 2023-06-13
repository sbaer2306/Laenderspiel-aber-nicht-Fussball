import React, { useState, useEffect } from 'react'
import '../css/FirstRound.css'
import { Box, Button, Center, Text, Input, Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  SliderMark,Tooltip } from '@chakra-ui/react';
import { FaQuestionCircle, FaSpinner, FaCheck } from 'react-icons/fa';

export const Facts = ({title, solution}) => {
    const [input, setInput] = useState("")
    const [isPopulation, setIsPopulation] = useState(false)
    const [sliderValue, setSliderValue] = useState(50000000)
    const [showTooltip, setShowTooltip] = useState(false)
    const [message, setMessage] = useState("")

    useEffect(() => {
      if(title.toLowerCase() == 'population'){
        setIsPopulation(true);
        setSliderValue(38*solution/100);
      }else{
        setIsPopulation(false)
      }
    },[title])

    const testValue = () => {
      if(isPopulation){
        return comparePopulation()
      }
    }

    const comparePopulation = () => {
      if(solution == sliderValue) return alert("richtig") 
      if(solution < sliderValue) return alert("zu viel")
      if(solution > sliderValue) return alert("zu wenig")
    }
  return (
    <div className='container_fact_component'>
        <Text mb={1} fontSize='2xl' textAlign="center">
          {title}
        </Text>
        <div className='textfield_container_fact rounded_shadow'>
          <div className='inputContainer'>
          {
            isPopulation ? 
            <Slider 
              id='slider' 
              aria-label='slider-ex-1'
              value={sliderValue}
              min={0}
              max={100000000}
              onChange={(v) => setSliderValue(v)}
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              onChangeEnd={(val) =>console.log("sliderval: ", val)}
            >
              <SliderTrack>
                <SliderFilledTrack />
              </SliderTrack>
              <Tooltip 
                hasArrow
                bg='teal.500'
                color='white'
                placement='top'
                isOpen={showTooltip}
                label={sliderValue}
              >
                <SliderThumb />
              </Tooltip>
              
            </Slider>
          :
            <Input 
                variant='outline'
                borderWidth='1px'
                borderColor='black'
                value={input}
                onChange={(e) => setInput(e.target.value)}
            />
          }
            
          </div>
          <div className='testButtonContainer'>
            <Button
              leftIcon={<FaQuestionCircle />}
              colorScheme="green"
              variant="outline"
              width="100%"
              onClick={testValue}
            />
          </div>
            
        </div>
        <Text mb={1} fontSize='m' textAlign="center">
            {message}
        </Text>
    </div>
  )
}
