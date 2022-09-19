//================================================================
//  Component: Example of component
//================================================================

//  Purpose: This is the standard for creating a component

//  Properties:
//    - name = {A string, this is the persons name}
//    - message = {A string, a short message}

//  Example:
//    <Example
//      name={"Mark Bennett"}
//      message={"stop breaking stuff!"}
//    ></Example>    

//================================================================


//Libraries
import React from 'react'

//Contexts

//Components

//Functions

//Images

//CSS
import './Example.css'


export default function Example(props) {

  //------------------------------------------------------
  //  Extract Props
  //------------------------------------------------------

    const name = props.name
    const message = props.message

  //------------------------------------------------------
  //  useContexts
  //------------------------------------------------------
  
    

  //------------------------------------------------------
  //  useStates
  //------------------------------------------------------

    

  //------------------------------------------------------
  //  Functions
  //------------------------------------------------------



  //------------------------------------------------------
  //  useEffects
  //------------------------------------------------------

    

  //------------------------------------------------------
  //  HTML
  //------------------------------------------------------

  return (
    <div>
        Hi {name}, {message}
    </div>
  )
}
