import axios from 'axios';
import openSocket from 'socket.io-client';
import { getServerAuthInfo } from './authservice'

let socket = null;

export const initSocket = () => {
    let serverInfo = getServerAuthInfo();
    socket = openSocket(serverInfo.server);
    socket.on('connect', () => {
        socket.emit('authentication', { username: serverInfo.username, password: serverInfo.password });
    });
}

export const subscribeToEvent = (name, callback) => {
    if (socket !== null) {
        socket.on(name, callback);
    }
}

export const emitEvent = (name, data) => {
    if (socket !== null) {
        socket.emit(name, data);
    }
}

export const getExpressions = () => {
    let serverInfo = getServerAuthInfo();
    const url = `${serverInfo.server}/api/expressions`;
    return axios.get(url, {
        auth: {
            username: serverInfo.username,
            password: serverInfo.password
        }
    }).then(response => response.data);
}

export const getPlugins = () => {
    let serverInfo = getServerAuthInfo();
    const url = `${serverInfo.server}/api/plugins`;
    return axios.get(url, {
        auth: {
            username: serverInfo.username,
            password: serverInfo.password
        }
    }).then(response => response.data);
}

export const getPluginView = (pluginName) => {
    let serverInfo = getServerAuthInfo();
    const url = `${serverInfo.server}/api/${pluginName}/view`;
    return axios.get(url, {
        auth: {
            username: serverInfo.username,
            password: serverInfo.password
        }
    }).then(response => response.data);
}

export const sendRequest = (plugin, actionId, requestData) => {
    let serverInfo = getServerAuthInfo();
    const url = `${serverInfo.server}/api/` + plugin + '/action/' + actionId;
    return axios.post(url, requestData, {
        auth: {
            username: serverInfo.username,
            password: serverInfo.password
        }
    }).then(response => response.data);
}