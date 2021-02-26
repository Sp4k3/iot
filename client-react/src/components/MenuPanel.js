import React, { useState, useEffect } from 'react';
import { isConfigured } from '../utils/authservice'
import { slide as Menu } from 'react-burger-menu';
import './MenuPanel.css';

import { getPlugins } from '../utils/serverhome-api'

const MenuPanel = () => {
	const [plugins, setPlugins] = useState([]);

	useEffect(() => {
		if (isConfigured()) {
			getPlugins().then((data) => {
				setPlugins(data);
			});
		}
	}, []);

	return (
		<Menu>
			<a id="home" className="menu-item" href="/">🏠 Home</a>
			{ 
				plugins.map((plugin, index) => (
					<a id="{plugin}" key={"pluginLink-" + index} className="menu-item" href={"/plugin/" + plugin}>
						➡️ {plugin}
					</a>
				))
			}
			<a id="home" className="menu-item config-item" href="/configserver">🔧 Configuration</a>
		</Menu>
	);
};

export default MenuPanel;