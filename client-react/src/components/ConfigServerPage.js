import React from 'react'
import { setServerAuthInfo, getServerAuthInfo } from '../utils/authservice'

class ConfigServerPage extends React.Component {

  constructor(props) {
    super(props);
    var serverInfo = getServerAuthInfo();
    this.state = {
      server: serverInfo.server ? serverInfo.server : "",
      username: serverInfo.username ? serverInfo.username : "",
      password: serverInfo.password ? serverInfo.password : ""
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState({
      [name]: value
    });
  }

  handleSubmit(event) {
    setServerAuthInfo(this.state.server, this.state.username, this.state.password);
    console.log("configuration saved");
    event.preventDefault();
  }

  render() {
    return (
      <div>
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-2xl font-extrabold text-gray-900">
            Configuration form
          </h2>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form className="space-y-6" action="#" method="POST" onSubmit={this.handleSubmit}>

              <div>
                <label htmlFor="server" className="block text-sm font-medium text-gray-700">
                  Server
                </label>
                <div className="mt-1">
                  <input id="server" name="server" value={this.state.server} onChange={this.handleChange} type="text" autoComplete="server" required placeholder="https://monserver.com ou http://192.168.1.xxx " className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Username
                </label>
                <div className="mt-1">
                  <input id="email" name="email" type="email" value={this.state.email} onChange={this.handleChange} autoComplete="email" required placeholder="Username" className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="mt-1">
                  <input id="password" name="password" type="password" value={this.state.password} onChange={this.handleChange} autoComplete="current-password" required placeholder="Password" className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                </div>
              </div>

              <div>
                <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
};

export default ConfigServerPage;