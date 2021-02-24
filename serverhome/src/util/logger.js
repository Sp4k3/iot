import winston from 'winston'
import morgan from 'morgan'
import dateUtil from './date-util.cjs'

const { getJSDateFromUtcIso } = dateUtil
const { format } = winston
const { colorize, combine, timestamp, label, printf } = format

const isProd = process.env.NODE_ENV === 'production'
const isTest = process.env.NODE_ENV === 'test'

const TECH_LABEL = 'tech'
const APP_LABEL = 'app'
const HTTP_LABEL = 'http'

const level = isProd
  ? 'info'
  : isTest
    ? 'error'
    : 'debug'

const logOptions = {
  console: {
    level,
    json: false,
    colorize: !isProd,
  },
}

export const getProperObjectFromError = error => {
  if (error == null) {
    return '<empty error>'
  }
  return Object.getOwnPropertyNames(error).reduce(
    (acc, key) => ({
      ...acc,
      [key]: error[key],
    }),
    Object.create(null),
  )
}

export const getProperObjectFromDate = message => {
  return Object.getOwnPropertyNames(message).reduce((acc, key) => {
    let value = message[key]
    if (['begin', 'end', 'date', 'dateTime'].includes(key)) {
      const newkey = key + 'Str'
      acc = {
        ...acc,
        [newkey]: `__${value}__`,
      }
      const datetimevalue = getJSDateFromUtcIso(value)
      if (datetimevalue) {
        value = datetimevalue
      }
    }
    return {
      ...acc,
      [key]: value,
    }
  }, Object.create(null))
}

export const getProperObject = message => {
  if (message == null) {
    return { default: '<empty message>' }
  }
  if (typeof message === 'string') {
    return { default: message }
  }
  if (message instanceof Error) {
    return getProperObjectFromError(message)
  }
  if ('error' in message) {
    message.error = getProperObjectFromError(message.error)
  }
  return getProperObjectFromDate(message)
}

const logFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${typeof message === 'object' ? JSON.stringify(getProperObject(message), null, 2, ' ') : message}`
})

const logJsonFormat = printf(({ label, level, message, timestamp }) => {
  const content = getProperObject(message)
  return JSON.stringify({
    content,
    meta: {
      level,
      label,
      timestamp,
    },
  })
})

export const techLogger = createWinstonLogger(TECH_LABEL)
export const appLogger = createWinstonLogger(APP_LABEL)
export const morganLogger = createWinstonLogger(HTTP_LABEL)

const morganLoggerStream = {
  write: function (message, encoding) {
    morganLogger.info(message)
  },
}

export const logHttp = morgan('combined', { stream: morganLoggerStream })

function createWinstonLogger (labelName, printColor) {
  const combineArgs = [
    label({ label: labelName }),
    timestamp(),
  ]
  if (!isProd) {
    combineArgs.push(colorize())
    combineArgs.push(logFormat)
  } else {
    combineArgs.push(logJsonFormat)
  }
  return winston.createLogger({
    format: combine(...combineArgs),
    transports: [
      new winston.transports.Console(logOptions.console),
    ],
  })
}
