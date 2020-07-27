import React from "react";

const Paginator = (props) => {
  return (
    <nav>
      <ul className="pagination justify-content-end">
        {props.currentPage > 1 && (
          <li className="page-item">
            <a
              className="page-link"
              href="#!"
              onClick={() => props.onPrevious("previous")}
            >
              Previous
            </a>
          </li>
        )}

        {props.currentPage < props.lastPage && (
          <li className="page-item">
            <a
              className="page-link"
              href="#!"
              onClick={() => props.onNext("next")}
            >
              Next
            </a>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Paginator;
