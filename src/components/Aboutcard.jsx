import React from 'react'
import '../App.css'

function Aboutcard({title , description}) {
  return (
    <div className='about-card'>
        <h3>{title}</h3>
        <p>{description}</p>
    </div>
  )
}

export default Aboutcard