import React from 'react'
import { sendRequest } from '../utils/serverhome-api'

class PluginActionButton extends React.Component {

    handleClick(e) {
        console.log("send action " + this.props.pluginName + ", " + this.props.action + ", " + this.props.data);
        sendRequest(this.props.pluginName, this.props.action, { data: this.props.data }).then((data) => {
            console.log(data);
        });
    }

    render() {
        var buttonContent = this.props.icon ? <span>{this.props.icon}</span> : <span>{this.props.name}</span>;
        return (
            <button
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                onClick={this.handleClick.bind(this)}>
                {buttonContent}
            </button>
        );
    }
};

export default PluginActionButton;