import faker from 'faker/locale/fr'

export function getRandomString () {
  return faker.random.word() + '-' + faker.random.word()
}
