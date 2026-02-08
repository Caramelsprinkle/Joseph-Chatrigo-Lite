'use client'

import Logo from '@components/Logo'
import message from '@components/message'
import { timeStamp } from 'console'

import { useState } from 'react'


const Chat = () => {
  const [ messages, setMessages ] = useState<Array<{text: string}>>([]);
  const [ input, setInput ] = useState<string>('');

  function sendMessage( e: React.SyntheticEvent<HTMLFormElement> ){
    e.preventDefault()
    if(input.trim() === '') return
    
    setMessages([...messages, { text: input, id: Date.now()}])
    setInput('')
  }

  return (
    <div className='flex flex-col h-screen w-screen bg-slate-300'>
      <Logo />
      <div className='flex grow justify-around content-around pt-1 pb-1'>
        <div className='bg-neutral-50 w-1/5 h-auto ml-1 rounded-lg'>
          test1
        </div>

        <div className='bg-neutral-50 w-4/5 h-auto ml-1 mr-1 rounded-lg flex flex-col'>
          <div className='h-11/12 overflow-y-auto'>
            {messages.map((msg) => (
              <div key={msg.id} className='p-2 m-2 bg-blue-100 rounded-lg break-words'>
                {msg.text}
              </div>
            ))}
          </div>

          <div className='h-1/12'>
            <form className='flex' onSubmit={sendMessage}>
              <div className='w-11/12 pl-2 pr-4'>
                <input 
                  className='w-full pl-2 h-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500' 
                  placeholder='Type a message...'
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                ></input>
              </div>

              <div className='w-1/12 pr-2'>
                <button className='w-full h-10 bg-orange-400 text-white rounded-lg hover:bg-orange-300 focus:outline-none focus:ring-2 focus:ring-blue-500'
                  onSubmit={sendMessage}
                >Send</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Chat