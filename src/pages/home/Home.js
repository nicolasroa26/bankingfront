import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export const Home = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    axios
      .get(
        "https://restaurantfullstack-20d2bcfb0f21.herokuapp.com/api/restaurants"
      )
      .then((response) => setRestaurants(response.data));
  }, []);

  console.log("asdkhgasj");

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const filteredRestaurants = restaurants.filter((restaurant) =>
    restaurant.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container">
      <h1>Restaurants</h1>
      <input
        type="text"
        placeholder="Search for a restaurant..."
        value={search}
        onChange={handleSearch}
        className="form-control"
      />
      <div className="row">
        {filteredRestaurants.map((restaurant) => (
          <div className="col-md-4" key={restaurant._id}>
            <div className="card mb-4">
              <div className="card-body">
                <h5 className="card-title">{restaurant.name}</h5>
                <p className="card-text">{restaurant.description}</p>
                <Link
                  to={`/restaurant/${restaurant._id}`}
                  className="btn btn-primary"
                >
                  View Menu
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
