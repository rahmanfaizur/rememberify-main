import { useEffect, useState } from 'react'
import { Button } from '../components/ui/Button'
import { PlusIcon } from '../icons/PlusIcon'
import { ShareIcon } from '../icons/ShareIcon'
import { Card } from '../components/ui/Card'
import { CreateContentModal } from '../components/ui/CreateContentModal'
import { SideBar } from '../components/ui/Sidebar'
import { useContent } from '../hooks/useContent'
import { ShareBrainBox } from '../components/ui/ShareBrianBox'
import { Navbar } from '../components/ui/Navbar'
import { useNavigate } from 'react-router-dom'
import { LogoutIcon } from '../icons/LogoutIcon'

//Share Brain Modal!

// const [modal, setModal] = useState(false);

  // const toggleModal = () => {
  //   setModal(!modal);
  // }


  export function DashBoard() {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const openModal = () => {
      setIsModalOpen(true);
    };
  
    const closeModal = () => {
      setIsModalOpen(false);
    };
  
    const [modalOpen, setModalOpen] = useState(false);
  
    const { contents, refresh } = useContent();
  
    useEffect(() => {
      refresh();
    }, [modalOpen]);

    function LogoutItem() {
      localStorage.removeItem('token');
      navigate('/signup');
  }
  
    return (
      <div className="flex">
        {/* Sidebar: Hidden on small screens */}
        <div className="hidden lg:block">
          <SideBar />
        </div>
  
        <div className="flex-grow">
          {/* Navbar: Hidden on small screens */}
          <div className="hidden md:block">
            <Navbar />
          </div>
          
          <div className="p-4 lg:ml-72 min-h-screen bg-slate-200 border-2">
            <CreateContentModal
              open={modalOpen}
              onClose={() => {
                setModalOpen(false);
              }}
            />
            <div className="flex justify-end gap-4">
              <Button
                padding="one"
                startIcon={<ShareIcon size="lg" />}
                variant="secondary"
                text="Share Brain"
                size="md"
                onClick={openModal}
              />
              <ShareBrainBox isModalOpen={isModalOpen} closeModal={closeModal} />
              <Button
                padding="one"
                onClick={() => {
                  setModalOpen(true);
                }}
                startIcon={<PlusIcon size="lg" />}
                variant="primary"
                text="Add Content"
                size="sm"
              ></Button>
              <div className="block md:hidden">
                <Button
                  padding="one"
                  text="Logout"
                  variant="reddish"
                  size="md"
                  startIcon={<LogoutIcon size="lg" />}
                  onClick={LogoutItem}
                />
              </div>          
              </div>
            <div className="flex flex-wrap gap-4 justify-start pt-3">
              {contents.map(({ type, link, title }) => (
                <Card
                  key={link} // Assuming link is unique
                  link={link}
                  type={type}
                  title={title}
                  showDelete={true}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
  

//how and when u use recoil here!
//use react query instead of react query!