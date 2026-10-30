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
    let data = await response.json()
    setLoading(false)
    setInput("")
    setChat(data.message)

  }
  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-center items-center">
      <h1 className='fixed top-6 text-4xl'>Ai thing</h1>
      {loading && <TailSpin
        visible={true}
        height="80"
        width="80"
        color="#ffffff"
        ariaLabel="tail-spin-loading"
        radius="1"
        wrapperStyle={{}}
        wrapperClass=""
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