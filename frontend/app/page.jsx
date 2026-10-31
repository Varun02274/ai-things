"use client"

import { useState } from 'react'

import { TailSpin } from "react-loader-spinner";

export default function Home() {

  const [input, setInput] = useState("")
  const [chat, setChat] = useState("")
  const [loading, setLoading] = useState(false)

  async function ai(e) {

    e.preventDefault();
    setLoading(true)
    let responsePromise = fetch("http://192.168.1.9:8000/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        query: input
      })
    })

    let response = await responsePromise

    setLoading(false)
    
    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();

      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      setChat((prev) => prev + chunk);
    }

    setInput("")


  }
  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-center items-center">
      <h1 className='fixed top-6 text-4xl'>Ai thing</h1>
      {!loading && !chat && (
        <h2 className="text-3xl sm:text-4xl mb-8 text-center">
          How can I help you today?
        </h2>
      )}
      {loading && <TailSpin
        visible={true}
        height="80"
        width="80"
        color="#ffffff"
        ariaLabel="tail-spin-loading"
        radius="1"
        wrapperStyle={{}}
        wrapperClass="mb-8"
      />}
      {!loading && chat && <div className="mt-24 mb-4 w-full max-w-3xl
                    max-h-[60vh] overflow-y-auto p-4">
        <p className="text-2xl whitespace-pre-wrap wrap-break-word">
          {chat}
        </p>
      </div>}
      <form onSubmit={ai} className='text-base sm:text-xl flex flex-col mt-4 w-full max-w-xl'>
        <input
          type="text"
          value={input}
          onChange={(e) => { setInput(e.target.value) }}
          className='border-2 rounded-xl border-slate-200 shadow-sm p-4 text-2xl w-full max-w-xl text-center'
          placeholder='Ask something'
        />
      </form>

    </div>
  )
}