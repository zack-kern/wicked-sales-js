import React from 'react';

function ProductListItem(props) {
  var prod = parseFloat((props.price) / 100);
  var newProd = '$' + prod.toFixed(2);
  return (
    <button className="card d-flex flex-column justify-content-around" onClick={() => (props.clicky((props)))}>
      <img src={props.image} className="card-img-top"></img>
      <div className="card-body">
        <h5 className="card-title">{props.title}</h5>
        <h6 className="card-text cost">{newProd}</h6>
        <p className="card-text">{props.shortDes}</p>
      </div>
    </button>
  );
}

export default ProductListItem;
