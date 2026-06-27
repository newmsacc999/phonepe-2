// src/components/PaymentFailed.jsx
import React from 'react';
import { Link } from 'react-router-dom';

function PaymentFailed() {
  const containerStyle = {
    minHeight: '80vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    backgroundColor: 'rgb(249, 249, 249)',
    padding: '20px',
  };

  const titleStyle = {
    fontSize: '24px',
    fontWeight: 'bold',
    color: 'rgb(192, 57, 43)',
  };

  const paragraphStyle = {
    fontSize: '16px',
    color: 'rgb(85, 85, 85)',
  };

  const refundTextStyle = {
    fontSize: '14px',
    marginTop: '10px',
    color: 'rgb(136, 136, 136)',
  };

  const buttonStyle = {
    marginTop: '20px',
    display: 'inline-block',
    padding: '10px 20px',
    backgroundColor: 'rgb(95, 37, 159)',
    color: 'white',
    borderRadius: '8px',
    textDecoration: 'none',
  };

  return (
    <div>
      <div
        class="py-4 px-6 bg-white flex items-center justify-between border-b border-slate-100 mb-0"
      >
        <div class="flex items-center">
          <svg
            stroke="currentColor"
            fill="currentColor"
            stroke-width="0"
            viewBox="0 0 448 512"
            class="text-[#5F259F] mr-3"
            height="19"
            width="19"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M16 132h416c8.837 0 16-7.163 16-16V76c0-8.837-7.163-16-16-16H16C7.163 60 0 67.163 0 76v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16z"
            ></path></svg
          ><a href="/"
            ><img
              src="/images/phonepe.png"
              alt=""
              class="h-8"
          /></a>
        </div>



        

        
        <div>
          <svg
            stroke="currentColor"
            fill="currentColor"
            stroke-width="0"
            viewBox="0 0 512 512"
            class="text-[#5F259F]"
            height="25"
            width="25"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M399 384.2C376.9 345.8 335.4 320 288 320H224c-47.4 0-88.9 25.8-111 64.2c35.2 39.2 86.2 63.8 143 63.8s107.8-24.7 143-63.8zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zm256 16a72 72 0 1 0 0-144 72 72 0 1 0 0 144z"
            ></path>
          </svg>
        </div>
      </div>
    
    <div style={containerStyle}>
      <h1 style={titleStyle}>Your payment has been failed!</h1>
      <p style={paragraphStyle}>Please try again.</p>
      <p style={refundTextStyle}>
        <strong>Don't worry!</strong> <br />
        Your money will be refunded in 7 working days.
      </p>
      <Link to="/" style={buttonStyle}>Back to Home</Link>
    </div>
</div>
  );
}

export default PaymentFailed;