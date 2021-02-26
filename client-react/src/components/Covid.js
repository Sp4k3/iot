import React, { useState, useEffect, useCallback } from 'react';
import VoiceRecognition from './VoiceRecognition'
import { sendRequest } from '../utils/serverhome-api'
import './Wikipedia.css';

const Covid = () => {
	const [searchValue, setSearchValue] = useState("");
	const [searchResult, setSearchResult] = useState(null);

	const handleChange = (event) => {
		setSearchValue(event.target.value)
	}

	const handleSubmit = useCallback((event) => {
		callAPI(searchValue)
		if (event) event.preventDefault();
	}, [searchValue])

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
			window.speechSynthesis.speak(utterThis);
		}
	}

	const callAPI = async (queryValue) => {
		let exp = ''
		queryValue === 'France' || queryValue === '' 
			? exp = 'casfrance' 
			: queryValue === 'casdepartements'
				? exp = 'casdepartements'
				: exp = 'casdepartement'
		const data = await sendRequest("covid", exp, { searchValue: queryValue })
		if (data.resultText) {
			const resultText = data.resultText
			let utterThis = new SpeechSynthesisUtterance(resultText);
			utterThis.lang = 'fr-FR';
			window.speechSynthesis.speak(utterThis);
		};
		setSearchResult(data.result)
	}

	return (
		<div className="mt-4 sm:mx-auto sm:w-full sm:max-w-md">
			<div className="bg-white pt-3 px-4 shadow sm:rounded-lg sm:px-10">
				<form className="space-y-2" action="#" method="POST" onSubmit={handleSubmit}>
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
						<button
							type="submit"
							className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
							Recherche
						</button>
						<button
							onClick={() => setSearchValue('')}
							type="submit"
							className="w-full flex justify-center my-2 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
							Cas France
						</button>
						<button
							onClick={() => setSearchValue('casdepartements')}
							type="submit"
							className="w-full flex justify-center my-2 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
							Cas départements
						</button>
				</form>
				<div className="bg-white mt-4 border-t border-gray-200">
					<VoiceRecognition callback={callbackVoice} />
				</div>
			</div>

			{
				searchResult ?
					searchResult.map((value, index) => {
						return (
							<div key={index} className="bg-white mt-2 pt-3 px-4 shadow sm:rounded-lg sm:px-10">
								<div className="overflow-hidden">
									<div className="px-3 bg-white border-b border-gray-200 font-bold uppercase">
										{value.nom} - {value.date}
									</div>
									<div className="p-3 bg-white border-b border-gray-200 text-left">
										Nouvelles hospitalisations : {value.nouvellesHospitalisations} <br></br>
										nouvelles réanimations : {value.nouvellesReanimations} <br></br>
										Nombre total de décès : {value.deces}
									</div>
									<div className="p-3 bg-white border-gray-200 text-right text-xs">
										Source : {value.source.nom}
									</div>
								</div>
							</div>
						)
					})
				:
					<div></div>
			}
		</div >
	);
};
export default Covid;