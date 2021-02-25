import React from 'react'
import ReactDOM from 'react-dom'

import { AppointmentsDayView } from '../src/AppointmentsDayView'
import { sampleAppointments } from '../src/sampleData'

ReactDOM.render(
  <AppointmentsDayView appointments={sampleAppointments} />,
  document.getElementById('root')
)