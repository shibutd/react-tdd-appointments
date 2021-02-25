import React from 'react'
import ReactDOM from 'react-dom'

// import { AppointmentsDayView } from './AppointmentsDayView'
// import { CustomerForm } from './CustomerForm'
import { AppointmentForm } from './AppointmentForm'
import {
  // sampleAppointments,
  sampleAvailableTimeSlots
} from './sampleData'

ReactDOM.render(
  // <AppointmentsDayView appointments={sampleAppointments} />,
  // <CustomerForm />,
  <AppointmentForm
    availableTimeSlots={sampleAvailableTimeSlots}
  />,
  document.getElementById('root')
)