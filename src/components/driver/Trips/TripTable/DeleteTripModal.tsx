"use client"

import { Button, Group, Modal } from '@mantine/core'
import React from 'react'
import { useRouter } from 'next/navigation'

const DeleteTripModal = ({opened, Modelhandler, id, setId}: any) => {
  const router = useRouter()
  
  return (
    <>
      <Modal 
        opened={opened}
        onClose={() => {
          Modelhandler.close()
        }}
        withCloseButton={false}
        title='Are you sure you want to delete this trip?'
      >
        <Group justify='flex-end'>
          <Button
            variant='filled'
            color='red'
            onClick={async () => {
              await fetch(`/api/trip/${id}`, {
                method: 'DELETE'
              })
              setId(null)
              Modelhandler.close()
              router.refresh()
            }}
          >
            Delete
          </Button>
        </Group>
      </Modal>
    </>
  )
}

export default DeleteTripModal
