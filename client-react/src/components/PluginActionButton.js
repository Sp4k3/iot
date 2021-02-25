import React from 'react'
import { sendRequest } from '../utils/serverhome-api'

const PluginActionButton = ({ pluginName, action, data, icon, name }) => {

    const handleClick = (e) => {
        console.log("send action " + pluginName + ", " + action + ", " + data);
        sendRequest(pluginName, action, { data: data }).then((data) => {
            console.log(data);
        });
    }

    const buttonContent = icon ? <span>{icon}</span> : <span>{name}</span>;
    return (
        <button
            className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-400 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400"
            onClick={handleClick}>
            {buttonContent}
        </button>
    );
};

export default PluginActionButton;