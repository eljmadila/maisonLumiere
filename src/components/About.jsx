import React from 'react'
import Aboutcard from './Aboutcard'

function About() {
  return (
    <div className='about-content'>
        <Aboutcard title={"Restful rooms"} description={"Linen sheets, dim brass sconces, and space to breathe."}/>
        <Aboutcard title={"Effortless booking"} description={"Reserve in seconds. Modify or cancel from your dashboard."}/>
        <Aboutcard title={"Warm reception"} description={"24-hour front desk and staff who remember your name."}/>
    </div>
  )
}

export default About