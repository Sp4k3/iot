import React from 'react'
import VoiceRecognition from './VoiceRecognition'
import { subscribeToEvent, emitEvent, sendRequest } from '../utils/serverhome-api'
import './Wikipedia.css';

class Covid extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            searchValue: "",
            shortResult: "",
            isTable: false,
            searchResult: null,
            expression: "casfrance"
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.callbackVoice = this.callbackVoice.bind(this);
    }

    handleChange(event) {
        this.setState({
            searchValue: event.target.value
        });
    }

    handleSubmit(event) {
        console.log("emit event covidsearch : " + this.state.searchValue);
        emitEvent("covidsearch", this.state.searchValue);
        var self = this;
        sendRequest("covid", this.state.expression, { searchValue: this.state.searchValue }).then((data) => {
            if (data.resultText) {
                var utterThis = new SpeechSynthesisUtterance(data.resultText);
                utterThis.lang = 'fr-FR';
                console.log({ "response": data.resultText });
                window.speechSynthesis.speak(utterThis);
                self.setState({
                    shortResult: data.resultText
                });
            }
        });
        if (event)
            event.preventDefault();
    }

    componentDidMount() {
        var self = this;
        subscribeToEvent("covidresult", function (data) {
            self.setState({
                searchResult: data.infos.replace(new RegExp("/wiki/", 'g'), "/plugin/covid/"),
                isTable: data.isTable
            });
        });
        var lastPart = window.location.href.split("/").pop();
        if (lastPart !== "covid") {
            this.setState({ searchValue: lastPart });
            this.handleSubmit(null);
        }
    }

    callbackVoice(voiceInfo) {
        this.setState({ expression: "casdepartement" })
        console.log("voiceInfo", voiceInfo);
        if (voiceInfo?.data.searchValue) {
            this.setState({ searchValue: voiceInfo.data.searchValue });
            this.handleSubmit();
        }
    }

    render() {
        var result = this.state.searchResult ?
            (this.state.isTable ?
                <table dangerouslySetInnerHTML={{ __html: this.state.searchResult }} /> :
                <div dangerouslySetInnerHTML={{ __html: this.state.searchResult }} />)
            : "";
        return (
            <div>
                <div className="sm:mx-auto sm:w-full sm:max-w-md">
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Search form
                    </h2>
                </div>

                <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                        <form className="space-y-6" action="#" method="POST" onSubmit={this.handleSubmit}>

                            <div>
                                <button
                                    onClick={() => (this.setState({ expression: "casfrance" }))}
                                    type="submit"
                                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                    Cas France
                                </button>
                                {/* <button
                                    onClick={() => (this.expression = "casmonde")}
                                    type="submit"
                                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                    Cas Monde
                                </button> */}

                                <label htmlFor="server" className="block text-sm font-medium text-gray-700">
                                    Search by department
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="server"
                                        name="server"
                                        value={this.state.searchValue}
                                        onChange={this.handleChange}
                                        type="text"
                                        placeholder="Ain"
                                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                                </div>
                            </div>

                            <div>
                                <button
                                    onClick={() => (this.setState({ expression: "casdepartement" }))}
                                    type="submit"
                                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                    Search
                                </button>
                            </div>
                        </form>
                        <VoiceRecognition callback={this.callbackVoice} />
                    </div>
                    <div className="shortResult">
                        <cite>{this.state.shortResult}</cite>
                    </div>
                    <div className="result">
                        {result}
                    </div>
                </div>
            </div>
        );
    }
};

export default Covid;