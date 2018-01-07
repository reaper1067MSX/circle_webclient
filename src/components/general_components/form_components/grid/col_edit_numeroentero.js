import React, {Component} from "react";

export default class EnteroEditor extends Component {
    constructor(props) {
        super(props);

        this.cancelBeforeStart = this.props.charPress && ('1234567890'.indexOf(this.props.charPress) < 0);        
        
        let value = this.props.value;
        
        if (!this.cancelBeforeStart && this.props.charPress) {
            value = this.props.charPress;
        }
        
        this.state = {
            value
        };

        this.onKeyDown = this.onKeyDown.bind(this);
        this.handleChange = this.handleChange.bind(this);            
    }
    
    componentDidMount() {
        this.refs.input.addEventListener('keydown', this.onKeyDown);
        this.focus();
    }   

    componentWillUnmount() {
        this.refs.input.removeEventListener('keydown', this.onKeyDown);
    }

    focus() {
        setTimeout(() => {
            if(this.refs.input){
                this.refs.input.focus();
                this.refs.input.setSelectionRange(this.state.value.length, this.state.value.length);
            }
        })
    }

    getValue() {
        return this.state.value;
    }

    isCancelBeforeStart() {
        return this.cancelBeforeStart;
    }

    onKeyDown(event) {
        if(this.isValidKey(event)) {
            event.stopPropagation();
            return;
        }

        if (!this.isKeyPressedNumeric(event)) {
            if (event.preventDefault) event.preventDefault();
        }
    }
    
    isValidKey(event) {
         /*  Teclas permitidas:
            35: fin
            36: inicio
            37: flecha izquierda                
            39: flecha derecha                
            8: delete
            46: suprimir            
        */
        return [8, 35, 36, 37, 39, 46].indexOf(event.keyCode) > -1;
    }
    
    handleChange(event) {
        var x = event.target.value;                
        this.setState({value: x});
    }

    getCharCodeFromEvent(event) {
        event = event || window.event;
        return (typeof event.which === "undefined") ? event.keyCode : event.which;
    }

    isCharNumeric(charStr) {
        return !!/\d/.test(charStr);                
    }

    isKeyPressedNumeric(event) {
        const charCode = this.getCharCodeFromEvent(event);        
        const charStr = event.key ? event.key : String.fromCharCode(charCode);        
        return this.isCharNumeric(charStr);
    }

    render() {
        return (
            <input ref="input" value={this.state.value} onChange={this.handleChange}/>
            
        );
    }
}