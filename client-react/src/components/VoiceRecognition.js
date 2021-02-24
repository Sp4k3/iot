import React, { useEffect } from 'react'
import { isConfigured } from '../utils/authservice'
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'

import { getExpressions, sendRequest, subscribeToEvent } from '../utils/serverhome-api'
import { searchRequest } from '../utils/voice-helper'

const VoiceRecognition = ({ callback }) => {
    const { transcript, listening } = useSpeechRecognition()
    const recognition = SpeechRecognition.getRecognition()

    useEffect(() => {
        if (!isConfigured()) return;
        console.log('callback', callback)
        getExpressions().then((expressions) => {
            subscribeServerSays();
            if (recognition) {
                recognition.onresult = (event) => {
                    var result = event.results[event.results.length - 1];
                    if (result.isFinal) {
                        var objRequest = searchRequest(result[0].transcript, expressions);
                        console.log({
                            "transcript": result[0].transcript,
                            "data": objRequest
                        });
                        //si un callback est definit on transmet l'information par la fonction.  
                        if (callback) {
                            console.log('objRequest dans callback', objRequest)
                            callback(objRequest);
                        } else if (objRequest && objRequest.plugin) {
                            console.log('objRequest', objRequest)
                            sendData(objRequest);
                        }
                    }
                };
            }
        });
    });

    const subscribeServerSays = () => {
        subscribeToEvent("serversays", function (data) {
            var utterThis = new SpeechSynthesisUtterance(data);
            utterThis.lang = 'fr-FR';
            console.log({ "event server says": data });
            window.speechSynthesis.speak(utterThis);
        });
    }

    const sendData = (objRequest) => {
        sendRequest(objRequest.plugin, objRequest.action, objRequest.data).then((data) => {
            if (data.resultText) {
                var utterThis = new SpeechSynthesisUtterance(data.resultText);
                utterThis.lang = 'fr-FR';
                console.log({ "response": data.resultText });
                window.speechSynthesis.speak(utterThis);
            }
        });
    }
    const start = async () => {
        await SpeechRecognition.startListening()
    }


    if (!isConfigured()) {
        return <div>Configurer le server de merry home ;)</div>;
    }

    if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
        return <div>Pour utiliser la reconnaissance vocale, merci d'utiliser google chrome ;)</div>;
    }

    return (
        <div className="voicerecognition">
            {listening ?
                <>
                    <span>👂</span>
                    <button
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        onClick={SpeechRecognition.stopListening}>⏸ Stop</button>
                </>
                :
                <>
                    <span>🎤</span>
                    <button
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                        onClick={start}>▶️ Start</button>
                </>
            }
            <p>{transcript}</p>
        </div>
    );
};


export default VoiceRecognition;