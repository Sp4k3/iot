import React from 'react';
import PluginItem from "./PluginItem"
import Wikipedia from "./Wikipedia"
import Covid from "./Covid"

const PluginContent = (props) => {
	if (props.viewInfo.type === "listItem") {
		return (
			<div className={'plugincontent plugin-' + props.pluginName}>
				{ 
					props.viewInfo.items.map((item, index) => (
						<PluginItem
							key={index}
							itemType={props.viewInfo.itemType}
							pluginName={props.pluginName}
							name={item.name}
							icon={item.icon}
							action={item.action}
							data={item.data}
							device={item.device} 	
						/>
					))
				}
			</div>
		);
	}
	else if (props.viewInfo.type === "Wikipedia") {
		return <Wikipedia />;
	}
	else if (props.viewInfo.type === "Covid") {
		return <Covid />;
	}
	else {
		return <div></div>;
	}
}

export default PluginContent