import React from 'react';
import { Link } from 'react-router-dom'; 
import "../App.css"

function Roomscard({ id, image, number, type, description, price }) {
  return (
    <div className="room-card">
      <img src={image} alt={`${type} Room ${number}`} />
      <div className="room-card-content">
        <div className="room-card-header">
          <h2>{type} · Room {number}</h2>
          <p className="room-type">{type}</p>
        </div>
        <p className="room-description">{description}</p>

        <div className="room-card-footer">
          <p className="room-price">${price} <span>/ night</span></p>
          <Link to={`/roominfo/${id}`} className="view-link">
            <span>VIEW</span> <span><i className="fa-solid fa-arrow-right-long"></i></span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Roomscard;