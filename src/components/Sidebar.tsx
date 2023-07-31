import {
  Dispatch,
  useRef,
  SetStateAction,
  useState,
  useEffect,
} from 'react';
import axios from 'axios';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from '@chakra-ui/react';
import toast from 'react-hot-toast';
import Prompts from '../utils/prompts.json';

interface Props {
  sidebarOpen: boolean;
  setSidebarOpen: Dispatch<SetStateAction<boolean>>;
  userId: string | null;
  model: string;
  setModel: Dispatch<SetStateAction<string>>;
  chat: any;
  setChat: Dispatch<SetStateAction<any>>;
  refetchChats: boolean;
  setRefetchChats: Dispatch<SetStateAction<boolean>>;
  selectedChat: string;
  setSelectedChat: Dispatch<SetStateAction<string>>;
  setMessages: Dispatch<SetStateAction<any>>;
}

interface SettingsProps {
  model: string;
  setModel: Dispatch<SetStateAction<string>>;
}

interface ChatDialogProps {
  id: string;
  setRefetchChats: Dispatch<SetStateAction<boolean>>;
  setSelectedChat: Dispatch<SetStateAction<string>>;
  setMessages: Dispatch<SetStateAction<any>>;
}

interface ChatProps {
  chat: any;
  chats: any;
  setChats: Dispatch<SetStateAction<any>>;
  selectedChat: string;
  setSelectedChat: Dispatch<SetStateAction<string>>;
  setRefetchChats: Dispatch<SetStateAction<boolean>>;
  setMessages: Dispatch<SetStateAction<any>>;
}

interface PromptProps {
  chat: any;
  setChat: Dispatch<SetStateAction<any>>;
}

const PromptIcon = () => {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 15 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3 2.5C3 2.22386 3.22386 2 3.5 2H9.08579C9.21839 2 9.34557 2.05268 9.43934 2.14645L11.8536 4.56066C11.9473 4.65443 12 4.78161 12 4.91421V12.5C12 12.7761 11.7761 13 11.5 13H3.5C3.22386 13 3 12.7761 3 12.5V2.5ZM3.5 1C2.67157 1 2 1.67157 2 2.5V12.5C2 13.3284 2.67157 14 3.5 14H11.5C12.3284 14 13 13.3284 13 12.5V4.91421C13 4.51639 12.842 4.13486 12.5607 3.85355L10.1464 1.43934C9.86514 1.15804 9.48361 1 9.08579 1H3.5ZM4.5 4C4.22386 4 4 4.22386 4 4.5C4 4.77614 4.22386 5 4.5 5H7.5C7.77614 5 8 4.77614 8 4.5C8 4.22386 7.77614 4 7.5 4H4.5ZM4.5 7C4.22386 7 4 7.22386 4 7.5C4 7.77614 4.22386 8 4.5 8H10.5C10.7761 8 11 7.77614 11 7.5C11 7.22386 10.7761 7 10.5 7H4.5ZM4.5 10C4.22386 10 4 10.2239 4 10.5C4 10.7761 4.22386 11 4.5 11H10.5C10.7761 11 11 10.7761 11 10.5C11 10.2239 10.7761 10 10.5 10H4.5Z"
        fill="white"
        fillRule="evenodd"
        clipRule="evenodd"
      ></path>
    </svg>
  );
};

const TextIcon = () => {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 15 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12.1464 1.14645C12.3417 0.951184 12.6583 0.951184 12.8535 1.14645L14.8535 3.14645C15.0488 3.34171 15.0488 3.65829 14.8535 3.85355L10.9109 7.79618C10.8349 7.87218 10.7471 7.93543 10.651 7.9835L6.72359 9.94721C6.53109 10.0435 6.29861 10.0057 6.14643 9.85355C5.99425 9.70137 5.95652 9.46889 6.05277 9.27639L8.01648 5.34897C8.06455 5.25283 8.1278 5.16507 8.2038 5.08907L12.1464 1.14645ZM12.5 2.20711L8.91091 5.79618L7.87266 7.87267L8.12731 8.12732L10.2038 7.08907L13.7929 3.5L12.5 2.20711ZM9.99998 2L8.99998 3H4.9C4.47171 3 4.18056 3.00039 3.95552 3.01877C3.73631 3.03668 3.62421 3.06915 3.54601 3.10899C3.35785 3.20487 3.20487 3.35785 3.10899 3.54601C3.06915 3.62421 3.03669 3.73631 3.01878 3.95552C3.00039 4.18056 3 4.47171 3 4.9V11.1C3 11.5283 3.00039 11.8194 3.01878 12.0445C3.03669 12.2637 3.06915 12.3758 3.10899 12.454C3.20487 12.6422 3.35785 12.7951 3.54601 12.891C3.62421 12.9309 3.73631 12.9633 3.95552 12.9812C4.18056 12.9996 4.47171 13 4.9 13H11.1C11.5283 13 11.8194 12.9996 12.0445 12.9812C12.2637 12.9633 12.3758 12.9309 12.454 12.891C12.6422 12.7951 12.7951 12.6422 12.891 12.454C12.9309 12.3758 12.9633 12.2637 12.9812 12.0445C12.9996 11.8194 13 11.5283 13 11.1V6.99998L14 5.99998V11.1V11.1207C14 11.5231 14 11.8553 13.9779 12.1259C13.9549 12.407 13.9057 12.6653 13.782 12.908C13.5903 13.2843 13.2843 13.5903 12.908 13.782C12.6653 13.9057 12.407 13.9549 12.1259 13.9779C11.8553 14 11.5231 14 11.1207 14H11.1H4.9H4.87934C4.47686 14 4.14468 14 3.87409 13.9779C3.59304 13.9549 3.33469 13.9057 3.09202 13.782C2.7157 13.5903 2.40973 13.2843 2.21799 12.908C2.09434 12.6653 2.04506 12.407 2.0221 12.1259C1.99999 11.8553 1.99999 11.5231 2 11.1207V11.1206V11.1V4.9V4.87935V4.87932V4.87931C1.99999 4.47685 1.99999 4.14468 2.0221 3.87409C2.04506 3.59304 2.09434 3.33469 2.21799 3.09202C2.40973 2.71569 2.7157 2.40973 3.09202 2.21799C3.33469 2.09434 3.59304 2.04506 3.87409 2.0221C4.14468 1.99999 4.47685 1.99999 4.87932 2H4.87935H4.9H9.99998Z"
        fill="#363636"
        fillRule="evenodd"
        clipRule="evenodd"
      ></path>
    </svg>
  );
};

