import React from 'react';

function ProductListItem(props) {
  return (
    <div className="card d-flex flex-column justify-content-around">
      <div className="card-img">
        <img src={props.image} className="card-img-top"></img>
      </div>
      <div className="card-body">
        <h5 className="card-title">{props.title}</h5>
        <h6 className="card-text cost">{props.price}</h6>
        <p className="card-text">{props.shortDes}</p>
      </div>
    </div>
  );
}

export default ProductListItem;
