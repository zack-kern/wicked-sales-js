import React from 'react';
import Header from './header';
import ProductDetails from './product-details';
import ProductList from './product-list';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.setView = this.setView.bind(this);
    this.clicky = this.clicky.bind(this);
    this.state = {
      message: null,
      isLoading: true,
      view: {
        name: 'catalog',
        params: {}
      }
    };
  }

  setView(params, name) {
    this.setState({
      view: {
        name: 'details',
        params: params
      }
    });
    if (name === 'catalog') {
      this.setState({
        view: {
          name: 'catalog',
          params: params
        }
      });
    }
  }

  componentDidMount() {
    fetch('/api/health-check')
      .then(res => res.json())
      .then(data => this.setState({ message: data.message || data.error }))
      .catch(err => this.setState({ message: err.message }))
      .finally(() => this.setState({ isLoading: false }));
  }

  clicky(params) {
    this.setView(params);
  }

  render() {
    if (this.state.view.name === 'details') {
      return (
        <div className="container">
          <div className="row"><Header></Header></div>
          <div className="row">
            <ProductDetails params={this.state.view.params} setView={this.setView}></ProductDetails>
          </div>
        </div>
      );
    } else {
      return (
        <div className="container">
          <div className="row"><Header></Header></div>
          <div className="row">
            <ProductList clicky={this.clicky}></ProductList>
          </div>
        </div>
      );
    }
  }
}
