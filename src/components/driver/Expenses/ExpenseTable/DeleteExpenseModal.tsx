"use client"

import { Button, Group, Modal, Text } from '@mantine/core'
import React from 'react'

const DeleteExpenseModal = ({opened,Modelhandler,id,setId}:any) => {
  return (
    <>
      <Modal 
      opened={opened}
      onClose={()=> {
        Modelhandler.close()
      }}
      withCloseButton={false}
      title='Are you sure you want to delete this expense?'
      >
        <Group justify='flex-end'>
        <Button
        variant='filled'
        color='red'
        onClick={async () => {
          const response = await fetch(new URL(`/api/expenses/${id}`,process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'),{
            method:'DELETE'
          })
          setId(null)
          Modelhandler.close()
        }}
        >
          Delete
        </Button>
        </Group>
      </Modal>
    </>
  )
}

export default DeleteExpenseModal
