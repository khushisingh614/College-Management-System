import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Heading from "../../components/Heading";
import pen from "../../assets/pen.png";
import notebook from "../../assets/notebook.png";
import pads from "../../assets/pads.png";
import highlighter from "../../assets/highlighter.png";
import bottle from "../../assets/bottle.png";
import file from "../../assets/file.png";
import tampon from "../../assets/tampon.png";
import menstrual from "../../assets/menstrual.png";
import stapler from "../../assets/stapler.png";

const Store = () => {
  const [coins, setCoins] = useState(100);
  const [purchasedItems, setPurchasedItems] = useState({});

  const storeItems = [
    { id: 1, title: "Pen", price: 2, image: pen },
    { id: 2, title: "Notebook", price: 10, image: notebook },
    { id: 3, title: "Sanitary Pads", price: 2, image: pads },
    { id: 4, title: "Water Bottle", price: 10, image: bottle },
    { id: 5, title: "Highlighter Pen", price: 3, image: highlighter },
    { id: 6, title: "File", price: 4, image: file },
    { id: 7, title: "Tampons", price: 2, image: tampon },
    { id: 8, title: "Menstrual Cup", price: 2, image: menstrual },
    { id: 9, title: "Stapler", price: 10, image: stapler },
  ];

  const handlePurchase = (item) => {
    if (coins >= item.price) {
      setCoins(coins - item.price);
      setPurchasedItems((prev) => ({
        ...prev,
        [item.id]: (prev[item.id] || 0) + 1,
      }));
      alert(`Purchased: ${item.title}`);
    } else {
      alert("Not enough coins!");
    }
  };

  return (
    <div className="container py-5">
      <Heading title="🛍️ College Essentials Store" />
      <div className="d-flex justify-content-end mb-4">
        <div className="bg-light px-4 py-2 rounded-3 shadow-sm d-inline-flex align-items-center">
          <h5 className="mb-0 text-secondary fw-semibold">
            Coins: <span className="text-warning">{coins} 🪙</span>
          </h5>
        </div>
      </div>

      <div className="row g-4">
        {storeItems.map((item) => (
          <div key={item.id} className="col-md-4 col-sm-6">
            <div className="card border-0 shadow-lg rounded-4 h-100">
              {/* Image Section */}
              <div
                className="bg-light d-flex justify-content-center align-items-center"
                style={{ height: "180px", borderTopLeftRadius: "1rem", borderTopRightRadius: "1rem" }}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="img-fluid"
                  style={{ maxHeight: "140px", objectFit: "contain" }}
                />
              </div>

              {/* Item Details */}
              <div className="card-body d-flex flex-column justify-content-between text-center">
                <h5 className="card-title fw-bold mb-3 text-primary">{item.title}</h5>

                <div className="d-flex justify-content-center align-items-center gap-3 mb-3">
                  <span className="badge bg-warning text-dark fs-6 px-3 py-2 rounded-pill">
                    {item.price} 🪙
                  </span>

                  <button
                    className="btn btn-outline-success rounded-pill px-4 fw-semibold"
                    onClick={() => handlePurchase(item)}
                  >
                    Buy
                  </button>
                </div>

                <div className="text-muted small">
                  Bought: <span className="fw-semibold">{purchasedItems[item.id] || 0}</span>
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
