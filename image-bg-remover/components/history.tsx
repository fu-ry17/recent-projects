import React from 'react'
import Heading from './ui/heading'
import { Separator } from './ui/separator'
import HistoryImages from './ui/history-images'

const History = () => {
  return (
    <div>
       <Heading title='History' description='Manage Removed bg images history' />
       <Separator />
       <HistoryImages />
    </div>
  )
}

export default History