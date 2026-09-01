import React from 'react'
import './page.css'
// import { RoleDisplay } from './[role]/page'

const page = () => {
  return (
    <div className='flex flex-row flex-wrap gap-4 justify-center w-screen h-screen content-center'>
      <a href="/roles/projectOfficer/" className='boxes'>Project&nbsp;Officer</a>
      <a href="/roles/laOfficer/" className='boxes'>Land&nbsp;Acquarisation&nbsp;Officer</a>
      <a href="/roles/nodalOfficer/" className='boxes'>Nodel&nbsp;Officer</a>
      <a href="/roles/admin" className='boxes'>Admin</a>
    </div>
  )
}

export default page