"use client"
import { createUniqueExpenseOrderCategories, syncClientAndContactGoogleSheet, syncExpensesGoogleSheet, syncOldExpenses, syncOldOrders, syncToGoogleSheet } from '@/actions/sheet-actions'
import { Button } from '@/components/ui/button'
import { Store } from '@prisma/client'
import React, { useState } from 'react'
import toast from 'react-hot-toast'

const SyncClient = ({ store }: { store: Store }) => {
  const [loading, setLoading] = useState<boolean>(false)

  return (
    <div className='flex gap-4 flex-wrap'>
        <Button disabled={true} onClick={async()=> {
           try {
            setLoading(true)
            const { error, msg } = await createUniqueExpenseOrderCategories(store)
              if(error){
                toast.error(error)
              }else if(msg){
                toast.success(msg)
              }
           } catch (error) {
              if(error instanceof Error){
                toast.error("Something went wrong")
              }
           }finally{
              setLoading(false)
           }
        }}>
            { loading ? 'Loading...' : 'Sync Categories' }
        </Button>

        <Button  disabled={true} onClick={async()=> {
           try {
            setLoading(true)
            const { error, msg } = await syncOldExpenses(store)
              if(error){
                toast.error(error)
              }else if(msg){
                toast.success(msg)
              }
           } catch (error) {
              if(error instanceof Error){
                toast.error("Something went wrong")
              }
           }finally{
              setLoading(false)
           }
        }}>
            { loading ? 'Loading...' : ' Sync Old Expenses' }
        </Button>


        <Button  disabled={true} onClick={async()=> {
           try {
            setLoading(true)
            const { error, msg } = await syncOldOrders(store)
              if(error){
                toast.error(error)
              }else if(msg){
                toast.success(msg)
              }
           } catch (error) {
              if(error instanceof Error){
                toast.error("Something went wrong")
              }
           }finally{
              setLoading(false)
           }
        }}>
            { loading ? 'Loading...' : '   Sync Old Orders' }
        </Button>


        <Button  disabled={true} onClick={async()=> {
           try {
            setLoading(true)
            const { error, msg } = await syncToGoogleSheet(store)
              if(error){
                toast.error(error)
              }else if(msg){
                toast.success(msg)
              }
           } catch (error) {
              if(error instanceof Error){
                toast.error("Something went wrong")
              }
           }finally{
              setLoading(false)
           }
        }}>
            { loading ? 'Loading...' : '   Sync To google sheet Orders' }
        </Button>


        <Button  disabled={true} onClick={async()=> {
           try {
            setLoading(true)
            const { error, msg } = await syncExpensesGoogleSheet(store)
              if(error){
                toast.error(error)
              }else if(msg){
                toast.success(msg)
              }
           } catch (error) {
              if(error instanceof Error){
                toast.error("Something went wrong")
              }
           }finally{
              setLoading(false)
           }
        }}>
            { loading ? 'Loading...' : 'Sync To google sheet Expenses' }
        </Button>

        <Button  disabled={false} onClick={async()=> {
           try {
            setLoading(true)
            const { error, msg } = await syncClientAndContactGoogleSheet(store)
              if(error){
                toast.error(error)
              }else if(msg){
                toast.success(msg)
              }
           } catch (error) {
              if(error instanceof Error){
                toast.error("Something went wrong")
              }
           }finally{
              setLoading(false)
           }
        }}>
            { loading ? 'Loading...' : '   Sync To google sheet Client Contacts' }
        </Button>
    </div>
  )
}

export default SyncClient