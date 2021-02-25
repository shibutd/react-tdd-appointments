import React, { useState } from 'react'

export const AppointmentForm = ({
  selectableServices,
  service,
  onSubmit
}) => {
  const [appointment, setAppointment] = useState({ service })

  const handleSelectChange = ({ target }) =>
    setAppointment(appointment => ({
      ...appointment,
      service: target.value
    }))


  return (
    <form id="appointment" onSubmit={() => onSubmit(appointment)}>
      <label htmlFor="service">Salon service</label>
      <select
        name="service"
        id="service"
        value={service}
        onChange={handleSelectChange}
      >
        <option />
        {selectableServices.map(service => (
          <option key={service}>{service}</option>
        ))}
      </select>
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
  ]
}