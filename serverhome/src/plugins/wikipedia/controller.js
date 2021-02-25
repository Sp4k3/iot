import request from 'sync-request'
import rp from 'request-promise'
import $ from 'cheerio'
const url = 'https://fr.wikipedia.org/wiki/'

const wikipediaController = (io) => {
  const isActive = true

  if (isActive) {
    scrapWiki(io)
  }


  const postAction = (req, res) => {
    let requestUrl = 'https://fr.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro=&explaintext=&titles='
    requestUrl += parseDataSend(req.body.searchValue)
    const dict = {
      whatis: () => whatIs(req, res, requestUrl),
      whois: () => whatIs(req, res, requestUrl),
    }
    dict[req.params.actionId]()
  }

  const getView = (req, res) => {
    const dataView = {
      type: 'Wikipedia',
    }
    res.end(JSON.stringify(dataView))
  }

  return {
    isActive,
    postAction,
    getView,
  }
}

const whatIs = (req, res, requestUrl) => {
  const wikiReq = request('GET', requestUrl, { cache: 'file' })
  const response = JSON.parse(wikiReq.getBody('utf8'))
  const textResponse = parseDataResponse(response)
  if (!textResponse) {
    res.end(JSON.stringify({ resultText: "je n'ai pas d'informations" }))
  } else {
    res.end(JSON.stringify({ resultText: textResponse }))
  }
}

const scrapWiki = (io) => {
  io.sockets.on('connection', (socket) => {
    socket.on('wikipediasearch', (searchvalue) => {
      console.log('Search on Wikipedia term : ' + searchvalue)
      let isTable = true
      const urlToSearch = url + searchvalue
        .split(' ')
        .map(el => el.charAt(0).toUpperCase() + el.slice(1))
        .join('_')
      rp(urlToSearch)
        .then(html => {
          const title = $('.firstHeading', html).text()
          let infos = $('.infobox_v2', html).html()
          if (!infos) {
            infos = $('.infobox_v3', html).html()
            if (!infos) {
              infos = $('.mw-parser-output', html).html()
              isTable = false
            }
          }
          socket.emit('wikipediaresult', { title: title, infos: infos, isTable: isTable })
        })
        .catch(err => {
          console.log('ERREUR')
        })
    })
  })
}

const parseDataSend = (data) => {
  if (data.indexOf(' ')) {
    const pieces = data.split(' ')
    data = ''
    for (const i in pieces) {
      if (pieces[i].length > 3) {
        data += pieces[i].charAt(0).toUpperCase()
        data += pieces[i].substr(1)
        if (i !== pieces.length - 1) {
          data += '_'
        }
      }
    }
  }
  return data
}

const parseDataResponse = (response) => {
  if (response) {
    if (response.query) {
      for (const i in response.query.pages) {
        if (response.query.pages[i].extract) {
          let textResponse = ''
          if (response.query.pages[i].extract.indexOf('\n') !== -1) {
            textResponse = response.query.pages[i].extract.substr(0, response.query.pages[i].extract.indexOf('\n'))
          } else {
            textResponse = response.query.pages[i].extract
          }
          if (textResponse.length > 300) {
            textResponse = textResponse.substr(0, textResponse.indexOf('.'))
          }
          // console.log(textResponse)
          return textResponse
        }
      }
    }
  }
  return false
}

export default wikipediaController
