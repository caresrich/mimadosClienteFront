import React, { Component} from 'react';
import {Link} from 'react-router-dom'

class Navigation extends Component {

    render() {
        return (
            <div className="App">
                <ul id="dropdown1" className="dropdown-content">
                    <li><a href="#!">one</a></li>
                    <li><a href="#!">two</a></li>
                    <li className="divider"></li>
                    <li><a href="#!">three</a></li>
                </ul>
                <nav className="teal darken-3">
                <div className="container">
                    <div className="nav-wrapper ">
                        <Link className="brand-logo" to="/">{this.props.titulo}</Link>
                        <ul className="right hide-on-med-and-down">
                            <li><Link to="/clientes">Clientes</Link></li>
                            <li><Link to="/ventas">Ventas</Link></li>
                            <li><Link to="/ventaPrendas">Vender</Link></li>
                            <li><a className="dropdown-trigger" href="#!" data-target="dropdown1">Dropdown<i className="material-icons right">arrow_drop_down</i></a></li>
                        </ul>
                    </div>
                    </div>
                </nav>

            </div>
        );
    };
};

export default Navigation;