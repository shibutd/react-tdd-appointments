import { name, phone, lorem } from 'faker'

const stylists = ['Ashley', 'Jo', 'Pat', 'Sam'];

const services = [
  'Cut',
  'Blow-dry',
  'Cut & color',
  'Beard trim',
  'Cut & beard trim',
  'Extensions'
]

const randomInt = range => Math.floor(Math.random() * range)

Array.prototype.unique = function() {
  return this.filter(function(value, index, self) {
    return self.indexOf(value) === index
  })
}

Array.prototype.pickRandom = function() {
  return this[randomInt(this.length)]
}

const today = new Date()
const at = hours => today.setHours(hours, 0)

const generateFakeCustomer = () => ({
  firstName: name.firstName(),
  lastName: name.lastName(),
  phoneNumber: phone.phoneNumberFormat(1)
})

const generateFakeAppointment = () => ({
  customer: generateFakeCustomer(),
  stylist: stylists.pickRandom(),
  service: services.pickRandom(),
  notes: lorem.paragraph()
})

export const sampleAppointments = [...Array(9).keys()]
  .map(key => ({ startsAt: at(key + 9), ...generateFakeAppointment() }))

const pickMany = (items, number) =>
  [...Array(number).keys()].map(() => items.pickRandom())

const buildTimeSlots = () => {
  const today = new Date()
  const startTime = today.setHours(9, 0, 0, 0)

  const times = [...Array(7).keys()].map(day => {
    const daysToAdd = day * 24 * 60 * 60 * 1000

    return [...Array(20).keys()].map(halfHour => {
      const halfHoursToAdd = halfHour * 30 * 60 * 1000
      return {
        startsAt: startTime + daysToAdd + halfHoursToAdd,
        stylists: pickMany(stylists, randomInt(stylists.length))
      }
    })
  })
  return [].concat(...times)
}

export const sampleAvailableTimeSlots = pickMany(
  buildTimeSlots(),
  50
)