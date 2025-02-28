"use client"; // Required for using useState
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import CalenderIcon from "@/public/images/calenderIcon.svg";
import LockIcon from "@/public/images/lockIcon.svg";
import SuccessIcon from "@/public/images/successIcon.svg";
import ErrorIcon from "@/public/images/errorIcon.svg";

function CheckoutPage() {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);

  useEffect(() => {
    const storedPlan = localStorage.getItem("selectedPlan");
    if (storedPlan) {
      setSelectedPlan(JSON.parse(storedPlan));
    } else {
      router.push("/pricing"); // Redirect if no plan is selected
    }
  }, [router]);

  const handlePayment = () => {
    const cardInputs = document.querySelectorAll(".inputField");
    let isValid = true;

    cardInputs.forEach((input) => {
      if (!input.value.trim()) {
        isValid = false;
      }
    });

    if (isValid) {
      setShowSuccessPopup(true);
    } else {
      setShowErrorPopup(true);
    }
  };

  if (!selectedPlan) {
    return <p>Loading...</p>;
  }

  return (
    <section className="flex w-full p-[100px] flex-col items-center relative">
      <div className="checkoutWrapper flex w-[1200px] gap-[30px] mt-[30px]">
        {/* Left Side - Payment Form */}
        <div className="checkoutForm flex flex-col gap-[37px] p-[32px] w-[683px]">
          <div className="headingCheckout flex gap-[12px] items-center">
            <Image
              src={LockIcon}
              alt="Secure Icon"
              className="w-[40px] h-[40px]"
            />
            <h2 className="BRCobane18500">
              Secure Payment - 256-bit Encryption
            </h2>
          </div>

          {/* Card Information */}
          <div className="flex flex-col gap-[15px]">
            <label className="BRCobane20600">Card Information</label>
            <input
              type="text"
              placeholder="Cardholder Name"
              className="inputField"
            />
            <input
              type="text"
              placeholder="Card Number"
              className="inputField"
            />
            <div className="flex gap-[10px]">
              <input
                type="text"
                placeholder="Expiry Date (MM/YY)"
                className="inputField"
              />
              <input type="text" placeholder="CVV" className="inputField" />
            </div>
          </div>

          {/* Billing Information */}
          <div className="flex flex-col gap-[15px] mt-[20px]">
            <label className="BRCobane20600">Billing Information</label>
            <input type="text" placeholder="Full Name" className="inputField" />
            <input type="text" placeholder="Address" className="inputField" />
            <div className="flex gap-[10px]">
              <input type="text" placeholder="City" className="inputField" />
              <input type="text" placeholder="State" className="inputField" />
            </div>
            <div className="flex gap-[10px]">
              <input
                type="text"
                placeholder="Zip Code"
                className="inputField w-[30%]"
              />
              <input type="text" placeholder="Country" className="inputField" />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-[10px] w-full items-center justify-center">
            <button
              className="large-white-btn w-full"
              onClick={() => router.push("/pricing")}
            >
              Back to Plans
            </button>
            <button className="yellow-btn w-full" onClick={handlePayment}>
              Complete Payment
            </button>
          </div>
        </div>

        {/* Right Side - Selected Plan Info */}
        <div className="planSummary">
          <h2 className="BRCobane20600">Plan Information</h2>
          <h3 className="BRCobane20600">{selectedPlan.name}</h3>
          <p className="BRCobane24600">
            <span className="BRCobane40600">{selectedPlan.price}</span>/mo
          </p>
          <p className="flex items-center gap-[10px]">
            <Image
              src={CalenderIcon}
              alt="Calendar Icon"
              className="w-[24px] h-[24px]"
            />
            {selectedPlan.duration}
          </p>
        </div>
      </div>

      {/* Dark Overlay when popup appears */}
      {(showSuccessPopup || showErrorPopup) && (
        <div className="popup-overlay"></div>
      )}

      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="popup success-popup">
          <div className="popup-content">
            <Image
              src={SuccessIcon}
              alt="Success Icon"
              className="popup-icon"
            />
            <h2 className="BRCobane24600">
              <span className="text-[#278A14]">Payment Successful!</span>{" "}
              Welcome to {selectedPlan.name}!
            </h2>
            <div className="planSummary w-full">
              <h3 className="BRCobane20600">Summary Details</h3>
              <p className="BRCobane24600">
                <span className="BRCobane40600">{selectedPlan.price}</span>/mo
              </p>
              <p className="flex items-center gap-[10px]">
                <Image
                  src={CalenderIcon}
                  alt="Calendar Icon"
                  className="w-[24px] h-[24px]"
                />
                {selectedPlan.duration}
              </p>
            </div>
            <div className="popup-buttons w-full">
              <button
                onClick={() => router.push("/")}
                className="large-white-btn w-full"
              >
                Return to Homepage
              </button>
              <button
                onClick={() => router.push("/dashboard")}
                className="yellow-btn w-full"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error Popup */}
      {showErrorPopup && (
        <div className="popup error-popup">
          <div className="popup-content">
            <Image src={ErrorIcon} alt="Error Icon" className="popup-icon" />
            <h2 className="BRCobane24600Red">Payment Failure!</h2>
            <p className="BRCobane20600 text-start">
              We were unable to process your payment. Please check your card
              details or try a different payment method.
            </p>
            <div className="popup-buttons w-full">
              <button
                onClick={() => router.push("/contact")}
                className="large-white-btn w-full"
              >
                Contact Support
              </button>
              <button
                onClick={() => setShowErrorPopup(false)}
                className="yellow-btn w-full"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CSS for Popups and Overlay */}
      <style jsx>{`
        .popup-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          z-index: 999;
        }
        .popup-content {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 24px;
          flex-shrink: 0;
        }
        .popup {
          width: 683px;
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: white;
          padding: 32px;
          border-radius: 10px;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
          z-index: 1000;
          text-align: center;
        }
        .popup-buttons {
          display: flex;
          justify-content: center;
          gap: 10px;
          margin-top: 20px;
        }
      `}</style>
    </section>
  );
}

