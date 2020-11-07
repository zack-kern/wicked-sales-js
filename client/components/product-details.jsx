import React from 'react';

class ProductDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = { product: null };
  }

  componentDidMount() {
    var id = this.props.params.productId;
    var path = `/api/products/${id}`;
    fetch(path)
      .then(response => {
        return response.json();
      })
      .then(data => {
        this.setState({ product: data });
      });
  }

  render() {
    if (this.state.product === null) {
      return (null);
    } else {
      var stat = this.state.product;
      var prod = parseFloat((stat.price) / 100);
      var cost = '$' + prod.toFixed(2);
      return (
        <div className="details-container container d-flex flex-column justify-content-between">
          <div className="row">
            <button onClick={() => (this.props.setView({}, 'catalog'))} className="back-button"> &lt; Back to Catalog</button>
          </div>

          <div className="row details-row d-flex justify-content-around">
            <img className="card-detail-img" src={stat.image}></img>
            <div className="card-detail-text">
              <h3>{stat.name}</h3>
              <h4>{cost}</h4>
              <h6>{stat.shortDescription}</h6>
            </div>
          </div>

          <div className="row details-row">
            <p>{stat.longDescription}</p>
          </div>
        </div>
      );
    }
  }
}

export default ProductDetails;
