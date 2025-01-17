import React from 'react'
import Button from '../../Button'
import { setSelectedBarName } from '../../../hooks/getSelectedBarName'

const GetComponent = () => {
  return (
    <div>
         <button onClick={() => setSelectedBarName(2)}>Get Component</button>
    </div>
  )
}

export default GetComponent;
