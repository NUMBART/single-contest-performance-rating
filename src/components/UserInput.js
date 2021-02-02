import React, {Component} from 'react';
import "./UserInput.css"

class UserInput extends Component{
    
    render(){
        return (
            <div>
                <div className="InputDivStyle input-effect">
                    <input className="InputStyle" onChange = {this.props.changed} value = {this.props.name} type="text" placeholder="Enter Handle"/>
                        <label>First Name</label>
                        <span className="focus-border"></span>
                </div>
            </div>
        );
    }
}

export default UserInput;