export default CheckoutPage;

// "use client"; // Required for using useState
// import React, { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import Image from "next/image";
// import CalenderIcon from "@/public/images/calenderIcon.svg";
// import LockIcon from "@/public/images/lockIcon.svg";
// import SuccessIcon from "@/public/images/successIcon.svg";
// import ErrorIcon from "@/public/images/errorIcon.svg";

// function CheckoutPage() {
//   const router = useRouter();
//   const [selectedPlan, setSelectedPlan] = useState(null);
//   const [showSuccessPopup, setShowSuccessPopup] = useState(false);
//   const [showErrorPopup, setShowErrorPopup] = useState(false);

//   useEffect(() => {
//     const storedPlan = localStorage.getItem("selectedPlan");
//     if (storedPlan) {
//       setSelectedPlan(JSON.parse(storedPlan));
//     } else {
//       router.push("/pricing"); // Redirect if no plan is selected
//     }
//   }, [router]);

//   const handlePayment = () => {
//     const cardInputs = document.querySelectorAll(".inputField");
//     let isValid = true;

//     cardInputs.forEach((input) => {
//       if (!input.value.trim()) {
//         isValid = false;
//       }
//     });

//     if (isValid) {
//       setShowSuccessPopup(true);
//     } else {
//       setShowErrorPopup(true);
//     }
//   };

//   if (!selectedPlan) {
//     return <p>Loading...</p>;
//   }

//   return (
//     <section className="flex w-full p-[100px] flex-col items-center">
//       <div className="checkoutWrapper flex w-[1200px] gap-[30px] mt-[30px]">
//         {/* Left Side - Payment Form */}
//         <div className="checkoutForm flex flex-col gap-[37px] p-[32px] w-[683px]">
//           <div className="headingCheckout flex gap-[12px] items-center">
//             <Image
//               src={LockIcon}
//               alt="Secure Icon"
//               className="w-[40px] h-[40px]"
//             />
//             <h2 className="BRCobane18500">
//               Secure Payment - 256-bit Encryption
//             </h2>
//           </div>

//           {/* Card Information */}
//           <div className="flex flex-col gap-[15px]">
//             <label className="BRCobane20600">Card Information</label>
//             <input
//               type="text"
//               placeholder="Cardholder Name"
//               className="inputField"
//             />
//             <input
//               type="text"
//               placeholder="Card Number"
//               className="inputField"
//             />
//             <div className="flex gap-[10px]">
//               <input
//                 type="text"
//                 placeholder="Expiry Date (MM/YY)"
//                 className="inputField"
//               />
//               <input type="text" placeholder="CVV" className="inputField" />
//             </div>
//           </div>

