import  React from 'react';
import Modal from 'react-responsive-modal';

export default class MyModal extends React.Component{

    render() {
        return (
            <div>
                <Modal open={this.props.open} onClose={this.props.onClose} little={(this.props.little===undefined?true:false)} closeOnOverlayClick={false} closeOnEsc={false}>
                    {this.props.children}
                </Modal>
            </div>
        );
    }
}