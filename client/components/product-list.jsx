import React from 'react';
import ProductListItem from './product-list-item';

class ProductList extends React.Component {
  constructor(props) {
    super(props);
    this.getProducts = this.getProducts.bind(this);
    this.state = { products: [] };
  }

  componentDidMount() {
    this.getProducts();
  }

  getProducts() {
    fetch('/api/products')
      .then(res => {
        return res.json();
      })
      .then(data => {
        this.setState({ products: data });
      });
  }

  render() {
    return (
      <div className="productListContainer container d-flex justify-content-around flex-wrap align-items-center">
        {
          this.state.products.map(product => {
            return <ProductListItem key={product.productId} image={product.image} title={product.name} price={product.price} shortDes={product.shortDes}></ProductListItem>;
          })
        }
      </div>
    );
  }
}

export default ProductList;
