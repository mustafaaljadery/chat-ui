import Header from './Header';
import { Dispatch, SetStateAction, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

interface Props {
  sidebarOpen: boolean;
  setSidebarOpen: Dispatch<SetStateAction<boolean>>;
  chat: string;
  setChat: Dispatch<SetStateAction<string>>;
}

async function getChat(id: string) {
  try {
  } catch (e) {
    console.log(e);
  }
}

async function sendMessage() {
  try {
    const key = localStorage.getItem('key');
    if (!key) {
      toast.error('Make sure to add your OpenAI key', {
        className: 'font-medium text-sm text-[#363636]',
      });
      return;
    }
  } catch (e) {
    console.log(e);
  }
}

function AIMessage() {
  return <div></div>;
}

function MyMessage() {
  return <div></div>;
}

export default function Chat({
  sidebarOpen,
  setSidebarOpen,
  chat,
  setChat,
}: Props) {
  const [messages, setMessages] = useState<any>([]);
  const [generatingResponse, setGeneratingResponse] = useState(false);

  return (
    <div className="flex flex-col w-full h-full flex-1">
      <Header
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      <main className="flex-1 py-4 px-6 h-full w-full flex flex-col justify-between items-betwen">
        {messages.length == 0 ? <div></div> : <div></div>}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setMessages([...messages, { text: chat, type: 'me' }]);
            sendMessage();
            setChat('');
          }}
          className="w-full border rounded-lg px-4 py-2 text-[#363636] flex flex-row justify-between items-between"
        >
          <input
            value={chat}
            onChange={(e) => {
              setChat(e.target.value);
            }}
            placeholder="Message..."
            type="text"
            className="w-full font-medium focus:outline-none focus:ring-0 focus:border-none"
          />
          <button
            type="submit"
            className="p-2 flex flex-col justify-center items-center rounded bg-[#FF623D]"
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 15 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className=""
            >
              <path
                d="M1.20308 1.04312C1.00481 0.954998 0.772341 1.0048 0.627577 1.16641C0.482813 1.32802 0.458794 1.56455 0.568117 1.75196L3.92115 7.50002L0.568117 13.2481C0.458794 13.4355 0.482813 13.672 0.627577 13.8336C0.772341 13.9952 1.00481 14.045 1.20308 13.9569L14.7031 7.95693C14.8836 7.87668 15 7.69762 15 7.50002C15 7.30243 14.8836 7.12337 14.7031 7.04312L1.20308 1.04312ZM4.84553 7.10002L2.21234 2.586L13.2689 7.50002L2.21234 12.414L4.84552 7.90002H9C9.22092 7.90002 9.4 7.72094 9.4 7.50002C9.4 7.27911 9.22092 7.10002 9 7.10002H4.84553Z"
                fill="white"
                fillRule="evenodd"
                clipRule="evenodd"
              ></path>
            </svg>
          </button>
        </form>
      </main>
    </div>
  );
}
