import "./App.css";
import React from "react";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";

function App() {
  const [coupon, setCoupon] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    const storedCoupon = localStorage.getItem("coupon");
    const expiry = localStorage.getItem("couponExpiry");

    if (storedCoupon && expiry && Date.now() < Number(expiry)) {
      setCoupon(storedCoupon);
      setTimeLeft(Math.floor((Number(expiry) - Date.now()) / 1000));
    } else {
      localStorage.removeItem("coupon");
      localStorage.removeItem("couponExpiry");
    }
  }, []);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft]);

  function claimCoupon(e) {
    e.preventDefault();

    fetch("http://127.0.0.1:8000/claim/")
      .then((response) => response.json())
      .then((data) => {
        if (data.coupon_code) {
          localStorage.setItem("coupon", data.coupon_code);
          localStorage.setItem("couponExpiry", Date.now() + 60 * 60 * 1000); // 1 hour expiry
          setCoupon(data.coupon_code);
          setTimeLeft(60 * 60); // 1 hour countdown
          toast.success("coupon claim successfully");
        } else {
          toast.error(data.message);
        }
      })
      .catch((error) => toast.error("something wrong"));
  }

  return (
    <>
      <h1>
        {coupon
          ? "Coupon allotted successfully"
          : "Click Here to Claim Your Coupon"}
      </h1>
      <div className="card">
        {coupon ? (
          <p>
            Time left: {Math.floor(timeLeft / 60)}:
            {(timeLeft % 60).toString().padStart(2, "0")}
          </p>
        ) : (
          <button onClick={claimCoupon}>Claim It</button>
        )}
      </div>
    </>
  );
}

export default App;
