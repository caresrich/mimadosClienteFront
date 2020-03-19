import React, { Component } from "react";
import M from "materialize-css";


class Modal extends Component {
  componentDidMount() {
    const options = {
      inDuration: 500,
      outDuration: 500,
      opacity: 0.5,
      dismissible: false,
      startingTop: "4%",
      endingTop: "10%"
    };
    M.Modal.init(this.Modal, options);
  }


  funcionProps()
  {
    this.props.cancelarDeuda();
  }

  render() {
    M.Modal.init(this.Modal);
    return (
        <div ref={Modal => { this.Modal = Modal }} id={this.props.id} className="modal">
          <div className="modal-content">
            <h5>Esta seguro de realizar esta acción..?</h5>
            <p>Click en Aceptar en caso de que el cliente <b>{this.props.nombreCliente}</b>  canceló su deuda, caso contrario Click en Cancelar</p>
          </div>
          <div className="modal-footer">
            <div className="card-action">
              <button className="modal-close waves-effect  left red btn"><i className="material-icons center">cancel</i></button>
              <button onClick={()=>this.funcionProps()} className="modal-close waves-effect right green btn">Aceptar</button>
            </div>
          </div>
        </div>
    );
  }
}

//la siguiente clase es otro componente que tambien puede ser exportado y utilizado desde otro archivo
//es decir que en un solo archivo podemos crear muchas clases o este caso componentes
//y exportarlos sin la pabra reservada default
/* class Modal2 extends Component {
  componentDidMount() {
    const options = {
      inDuration: 500,
      outDuration: 500,
      opacity: 0.5,
      dismissible: false,
      startingTop: "4%",
      endingTop: "10%"
    };
    M.Modal.init(this.Modal, options);
  }

  render() {
    return (
      <div>
        <button className="waves-effect waves-light btn modal-trigger" data-target="modal2">Modal</button>

        <div ref={Modal => { this.Modal = Modal }} id="modal2" className="modal">
          <div className="modal-content">
            <h5>Esta seguro de realizar esta acción..2222?</h5>
            <p>Click en Aceptar en caso de que el cliente canceló su deuda, caso contrario Click en Cancelar</p>
          </div>
          <div className="modal-footer">
            <button  className="modal-close waves-effect  left red btn">Cancelar</button>
            <button  className="modal-close waves-effect right green btn">Aceptar</button>
          </div>
        </div>
      </div>
    );
  }
} */

export default Modal;