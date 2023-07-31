import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Chat from '@/components/Chat';
import axios from 'axios';
import { useChat } from 'ai/react';
import Head from 'next/head';

async function createUser() {
  try {
    const result = await axios.post('/api/user');
    return result.data;
  } catch (e) {
    console.log(e);
  }
}
export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [initialMessages, setInitialMessages] = useState<any[]>([]);
  const [selectedChat, setSelectedChat] = useState('');
  const [model, setModel] = useState('gpt-3.5');
  const [key, setKey] = useState('');
  const [refetchChats, setRefetchChats] = useState(false);

  const { messages, setMessages, handleSubmit, input, setInput } =
    useChat({
      api: '/api/chat/route',
      body: {
        key: key,
        chatId: selectedChat,
        model: model,
      },
    });

  useEffect(() => {
    if (localStorage.getItem('key')) {
      setKey(localStorage.getItem('key') || '');
    }
    if (localStorage.getItem('userId')) {
      setUserId(localStorage.getItem('userId'));
    } else {
      createUser().then((user) => {
        localStorage.setItem('userId', user?.id);
        setUserId(user?.id);
      });
    }
  }, []);

  return (
    <>
      <Head>
        <title>Chat UI</title>
      </Head>
      <div className="flex flex-col h-[100vh] w-[100vw] overflow-hidden">
        <div className="flex flex-row h-full w-full">
          <Sidebar
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            userId={userId}
            model={model}
            setModel={setModel}
            chat={input}
            setChat={setInput}
            refetchChats={refetchChats}
            setRefetchChats={setRefetchChats}
            selectedChat={selectedChat}
            setSelectedChat={setSelectedChat}
            setMessages={setMessages}
          />
          <Chat
            initialMessages={initialMessages}
            setInitialMessages={setInitialMessages}
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            chat={input}
            setChat={setInput}
            selectedChat={selectedChat}
            setSelectedChat={setSelectedChat}
            userId={userId as string}
            handleSubmit={handleSubmit}
            messages={messages}
            setRefetchChats={setRefetchChats}
            setMessages={setMessages}
          />
        </div>
      </div>
    </>
  );
}
