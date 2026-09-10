import React from 'react'
import {Header} from '../../../component/layout/index'
import {KPI,Gis,RiskDistribution,RiskAlert,Delay,Attention,Intervention,RiskTrend} from './components/index'
const page = () => {
  return (
    <>
    <Header title="Dashboard"/>
    <div>
      <div>
        <KPI/>
      </div>
      <div className='grid grid-cols-2 '>
        <Attention/>
        <RiskDistribution/>
        <RiskTrend/>
        <Delay/>
        <Gis/>
        <RiskAlert/>
        <Intervention/>
      </div>
    </div>
    </>
  )
}

export default page