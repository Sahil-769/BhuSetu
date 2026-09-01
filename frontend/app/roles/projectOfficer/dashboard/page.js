import React from 'react'
import { Header } from '../../../component/layout/index'
import './page.css'
import {KPI,Gis,MyProjects,NewProjects,RecentActivity} from './index'
const page = () => {
  return (
    <>
    <Header title="Dashboard" />
    <div className='mx-4 my-5 flex flex-col gap-3'>
      <div className='grid grid-cols-1 gap-5 min-[425px]:grid-cols-2 md:grid-cols-4 md:gap-8'>
        <KPI title="Total Project" value="54"/>
        <KPI title="Under Acquisition" value="14"/>
        <KPI title="Completed" value="48"/>
        <KPI title="High Risk" value="12"/>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-2 md:gap-3'>
        <div className="card">
          <h1 className='heading'>My Projects</h1>
          <MyProjects/>
          </div>
        <div className="card">
          <h1 className='heading'>GIS</h1>
          <Gis/>
          </div>
        <div className="card"><h1 className='heading'>New Projects</h1><NewProjects/></div>
        <div className="card"><h1 className='heading'>Recent Activity</h1><RecentActivity/></div>
      </div>
      </div>
    </>
  )
}

export default page