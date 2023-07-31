'use client';

import Header from './Header';
import {
  Dispatch,
  useRef,
  SetStateAction,
  useState,
  useEffect,
} from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';

interface Props {
  sidebarOpen: boolean;
  setSidebarOpen: Dispatch<SetStateAction<boolean>>;
  chat: string;
  setChat: Dispatch<SetStateAction<string>>;
  selectedChat: string;
  setSelectedChat: Dispatch<SetStateAction<string>>;
  userId: string;
  messages: any;
  handleSubmit: any;
  setRefetchChats: Dispatch<SetStateAction<boolean>>;
  initialMessages: any;
  setInitialMessages: Dispatch<SetStateAction<any[]>>;
  setMessages: Dispatch<SetStateAction<any>>;
}

interface ComponentProps {
  value: any;
}

async function getChat(id: string) {
  try {
    const result = await axios.get(`/api/chat/get`, {
      params: {
        id: id,
      },
    });
    return result.data;
  } catch (e) {
    console.log(e);
  }
}

async function updateChat(id: string, messages: any) {
  try {
    const result = await axios.put(`/api/chat/update`, {
      id: id,
      messages: JSON.stringify(messages),
    });
    return result.data;
  } catch (e) {
    console.log(e);
  }
}

async function createChat(userId: string) {
  try {
    const result = await axios.post(`/api/chat/create`, {
      userId: userId,
    });
    return result.data;
  } catch (e) {
    console.log(e);
  }
}

function AIMessage({ value }: ComponentProps) {
  return (
    <div className="w-full flex flex-row space-x-3 justify-start items-start">
      <div className="min-h-[36px] min-w-[36px] mb-auto flex flex-col justify-center items-center rounded-full bg-[#363636]">
        <p className="text-white font-semibold text-sm">AI</p>
      </div>
      <div className="my-auto bg-gray-50 rounded-lg px-4 py-1.5 border">
        <p className="text-sm font-medium text-[#363636]">
          {value?.content}
        </p>
      </div>
    </div>
  );
}

function MyMessage({ value }: ComponentProps) {
  return (
    <div className="w-full flex flex-row space-x-3 justify-end items-end">
      <div className="my-auto bg-gray-50 rounded-lg border px-4 py-1.5">
        <p className="text-sm font-medium text-[#363636]">
          {value?.content}
        </p>
      </div>
      <div className="min-h-[36px] min-w-[36px] mb-auto flex flex-col justify-center items-center rounded-full bg-[#FF623D]">
        <p className="text-white font-semibold text-sm">ME</p>
      </div>
    </div>
  );
}

export default function Chat({
  sidebarOpen,
  setSidebarOpen,
  chat,
  setChat,
  selectedChat,
  setSelectedChat,
  userId,
  messages,
  handleSubmit,
  setRefetchChats,
  initialMessages,
  setInitialMessages,
  setMessages,
}: Props) {
  const messagesEndRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [generating, setGenerating] = useState(false);

  const scrollToBottom = () => {
    //@ts-ignore
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
      inline: 'nearest',
    });
  };

  useEffect(() => {
    scrollToBottom();
    const timeoutId = setTimeout(() => {
      if (selectedChat) {
        updateChat(selectedChat, messages);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [messages]);

  useEffect(() => {
    if (selectedChat && !creating) {
      setIsLoading(true);
      getChat(selectedChat).then((chat) => {
        setMessages(JSON.parse(chat?.messages) || []);
        setIsLoading(false);
      });
    }
  }, [selectedChat]);

  return (
    <div className="flex flex-col w-full h-full flex-1">
      <Header
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      <main className="flex-1 py-4 h-full w-full flex flex-col justify-between items-center">
        <div className="overflow-auto px-6 mb-32 h-full w-full">
          {isLoading ? (
            <div className="flex flex-row h-full w-full space-x-4 justify-center items-center">
              <svg
                width="18"
                height="18"
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
              <p className="text-2xl font-bold my-auto text-[#363636]">
                Getting Chat
              </p>
            </div>
          ) : messages.length == 0 || !selectedChat ? (
            <div className="w-full h-full flex flex-col justify-center flex-1 space-y-5 items-center">
              <p className="text-4xl font-bold text-gray-900">
                Open Chat
              </p>
              <span className="text-sm font-semibold text-gray-400">
                An open-source chat ui, by Max Aljadery.
              </span>
            </div>
          ) : (
            <div className="flex flex-col space-y-5">
              {messages.map((message: any, index: number) => {
                if (message.role == 'user') {
                  return <MyMessage value={message} key={index} />;
                } else {
                  return <AIMessage value={message} key={index} />;
                }
              })}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setGenerating(true);
            setChat('');

            const key = localStorage.getItem('key');

            if (!key) {
              toast.error('Make sure to add your OpenAI key', {
                className: 'font-medium text-sm text-[#363636]',
              });
            } else if (!selectedChat) {
              setCreating(true);
              createChat(userId).then((value) => {
                setSelectedChat(value?.id);
                handleSubmit(e);
                setRefetchChats(true);
                setCreating(false);
                setGenerating(false);
              });
            } else {
              handleSubmit(e);
              setGenerating(false);
            }
          }}
          className="w-1/2 border rounded-lg fixed mb-4 bottom-0 mx-6 px-3 py-2 text-[#363636] flex flex-row justify-between items-between"
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
            disabled={generating}
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
