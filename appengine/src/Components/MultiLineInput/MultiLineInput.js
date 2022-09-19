//================================================================
//  Component: Multi Line Input
//================================================================

//  Purpose: Creates an array of strings based off the users input

//  Properties:
//    - name = {string, name the field so you can find it in the forms value in the on submit event}
//    - setPlaceHolder = {string, text you would like to display}
//    - setDefaultValue= {string, text you would like to display}
//    - required = {boolen, is this field required?}
//    - disabled = {boolen, is this field editabled?}

//  Example:
//    <MultiLineInput
//      name={'textarea1'}
//      setPlaceHolder={'yay'}
//      setDefaultValue={'bob'}
//      required={true}
//      disabled={true}
//    ></MultiLineInput>    

//================================================================


//Libraries
import React, {useEffect, useState} from 'react'

//Contexts

//Components

//Functions

//Images

//CSS
import './MultiLineInput.css'


export default function MultiLineInput(props) {

  //------------------------------------------------------
  //  Extract Props
  //------------------------------------------------------

    const name = props.name
    const setPlaceHolder = props.setPlaceHolder
    const setDefaultValue = props.setDefaultValue
    const required = props.required
    let setDisabled = props.setDisabled
    if (setDisabled === undefined){

      setDisabled = false;

    }

  //------------------------------------------------------
  //  useStates
  //------------------------------------------------------

    const [style, setStyle] = useState('MultiLineInput-Container');

  //------------------------------------------------------
  //  Handle readonly or edit type
  //------------------------------------------------------

    useEffect(()=>{

      if(setDisabled === true){
        setStyle('MultiLineInput-Container-Read');
      }

    }, [setDisabled])

  //------------------------------------------------------
  //  HTML
  //------------------------------------------------------

  return (
    <textarea
      name={name}
      required={required}
      className={style}
      placeholder={setPlaceHolder}
      defaultValue={setDefaultValue}
      disabled={setDisabled}
    ></textarea>
  )
}
