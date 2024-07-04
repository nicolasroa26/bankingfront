import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const Restaurant = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:5002/api/restaurants/${id}`)
      .then((response) => setRestaurant(response.data));
  }, [id]);

  if (!restaurant) return <div>Loading...</div>;

  return (
    <div className="container">
      <h1>{restaurant.name}</h1>
      <p>{restaurant.description}</p>
      <div className="row">
        {restaurant.dishes.map((dish) => (
          <div className="col-md-4" key={dish._id}>
            <div className="card mb-4">
              <div className="card-body">
                <h5 className="card-title">{dish.name}</h5>
                <p className="card-text">${dish.price.toFixed(2)}</p>
                <button className="btn btn-primary">Add to Cart</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Restaurant;
