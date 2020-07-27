import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import Alert from "../components/Alert/Alert";
import Paginator from "../components/Paginator/Paginator";

const BeerList = (props) => {
  const [beers, setBeers] = useState([]);
  const [totalBeers, setTotalBeers] = useState(0);
  const [beerPage, setBeerPage] = useState(1);
  const [totalConsumed, setTotalConsumed] = useState(0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadBeers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadBeers = (direction) => {
    setLoading(true);
    let page = beerPage;

    if (direction === "next") setBeerPage(++page);

    if (direction === "previous") setBeerPage(--page);

    fetch(`https://beer-rest-api.herokuapp.com/api/beers?page=${page}`, {
      headers: {
        Authorization: `Bearer ${props.token}`,
      },
    })
      .then((res) => {
        if (res.status !== 200) throw new Error("Failed to fetch beers.");

        return res.json();
      })
      .then((res) => {
        setBeers(res.beers);
        setTotalBeers(res.totalItems);
        getTotalConsumed();
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  };

  const getTotalConsumed = () => {
    fetch(`https://beer-rest-api.herokuapp.com/api/totalConsumed`, {
      headers: {
        Authorization: `Bearer ${props.token}`,
      },
    })
      .then((res) => {
        if (res.status !== 200)
          throw new Error("Failed to fetch total consumed.");

        return res.json();
      })
      .then((res) => {
        setTotalConsumed(res.totalConsumed);
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  const consumeBeer = (beerId) => {
    setLoading(true);

    fetch("https://beer-rest-api.herokuapp.com/api/consumptions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${props.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        quantity: 1,
        beerId,
      }),
    })
      .then((res) => {
        if (res.status !== 200)
          throw new Error("Could not record beer consumption.");

        return res.json();
      })
      .then(() => {
        return props.history.push(`/beers/${beerId}`);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  };

  return (
    <div className="container h-100">
      <div className="row justify-content-center align-items-center h-100">
        {error && (
          <div className="col-12">
            <Alert message={error} type="danger" />
          </div>
        )}

        <div className="col-12 col-md-4 text-center">
          <img
            src="/logo192.png"
            height="100"
            className="rounded mx-auto d-block"
            alt="beer-api logo"
          />
          <p className="h3 font-weight-light">Instructions</p>
          <hr />
          <p className="text-black-50">
            Check the details of the beer by selecting the "Show" option.
          </p>
          <p className="text-black-50">
            Register a unit of a beer by selecting the "Consume" option.
          </p>
          <a href="#!" onClick={props.logoutHandler}>
            Logout
          </a>
        </div>

        <div className="col-12 col-md-8">
          <div className="card shadow border-0">
            <div className="card-body">
              <h3>
                Total units consumed:{" "}
                <span class="badge badge-secondary">{totalConsumed}</span>
              </h3>

              {beers.length <= 0 && !loading ? (
                <div>
                  <img
                    src="/empty.png"
                    width="64"
                    className="rounded mx-auto d-block mb-3"
                    alt="beer-api logo"
                  />
                  <p className="text-black-50 text-center">No beers found.</p>
                </div>
              ) : (
                <>
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Brand</th>
                        <th width="180">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {beers.map((beer) => (
                        <tr key={beer._id}>
                          <td>{beer.brand}</td>
                          <td>
                            <Link
                              to={`/beers/${beer._id}`}
                              className="btn btn-primary btn-sm m-1"
                            >
                              Show
                            </Link>
                            <a
                              href="#!"
                              className="btn btn-primary btn-sm m-1"
                              onClick={() => {
                                !loading && consumeBeer(beer._id);
                              }}
                            >
                              Consume
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <Paginator
                    onPrevious={loadBeers}
                    onNext={loadBeers}
                    lastPage={Math.ceil(totalBeers / 10)}
                    currentPage={beerPage}
                  />
                </>
              )}
            </div>
          </div>
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

export default connect(mapState, mapDispatch)(BeerList);
