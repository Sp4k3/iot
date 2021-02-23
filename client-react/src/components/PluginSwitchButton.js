import React, { Component } from 'react'
import { sendRequest } from '../utils/serverhome-api'

class PluginSwitchButton extends Component {

    handleSwitch(elem, state) {
        console.log('handleSwitch. elem:', elem);
        console.log('name:', elem.props.name);
        console.log('new state:', state);
        sendRequest(this.props.pluginName, this.props.action, { device: this.props.device, value: state }).then((data) => {
            console.log(data);
        });
    }

    render() {
        return (
            <div className="switch-button">
                <span><strong>{this.props.name}</strong></span><br />
                <span>device : {this.props.device}</span><br /><br />
                {/* switch à tester, présent uniquement pour l'ampoule philipshue */}
                <div className="flex items-center justify-center w-full mb-24">
                    <label htmlFor="toogleA" className="flex items-center cursor-pointer">
                        <div className="mr-3 text-gray-700 font-medium">
                            OFF
                        </div>
                        <div className="relative">
                            <input id="toogleA"
                                type="checkbox"
                                className="hidden"
                                name={this.props.name}
                                defaultChecked={this.state.data}
                                onChange={(el, state) => this.handleSwitch(el, state)}
                            />
                            <div className="toggle__line w-10 h-4 bg-gray-400 rounded-full shadow-inner"></div>
                            <div className="toggle__dot absolute w-6 h-6 bg-white rounded-full shadow inset-y-0 left-0"></div>
                        </div>
                        <div className="ml-3 text-gray-700 font-medium">
                            ON
                        </div>
                    </label>
                </div>
            </div>
        );
    }
};


export default PluginSwitchButton;