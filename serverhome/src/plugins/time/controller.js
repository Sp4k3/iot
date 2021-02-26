const timeController = (io) => {
  const isActive = true

  const postAction = (req, res) => {
    const dict = {
      time1: () => whatTime(req, res),
      time2: () => whatTime(req, res),
      time3: () => whatTime(req, res),
      day1: () => whatDay(req, res),
      day2: () => whatDay(req, res),
    }
    dict[req.params.actionId]()
  }

  return {
    isActive,
    postAction,
  }
}

const whatTime = (req, res) => {
  const now = new Date()
  const response = 'Il est ' + now.toLocaleTimeString('fr-FR') + '.'
  res.end(JSON.stringify({ resultText: response }))
}

const whatDay = (req, res) => {
  const now = new Date()
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
  const response = 'Nous sommes le ' + now.toLocaleDateString('fr-FR', options) + '.'
  res.end(JSON.stringify({ resultText: response }))
}

export default timeController
