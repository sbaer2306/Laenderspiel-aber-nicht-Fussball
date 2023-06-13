import React, { useState, useEffect } from 'react'
import '../css/FirstRound.css'
import { Box, Button, Center, Text, Input, Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  SliderMark,Tooltip } from '@chakra-ui/react';
import { FaQuestionCircle, FaSpinner, FaCheck } from 'react-icons/fa';

export const Facts = ({title, solution, tip, updateAnswer}) => {
    
    const [isPopulation, setIsPopulation] = useState(false)
    const [sliderValue, setSliderValue] = useState(0)
    const [showTooltip, setShowTooltip] = useState(false)
    const [maxTriesReached, setMaxTriesReached] = useState(false)
    const [correct, setCorrect] = useState(false)
    
    //userNote (maybe toast)
    const [message, setMessage] = useState("")
    //data
    const [input, setInput] = useState("")
    const [tries, setTries] = useState(0)

    useEffect(() => {
      if(tip){
        setInput(solution);
        setMessage("Tipp")
      }
      if(title.toLowerCase() == 'population'){
        setIsPopulation(true);
        if(tip) setSliderValue(solution)
        else setSliderValue(38*solution/100);
      }else{
        setIsPopulation(false)
      }
    },[title])

    const testValue = () => {
      setTries(prevTries =>{
        const newTries = prevTries + 1
        if(newTries == 3) setMaxTriesReached(true)
        return newTries
      })
      if(isPopulation){
        return comparePopulation()
      }
      const answer = {
        answer: input,
        tries: tries + 1
      }
      updateAnswer(title, answer)
    }

    const comparePopulation = () => {
      const upperEnd = solution * 1.1
      const lowerEnd = solution * 0.9
      if(lowerEnd <= sliderValue && sliderValue <= upperEnd){
        alert("richtig")
        setCorrect(true)
      }
      if(upperEnd < sliderValue)  alert("zu viel")
      if(lowerEnd > sliderValue)  alert("zu wenig")

      const answer = {
        answer: sliderValue,
        tries: tries +1
      }
      updateAnswer(title,answer)
    }
  return (
    <div className='container_fact_component rounded_shadow'>
        <Text mb={1} fontSize='2xl' textAlign="left">
          {title.charAt(0).toUpperCase()+title.slice(1)}
        </Text>
        <div className={`textfield_container_fact rounded_shadow ${correct? 'right' : tries > 0 ? 'wrong' : ""}`}>
          <div className={`inputContainer `}>
          {
            isPopulation ? 
            <Slider 
              id='slider' 
              aria-label='slider-ex-1'
              value={maxTriesReached ? solution : sliderValue}
              min={1*solution/100}
              max={169*solution/100}
              onChange={(v) => setSliderValue(v)}
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              onChangeEnd={(val) =>console.log("sliderval: ", val)}
              isReadOnly={tip || maxTriesReached}
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
                label={sliderValue.toLocaleString()}
              >
                <SliderThumb />
              </Tooltip>
              
            </Slider>
          : tip ?
          <Text mb={1} fontSize='xl' textAlign="center">
              {input}
          </Text>
          : maxTriesReached || correct ?
          <Text mb={1} fontSize='xl' textAlign="center">
              {solution}
          </Text>
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
            {
              tip || maxTriesReached || correct ?
              "":
              (
              <Button
              leftIcon={<FaQuestionCircle />}
              colorScheme="green"
              variant="outline"
              width="100%"
              onClick={testValue}
              />
              )
            }
          </div>
            
        </div>
        <Text mb={1} fontSize='m' textAlign="center">
            {message}
        </Text>
    </div>
  )
}
