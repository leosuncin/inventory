import './app.css';

import React from 'react';
import { Container, Navbar, Row } from 'react-bootstrap';
import { Link, Route, BrowserRouter as Router, Switch } from 'react-router-dom';

import CategoryIcon from '../components/icons/category-icon';
import HomeIcon from '../components/icons/home-icon';
import ProductIcon from '../components/icons/product-icon';
import StackIcon from '../components/icons/stack-icon';
import BuyPage from '../pages/buy-page';
import CategoryPage from '../pages/category-page';
import InventoryPage from '../pages/inventory-page';
import SellPage from '../pages/sell-page';

/**
 * @type React.FC
 */
export const App = () => {
  return (
    <Router>
      <Navbar
        bg="dark"
        variant="dark"
        sticky="top"
        className="flex-md-nowrap p-0 shadow"
      >
        <Link to="/" className="navbar-brand col-md-3 col-lg-2 mr-0 px-3">
          <HomeIcon />
          Inventario
        </Link>
        <Navbar.Toggle label="Toggle navigation" />
      </Navbar>
      <Container fluid>
        <Row>
          <nav className="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse">
            <div className="sidebar-sticky pt-3">
              <ul className="nav flex-column">
                <li className="nav-item">
                  <Link className="nav-link" to="/categories">
                    <CategoryIcon />
                    Categorias de producto
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/">
                    <ProductIcon />
                    Inventario de productos
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/buy">
                    <StackIcon />
                    Ingreso de producto
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/sell">
                    <ProductIcon />
                    Salida de producto
                  </Link>
                </li>
              </ul>
            </div>
          </nav>

          <main role="main" className="col-md-9 ml-sm-auto col-lg-10 px-md-4">
            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
              <Switch>
                <Route path="/categories" component={CategoryPage} />
                <Route path="/buy" component={BuyPage} />
                <Route path="/sell" component={SellPage} />
                <Route path="/" component={InventoryPage} />
              </Switch>
            </div>
          </main>
        </Row>
      </Container>
    </Router>
  );
};

export default App;
