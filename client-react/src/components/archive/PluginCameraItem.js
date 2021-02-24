import React, { Component } from 'react'
import { subscribeToEvent, emitEvent } from '../utils/serverhome-api'

class PluginCameraItem extends Component {

    constructor(props) {
        super(props);
        this.state = {
            source: "",
            start: this.props.data
        };
    }

    componentDidMount() {
        let self = this;
        subscribeToEvent(this.props.name, (data) => {
            const sourceData = 'data:image/jpeg;base64,' + data.buffer;
            self.setState({ source: sourceData });
        });
    }

    stopCamera() {
        emitEvent(this.props.name + ".stop", this.props.name);
        this.setState({ start: false });
    }

    startCamera() {
        emitEvent(this.props.name + ".start", this.props.name);
        this.setState({ start: true });
    }

    render() {
        const actionButton = !this.state.start ?
            <button onClick={this.startCamera.bind(this)}>▶️</button> :
            <button onClick={this.stopCamera.bind(this)}>⏸</button>;

        const imageCamera = !this.state.start ?
            <img src="/videosurveillance.png" alt={this.props.name} /> : "";
        return (
            <div className="cameraitem">
                <h5>{this.props.name}</h5>
                {actionButton}
                <img src={this.state.source} alt="no video" />
                {imageCamera}
            </div>
        );
    }
};

export default PluginCameraItem;