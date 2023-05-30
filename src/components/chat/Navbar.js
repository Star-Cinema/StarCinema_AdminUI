import React from 'react'
import logo from '../../assets/images/logoStart1.png'

const handleReturnDashboard = () => {
  window.location = '/';
}

const Navbar = () => {

  return (
    <div className='navbar' style={{display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer'}} onClick={handleReturnDashboard}>
      {/* <span className="logo1"><img src={logo} alt="" style={{height:45}}/></span> */}
      <h4 style={{margin: 0, marginLeft: 5, color: 'white', fontSize:"28px"}}>Star Cinema</h4>
    </div>
  )
}

export default Navbar