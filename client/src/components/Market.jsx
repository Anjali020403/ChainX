import React, { useEffect, useState } from 'react';

function Market() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8080/');
        const jsonData = await response.json();
        setData(jsonData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h2>Market Data</h2>
      <table>
        <thead>
          <tr>
            <th>Symbol</th>
            <th>Last</th>
            <th>Vol</th>
            <th>Open</th>
            <th>High</th>
            <th>Low</th>
            <th>Close</th>
            <th>Bid</th>
            <th>Ask</th>
            <th>Time</th>
            <th>Prev close</th>
            <th>Change</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td className="text-white">{item['Trading Symbol']}</td>
              <td className="text-white">{item['Last Traded Price (LTP)']}</td>
              <td className="text-white">{item['Volume']}</td>
              <td className="text-white">{item['Open']}</td>
              <td className="text-white">{item['High']}</td>
              <td className="text-white">{item['Low']}</td>
              <td className="text-white">{item['Close']}</td>
              <td className="text-white">{item['Bid Price']}</td>
              <td className="text-white">{item['Ask Price']}</td>
              <td className="text-white">{item['Timestamp']}</td>
              <td className="text-white">{item['Previous Close Price']}</td>
              <td className="text-white">{item['Change']}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Market;
