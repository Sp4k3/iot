import request from 'sync-request'
const url = 'https://coronavirusapi-france.now.sh/'

const covidController = () => {
  const isActive = true

  const postAction = (req, res) => {
    let requestUrl = url
    const dict = {
      casdepartements: () => getAllDepartement(req, res, requestUrl),
      casdepartement: () => getDepartement(req, res, requestUrl),
      casfrance: () => getFrance(req, res, requestUrl),
      casmonde: () => getFrance(req, res, requestUrl),
    }
    dict[req.params.actionId]()
  }

  const getView = (req, res) => {
    const dataView = {
      type: 'Covid',
    }
    res.end(JSON.stringify(dataView))
  }

  return {
    isActive,
    postAction,
    getView,
  }
}

const getAllDepartement = (req, res, requestUrl) => {
  requestUrl += 'AllLiveData'
  const covidReq = request('GET', requestUrl, { cache: 'file' })
  const response = JSON.parse(covidReq.getBody('utf8'))
    res.end(JSON.stringify({ result: response.allLiveFranceData }))
}

const getDepartement = (req, res, requestUrl) => {
  requestUrl += 'LiveDataByDepartement?Departement='
  requestUrl += req.body.searchValue.trim()
  const covidReq = request('GET', requestUrl, { cache: 'file' })
  const response = JSON.parse(covidReq.getBody('utf8'))
  const textResponse = parseDataResponse(response.LiveDataByDepartement[0])
  if (!textResponse) {
    res.end(JSON.stringify({ resultText: "je n'ai pas d'informations" }))
  } else {
    res.end(JSON.stringify({ resultText: textResponse, result: response.LiveDataByDepartement }))
  }
}

const getFrance = (req, res, requestUrl) => {
  requestUrl += 'FranceLiveGlobalData'
  const covidReq = request('GET', requestUrl, { cache: 'file' })
  const response = JSON.parse(covidReq.getBody('utf8'))
  const textResponse = parseDataResponse(response.FranceGlobalLiveData[0])
  if (!textResponse) {
    res.end(JSON.stringify({ resultText: "je n'ai pas d'informations" }))
  } else {
    res.end(JSON.stringify({ resultText: textResponse, result: response.FranceGlobalLiveData }))
  }
}

const parseDataResponse = (response) => {
  if (response) {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
    const date = new Date(response.date).toLocaleDateString('fr-FR', options)
    return response.nom + ', le ' + date + ', il y a eu ' + response.nouvellesHospitalisations + ' nouvelles hospitalisations.'
  }
  return false
}

export default covidController
