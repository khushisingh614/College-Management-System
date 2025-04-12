import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaCheckCircle } from "react-icons/fa";
import Heading from "../../components/Heading";
import penIcon from "../../assets/pen.png";
import notebookIcon from "../../assets/notebook.png";
import padsIcon from "../../assets/pads.png";
import highlighter from "../../assets/highlighter.png";
import bottle from "../../assets/bottle.png";
import file from "../../assets/file.png";

const Store = () => {
  const [coins, setCoins] = useState(100); // example initial coins
  const [purchasedItems, setPurchasedItems] = useState([]);

  const storeItems = [
    {
      id: 1,
      title: "Pen",
      price: 2,
      image: penIcon,
    },
    {
      id: 2,
      title: "Notebook",
      price: 10,
      image: notebookIcon,
    },
    {
      id: 3,
      title: "Sanitary Pads",
      price: 2,
      image: padsIcon,
    },
    {
        id: 4,
        title: "Water Bottle",
        price: 10,
        image: bottle,
      },
      {
        id: 5,
        title: "Highlighter Pen",
        price: 3,
        image: highlighter,
      },
      {
        id: 6,
        title: "File",
        price: 4,
        image: file,
      },
  ];

  const handlePurchase = (item) => {
    if (coins >= item.price) {
      setCoins(coins - item.price);
      setPurchasedItems([...purchasedItems, item.id]);
      alert(`Purchased: ${item.title}`);
    } else {
      alert("Not enough coins!");
    }
  };

  return (
    <div className="container mt-5">
      <Heading title="🎉 College Store" />
      <div className="text-end mb-3">
        <h5>
          My Coins: <span className="badge bg-warning text-dark">{coins}</span>
        </h5>
      </div>

      <div className="row g-4">
        {storeItems.map((item) => (
          <div key={item.id} className="col-md-4">
            <div className="card shadow-sm border-0 rounded-4 overflow-hidden h-100">
              {/* Top: dark section with image */}
            <div className="bg-dark d-flex justify-content-center align-items-center p-2" style={{ height: "160px" }}>
            <img
                src={item.image}
                alt={item.title}
                className="w-100 h-100"
                style={{ objectFit: "contain", borderRadius: "10px" }}
            />
            </div>


              {/* Bottom: content */}
              <div className="card-body text-center">
                <h5 className="card-title">{item.title}</h5>

                {/* Coin and Buy Button in same line */}
                <div className="d-flex justify-content-between align-items-center mt-3">
                  <div className="bg-warning text-dark px-3 py-1 rounded-pill d-flex align-items-center">
                    <span className="fw-bold me-1">{item.price}</span>
                    <span role="img" aria-label="coin">🪙</span>
                  </div>

                  <button
                    className="btn btn-outline-primary mt-0 px-4 rounded-pill"
                    onClick={() => handlePurchase(item)}
                    disabled={purchasedItems.includes(item.id)}
                  >
                    {purchasedItems.includes(item.id) ? "Purchased" : "Buy"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Store;