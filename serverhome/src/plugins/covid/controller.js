import request from 'sync-request'
import rp from 'request-promise'
import $ from 'cheerio'
const url = 'https://coronavirusapi-france.now.sh/'

const covidController = (io) => {
  const isActive = true

  if (isActive) {
    scrapWiki(io)
  }

  const postAction = (req, res) => {
    let requestUrl = url
    const dict = {
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

const getDepartement = (req, res, requestUrl) => {
  requestUrl += 'LiveDataByDepartement?Departement='
  requestUrl += req.body.searchValue
  const wikiReq = request('GET', requestUrl, { cache: 'file' })
  const response = JSON.parse(wikiReq.getBody('utf8'))
  const textResponse = parseDataResponse(response.LiveDataByDepartement[0])
  if (!textResponse) {
    res.end(JSON.stringify({ resultText: "je n'ai pas d'informations" }))
  } else {
    res.end(JSON.stringify({ resultText: textResponse }))
  }
}

const getFrance = (req, res, requestUrl) => {
  requestUrl += 'FranceLiveGlobalData'
  const wikiReq = request('GET', requestUrl, { cache: 'file' })
  const response = JSON.parse(wikiReq.getBody('utf8'))
  const textResponse = parseDataResponse(response.FranceGlobalLiveData[0])
  if (!textResponse) {
    res.end(JSON.stringify({ resultText: "je n'ai pas d'informations" }))
  } else {
    res.end(JSON.stringify({ resultText: textResponse }))
  }
}

const parseDataResponse = (response) => {
  if (response) {
    let textResponse = ''
    textResponse = response.nom + ' ' + response.date + ' : ' + response.nouvellesHospitalisations + ' hospitalisations'
    return textResponse
  }
  return false
}

const scrapWiki = (io) => {
  io.sockets.on('connection', (socket) => {
    console.log('connexion')
    socket.on('covidsearch', (searchvalue) => {
      console.log('Search on covid : ' + searchvalue)

    })
  })
}

export default covidController