//           {/* Billing Information */}
//           <div className="flex flex-col gap-[15px] mt-[20px]">
//             <label className="BRCobane20600">Billing Information</label>
//             <input type="text" placeholder="Full Name" className="inputField" />
//             <input type="text" placeholder="Address" className="inputField" />
//             <div className="flex gap-[10px]">
//               <input type="text" placeholder="City" className="inputField" />
//               <input type="text" placeholder="State" className="inputField" />
//             </div>
//             <div className="flex gap-[10px]">
//               <input
//                 type="text"
//                 placeholder="Zip Code"
//                 className="inputField w-[30%]"
//               />
//               <input type="text" placeholder="Country" className="inputField" />
//             </div>
//           </div>

//           {/* Action Buttons */}
//           <div className="flex gap-[10px] w-full items-center justify-center">
//             <button
//               className="large-white-btn w-full"
//               onClick={() => router.push("/pricing")}
//             >
//               Back to Plans
//             </button>
//             <button className="yellow-btn w-full" onClick={handlePayment}>
//               Complete Payment
//             </button>
//           </div>
//         </div>

//         {/* Right Side - Selected Plan Info */}
//         <div className="planSummary">
//           <h2 className="BRCobane20600">Plan Information</h2>
//           <h3 className="BRCobane20600">{selectedPlan.name}</h3>
//           <p className="BRCobane24600">
//             <span className="BRCobane40600">{selectedPlan.price}</span>/mo
//           </p>
//           <p className="flex items-center gap-[10px]">
//             <Image
//               src={CalenderIcon}
//               alt="Calendar Icon"
//               className="w-[24px] h-[24px]"
//             />
//             {selectedPlan.duration}
//           </p>
//         </div>
//       </div>

//       {/* Success Popup */}
//       {showSuccessPopup && (
//         <div className="popup success-popup">
//           <Image src={SuccessIcon} alt="Success Icon" className="popup-icon" />
//           <h2>Payment Successful! Welcome to {selectedPlan.name}!</h2>
//           <div className="planSummary">
//             <h3>Summary Details</h3>
//             <p className="BRCobane24600">
//               <span className="BRCobane40600">{selectedPlan.price}</span>/mo
//             </p>
//             <p className="flex items-center gap-[10px]">
//               <Image
//                 src={CalenderIcon}
//                 alt="Calendar Icon"
//                 className="w-[24px] h-[24px]"
//               />
//               {selectedPlan.duration}
//             </p>
//           </div>
//           <div className="popup-buttons">
//             <button
//               onClick={() => router.push("/")}
//               className="large-white-btn"
//             >
//               Return to Homepage
//             </button>
//             <button
//               onClick={() => router.push("/dashboard")}
//               className="yellow-btn"
//             >
//               Go to Dashboard
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Error Popup */}
//       {showErrorPopup && (
//         <div className="popup error-popup">
//           <Image src={ErrorIcon} alt="Error Icon" className="popup-icon" />
//           <h2>Payment Failure!</h2>
//           <p>
//             We were unable to process your payment. Please check your card
//             details or try a different payment method.
//           </p>
//           <div className="popup-buttons">
//             <button
//               onClick={() => setShowErrorPopup(false)}
//               className="large-white-btn"
//             >
//               Contact Support
//             </button>
//             <button
//               onClick={() => setShowErrorPopup(false)}
//               className="yellow-btn"
//             >
//               Try Again
//             </button>
//           </div>
//         </div>
//       )}
//     </section>
//   );
// }

// export default CheckoutPage;

// "use client"; // Required for using useState
// import React, { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import Image from "next/image";
// import CalenderIcon from "@/public/images/calenderIcon.svg";
// import LockIcon from "@/public/images/lockIcon.svg";
// import SuccessIcon from "@/public/images/successIcon.svg";
// import ErrorIcon from "@/public/images/errorIcon.svg";

// function CheckoutPage() {
//   const router = useRouter();
//   const [selectedPlan, setSelectedPlan] = useState(null);
//   const [formData, setFormData] = useState({
//     cardName: "",
//     cardNumber: "",
//     expiry: "",
//     cvv: "",
//     fullName: "",
//     address: "",
//     city: "",
//     state: "",
//     zip: "",
//     country: "",
//   });
//   const [showSuccessPopup, setShowSuccessPopup] = useState(false);
//   const [showErrorPopup, setShowErrorPopup] = useState(false);

