"use client"

import {useState} from 'react'

export default function Home(){

  const [input,setInput] = useState("")
  const [chat,setChat] = useState("")

  async function ai(e){

    e.preventDefault();

    let response = await fetch("http://127.0.0.1:8000/chat",{
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        query: input
      })
    })

    let data = await response.json()

    setChat(data.message)
    
  }
  return(
    <div>
      <h1>ai thing</h1>
      <form onSubmit={ai}>
        <input
        type = "text"
        value = {input}
        onChange={(e)=>{setInput(e.target.value)}}
        />
        <button type='submit'>Submit</button>
      </form>
      <p>{chat}</p>
    </div>
  )
}