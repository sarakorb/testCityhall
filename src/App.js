import React, { useEffect, useState } from 'react'
import axios from 'axios'
import BmiSharesTable from './components/bmiSharesTable'

const BMI_SHARES_URL='https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=IBM&apikey=demo'


function App() {

  const [shares,setShares]=useState([]);

  useEffect(()=>{

    axios.get(BMI_SHARES_URL)
    .then(res=>{
      console.log(res.data["Time Series (Daily)"])
      setShares(res.data["Time Series (Daily)"])
      
    })
    .catch(err=>{
      console.log(err);
    })

  },[])

  

  return (
    <div>
      <BmiSharesTable sharesData={shares}/>
    </div>
  );
}

export default App;