//   useEffect(() => {
//     const storedPlan = localStorage.getItem("selectedPlan");
//     if (storedPlan) {
//       setSelectedPlan(JSON.parse(storedPlan));
//     } else {
//       router.push("/pricing"); // Redirect if no plan is selected
//     }
//   }, [router]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleSubmit = () => {
//     const isFormValid = Object.values(formData).every(
//       (val) => val.trim() !== ""
//     );
//     if (isFormValid) {
//       setShowSuccessPopup(true);
//     } else {
//       setShowErrorPopup(true);
//     }
//   };

//   if (!selectedPlan) {
//     return <p>Loading...</p>;
//   }

//   return (
//     <section className="flex w-full p-[100px] flex-col items-center">
//       <div className="checkoutWrapper flex w-[1200px] gap-[30px] mt-[30px]">
//         {/* Left Side - Payment Form */}
//         <div className="checkoutForm flex flex-col gap-[37px] p-[32px] w-[683px]">
//           <div className="headingCheckout flex gap-[12px] items-center">
//             <Image
//               src={LockIcon}
//               alt="Lock Icon"
//               className="w-[40px] h-[40px] mb-0"
//             />
//             <h2 className="BRCobane18500">
//               Secure Payment - 256-bit Encryption
//             </h2>
//           </div>

//           {/* Card Information */}
//           <div className="flex flex-col gap-[15px]">
//             <label className="BRCobane20600">Card Information</label>
//             <input
//               type="text"
//               name="cardName"
//               placeholder="Cardholder Name"
//               className="inputField"
//               onChange={handleInputChange}
//             />
//             <input
//               type="text"
//               name="cardNumber"
//               placeholder="Card Number"
//               className="inputField"
//               onChange={handleInputChange}
//             />
//             <div className="flex gap-[10px]">
//               <input
//                 type="text"
//                 name="expiry"
//                 placeholder="Expiry Date (MM/YY)"
//                 className="inputField"
//                 onChange={handleInputChange}
//               />
//               <input
//                 type="text"
//                 name="cvv"
//                 placeholder="CVV"
//                 className="inputField"
//                 onChange={handleInputChange}
//               />
//             </div>
//           </div>

//           {/* Billing Information */}
//           <div className="flex flex-col gap-[15px] mt-[20px]">
//             <label className="BRCobane20600">Billing Information</label>
//             <input
//               type="text"
//               name="fullName"
//               placeholder="Full Name"
//               className="inputField"
//               onChange={handleInputChange}
//             />
//             <input
//               type="text"
//               name="address"
//               placeholder="Address"
//               className="inputField"
//               onChange={handleInputChange}
//             />
//             <div className="flex gap-[10px]">
//               <input
//                 type="text"
//                 name="city"
//                 placeholder="City"
//                 className="inputField"
//                 onChange={handleInputChange}
//               />
//               <input
//                 type="text"
//                 name="state"
//                 placeholder="State"
//                 className="inputField"
//                 onChange={handleInputChange}
//               />
//             </div>
//             <div className="flex gap-[10px]">
//               <input
//                 type="text"
//                 name="zip"
//                 placeholder="Zip Code"
//                 className="inputField w-[30%]"
//                 onChange={handleInputChange}
//               />
//               <input
//                 type="text"
//                 name="country"
//                 placeholder="Country"
//                 className="inputField"
//                 onChange={handleInputChange}
//               />
//             </div>
//           </div>

//           {/* Action Buttons */}
//           <div className="flex gap-[10px] w-full items-center justify-center">
//             <button
//               className="large-white-btn w-full"
//               onClick={() => router.push("/pricing")}
//             >
//               Back to Plans
//             </button>
//             <button className="yellow-btn w-full" onClick={handleSubmit}>
//               Complete Payment
//             </button>
//           </div>
//         </div>

//         {/* Right Side - Selected Plan Info */}
//         <div className="planSummary">
//           <h2 className="BRCobane20600">Plan Information</h2>
//           <h3 className="BRCobane20600">{selectedPlan.name}</h3>
//           <p className="BRCobane24600">
//             <span className="BRCobane40600">{selectedPlan.price}</span>/mo
//           </p>
//           <p className="flex items-center gap-[10px]">
//             <Image
//               src={CalenderIcon}
//               alt="Calender Icon"
//               className="w-[24px] h-[24px] mb-0"
//             />
//             {selectedPlan.duration}
//           </p>
//         </div>
//       </div>

