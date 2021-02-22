import React from 'react';
import { isConfigured } from '../utils/authservice'
import { slide as Menu } from 'react-burger-menu';
import './MenuPanel.css';

import { getPlugins } from '../utils/serverhome-api'

class MenuPanel extends React.Component {

    constructor(props) {
        super(props);
        this.state = { plugins: [] };
    }

    componentDidMount() {
        if (isConfigured()) {
            getPlugins().then((data) => {
                this.setState({ plugins: data });
            });
        }
    }

    render() {
        const plugins = this.state.plugins;
        return (
            <Menu>
                <a id="home" className="menu-item" href="/">🏠 Home</a>
                { plugins.map((plugin, index) => (
                    <a id="{plugin}" key={"pluginLink-" + index} className="menu-item" href={"/plugin/" + plugin}>
                        ➡️{plugin}
                    </a>
                ))}
                <a id="home" className="menu-item config-item" href="/configserver">🔧Configuration</a>
            </Menu>
        );
    }
};

export default MenuPanel;