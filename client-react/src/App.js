import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { isConfigured } from './utils/authservice'
import { initSocket } from './utils/serverhome-api'
import MenuPanel from './components/MenuPanel'
import PluginPage from './components/PluginPage'
import ConfigServerPage from './components/ConfigServerPage'
import VoiceRecognition from './components/VoiceRecognition'
import './App.css';

const App = () => {

    useEffect(() => {
        if (isConfigured()) {
            initSocket();
        }
    });

    return (
        <div className="App">
            <MenuPanel />
            <div className="flex flex-col justify-center sm:px-6 lg:px-8">
                <Router>
                    <div>
                        <Route exact path="/" component={VoiceRecognition} />
                        <Route path="/plugin/:pluginName" component={PluginPage} />
                        <Route path="/configserver" component={ConfigServerPage} />
                    </div>
                </Router>
            </div>
        </div>
    );
};

export default App;