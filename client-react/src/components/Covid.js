import React, { useState, useEffect, useCallback } from 'react';
import VoiceRecognition from './VoiceRecognition'
import { subscribeToEvent, emitEvent, sendRequest } from '../utils/serverhome-api'
import './Wikipedia.css';

const Covid = () => {
    const [searchValue, setSearchValue] = useState("");
    const [shortResult, setShortResult] = useState("");
    const [isTable, setIsTable] = useState(false);
    const [searchResult, setSearchResult] = useState(null);

    const handleChange = (event) => {
        setSearchValue(event.target.value)
    }

    const handleSubmit = useCallback((event) => {
        callAPI(searchValue)
        if (event) event.preventDefault();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchValue])

    useEffect(() => {
        subscribeToEvent("covidresult", (data) => {
            setSearchResult(data.infos.replace(new RegExp("/wiki/", 'g'), "/plugin/covid/"))
            setIsTable(data.isTable)
        });
    }, [searchValue]);

    useEffect(() => {
        const lastPart = window.location.href.split("/").pop();
        if (lastPart !== "covid") {
            setSearchValue(lastPart);
            handleSubmit(null);
        }
    }, [handleSubmit, searchValue]);

    const callbackVoice = (voiceInfo) => {
        if (voiceInfo?.data.searchValue) {
            setSearchValue(voiceInfo.data.searchValue);
            callAPI(voiceInfo.data.searchValue)
        } else {
            const sentence = 'Je n\'ai pas compris votre demande'
            const utterThis = new SpeechSynthesisUtterance(sentence);
            utterThis.lang = 'fr-FR';
            console.log({ "response": sentence });
            window.speechSynthesis.speak(utterThis);
        }
    }

    const callAPI = (queryValue) => {
        console.log("emit event covidsearch : " + queryValue);
        let exp = ''
        queryValue = queryValue.trim()
        queryValue.includes('France') ? exp = 'casfrance' : exp = 'casdepartement'
        console.log(queryValue)
        console.log('exp : ', exp)
        sendRequest("covid", exp, { searchValue: queryValue }).then((data) => {
            if (data.resultText) {
                let utterThis = new SpeechSynthesisUtterance(data.resultText);
                utterThis.lang = 'fr-FR';
                console.log({ "response": data.resultText });
                window.speechSynthesis.speak(utterThis);
                setShortResult(data.resultText)
            };
        });
    }

    const result = searchResult ?
        (isTable ?
            <table dangerouslySetInnerHTML={{ __html: searchResult }} /> :
            <div dangerouslySetInnerHTML={{ __html: searchResult }} />)
        : "";
    return (
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                <form className="space-y-6" action="#" method="POST" onSubmit={handleSubmit}>
                    <div>
                        <button
                            type="submit"
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            Cas France
                        </button>
                        {/* <button
                            onClick={() => (setExpression("casmonde"))}
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
                                value={searchValue}
                                onChange={handleChange}
                                type="text"
                                placeholder="Ain"
                                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            Search
                        </button>
                    </div>
                </form>
                <VoiceRecognition callback={callbackVoice} />
            </div>
            <div className="shortResult">
                <cite>{shortResult}</cite>
            </div>
            <div className="result">
                {result}
            </div>
        </div>
    );
};

export default Covid;