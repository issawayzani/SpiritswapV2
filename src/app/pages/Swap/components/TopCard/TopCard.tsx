import React from 'react';
import './styles.css';
export default function TopCard(props) {
  return (
    <div className="card">
      <div className="text-container">
        <div className="card-body">
          <h5 className="card-title">{'TVL'}</h5>
          <p className="card-text">{props.TVL}</p>
        </div>

        <div className="card-body">
          <h5 className="card-title">{'Volume'}</h5>
          <p className="card-text">{props.Volume}</p>
        </div>

        <div className="card-body">
          <h5 className="card-title">{'APR'}</h5>
          <p className="card-text">{props.APR}</p>
        </div>

        <div className="card-body">
          <h5 className="card-title">{'Supply'}</h5>
          <p className="card-text">{props.Supply}</p>
        </div>

        <div className="card-body">
          <h5 className="card-title">{'LTV'}</h5>
          <p className="card-text">{props.LTV}</p>
        </div>

        <div className="card-body">
          <h5 className="card-title">{'Ratio'}</h5>
          <p className="card-text">{props.LTV}</p>
        </div>
      </div>
    </div>
  );
}
