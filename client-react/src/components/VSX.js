import React from 'react'
import PluginActionButton from "./PluginActionButton"
import { sendRequest } from '../utils/serverhome-api'
import './VSX.css';

class VSX extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            currentValue: 10
        };
        this.changeValue.bind(this);
    }

    changeValue(event) {
        console.log("set vsx volume : " + event.target.value);
        sendRequest("vsx", "setVolumeSound", { value: event.target.value }).then((data) => {
            console.log(data);
        });
    }

    render() {
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
                {/* A tester si le onchange du input range fonctionne */}
                <input
                    class="rounded-lg overflow-hidden appearance-none bg-gray-400 h-3 w-128"
                    type="range" min="1" max="60" step="1"
                    value={this.state.currentValue}
                    onChange={this.changeValue}
                />
            </div>
        );
    }
};

export default VSX;