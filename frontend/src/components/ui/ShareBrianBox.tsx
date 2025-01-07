import { useEffect, useState } from 'react';
import './Modal.css';
import { generateSharableLink } from './shareUtils';
import { CopyIcon } from '../../icons/CopyIcon';
import { CrossIcon } from '../../icons/CrossIcon';
// import { useNavigate } from 'react-router-dom';

interface ShareBrainBoxProps {
    isModalOpen: boolean;
    closeModal: () => void;
}

export const ShareBrainBox = ({ isModalOpen, closeModal } : ShareBrainBoxProps) => {
    // const [modal, setModal] = useState(false);

    // const toggleModal = () => {
    //     setModal(!modal);
    // };
    
    // const navigate = useNavigate();

    const [shareUrl, setShareUrl] = useState<string>("");

    useEffect(() => {
        const fetchShareUrl = async () => {
            const { shareUrl } = await generateSharableLink();
            setShareUrl(shareUrl);
        };

        fetchShareUrl();
    }, []); // Empty dependency array ensures this runs once when the component mounts
    //the below part prevents scroll when the modal component is open!

    useEffect(() => {
        if (isModalOpen) {
            document.body.classList.add('active-modal');
        } else {
            document.body.classList.remove('active-modal');
        }

        return () => document.body.classList.remove('active-modal'); // Cleanup
    }, [isModalOpen]);

        const [copied, setCopied ] = useState(false);

        const handleCopy = () => {
            navigator.clipboard.writeText(shareUrl).then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000); //it resets after 2 seconds!
            });
    }

    function extractPath(url: any) {
        try {
          const urlObj = new URL(url);
          return urlObj.pathname.slice(1); // Remove the leading '/' from pathname
        } catch (error) {
          console.error('Invalid URL:', error);
          return null;
        }
      }

      const navTo = extractPath(shareUrl);

      const gotoPage = () => {
        window.open(`/${navTo}`, '_blank');
        // navigate(`/${navTo}`);
    }
    

    return (
        <div>
            {isModalOpen && (
                <div className="modal">
                    <div onClick={closeModal} className="overlay"></div>
                    <div className="modal-content">
                        <h2 className="text-white">Brain Shared Successfully!</h2>
                        <div className="grid grid-cols-[1fr_auto_auto] items-center gap-4 pt-8">
                            {/* Shareable URL positioned on the left */}
                            <div
                              className="border-2 bg-gray-500 hover:bg-green-600 hover:text-white hover:cursor-pointer p-2 rounded"
                              onClick={gotoPage}
                            >
                              {shareUrl}
                            </div>
                            {/* Copy button positioned on the right */}
                            <button onClick={handleCopy} className="p-2 border rounded bg-gray-500">
                                <CopyIcon size="md" />
                            </button>

                            {/* Display the "Copied to clipboard!" message */}
                            {copied && <span className="text-green-500">✔</span>}
                        </div>
                        <button onClick={closeModal} className="close-modal">
                            <CrossIcon size='md'></CrossIcon>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
