//------------------------------------------------------
//  Members Page
//------------------------------------------------------

//Libraries
import React, {useContext, useState, useEffect} from 'react'

//Contexts
import {SetUserError, SetAdminError} from '../../Library/UserContexts'

//Functions
import WriteDocument from '../../Library/WriteDocument'

//Images
import SearchIcon from '../../Components/Images/Search-Icon.svg'
import ClearIcon from '../../Components/Images/Clear-Icon.svg'

//Styles
import './Administrators.css'

export default function AddAdministrators(props) {

  //------------------------------------------------------
  //  Props
  //------------------------------------------------------

    const setRequestType = props.setRequestType
    const users = props.users

  //------------------------------------------------------
  //  useContexts
  //------------------------------------------------------

    const setUserError = useContext(SetUserError)
    const setAdminError = useContext(SetAdminError)

  //------------------------------------------------------
  //  useStates & function variables
  //------------------------------------------------------

    //State used to store list of all users
    const [filteredUsers, setFilteredUsers] = useState(users);

    //State used to selected member 
    const [arrayOfSelectedUsers, setArrayOfSelectedUsers] = useState([]);

    //State used manage adding or removing users
    const [addUser, setAddUser] = useState();
    const [removeUser, setRemoveUser] = useState();

    //Handles the save button class and prevents submits
    const [saveButtonDisabled, setSaveButtonDisabled] = useState(true);

  //------------------------------------------------------
  //  Functions
  //------------------------------------------------------

    //used to search for email addresses and return the results
    const Search = e => {

        const searchValue = e.target.value;

        //Catch when the user clears the search
        if(searchValue === ""){
            setFilteredUsers(users)
            return
        }

        //Find the email address
        const results = filteredUsers.find(user => user.includes(searchValue))
        if(results === undefined){
            setFilteredUsers(["no results..."])
            return
        }
        else{
            setFilteredUsers([results])
            return
        }
    }

    //Handles the save button
    function SaveButton(){

        //Prevent empty requests
        if(arrayOfSelectedUsers.length === 0) return

        //Tracks the number of running and completed jobs
        const jobs = arrayOfSelectedUsers.length
        var completedJobs = 0
        

        //Loop through users and assign admin role
        const document = {
            "roles": {
              "isAdmin": true
            }
          }
        arrayOfSelectedUsers.forEach(emailaddress => {
            WriteDocument('users', emailaddress, document, true).then((results) =>{

              //This code ensures all jobs are completed before returning to Users.js
              completedJobs = completedJobs + 1
              if(jobs === completedJobs){
                setRequestType('pending')
              }
              
            })
            .catch((error) =>{
              setRequestType('failed')
              setAdminError(`WriteDocument failed in Users.js, error ${error}`)
              setUserError("Failed to update user record.")
            })
        })


    }

  //------------------------------------------------------
  //  useEffects
  //------------------------------------------------------

    //Add a addUser
    useEffect(() => {

        //Prevents null, "no results..." or duplicates
        if(addUser === undefined) return
        if(addUser === "no results...") return
        if (arrayOfSelectedUsers.includes(addUser)) return setAddUser(undefined)

        //Add new user to array
        const results = arrayOfSelectedUsers
        results.push(addUser)
        setArrayOfSelectedUsers(results)

        //Clear useState
        setAddUser(undefined)

      // eslint-disable-next-line 
    },[addUser])

    //Remove a user
    useEffect(() => {

        //Prevents null or duplicates
        if(removeUser === undefined) return
        if (!arrayOfSelectedUsers.includes(removeUser)) return setRemoveUser(undefined)

        //Find user in array
        const results = arrayOfSelectedUsers
        const index = results.indexOf(removeUser)

        //Remove user from array
        results.splice(index, 1)
        setArrayOfSelectedUsers(results)

        //Clear useState
        setRemoveUser(undefined)

      // eslint-disable-next-line 
    },[removeUser])

    //Toggles the save button class state
    useEffect(() => {

        //Disable save button if there is no selected users
        if(arrayOfSelectedUsers.length === 0) {
          setSaveButtonDisabled(true)
          return
        }

        //Enable save button
        if(arrayOfSelectedUsers.length > 0) {
          setSaveButtonDisabled(false)
          return
        }

      // eslint-disable-next-line 
    },[removeUser, addUser])

  //------------------------------------------------------
  //  Return HTML
  //------------------------------------------------------

    return (
        <div className='Users-Create-Container'>

            {/* Title */}
            <div className='Users-Create-Title'>
              Add Administrator(s)
            </div>

            {/* Container that created the form layout*/}
            <div className='Users-Create-Content-Container'>

                {/* Search Box */}
                <form className='Users-Create-Search' onChange={Search}> 
                    <input id="value" type="text" placeholder='Search'></input>
                    <img alt="Search-Icon" src={SearchIcon}></img>
                </form>

                {/* Available Users > People WITHOUT the admin role */}
                <div className='Users-Create-Users'>
                    <table className="Users-Create-Table" cellSpacing="10px">
                        <tbody>
                            {
                                filteredUsers.map(emailaddress => (
                                <tr key={emailaddress}>
                                    <td onClick={() => setAddUser(emailaddress)}>{emailaddress}</td>  
                                </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>

                {/* Seleted Users > People we want to ASSIGN the admin role to */}
                <div className='Users-Create-Selected'>
                    <h5 className='Users-Create-Selected-Title'>Selected Users</h5>
                    <table className="Users-Create-Table" cellSpacing="10px">
                        <tbody>
                            {
                                arrayOfSelectedUsers.map(emailaddress => (
                                <tr key={emailaddress}>
                                    <td style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                                        {emailaddress}
                                        <img alt="Clear-Icon" src={ClearIcon} onClick={() => setRemoveUser(emailaddress)}></img> 
                                    </td> 
                                </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>

                <div className='Users-Create-Buttons'>
                    <button disabled={saveButtonDisabled} className="Primary-Button" onClick={() => SaveButton()} style={{float: "right"}}>
                      Save
                    </button>
                    <button className="Secondary-Button" style={{float: "right"}} onClick={() => setRequestType("pending")}>
                      Cancel
                    </button>
                </div>
            </div>

        </div>
    )

  //------------------------------------------------------

}