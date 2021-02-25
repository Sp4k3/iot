import React, { useState } from 'react';
import PluginActionButton from "./PluginActionButton"
import { sendRequest } from '../utils/serverhome-api'
import './VSX.css';

const VSX = () => {
    const [currentValue, setCurrentValue] = useState(10);

    const changeValue = (event) => {
        console.log("set vsx volume : " + event.target.value);
        sendRequest("vsx", "setVolumeSound", { value: event.target.value }).then((data) => {
            console.log(data);
        });
        setCurrentValue(event.target.value);
    }

    return (
        <div className='plugincontent plugin-vsx'>
            <div className="buttons">
                <PluginActionButton pluginName="vsx" icon="🔌" action="powerOff" />
                <PluginActionButton pluginName="vsx" icon="🔇" action="muteSound" />
                <PluginActionButton pluginName="vsx" icon="🔈" action="decreaseSound" />
                <PluginActionButton pluginName="vsx" icon="🔊" action="increaseSound" />
                <PluginActionButton pluginName="vsx" name="📺" action="channelTV" />
                <PluginActionButton pluginName="vsx" name="🎮" action="channelGame" />
            </div>
            <input
                className="rounded-lg overflow-hidden appearance-none bg-gray-400 w-128 focus:outline-none focus:border-transparent"
                type="range" min="1" max="60" step="1"
                value={currentValue}
                onChange={changeValue}
            />
            <span className="ml-3">{currentValue}</span>
        </div>
    );
};

export default VSX;