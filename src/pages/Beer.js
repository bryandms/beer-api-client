import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import Alert from "../components/Alert/Alert";

const Beer = (props) => {
  const [beer, setBeer] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadBeer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadBeer = () => {
    setLoading(true);
    fetch(
      `https://beer-rest-api.herokuapp.com/api/beers/${props.match.params.beerId}`,
      {
        headers: {
          Authorization: `Bearer ${props.token}`,
        },
      }
    )
      .then((res) => {
        if (res.status !== 200) throw new Error("Could not find beer.");

        return res.json();
      })
      .then((res) => {
        setBeer(res.beer);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  return (
    <div className="container h-100">
      <div className="row justify-content-center align-items-center h-100">
        <div className="col-10 col-sm-8 col-md-6">
          <div className="card shadow border-0">
            <div className="card-body">
              <Alert message={error} type="danger" />

              {!loading && beer && (
                <>
                  <h5 className="card-title text-center">Beer {beer.brand}</h5>

                  <ul className="list-group list-group-flush">
                    <li className="list-group-item d-flex flex-wrap justify-content-between align-items-center ">
                      <b>Beer Details</b>
                    </li>
                    <li className="list-group-item d-flex flex-wrap justify-content-between align-items-center disabled">
                      <b>Type:</b> {beer.type}
                    </li>
                    <li className="list-group-item d-flex flex-wrap justify-content-between align-items-center disabled">
                      <b>brand:</b> {beer.brand}
                    </li>
                    <li className="list-group-item d-flex flex-wrap justify-content-between align-items-center disabled">
                      <b>Alcohol Percentage:</b> {beer.alcoholPercentage} %
                    </li>
                    <hr />
                  </ul>

                  <ul className="list-group list-group-flush">
                    <li className="list-group-item d-flex flex-wrap justify-content-between align-items-center ">
                      <b>Total you have consumed</b>
                    </li>
                    <li className="list-group-item d-flex flex-wrap justify-content-between align-items-center disabled">
                      <b>Units consumed:</b> {beer.totalConsumed}
                    </li>
                    <hr />
                  </ul>
                </>
              )}
            </div>
          </div>

          <p className="mt-5 text-black-50 text-center">
            <Link to="/beers">Back</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

const mapState = (state) => ({
  userId: state.userId,
  token: state.token,
  isAuth: state.isAuth,
});

const mapDispatch = (dispatch) => ({
  setUserId: dispatch.userId.setUserId,
  setToken: dispatch.token.setToken,
  setIsAuth: dispatch.isAuth.setIsAuth,
});

export default connect(mapState, mapDispatch)(Beer);
