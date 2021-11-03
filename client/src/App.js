import './App.css'
import { useState, useEffect } from 'react';
import socketIOClient from "socket.io-client";
import React from "react"




function App() {
  const [response, setresponse] = useState(false)
  const [endpoint, setendpoint] = useState("http://127.0.0.1:4001")
  const [bidQty, setBidQty] = useState()
  const [bidPrice, setBidPrice] = useState()
  const [askQty, setAskQty] = useState()
  const [askPrice, setAskPrice] = useState()

  useEffect(() => {

    const socket = socketIOClient(endpoint);

    socket.on("FromAPI", data => setresponse(data));
    if (response !== undefined && response) {
      setAskPrice(response[0].askPrice)
      setBidQty(response[0].bidQty)
      setBidPrice(response[0].bidPrice)
      setAskQty(response[0].askQty)
    }

    return () => {
      socket.disconnect()
    }
  }, [response])

  return (
    <div>

      <table className="container">
        <tr>
          <td>
            <table>
              <tr><th>Bid Qty</th></tr>
              {bidQty ? bidQty.map((s) => {
                return <tr><td className="red">{s}</td></tr>
              }) : <p>Loading...</p>}
            </table>
          </td>

          <td>
            <table>
              <tr><th>Bid price</th></tr>
              {bidPrice ? bidPrice.map((s) => {
                return <tr><td className="red">{s}</td></tr>
              }) : <p>Loading...</p>}
            </table>
          </td>

          <td>
            <table>
              <tr><th>Ask price</th></tr>
              {askPrice ? askPrice.map((s) => {
                return <tr><td className="green">{s}</td></tr>
              }) : <p>Loading...</p>}
            </table>
          </td>
          <td>
            <table>
              <tr><th>Ask Qty</th></tr>
              {askQty ? askQty.map((s) => {
                return <tr><td className="green">{s}</td></tr>
              }) : <p>Loading...</p>}
            </table>
          </td>
        </tr>
      </table>
    </div>
  )
}

export default App;
