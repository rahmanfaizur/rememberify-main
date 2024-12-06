import { useEffect, useState } from 'react'
// import './App.css'
import { Button } from '../components/ui/Button'
import { PlusIcon } from '../icons/PlusIcon'
import { ShareIcon } from '../icons/ShareIcon'
import { Card } from '../components/ui/Card'
import { CreateContentModal } from '../components/ui/CreateContentModal'
import { SideBar } from '../components/ui/Sidebar'
import { useContent } from '../hooks/useContent'
import { BACKEND_URL } from '../config'
import axios from 'axios'

export function DashBoard() {

  const [modalOpen, setModalOpen] = useState(false);

  const { contents, refresh } = useContent();

  useEffect(() => {
    refresh();
  }, [modalOpen]);

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
      <Button startIcon={<ShareIcon size='lg'/>} variant='secondary' text='Share Brain' size='md'
      onClick={async () => {
        const response = await axios.post(`${BACKEND_URL}/api/v1/brain/share`, {
          share: true
        }, {
          headers: {
            "Authorization": localStorage.getItem("token")
          }
        });
        // console.log("111111111111111111111");
        // console.log(response);
        const shareUrl = `http://localhost:5173/share/${response.data.message}`;
        alert(shareUrl);
      }} ></Button>
      <Button onClick={() => {
        setModalOpen(true)
      }}
      startIcon={<PlusIcon size='lg'/>} variant='primary' text='Add Content' size='sm' ></Button>
    </div>
    <div className='flex space-x-4 flex-wrap'>
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

//how and when u use recoil here!
//use react query instead of react query!