const OpenAILogo = () => {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 15 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clip-path="url(#clip0_536_3)">
        <path
          d="M13.9261 6.13817C14.0938 5.63309 14.1518 5.09804 14.0962 4.56876C14.0406 4.03947 13.8728 3.52814 13.6038 3.06892C13.205 2.37481 12.5961 1.82527 11.8649 1.49952C11.1337 1.17377 10.3179 1.08865 9.53515 1.25642C9.09047 0.761774 8.52346 0.392842 7.89107 0.18668C7.25867 -0.0194823 6.58317 -0.0556156 5.93239 0.0819087C5.28162 0.219433 4.67848 0.525773 4.18357 0.970162C3.68865 1.41455 3.31938 1.98134 3.11284 2.61361C2.59138 2.72054 2.09875 2.93754 1.66788 3.2501C1.237 3.56267 0.877798 3.9636 0.61428 4.42611C0.211177 5.11906 0.0388932 5.92226 0.122337 6.71957C0.20578 7.51689 0.540627 8.26701 1.07847 8.86148C0.910133 9.36632 0.851545 9.90128 0.906623 10.4306C0.961701 10.9599 1.12918 11.4713 1.39784 11.9307C1.79712 12.625 2.40654 13.1747 3.13829 13.5005C3.87003 13.8262 4.6863 13.9112 5.46947 13.7432C5.82276 14.1411 6.25686 14.459 6.74278 14.6757C7.22871 14.8924 7.75528 15.003 8.28734 15C9.08961 15.0007 9.87137 14.7465 10.5198 14.274C11.1682 13.8016 11.6496 13.1353 11.8947 12.3714C12.4161 12.2642 12.9087 12.0472 13.3395 11.7346C13.7704 11.422 14.1296 11.0212 14.3933 10.5588C14.7916 9.86686 14.9609 9.06668 14.877 8.2727C14.7931 7.47872 14.4603 6.73155 13.9261 6.13817ZM8.28734 14.0182C7.63029 14.0193 6.99384 13.789 6.48959 13.3677L6.57828 13.3175L9.56472 11.5936C9.63905 11.55 9.70076 11.4878 9.74379 11.4132C9.78682 11.3385 9.80969 11.254 9.81015 11.1678V6.95723L11.0727 7.68761C11.0789 7.69077 11.0843 7.69536 11.0884 7.70101C11.0926 7.70666 11.0953 7.7132 11.0964 7.72011V11.2092C11.0948 11.9537 10.7984 12.6673 10.2719 13.1938C9.74543 13.7202 9.03186 14.0167 8.28734 14.0182ZM2.2494 11.4399C1.91989 10.8709 1.80157 10.2039 1.91528 9.5563L2.00403 9.60955L4.9934 11.3334C5.06737 11.3768 5.15158 11.3997 5.23734 11.3997C5.3231 11.3997 5.40731 11.3768 5.48128 11.3334L9.13303 9.22811V10.6859C9.13269 10.6934 9.13064 10.7008 9.12705 10.7074C9.12346 10.7141 9.11841 10.7199 9.11228 10.7243L6.0874 12.4689C5.44186 12.8407 4.67512 12.9413 3.95554 12.7483C3.23595 12.5554 2.62233 12.0848 2.2494 11.4399ZM1.4629 4.93473C1.79471 4.36209 2.31842 3.92532 2.94134 3.70173V7.24998C2.94022 7.33571 2.96212 7.42016 3.00476 7.49453C3.04741 7.5689 3.10923 7.63046 3.18378 7.6728L6.81778 9.76923L5.55522 10.4995C5.54838 10.5032 5.54077 10.5051 5.53303 10.5051C5.52529 10.5051 5.51768 10.5032 5.51084 10.4995L2.4919 8.75798C1.84757 8.38449 1.3775 7.77088 1.18463 7.05153C0.991769 6.33218 1.09183 5.56571 1.4629 4.91998V4.93473ZM11.8356 7.34461L8.18978 5.22748L9.4494 4.49998C9.45624 4.49636 9.46386 4.49446 9.47159 4.49446C9.47933 4.49446 9.48695 4.49636 9.49378 4.49998L12.5127 6.24455C12.9743 6.51089 13.3506 6.90305 13.5977 7.37524C13.8448 7.84743 13.9524 8.38016 13.9081 8.91124C13.8638 9.44231 13.6693 9.94982 13.3473 10.3745C13.0254 10.7992 12.5893 11.1235 12.0899 11.3097V7.76142C12.0873 7.67584 12.0625 7.59242 12.0179 7.51933C11.9733 7.44625 11.9105 7.38608 11.8356 7.34461ZM13.0923 5.45517L13.0035 5.40192L10.0201 3.6633C9.94567 3.61962 9.86094 3.5966 9.77465 3.5966C9.68836 3.5966 9.60364 3.61962 9.52922 3.6633L5.88053 5.76855V4.31086C5.87975 4.30345 5.88099 4.29596 5.88412 4.2892C5.88724 4.28243 5.89213 4.27664 5.89828 4.27242L8.91722 2.5308C9.37991 2.26425 9.90894 2.13495 10.4424 2.15802C10.9759 2.1811 11.4918 2.35559 11.9297 2.6611C12.3677 2.96661 12.7096 3.3905 12.9155 3.88319C13.1214 4.37589 13.1827 4.91702 13.0923 5.4433L13.0923 5.45517ZM5.19147 8.03936L3.92897 7.31198C3.92265 7.30818 3.91725 7.30303 3.91314 7.29691C3.90904 7.29079 3.90633 7.28383 3.90522 7.27655V3.79636C3.90591 3.26247 4.05858 2.73981 4.34537 2.28948C4.63217 1.83916 5.04123 1.47979 5.52474 1.25338C6.00825 1.02698 6.54622 0.942897 7.07576 1.01097C7.60529 1.07904 8.10451 1.29646 8.51503 1.6378L8.42628 1.68811L5.43991 3.41186C5.36558 3.45545 5.30387 3.51763 5.26083 3.59228C5.2178 3.66694 5.19493 3.7515 5.19447 3.83767L5.19147 8.03936ZM5.87747 6.56098L7.50372 5.62361L9.13303 6.56098V8.43561L7.50965 9.37292L5.88047 8.43561L5.87747 6.56098Z"
          fill="white"
        />
      </g>
      <defs>
        <clipPath id="clip0_536_3">
          <rect width="15" height="15" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

async function getChats(userId: string) {
  try {
    const result = await axios.get('/api/chat/all', {
      params: {
        userId: userId,
      },
    });
    return result.data;
  } catch (e) {
    console.log(e);
  }
}

async function renameChat(chatId: string, newName: string) {
  try {
    const result = await axios.post(`/api/chat/rename`, {
      chatId: chatId,
      newName: newName,
    });
    return result.data;
  } catch (e) {
    console.log(e);
  }
}

async function deleteChat(chatId: string) {
  try {
    const result = await axios.post(`/api/chat/delete`, {
      chatId: chatId,
    });
    return result.data;
  } catch (e) {
    console.log(e);
  }
}

function RenameDialog({ id, setRefetchChats }: ChatDialogProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [newName, setNewName] = useState('');
  const finalRef = useRef<any>(null);

  return (
    <>
      <button className="my-auto" onClick={onOpen}>
        <svg
          width="15"
          height="15"
          viewBox="0 0 15 15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="my-auto"
        >
          <path
            d="M11.8536 1.14645C11.6583 0.951184 11.3417 0.951184 11.1465 1.14645L3.71455 8.57836C3.62459 8.66832 3.55263 8.77461 3.50251 8.89155L2.04044 12.303C1.9599 12.491 2.00189 12.709 2.14646 12.8536C2.29103 12.9981 2.50905 13.0401 2.69697 12.9596L6.10847 11.4975C6.2254 11.4474 6.3317 11.3754 6.42166 11.2855L13.8536 3.85355C14.0488 3.65829 14.0488 3.34171 13.8536 3.14645L11.8536 1.14645ZM4.42166 9.28547L11.5 2.20711L12.7929 3.5L5.71455 10.5784L4.21924 11.2192L3.78081 10.7808L4.42166 9.28547Z"
            fill="#363636"
            fillRule="evenodd"
            clipRule="evenodd"
          ></path>
        </svg>
      </button>
      <Modal
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Rename Chat</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <div className="flex flex-col space-y-2 justify-start w-full items-start">
              <p className="text-sm font-medium text-[#363636]">
                Name
              </p>
              <input
                value={newName}
                onChange={(e) => {
                  setNewName(e.target.value);
                }}
                className="text-sm border px-3 py-1.5 rounded w-full focus:ring-0 focus:outline-none"
                placeholder="New name..."
                type="text"
              />
            </div>
          </ModalBody>
          <ModalFooter className="flex flex-row space-x-4 mt-4">
            <button
              onClick={onClose}
              className="text-sm px-4 py-1 font-medium  text-white bg-[#363636] rounded hover:opacity-90"
            >
              Close
            </button>
            <button
              className="text-sm px-4 py-1 font-medium hover:opacity-90 text-white bg-[#FF623D] rounded"
              onClick={() => {
                onClose();
                renameChat(id, newName).then(() => {
                  setRefetchChats(true);
                });
              }}
            >
              Rename
            </button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

function DeleteDialog({
  id,
  setRefetchChats,
  setSelectedChat,
  setMessages,
}: ChatDialogProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const finalRef = useRef<any>(null);
  return (
    <>
      <button onClick={onOpen} className="my-auto">
        <svg
          width="15"
          height="15"
          viewBox="0 0 15 15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="my-auto"
        >
          <path
            d="M5.5 1C5.22386 1 5 1.22386 5 1.5C5 1.77614 5.22386 2 5.5 2H9.5C9.77614 2 10 1.77614 10 1.5C10 1.22386 9.77614 1 9.5 1H5.5ZM3 3.5C3 3.22386 3.22386 3 3.5 3H5H10H11.5C11.7761 3 12 3.22386 12 3.5C12 3.77614 11.7761 4 11.5 4H11V12C11 12.5523 10.5523 13 10 13H5C4.44772 13 4 12.5523 4 12V4L3.5 4C3.22386 4 3 3.77614 3 3.5ZM5 4H10V12H5V4Z"
            fill="#363636"
            fillRule="evenodd"
            clipRule="evenodd"
          ></path>
        </svg>
      </button>
      <Modal
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete Chat</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <div className="flex flex-col justify-center items-center">
              <p className="text-xs text-center font-regular text-gray-400">
                Are you sure you want to delete this chat? You will
                lose all of your messages.
              </p>
            </div>
          </ModalBody>
          <ModalFooter className="flex flex-row space-x-4 mt-4">
            <button
              onClick={onClose}
              className="text-sm px-4 py-1 font-medium  text-white bg-[#363636] rounded hover:opacity-90"
            >
              Close
            </button>
            <button
              className="text-sm px-4 py-1 font-medium text-white bg-[#FF623D] rounded"
              onClick={() => {
                onClose();
                setSelectedChat('');
                setMessages([]);
                deleteChat(id).then(() => {
                  setRefetchChats(true);
                });
              }}
            >
              Delete
            </button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

function OpenAI() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [key, setKey] = useState('');
  const finalRef = useRef(null);

  return (
    <>
      <button
        onClick={onOpen}
        className="flex flex-row space-x-2 hover:opacity-80 w-full justify-start items-start"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 15 15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="my-auto"
        >
          <g clip-path="url(#clip0_536_3)">
            <path
              d="M13.9261 6.13817C14.0938 5.63309 14.1518 5.09804 14.0962 4.56876C14.0406 4.03947 13.8728 3.52814 13.6038 3.06892C13.205 2.37481 12.5961 1.82527 11.8649 1.49952C11.1337 1.17377 10.3179 1.08865 9.53515 1.25642C9.09047 0.761774 8.52346 0.392842 7.89107 0.18668C7.25867 -0.0194823 6.58317 -0.0556156 5.93239 0.0819088C5.28162 0.219433 4.67848 0.525773 4.18357 0.970162C3.68865 1.41455 3.31938 1.98134 3.11284 2.61361C2.59138 2.72054 2.09875 2.93754 1.66788 3.2501C1.237 3.56267 0.877798 3.9636 0.61428 4.42611C0.211177 5.11906 0.0388932 5.92226 0.122337 6.71957C0.20578 7.51689 0.540627 8.26701 1.07847 8.86148C0.910133 9.36632 0.851545 9.90128 0.906623 10.4306C0.961701 10.9599 1.12918 11.4713 1.39784 11.9307C1.79712 12.625 2.40654 13.1747 3.13829 13.5005C3.87003 13.8262 4.6863 13.9112 5.46947 13.7432C5.82276 14.1411 6.25686 14.459 6.74278 14.6757C7.22871 14.8924 7.75529 15.003 8.28734 15C9.08961 15.0007 9.87137 14.7465 10.5198 14.274C11.1682 13.8016 11.6496 13.1353 11.8947 12.3714C12.4161 12.2642 12.9087 12.0472 13.3395 11.7346C13.7704 11.422 14.1296 11.0212 14.3933 10.5588C14.7916 9.86686 14.9609 9.06668 14.877 8.2727C14.7931 7.47872 14.4603 6.73155 13.9261 6.13817ZM8.28734 14.0182C7.63029 14.0193 6.99384 13.789 6.48959 13.3677L6.57828 13.3175L9.56472 11.5936C9.63905 11.55 9.70076 11.4878 9.74379 11.4132C9.78682 11.3385 9.80969 11.254 9.81015 11.1678V6.95723L11.0727 7.68761C11.0789 7.69077 11.0843 7.69536 11.0884 7.70101C11.0926 7.70666 11.0953 7.7132 11.0964 7.72011V11.2092C11.0948 11.9537 10.7984 12.6673 10.2719 13.1938C9.74543 13.7202 9.03186 14.0167 8.28734 14.0182ZM2.2494 11.4399C1.91989 10.8709 1.80157 10.2039 1.91528 9.5563L2.00403 9.60955L4.9934 11.3334C5.06737 11.3768 5.15158 11.3997 5.23734 11.3997C5.3231 11.3997 5.40731 11.3768 5.48128 11.3334L9.13303 9.22811V10.6859C9.13269 10.6934 9.13064 10.7008 9.12705 10.7075C9.12346 10.7141 9.11841 10.7199 9.11228 10.7243L6.0874 12.4689C5.44186 12.8407 4.67512 12.9413 3.95554 12.7483C3.23595 12.5554 2.62233 12.0848 2.2494 11.4399ZM1.4629 4.93473C1.79471 4.36209 2.31842 3.92532 2.94134 3.70173V7.24998C2.94022 7.33571 2.96212 7.42016 3.00476 7.49453C3.04741 7.5689 3.10923 7.63046 3.18378 7.6728L6.81778 9.76923L5.55522 10.4995C5.54838 10.5032 5.54077 10.5051 5.53303 10.5051C5.52529 10.5051 5.51768 10.5032 5.51084 10.4995L2.4919 8.75798C1.84757 8.38449 1.3775 7.77088 1.18463 7.05153C0.991769 6.33218 1.09183 5.56571 1.4629 4.91998V4.93473ZM11.8356 7.34461L8.18978 5.22748L9.4494 4.49998C9.45624 4.49636 9.46386 4.49446 9.47159 4.49446C9.47933 4.49446 9.48695 4.49636 9.49378 4.49998L12.5127 6.24455C12.9743 6.51089 13.3506 6.90305 13.5977 7.37524C13.8448 7.84743 13.9524 8.38016 13.9081 8.91124C13.8638 9.44231 13.6693 9.94982 13.3473 10.3745C13.0254 10.7992 12.5893 11.1235 12.0899 11.3097V7.76142C12.0873 7.67584 12.0625 7.59242 12.0179 7.51933C11.9733 7.44625 11.9105 7.38608 11.8356 7.34461ZM13.0923 5.45517L13.0035 5.40192L10.0201 3.6633C9.94567 3.61962 9.86094 3.5966 9.77465 3.5966C9.68836 3.5966 9.60364 3.61962 9.52922 3.6633L5.88053 5.76855V4.31086C5.87975 4.30345 5.88099 4.29596 5.88412 4.2892C5.88724 4.28243 5.89213 4.27664 5.89828 4.27242L8.91722 2.5308C9.37991 2.26425 9.90894 2.13495 10.4424 2.15802C10.9759 2.1811 11.4918 2.35559 11.9297 2.6611C12.3677 2.96661 12.7096 3.3905 12.9155 3.88319C13.1214 4.37589 13.1827 4.91702 13.0923 5.4433L13.0923 5.45517ZM5.19147 8.03936L3.92897 7.31198C3.92265 7.30818 3.91725 7.30303 3.91314 7.29691C3.90904 7.29079 3.90633 7.28383 3.90522 7.27655V3.79636C3.90591 3.26247 4.05858 2.73981 4.34537 2.28948C4.63217 1.83916 5.04123 1.47979 5.52474 1.25338C6.00825 1.02698 6.54622 0.942897 7.07576 1.01097C7.60529 1.07904 8.10451 1.29646 8.51503 1.6378L8.42628 1.68811L5.43991 3.41186C5.36558 3.45545 5.30387 3.51763 5.26083 3.59228C5.2178 3.66694 5.19493 3.7515 5.19447 3.83767L5.19147 8.03936ZM5.87747 6.56098L7.50372 5.62361L9.13303 6.56098V8.43561L7.50965 9.37292L5.88047 8.43561L5.87747 6.56098Z"
              fill="#0F9E7C"
            />
          </g>
          <defs>
            <clipPath id="clip0_536_3">
              <rect width="15" height="15" fill="white" />
            </clipPath>
          </defs>
        </svg>
        <p className="font-medium my-auto text-[#363636]">
          OpenAI Key
        </p>
      </button>
      <Modal
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Enter API Key</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <div className="flex flex-col justify-center items-center">
              <p className="text-xs text-center font-regular text-gray-400">
                Your API key is stored on the browser and isn&apos;t
                stored anywhere else.
              </p>
              <div className="mt-6 flex flex-col w-full space-y-3">
                <div className="flex flex-row space-x-1.5">
                  <p className="text-sm font-semibold text-gray-900">
                    OpenAI Key:
                  </p>
                  <a
                    href="https://platform.openai.com/account/api-keys"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm hover:underline font-semibold text-blue-700"
                  >
                    Get API Key
                  </a>
                </div>
                <div className="flex flex-row space-x-3 w-full">
                  <div className="h-[25px] my-auto w-[25px] rounded bg-[#0F9E7C] flex flex-col justify-center items-center">
                    <OpenAILogo />
                  </div>
                  <input
                    value={key}
                    onChange={(e) => {
                      setKey(e.target.value);
                    }}
                    type="text"
                    className="w-full flex-1 border text-sm font-regular px-3 py-1.5 rounded focus:outline-none focus:ring-0"
                    placeholder="sk-xxxxxxxxxxx"
                  />
                </div>
              </div>
            </div>
          </ModalBody>
          <ModalFooter className="flex flex-row space-x-4 mt-4">
            <button
              onClick={onClose}
              className="text-sm px-4 py-1 font-medium  text-white bg-[#363636] rounded hover:opacity-90"
            >
              Close
            </button>
            <button
              className="text-sm px-4 py-1 font-medium text-white bg-[#FF623D] rounded"
              onClick={(e) => {
                e.preventDefault();
                if (key.slice(0, 3) != 'sk-' || key.length != 51) {
                  toast.error('Invalid API Key!', {
                    className: 'text-sm font-medium text-[#363636]',
                  });
                } else {
                  localStorage.setItem('key', key);
                  toast.success('API Key Added!', {
                    className: 'text-sm font-medium text-[#363636]',
                  });
                  onClose();
                }
              }}
            >
              Save
            </button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

function Settings({ model, setModel }: SettingsProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const finalRef = useRef(null);

  return (
    <>
      <button
        onClick={onOpen}
        className="flex hover:opacity-80 flex-row space-x-2 w-full justify-start items-start"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 15 15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="my-auto"
        >
          <path
            d="M7.07095 0.650238C6.67391 0.650238 6.32977 0.925096 6.24198 1.31231L6.0039 2.36247C5.6249 2.47269 5.26335 2.62363 4.92436 2.81013L4.01335 2.23585C3.67748 2.02413 3.23978 2.07312 2.95903 2.35386L2.35294 2.95996C2.0722 3.2407 2.0232 3.6784 2.23493 4.01427L2.80942 4.92561C2.62307 5.2645 2.47227 5.62594 2.36216 6.00481L1.31209 6.24287C0.924883 6.33065 0.650024 6.6748 0.650024 7.07183V7.92897C0.650024 8.32601 0.924883 8.67015 1.31209 8.75794L2.36228 8.99603C2.47246 9.375 2.62335 9.73652 2.80979 10.0755L2.2354 10.9867C2.02367 11.3225 2.07267 11.7602 2.35341 12.041L2.95951 12.6471C3.24025 12.9278 3.67795 12.9768 4.01382 12.7651L4.92506 12.1907C5.26384 12.377 5.62516 12.5278 6.0039 12.6379L6.24198 13.6881C6.32977 14.0753 6.67391 14.3502 7.07095 14.3502H7.92809C8.32512 14.3502 8.66927 14.0753 8.75705 13.6881L8.99505 12.6383C9.37411 12.5282 9.73573 12.3773 10.0748 12.1909L10.986 12.7653C11.3218 12.977 11.7595 12.928 12.0403 12.6473L12.6464 12.0412C12.9271 11.7604 12.9761 11.3227 12.7644 10.9869L12.1902 10.076C12.3768 9.73688 12.5278 9.37515 12.638 8.99596L13.6879 8.75794C14.0751 8.67015 14.35 8.32601 14.35 7.92897V7.07183C14.35 6.6748 14.0751 6.33065 13.6879 6.24287L12.6381 6.00488C12.528 5.62578 12.3771 5.26414 12.1906 4.92507L12.7648 4.01407C12.9766 3.6782 12.9276 3.2405 12.6468 2.95975L12.0407 2.35366C11.76 2.07292 11.3223 2.02392 10.9864 2.23565L10.0755 2.80989C9.73622 2.62328 9.37437 2.47229 8.99505 2.36209L8.75705 1.31231C8.66927 0.925096 8.32512 0.650238 7.92809 0.650238H7.07095ZM4.92053 3.81251C5.44724 3.44339 6.05665 3.18424 6.71543 3.06839L7.07095 1.50024H7.92809L8.28355 3.06816C8.94267 3.18387 9.5524 3.44302 10.0794 3.81224L11.4397 2.9547L12.0458 3.56079L11.1882 4.92117C11.5573 5.44798 11.8164 6.0575 11.9321 6.71638L13.5 7.07183V7.92897L11.932 8.28444C11.8162 8.94342 11.557 9.55301 11.1878 10.0798L12.0453 11.4402L11.4392 12.0462L10.0787 11.1886C9.55192 11.5576 8.94241 11.8166 8.28355 11.9323L7.92809 13.5002H7.07095L6.71543 11.932C6.0569 11.8162 5.44772 11.5572 4.92116 11.1883L3.56055 12.046L2.95445 11.4399L3.81213 10.0794C3.4431 9.55266 3.18403 8.94326 3.06825 8.2845L1.50002 7.92897V7.07183L3.06818 6.71632C3.18388 6.05765 3.44283 5.44833 3.81171 4.92165L2.95398 3.561L3.56008 2.95491L4.92053 3.81251ZM9.02496 7.50008C9.02496 8.34226 8.34223 9.02499 7.50005 9.02499C6.65786 9.02499 5.97513 8.34226 5.97513 7.50008C5.97513 6.65789 6.65786 5.97516 7.50005 5.97516C8.34223 5.97516 9.02496 6.65789 9.02496 7.50008ZM9.92496 7.50008C9.92496 8.83932 8.83929 9.92499 7.50005 9.92499C6.1608 9.92499 5.07513 8.83932 5.07513 7.50008C5.07513 6.16084 6.1608 5.07516 7.50005 5.07516C8.83929 5.07516 9.92496 6.16084 9.92496 7.50008Z"
            fill="#363636"
            fillRule="evenodd"
            clipRule="evenodd"
          ></path>
        </svg>
        <p className="font-medium text-[#363636] my-auto">Settings</p>
      </button>
      <Modal
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Settings</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <div className="mt-3 flex w-full flex-row space-x-3">
              <button
                className={
                  'w-1/2 flex flex-row justify-center items-center border rounded py-2 space-x-2 ' +
                  (model == 'gpt-3.5' ? 'border-[#FF623D]' : '')
                }
                onClick={() => {
                  setModel('gpt-3.5');
                }}
              >
                <div className="h-[20px] w-[20px] rounded bg-[#5CC082] flex flex-col justify-center items-center">
                  <OpenAILogo />
                </div>
                <p className="text-[#363636] font-semibold my-auto">
                  GPT 3.5
                </p>
              </button>
              <button
                className={
                  'w-1/2 flex flex-row justify-center items-center border rounded py-2 space-x-2 ' +
                  (model == 'gpt-4' ? 'border-[#FF623D]' : '')
                }
                onClick={() => {
                  setModel('gpt-4');
                }}
              >
                <div className="h-[20px] rounded bg-[#A26BF7] w-[20px] flex flex-col justify-center items-center">
                  <OpenAILogo />
                </div>
                <p className="text-[#363636] font-semibold my-auto">
                  GPT 4
                </p>
              </button>
            </div>
          </ModalBody>
          <ModalFooter className="mt-5 flex flex-row space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-1 bg-[#FF623D] rounded hover:opacity-90 text-sm font-medium text-white"
            >
              Save
            </button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

function PromptModal({ chat, setChat }: PromptProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const finalRef = useRef(null);

  return (
    <>
      <button
        onClick={onOpen}
        className="w-1/6 py-1.5 bg-[#FF623D] hover:opacity-90 rounded flex flex-col justify-center items-center"
      >
        <PromptIcon />
      </button>
      <Modal
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent className="max-h-[500px] overflow-auto">
          <ModalHeader>Settings</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <div className=" flex w-full flex-col space-y-2">
              {Prompts.map((prompt) => {
                return (
                  <div className="flex flex-row justify-between items-between space-x-3">
                    <p className="font-semibold text-[#363636] my-auto">
                      {prompt?.title}
                    </p>
                    <button
                      onClick={() => {
                        setChat(prompt?.prompt);
                        onClose();
                      }}
                      className="px-4 py-1 bg-[#363636] text-white text-xs rounded hover:opacity-90 my-auto"
                    >
                      Use
                    </button>
                  </div>
                );
              })}
            </div>
          </ModalBody>
          <ModalFooter className="mt-5 flex flex-row space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-1 bg-[#FF623D] rounded hover:opacity-90 text-sm font-medium text-white"
            >
              Save
            </button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

function NoData() {
  return (
    <div className="flex flex-col mt-4 border border-gray-300 rounded-lg border-dashed justify-center items-center px-3 py-5 space-y-1">
      <p className="text-base font-bold text-[#363636]">
        No Data Yet
      </p>
      <span className="text-xs font-regular text-gray-400">
        Create a chat to continue
      </span>
    </div>
  );
}

function Chat({
  chat,
  chats,
  setChats,
  selectedChat,
  setSelectedChat,
  setRefetchChats,
  setMessages,
}: ChatProps) {
  return (
    <button
      onClick={() => {
        setSelectedChat(chat?.id);
      }}
      className={
        'flex flex-row w-full justify-between py-2 items-between rounded px-3 ' +
        (chat?.id == selectedChat ? 'bg-gray-200' : '')
      }
    >
      <div className="flex flex-row space-x-3">
        <svg
          width="15"
          height="15"
          viewBox="0 0 15 15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="my-auto"
        >
          <path
            d="M12.5 3L2.5 3.00002C1.67157 3.00002 1 3.6716 1 4.50002V9.50003C1 10.3285 1.67157 11 2.5 11H7.50003C7.63264 11 7.75982 11.0527 7.85358 11.1465L10 13.2929V11.5C10 11.2239 10.2239 11 10.5 11H12.5C13.3284 11 14 10.3285 14 9.50003V4.5C14 3.67157 13.3284 3 12.5 3ZM2.49999 2.00002L12.5 2C13.8807 2 15 3.11929 15 4.5V9.50003C15 10.8807 13.8807 12 12.5 12H11V14.5C11 14.7022 10.8782 14.8845 10.6913 14.9619C10.5045 15.0393 10.2894 14.9965 10.1464 14.8536L7.29292 12H2.5C1.11929 12 0 10.8807 0 9.50003V4.50002C0 3.11931 1.11928 2.00003 2.49999 2.00002Z"
            fill="currentColor"
            fillRule="evenodd"
            clipRule="evenodd"
          ></path>
        </svg>
        <p className="font-semibold my-auto text-[#363636]">
          {chat?.name ? chat?.name : 'Untitled Chat'}
        </p>
      </div>
      <div className="flex flex-row my-auto space-x-2">
        <RenameDialog
          id={chat?.id}
          setRefetchChats={setRefetchChats}
          setSelectedChat={setSelectedChat}
          setMessages={setMessages}
        />
        <DeleteDialog
          id={chat?.id}
          setRefetchChats={setRefetchChats}
          setSelectedChat={setSelectedChat}
          setMessages={setMessages}
        />
      </div>
    </button>
  );
}

export default function Sidebar({
  sidebarOpen,
  setSidebarOpen,
  userId,
  model,
  setModel,
  chat,
  setChat,
  refetchChats,
  setRefetchChats,
  selectedChat,
  setSelectedChat,
  setMessages,
}: Props) {
  const [isLoading, setIsLoading] = useState(true);
  const [chats, setChats] = useState([]);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    if (userId) {
      getChats(userId).then((value) => {
        setChats(value);
        setIsLoading(false);
      });
    }
  }, [userId]);

  useEffect(() => {
    if (refetchChats && userId) {
      getChats(userId).then((value) => {
        setChats(value);
        setRefetchChats(false);
      });
    }
  }, [refetchChats]);

  return (
    <div
      className={
        'bg-[#F7F7F7] p-4 w-[350px] flex flex-col space-y-3 justify-between items-between h-full ' +
        (!sidebarOpen && 'hidden')
      }
    >
      <div className="flex flex-col space-y-4 w-full">
        <div className="flex flex-row w-full space-x-4">
          <button
            onClick={() => {
              setSelectedChat('');
              setMessages([]);
            }}
            className="w-5/6 py-1.5 flex flex-row space-x-2 border bg-[#EDEDED] hover:bg-gray-200 justify-center items-center rounded"
          >
            <TextIcon />
            <p className="text-sm font-medium">New Chat</p>
          </button>
          <PromptModal chat={chat} setChat={setChat} />
        </div>
        <input
          value={searchText}
          onChange={(e) => {
            setSearchText(e.target.value);
          }}
          className="bg-[#EDEDED] text-[#363636] font-regualr py-1.5 px-2 rounded border border-gray-300 focus:outline-none focus:ring-0"
          placeholder="Search Chats..."
          type="text"
        />
      </div>
      <div className="flex-1 h-full flex flex-col space-y-2 overflow-auto">
        {isLoading ? (
          <div className="flex flex-col w-full mt-4 justify-center items-center">
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="my-auto animate-spin"
            >
              <g clipPath="url(#clip0_1405_2)">
                <path
                  d="M4.84457 21.6005C4.13345 21.0227 3.95568 20.0005 4.53345 19.2449C5.11123 18.5338 6.13345 18.3116 6.88901 18.8894C7.24457 19.1116 7.55568 19.3783 7.95568 19.556C11.289 21.3783 15.4223 20.756 18.089 18.0449C18.7557 17.3783 19.7779 17.3783 20.4446 18.0449C21.0668 18.7116 21.0668 19.7783 20.4446 20.4005C16.7112 24.1783 10.9335 25.1116 6.31123 22.5338C5.7779 22.2671 5.28901 21.9116 4.84457 21.6005Z"
                  fill="#ff623d"
                />
                <path
                  d="M23.8224 13.9555C23.6891 14.8888 22.8002 15.511 21.8669 15.3777C20.9335 15.2444 20.3558 14.3555 20.4891 13.4221C20.578 12.9332 20.578 12.4444 20.578 11.9555C20.578 8.0888 18.0446 4.75547 14.4891 3.73325C13.6002 3.51103 13.0669 2.53325 13.3335 1.64436C13.6002 0.755471 14.4891 0.222137 15.4224 0.488804C20.4446 1.95547 23.9558 6.62214 23.9558 11.9999C23.9558 12.6666 23.9113 13.3332 23.8224 13.9555Z"
                  fill="#ff623d"
                />
                <path
                  d="M7.42222 0.843445C8.26667 0.487889 9.24445 0.932334 9.55556 1.82122C9.86667 2.71011 9.46667 3.68789 8.62222 4.04344C5.42222 5.33233 3.28889 8.48789 3.28889 12.0879C3.28889 12.799 3.37778 13.5101 3.55556 14.1768C3.77778 15.0657 3.24444 15.999 2.35556 16.2212C1.46667 16.4434 0.577778 15.9101 0.355556 14.9768C0.133333 13.999 0 13.0212 0 12.0434C0 7.02122 2.97778 2.62122 7.42222 0.843445Z"
                  fill="#ff623d"
                />
              </g>
              <defs>
                <clipPath id="clip0_1405_2">
                  <rect width="24" height="24" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </div>
        ) : chats.length == 0 ? (
          <NoData />
        ) : (
          <>
            {chats
              .sort((a: any, b: any) => {
                //@ts-ignore
                return (
                  //@ts-ignore
                  new Date(b?.created_at) - new Date(a?.created_at)
                );
              })
              .map((chat: any, index: number) => {
                return (
                  <Chat
                    key={index}
                    chat={chat}
                    chats={chats}
                    setChats={setChats}
                    selectedChat={selectedChat}
                    setSelectedChat={setSelectedChat}
                    setRefetchChats={setRefetchChats}
                    setMessages={setMessages}
                  />
                );
              })}
          </>
        )}
      </div>
      <div className="flex flex-col space-y-3.5">
        <OpenAI />
        <Settings model={model} setModel={setModel} />
      </div>
    </div>
  );
}
