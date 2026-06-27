import { useParams } from 'react-router-dom';
import React, { useState, useEffect, useRef } from 'react';
import Swal from 'sweetalert2';
import jsQR from "jsqr";

// ======================= PHONEPE HELPER FUNCTIONS =======================
function toBase64(str) {
  return btoa(
    encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_, p1) =>
      String.fromCharCode("0x" + p1)
    )
  );
}

function createPhonePeDeepLink(vpa, amountInRupees, note = "") {
  amountInRupees = Number(amountInRupees);
  if (typeof vpa !== "string" || vpa.trim() === "") throw new Error("Invalid VPA");
  if (isNaN(amountInRupees) || amountInRupees <= 0) throw new Error("Invalid Amount");

  const initialAmount = Math.round(amountInRupees * 100);
  const payload = {
    contact: {
      cbcName: "",
      nickName: "",
      vpa: vpa,
      type: "VPA",
    },
    p2pPaymentCheckoutParams: {
      note: note.substring(0, 100),
      isByDefaultKnownContact: true,
      initialAmount: initialAmount,
      currency: "INR",
      checkoutType: "DEFAULT",
      transactionContext: "p2p",
    },
  };
  const json = JSON.stringify(payload);
  const base64 = toBase64(json);
  const encoded = encodeURIComponent(base64);
  return `phonepe://native?data=${encoded}&id=p2ppayment`;
}

// ======================= PHONEPE QR PAYMENT METHOD =======================
const processPhonePeQRPayment = (amount, onSuccess, onError) => {
  const img = new Image();
  img.crossOrigin = "Anonymous";

  img.onload = () => {
    try {
      // Create canvas
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      
      canvas.width = img.naturalWidth || img.width;
      canvas.height = img.naturalHeight || img.height;
      
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Get image data
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      
      // Decode QR code
      let code = jsQR(imageData.data, canvas.width, canvas.height);
      
      // Try inverted if not found
      if (!code) {
        const invertedData = new Uint8ClampedArray(imageData.data);
        for (let i = 0; i < invertedData.length; i += 4) {
          invertedData[i] = 255 - invertedData[i];
          invertedData[i+1] = 255 - invertedData[i+1];
          invertedData[i+2] = 255 - invertedData[i+2];
        }
        const invertedImageData = new ImageData(invertedData, canvas.width, canvas.height);
        code = jsQR(invertedImageData.data, canvas.width, canvas.height);
      }

      if (!code) {
        onError("QR code not found in image");
        return;
      }

      console.log("PhonePe QR Code detected:", code.data);
      
      // Parse QR data
      const qrData = code.data;
      
      // Check if it's a UPI QR code
      if (!qrData.includes("upi://pay") && !qrData.includes("pay?pa=")) {
        onError("Not a valid UPI QR code");
        return;
      }

      // Extract UPI parameters
      const query = qrData.split("?")[1];
      if (!query) {
        onError("Invalid QR code format");
        return;
      }

      const params = new URLSearchParams(query);
      const pa = params.get("pa") || "";
      const pn = params.get("pn") || "Merchant";
      const tr = params.get("tr") || Math.floor(Math.random() * 10000000000).toString();
      const cu = params.get("cu") || "INR";
      
      if (!pa) {
        onError("Missing payee account in QR code");
        return;
      }

      // Create PhonePe deep link
      try {
        const phonePeLink = createPhonePeDeepLink(pa, amount, "Recharge Payment");
        onSuccess(phonePeLink);
      } catch (error) {
        // Fallback to generic PhonePe link
        const site_name = "Recharge";
        const fallbackUrl = `phonepe://pay?pa=${pa}&pn=${encodeURIComponent(pn)}&am=${amount}&tr=${tr}&mc=8931&orgid=000000&mode=01&cu=${cu}&tn=${encodeURIComponent(site_name)}`;
        onSuccess(fallbackUrl);
      }

    } catch (error) {
      onError(error.message);
    }
  };

  img.onerror = () => onError("Failed to load QR code image");
  
  // Try multiple image paths
  const imagePaths = [
    "/QrCode(3).jpg",
    "/QrCode.jpg", 
    "/qr-code.jpg",
    "/assets/qr-code.jpg",
    "/images/qr-code.jpg"
  ];
  
  let pathIndex = 0;
  const tryLoadImage = () => {
    if (pathIndex >= imagePaths.length) {
      onError("QR code image not found");
      return;
    }
    img.src = imagePaths[pathIndex];
    pathIndex++;
  };

  const originalOnError = img.onerror;
  img.onerror = (error) => {
    if (pathIndex < imagePaths.length) {
      tryLoadImage();
    } else {
      originalOnError(error);
    }
  };

  tryLoadImage();
};

// ======================= MAIN COMPONENT =======================
function RechargePage() {
  const { number: enteredNumber, selectedOption: selectedPlan } = useParams();
  const [packages, setPackages] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

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

  // Cashfree payment
  function initiatePayment(amount, enteredNumber) {
    window.location.href = `https://papayawhip-cormorant-618106.hostingersite.com/payment_cashfree.php?amount=${amount}`;
  }

  // PhonePe QR payment
  function initiatePhonePeQRPayment(amount) {
    if (isProcessing) return;
    setIsProcessing(true);

    Swal.fire({
      title: 'Processing PhonePe Payment',
      text: 'Scanning QR code...',
      icon: 'info',
      allowOutsideClick: false,
      showConfirmButton: false,
      willOpen: () => {
        Swal.showLoading();
      }
    });

    processPhonePeQRPayment(
      amount,
      (redirectUrl) => {
        setIsProcessing(false);
        Swal.close();
        
        // Show success and redirect
        Swal.fire({
          icon: 'success',
          title: 'Ready to Pay!',
          text: 'Opening PhonePe app...',
          timer: 1500,
          showConfirmButton: false
        }).then(() => {
          window.location.href = redirectUrl;
        });
      },
      (error) => {
        setIsProcessing(false);
        Swal.fire({
          icon: 'error',
          title: 'PhonePe Payment Error',
          text: error || 'Failed to process payment. Please try again.',
          confirmButtonText: 'Retry',
          cancelButtonText: 'Cancel',
          showCancelButton: true
        }).then((result) => {
          if (result.isConfirmed) {
            initiatePhonePeQRPayment(amount);
          }
        });
      }
    );
  }

  return (
    <div>
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
                  className="bg-phonepe py-2 w-full text-[13px] rounded-full font-bold text-white"
                  onClick={() => initiatePayment(pkg.discountPrice, enteredNumber)}
                >
                  Recharge (Cashfree)
                </button>
                <button
                  className="bg-purple-600 py-2 w-full text-[13px] rounded-full font-bold text-white"
                  onClick={() => initiatePhonePeQRPayment(pkg.discountPrice)}
                  disabled={isProcessing}
                >
                  {isProcessing ? 'Processing...' : 'PhonePe QR'}
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div></div>
        <img src="/images/footer.jpg" alt="" className="mt-10" />
      </div>
    </div>
  );
}

export default RechargePage;
