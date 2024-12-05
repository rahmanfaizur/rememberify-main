import { useState } from 'react'
// import './App.css'
import { Button } from '../components/ui/Button'
import { PlusIcon } from '../icons/PlusIcon'
import { ShareIcon } from '../icons/ShareIcon'
import { Card } from '../components/ui/Card'
import { CreateContentModal } from '../components/ui/CreateContentModal'
import { SideBar } from '../components/ui/Sidebar'
import { useContent } from '../hooks/useContent'

export function DashBoard() {

  const [modalOpen, setModalOpen] = useState(false);

  const contents = useContent();


  return (
    <div>
      <SideBar/>
      <div className='p-4 ml-72 min-h-screen bg-slate-200 border-2'>
      <CreateContentModal open={modalOpen} onClose={() => {
        setModalOpen(false);
      }}/>
    {/* hey! */}
    {/* <button className='bg-blue-700'>heyo!</button> */}
    <div className='flex justify-end gap-4'>
      <Button startIcon={<ShareIcon size='lg'/>} variant='secondary' text='Share Brain' size='md' ></Button>
      <Button onClick={() => {
        setModalOpen(true)
      }}
      startIcon={<PlusIcon size='lg'/>} variant='primary' text='Add Content' size='sm' ></Button>
    </div>
    <div className='flex space-x-4'>
      {contents.map(({type, link, title}) => <Card
      link={link}
      type={type}
      title={title}>
      </Card>
      )}
    </div>
    </div>
    </div>
  )
}
