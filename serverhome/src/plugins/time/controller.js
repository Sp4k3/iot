const timeController = (io) => {
  const isActive = true

  const postAction = (req, res) => {
    const dict = {
      whattime: () => whatTime(req, res),
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
  const response = 'Il est ' + now.getHours() + ' heure ' + now.getMinutes() + '.'
  res.end(JSON.stringify({ resultText: response }))
}

export default timeController
