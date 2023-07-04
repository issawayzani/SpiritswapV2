import './styles.css';

const TopCard = props => {
  const roundedLTV = props.LTV.toFixed(2);
  const roundedTVL = props.TVL.toFixed(2);
  const roundedRatio = props.Ratio.toFixed(2);
  return (
    <div className="card">
      <div className="text-container">
        <div className="card-body">
          <h5 className="card-title">{'TVL'}</h5>
          <p className="card-text"> ${roundedTVL}</p>
        </div>
        <div className="card-body">
          <h5 className="card-title">{'APR'}</h5>
          <p className="card-text">{props.APR}%</p>
        </div>

        <div className="card-body">
          <h5 className="card-title">{'Supply'}</h5>
          <p className="card-text">{props.supplyTOKEN}</p>
        </div>

        <div className="card-body">
          <h5 className="card-title">{'Staked Supply'}</h5>
          <p className="card-text">{props.supplyVTOKEN}</p>
        </div>
        <div className="card-body">
          <h5 className="card-title">{'LTV'}</h5>
          <p className="card-text">{roundedLTV}%</p>
        </div>

        <div className="card-body">
          <h5 className="card-title">{'Ratio'}</h5>
          <p className="card-text">{roundedRatio}</p>
        </div>
      </div>
    </div>
  );
};

export default TopCard;
