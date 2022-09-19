
//=====================================================
//  Component: Page Response 
//  Description: Displays location details
//=====================================================

//  Properties:
//    - requestType = {useState used to determine current page view}
//    - pageOnload = {HTML content display when page is first loaded}
//    - pageView = {HTML content display when page request type is 'view'}
//    - pageCreate = {HTML content display when page request type is 'create'}
//    - pageDelete = {HTML content display when page request type is 'delete'}

//  Example:
//    <PageResponse
//      requestType={requestType}
//      pageOnload={[
//        <div>
//        </div>
//      ]}
//      pageView={[
//        <MapView
//          location={locations[Object.keys(locations).find(key => locations[key] === selectedLocation)]}
//          formStatus={requestType}
//        ></MapView>
//      ]}
//      pageCreate={[
//        <CreateBooking
//          locations={locations}
//          selectedLocation={selectedLocation}
//          setRequestType={setRequestType}
//        ></CreateBooking>        
//      ]}
//    ></PageResponse>

//=====================================================


//Libraries
import React, {useEffect} from 'react';

//Components
import ErrorHandler from '../ErrorHandler/ErrorHandler'

//Images
import LoadingIcon from '../Images/Loading_Ripple.svg'

//CSS
import './PageResponse.css'

function PageResponse(props){

  //------------------------------------------------------
  //  Extract props 
  //------------------------------------------------------
  
    var requestType = props.requestType
    var pageOnload = props.pageOnload
    var pageView = props.pageView
    var pageCreate = props.pageCreate
    var pageEdit = props.pageEdit
    var pageDelete = props.pageDelete

  //------------------------------------------------------
  //  useEffects
  //------------------------------------------------------

    //Load the page whenever the requestType changes 
    useEffect(() => {
      //Auto-scrolls to the top
      window.scrollTo(0, 0)

    },[requestType])

  //------------------------------------------------------
  //  Returned HTML
  //------------------------------------------------------

    //------------------------------------------------------
    //  requestType === "pending"
    //------------------------------------------------------

    if(requestType === 'pending'){
      return (
        <div className="PageResponse-Container">
          <img alt="loading-circle-icon" src={LoadingIcon}></img>
            <p className='Pending'>Please wait while we process your request.</p>
        </div>
      )
    }

    //------------------------------------------------------
    //  requestType === "onload"
    //------------------------------------------------------

      else if(requestType === 'onload'){
        return (
          <div className="PageResponse-Container">
            {pageOnload}
          </div>
        )
      }

    //------------------------------------------------------
    //  requestType === "view"
    //------------------------------------------------------

      else if(requestType === 'view'){
        return (
          <div className="PageResponse-Container">
            {pageView}
          </div>
        )
      }
    
    //------------------------------------------------------
    //  requestType === "create"
    //------------------------------------------------------

      else if(requestType === 'create'){
        return (
          <div className="PageResponse-Container">
            {pageCreate}
          </div>
        )
      }

    //------------------------------------------------------
    //  requestType === "edit"
    //------------------------------------------------------

      else if(requestType === 'edit'){
        return (
          <div className="PageResponse-Container">
            {pageEdit}
          </div>
        )
      }

    //------------------------------------------------------
    //  requestType === "delete"
    //------------------------------------------------------

      else if(requestType === 'delete'){
        return (
          <div className="PageResponse-Container">
            {pageDelete}
          </div>
        )
      }

    //------------------------------------------------------
    //  requestType === "failed"
    //------------------------------------------------------

    else if(requestType === 'failed'){
      return (
        <ErrorHandler></ErrorHandler>
      )
    }

    //------------------------------------------------------
    //  Catch-all
    //------------------------------------------------------

    else {
      return (
        <ErrorHandler></ErrorHandler>
      )
    }

  }
   

//------------------------------------------------------

export default PageResponse;