//       {/* Payment Popups */}
//       {showSuccessPopup && (
//         <div className="popup success-popup">
//           <Image src={SuccessIcon} alt="Success Icon" />
//           <h3>Payment Successful! Welcome to {selectedPlan.name}!</h3>
//           <button onClick={() => router.push("/dashboard")}>
//             Go to Dashboard
//           </button>
//           <button onClick={() => router.push("/")}>Return to Homepage</button>
//         </div>
//       )}
//       {showErrorPopup && (
//         <div className="popup error-popup">
//           <Image src={ErrorIcon} alt="Error Icon" />
//           <h3>Payment Failure!</h3>
//           <p>
//             We were unable to process your payment. Please check your details
//             and try again.
//           </p>
//           <button onClick={() => setShowErrorPopup(false)}>Try Again</button>
//         </div>
//       )}
//     </section>
//   );
// }

// export default CheckoutPage;

// "use client"; // Required for using useState
// import React, { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import Image from "next/image";
// import CalenderIcon from "@/public/images/calenderIcon.svg";
// import LockIcon from "@/public/images/lockIcon.svg";

// function CheckoutPage() {
//   const router = useRouter();
//   const [selectedPlan, setSelectedPlan] = useState(null);

//   useEffect(() => {
//     const storedPlan = localStorage.getItem("selectedPlan");
//     if (storedPlan) {
//       setSelectedPlan(JSON.parse(storedPlan));
//     } else {
//       router.push("/pricing"); // Redirect if no plan is selected
//     }
//   }, [router]);

//   if (!selectedPlan) {
//     return <p>Loading...</p>;
//   }

//   return (
//     <section className="flex w-full p-[100px] flex-col items-center">
//       <div className="checkoutWrapper flex w-[1200px] gap-[30px] mt-[30px]">
//         {/* Left Side - Payment Form */}
//         <div className="checkoutForm flex flex-col gap-[37px] p-[32px] w-[683px]">
//           <div className="headingCheckout flex gap-[12px] items-center">
//             <Image
//               src={LockIcon}
//               alt="Calender Icon"
//               className="w-[40px] h-[40px] mb-0"
//             />
//             <h2 className="BRCobane18500">
//               Secure Payment - 256-bit Encryption
//             </h2>
//           </div>

//           {/* Card Information */}
//           <div className="flex flex-col gap-[15px]">
//             <label className="BRCobane20600">Card Information</label>
//             <input
//               type="text"
//               placeholder="Cardholder Name"
//               className="inputField"
//             />
//             <input
//               type="text"
//               placeholder="Card Number"
//               className="inputField"
//             />
//             <div className="flex gap-[10px]">
//               <input
//                 type="text"
//                 placeholder="Expiry Date (MM/YY)"
//                 className="inputField"
//               />
//               <input type="text" placeholder="CVV" className="inputField" />
//             </div>
//           </div>

//           {/* Billing Information */}
//           <div className="flex flex-col gap-[15px] mt-[20px]">
//             <label className="BRCobane20600">Billing Information</label>
//             <input type="text" placeholder="Full Name" className="inputField" />
//             <input type="text" placeholder="Address" className="inputField" />
//             <div className="flex gap-[10px]">
//               <input type="text" placeholder="City" className="inputField" />
//               <input type="text" placeholder="State" className="inputField" />
//             </div>
//             <div className="flex gap-[10px]">
//               <input
//                 type="text"
//                 placeholder="Zip Code"
//                 className="inputField w-[30%]"
//               />
//               <input type="text" placeholder="Country" className="inputField" />
//             </div>
//           </div>

//           {/* Action Buttons */}
//           <div className="flex gap-[10px] w-full items-center justify-center">
//             <button
//               className="large-white-btn w-full"
//               onClick={() => router.push("/pricing")}
//             >
//               Back to Plans
//             </button>
//             <button className="yellow-btn w-full">Complete Payment</button>
//           </div>
//         </div>

//         {/* Right Side - Selected Plan Info */}

//         <div className="planSummary">
//           <h2 className="BRCobane20600">Plan Information</h2>

//           <h3 className="BRCobane20600">{selectedPlan.name}</h3>
//           <p className="BRCobane24600">
//             <span className="BRCobane40600">{selectedPlan.price}</span>/mo
//           </p>
//           <p className="flex items-center gap-[10px]">
//             <Image
//               src={CalenderIcon}
//               alt="Calender Icon"
//               className="w-[24px] h-[24px] mb-0"
//             />
//             {selectedPlan.duration}
//           </p>
//         </div>
//       </div>
//     </section>
//   );
// }

// export default CheckoutPage;
