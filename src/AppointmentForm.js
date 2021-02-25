import React, { useState, useCallback } from 'react'

const timeIncrements = (numTimes, startTime, increment) =>
  Array(numTimes)
  .fill([startTime])
  .reduce((acc, _, i) =>
    acc.concat([startTime + (i * increment)]))

const dailyTimeSlots = (salonOpensAt, salonClosesAt) => {
  const totalSlots = (salonClosesAt - salonOpensAt) * 2
  const startTime = new Date().setHours(salonOpensAt, 0, 0, 0)
  const increment = 30 * 60 * 1000

  return timeIncrements(totalSlots, startTime, increment)
}

const weeklyDateValues = (startDate) => {
  const midnight = new Date(startDate).setHours(0, 0, 0, 0)
  const increment = 24 * 60 * 60 * 1000

  return timeIncrements(7, midnight, increment)
}

const toTimeValue = timestamp =>
  new Date(timestamp).toTimeString().substring(0, 5)

const toShortDate = timestamp => {
  const [day, , dayOfMonth] = new Date(timestamp)
    .toDateString()
    .split(' ')
  return `${day} ${dayOfMonth}`
}

const mergeDateAndTime = (date, timeSlot) => {
  const time = new Date(timeSlot)
  return new Date(date).setHours(
    time.getHours(),
    time.getMinutes(),
    time.getSeconds(),
    time.getMilliseconds()
  )
}

const RadioButtonIfAvailable = ({
  availableTimeSlots,
  date,
  timeSlot,
  checkedTimeSlot,
  handleChange
}) => {
  const startsAt = mergeDateAndTime(date, timeSlot);

  if (availableTimeSlots.some(slot => slot.startsAt === startsAt)) {
    const isChecked = startsAt === checkedTimeSlot
    return (
      <input
        name="startsAt"
        type="radio"
        value={startsAt}
        checked={isChecked}
        onChange={handleChange}
      />
    )
  }
  return null
}

const TimeSlotTable = ({
  salonOpensAt,
  salonClosesAt,
  today,
  availableTimeSlots,
  checkedTimeSlot,
  handleChange
}) => {
  const dates = weeklyDateValues(today)
  const timeSlots = dailyTimeSlots(salonOpensAt, salonClosesAt)

  return (
    <table id="time-slots">
      <thead>
        <tr>
          <th />
          {dates.map(date => (
            <th key={date}>{toShortDate(date)}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {timeSlots.map(timeSlot => (
          <tr key={timeSlot}>
            <th>{toTimeValue(timeSlot)}</th>
            {dates.map(date => (
              <td key={date}>
                <RadioButtonIfAvailable
                  availableTimeSlots={availableTimeSlots}
                  date={date}
                  timeSlot={timeSlot}
                  checkedTimeSlot={checkedTimeSlot}
                  handleChange={handleChange}
                />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export const AppointmentForm = ({
  selectableServices,
  service,
  onSubmit,
  salonOpensAt,
  salonClosesAt,
  today,
  availableTimeSlots,
  startsAt
}) => {
  const [appointment, setAppointment] = useState({ service, startsAt })

  const handleServiceChange = ({ target }) =>
    setAppointment(appointment => ({
      ...appointment,
      service: target.value
    }))

  const handleStartsAtChange = useCallback(({ target }) => {
    setAppointment(appointment => ({
      ...appointment,
      startsAt: parseInt(target.value)
    }))
  }, [])

  return (
    <form id="appointment" onSubmit={() => onSubmit(appointment)}>
      <label htmlFor="service">Salon service</label>
      <select
        name="service"
        id="service"
        value={service}
        onChange={handleServiceChange}
      >
        <option />
        {selectableServices.map(service => (
          <option key={service}>{service}</option>
        ))}
      </select>
      <TimeSlotTable
        salonOpensAt={salonOpensAt}
        salonClosesAt={salonClosesAt}
        today={today}
        availableTimeSlots={availableTimeSlots}
        checkedTimeSlot={appointment.startsAt}
        handleChange={handleStartsAtChange}
      />
    </form>
  )
}

AppointmentForm.defaultProps = {
  selectableServices: [
    'Cut',
    'Blow-dry',
    'Cut & color',
    'Beard trim',
    'Cut & beard trim',
    'Extensions'
  ],
  salonOpensAt: 9,
  salonClosesAt: 19,
  today: new Date(),
  availableTimeSlots: []
}