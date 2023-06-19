import React, { useState, useEffect } from 'react'
import '../css/FirstRound.css'
import { Box, Button, Center, Text, Input, Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  SliderMark,Tooltip,
useToast } from '@chakra-ui/react';
import { FaQuestionCircle, FaSpinner, FaCheck } from 'react-icons/fa';

export const Facts = ({title, solution, tip, updateAnswer}) => {
  const toast = useToast();
    
    const [isPopulation, setIsPopulation] = useState(false)
    const [sliderValue, setSliderValue] = useState(0)
    const [isArea, setIsArea] = useState(false)
    const [area, setArea] = useState(0)
    const [showTooltip, setShowTooltip] = useState(false)
    const [maxTriesReached, setMaxTriesReached] = useState(false)
    const [correct, setCorrect] = useState(false)
    const [solutionInput, setSolutionInput] = useState("")
    const [answerObj, setAnswerObj] = useState({question_keyword: title, answer: "", tries: 0})
    
    //userNote (maybe toast)
    const [message, setMessage] = useState("")
    //data
    const [input, setInput] = useState("")
    const [tries, setTries] = useState(0)

    const showToastMessage = (title, description, status) => {
      toast({
        title: title,
        description: description,
        status: status,
        duration: 3000,
        isClosable: true,
        position: "bottom-left",
        variant: "left-accent"
      });
    };

    useEffect(() => {
      console.log(`${title}:  with solution: ${solution}`);
      setSolutionInput(solution.toString().toLowerCase())
      if(tip){
        setInput(solution);
        setMessage("Tipp")
      }
      if(title.toLowerCase() == 'population'){
        setIsPopulation(true);
        if(tip) setSliderValue(solution)
        else setSliderValue(38*solution/100);
      }
      if(title.toLowerCase() == 'area'){
        setIsArea(true)
        if(tip) setArea(solution);
        else setArea(63*solution/100)
      } 
    },[title])

    const testValue = () => {
      if(input == "" && !isPopulation && !isArea) return;
      compareSolution()
      setTries(prevTries =>{
        const newTries = prevTries + 1
        if(newTries == 3) setMaxTriesReached(true)
        return newTries
      })
    }

    const compareSolution = () => {
      if(tries === 3) return;
      if(isPopulation){
        return compareNumberSolution(sliderValue);
      }
      if(isArea){
        return compareNumberSolution(area);
      }
      if(input.trim() == solutionInput){ 
        showToastMessage("Correct", "", "success");
        return setCorrect(true);
      }
      showToastMessage("Wrong", "", "error");
    }

    const compareNumberSolution = (value) => {
      const upperEnd = solution * 1.1
      const lowerEnd = solution * 0.9
      if(lowerEnd < value && value < upperEnd){
        showToastMessage("Correct", "", "success");
        return setCorrect(true)
      }
      if (upperEnd < value) {
        showToastMessage("Wrong", "Too much", "error");
        return;
      }
      if (lowerEnd > value) {
        showToastMessage("Wrong", "Too low", "error");
        return;
      }
    }

    useEffect(() => {
      if(tries != 0){
        const answer = {
          question_keyword: title,
          answer: isPopulation ? sliderValue : isArea ? area : input,
          tries: tries
        }
        setAnswerObj(answer);
      } 
    },[tries])

    useEffect(() => {
      if(tries != 0) updateAnswer(answerObj, correct)
    },[answerObj])

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
              min={28*solution/100}
              max={169*solution/100}
              onChange={(v) => setSliderValue(v)}
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
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
                label={`${sliderValue.toLocaleString(undefined, {maximumFractionDigits: 0})}`}
              >
                <SliderThumb />
              </Tooltip>
              
            </Slider>
          : isArea?
          <Slider 
              id='slider' 
              aria-label='slider-ex-1'
              value={maxTriesReached ? solution : area}
              min={43*solution/100}
              max={179*solution/100}
              onChange={(a) => setArea(a)}
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              onChangeEnd={(val) =>console.log("areaval: ", val)}
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
                label={`${area.toLocaleString()} Kilometer`}
              >
                <SliderThumb />
              </Tooltip>
              
            </Slider>
          :tip ?
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
                value={input.charAt(0).toUpperCase()+input.slice(1)}
                onChange={(e) => setInput(e.target.value.toLowerCase())}
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
