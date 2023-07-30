import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Chat from '@/components/Chat';
import axios from 'axios';

async function createUser() {
  try {
    const result = await axios.post('/api/user');
    return result.data;
  } catch (e) {
    console.log(e);
  }
}
export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [chat, setChat] = useState('');
  const [model, setModel] = useState('gpt-3.5');

  useEffect(() => {
    if (localStorage.getItem('userId')) {
      setUserId(localStorage.getItem('userId'));
    } else {
      createUser().then((user) => {
        localStorage.setItem('userId', user?.id);
        setUserId(userId);
      });
    }
  }, []);

  return (
    <div className="flex flex-col h-[100vh] w-[100vw] overflow-hidden">
      <div className="flex flex-row h-full w-full">
        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          userId={userId}
          model={model}
          setModel={setModel}
          chat={chat}
          setChat={setChat}
        />
        <Chat
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          chat={chat}
          setChat={setChat}
        />
      </div>
    </div>
  );
}
