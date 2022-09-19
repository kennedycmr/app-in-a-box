//------------------------------------------------------
//  Members Page
//------------------------------------------------------

//Libraries
import React, {useContext, useState, useEffect} from 'react'

//Contexts
import {GetFireBaseUser, SetUserError, SetAdminError} from '../../Library/UserContexts'

//Functions
import QueryDocument from '../../Library/QueryDocument'
import WriteDocument from '../../Library/WriteDocument'

//Components
import PageResponse from '../../Components/PageResponse/PageResponse'
import AddAdministrators from './AddAdministrators'

//Images
import DeleteIcon from '../../Components/Images/Delete_Icon.svg'

//Styles
import './Administrators.css'

export default function Administrators() {

  //------------------------------------------------------
  //  useContexts
  //------------------------------------------------------

    const getContextUser = useContext(GetFireBaseUser)
    const setUserError = useContext(SetUserError)
    const setAdminError = useContext(SetAdminError)

  //------------------------------------------------------
  //  useStates
  //------------------------------------------------------

    //State used to determine current view on this page > "pending", "onload", "create", "delete",
    const [requestType, setRequestType] = useState("pending")

    //State used to store list of all admins
    const [admins, setAdmins] = useState([]);

    //State used to store list of all users
    const [users, setUsers] = useState([]);

    //State used to selected member 
    const [selectedUser, setSelectedUser] = useState();

    //Anti-lockout protection > alerts admins, if they remove their admin role!
    const [lockoutProtection, setLockoutProtection] = useState(false);

  //------------------------------------------------------
  //  Functions
  //------------------------------------------------------

    //Controls the traversal to the delete page
    //Required additional logic to prevent lockout
    function GoToDeletePage(user){

      //Check on null
      if(user.uid === undefined) return

      //Anti-lockout protection
      if (user.uid === getContextUser.uid){
        setLockoutProtection(true)
      }
      else{
        setLockoutProtection(false)
      }

      //Save user and change request type
      setSelectedUser(user)
      setRequestType("delete")
    }

    //Handles the disabling isAdmin role in 'users' collection  
    function DeleteAdminRole(user){

      if (user.uid === undefined) return

      const document = {
        "roles": {
          "isAdmin": false
        }
      }
      WriteDocument('users', user.uid, document, true)
      .then(() =>{

        //User has decided to remove their admin role
        //We need to reload to refresh the routes
        if(lockoutProtection){
          window.location.reload()
        }
        setRequestType("pending")
      })
      .catch((error) =>{
        setRequestType('failed')
        setAdminError(`WriteDocument failed in Users.js, error ${error}`)
        setUserError("Failed to update user record.")
      })
    }

  //------------------------------------------------------
  //  useEffects
  //------------------------------------------------------

    //When requestType changes
    useEffect(() => {

      if(requestType === "pending"){

        //Find Admins
        QueryDocument("users", "roles.isAdmin", "==", true).then((results) =>{
          setAdmins(results)

          //Find Users
          return QueryDocument("users", "roles.isAdmin", "==", false).then((results) =>{
            const arrayOfUsers = []
            results.forEach((object) =>{
              arrayOfUsers.push(object.uid)
            })
            setUsers(arrayOfUsers)
            setRequestType("onload")
          })
        })
        .catch((error) =>{
          setRequestType('failed')
          setAdminError(`QueryDocument failed in Users.js, error ${error}`)
          setUserError("Failed to find administrators.")
        })
      }
      
    // eslint-disable-next-line 
    },[requestType])

  //------------------------------------------------------
  //  Return HTML
  //------------------------------------------------------

  return (
    <PageResponse
      requestType={requestType}
      pageOnload={[
        <div>
          {admins.length > 0 ? 
            (
              //If users found > return list of users
              <div className="Table-Container">
                <table width="100%">
                  <colgroup>
                      <col span="1" style={{width: "20%"}}></col>
                      <col span="1" style={{width: "60%"}}></col>
                      <col span="1" style={{width: "20%"}}></col>
                  </colgroup>
                  <tbody>
                      <tr>
                          <th className="Table-th">User</th>
                          <th className="Table-th">Company</th>
                          <th className="Table-th">
                            <button className="Primary-Button" style={{float: "right", marginRight: "0px"}} onClick={() => setRequestType("create")}>
                              Add
                            </button>
                          </th>
                      </tr>
                      {
                          admins.map(object => (
                          <tr key={object.uid}>
                              <td className="Table-td">{object.emailaddress}</td>
                              <td className="Table-td">{object.company}</td>
                              <td className="Table-td" style={{textAlign: "right"}}>
                                <img className="Users-Onload-Delete-Img" src={DeleteIcon} alt="Delete-Img" onClick={() => GoToDeletePage(object)}></img>
                              </td>
                          </tr>
                          ))
                      }
                  </tbody>
                </table>
              </div>
            ) :
            (
              // Else > return message
              <div style={{margin: "2%"}}>
                No users found.
              </div>
            )
          }
        </div>
      ]}
      pageCreate={[
          <AddAdministrators
          setRequestType={setRequestType}
          users={users}
          ></AddAdministrators>
      ]}
      pageDelete={[
        <div className='Users-Delete-Container'>

          {/* Title */}
          <div className='Users-Delete-Title'>
            <div className="alert alert-warning" role="alert">
              Do you want to remove administrator permissions for <strong>{selectedUser?.emailaddress}</strong>?
            </div>
          </div>

          {/* Anti-Lockout alert */}
          <div className='Users-Delete-Footer' hidden={!lockoutProtection}>
            <div className="alert alert-danger" role="alert">
                You are about to be <strong>locked out</strong> of the administrators portal!
                <div style={{padding: "10px"}}>
                  <strong>Proceed with caution!</strong>
                </div>
            </div>
          </div>

          {/* Confirm or deny buttons */}
          <div className='Users-Delete-Buttons'>
            <button className="Primary-Button" style={{float: "right"}} onClick={() => DeleteAdminRole(selectedUser)}>
              Confirm
            </button>
            <button className="Secondary-Button" style={{float: "right"}} onClick={() => setRequestType("pending")}>
              Cancel
            </button>
          </div>

        </div>
      ]}
    ></PageResponse>
  )
}