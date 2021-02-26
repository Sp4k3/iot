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
		getExpressions().then((expressions) => {
			subscribeServerSays();
			if (recognition) {
				recognition.onresult = async (event) => {
					const result = event.results[event.results.length - 1];
					if (result.isFinal) {
						const objRequest = searchRequest(result[0].transcript, expressions);
						console.log({
							"transcript": result[0].transcript,
							"data": objRequest
						}); 
						if (callback) {
							await callback(objRequest);
						} else if (objRequest && objRequest.plugin) {
							sendData(objRequest);
						}
					}
				};
			}
		});
	});

	const subscribeServerSays = () => {
		subscribeToEvent("serversays", (data) => {
			let utterThis = new SpeechSynthesisUtterance(data);
			utterThis.lang = 'fr-FR';
			window.speechSynthesis.speak(utterThis);
		});
	}

	const sendData = (objRequest) => {
		sendRequest(objRequest.plugin, objRequest.action, objRequest.data).then((data) => {
			if (data.resultText) {
				let utterThis = new SpeechSynthesisUtterance(data.resultText);
				utterThis.lang = 'fr-FR';
				window.speechSynthesis.speak(utterThis);
			}
		});
	}
	const start = async () => {
		await SpeechRecognition.startListening()
	}

	const stop = async () => {
		await SpeechRecognition.stopListening()
	}

	if (!isConfigured()) {
		return <div>Configurer le server de merry home ;)</div>;
	}

	if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
		return <div>Pour utiliser la reconnaissance vocale, merci d'utiliser google chrome ;)</div>;
	}

	return (
		<div className="voicerecognition py-2">
			{
				listening ?
					<button
						className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
						onClick={stop}>Stop	</button>
				:
					<button
						className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
						onClick={start}>Start</button>
			}
			<p>{transcript}</p>
		</div>
	);
};


export default VoiceRecognition;