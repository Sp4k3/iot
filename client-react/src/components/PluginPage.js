import React, { useState, useEffect } from 'react';

import PluginContent from './PluginContent'
import { getPluginView } from '../utils/serverhome-api'

const PluginPage = ({ match }) => {

	const [pluginView, setPluginView] = useState({});

	useEffect(() => {
		getPluginView(match.params.pluginName).then((data) => {
			setPluginView(data);
		});
	}, [match.params.pluginName]);

	const pluginName = match.params.pluginName;
	return (
		<div className="">
			<h2 className="text-center text-3xl font-extrabold text-gray-900">
				{pluginName}
			</h2>
			<PluginContent viewInfo={pluginView} pluginName={pluginName} />
		</div>
	);
};

export default PluginPage;