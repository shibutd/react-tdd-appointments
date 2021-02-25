import React from 'react'
import ReactDOM from 'react-dom'

import { AppointmentsDayView } from '../src/AppointmentsDayView'
import { CustomerForm } from '../src/CustomerForm'
import { sampleAppointments } from '../src/sampleData'

ReactDOM.render(
  // <AppointmentsDayView appointments={sampleAppointments} />,
  <CustomerForm />,
  document.getElementById('root')
)