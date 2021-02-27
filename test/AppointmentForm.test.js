import React from 'react'
import ReactTestUtils from 'react-dom/test-utils'

import { createContainer } from './domManipulators'
import { AppointmentForm, TimeSlotTable } from '../src/AppointmentForm'

describe('AppointmentForm', () => {
  let render, container

  beforeEach(() => {
    ({ render, container } = createContainer())
  })

  const form = id =>
    container.querySelector(`form[id="${id}"]`)

  it('renders a form', () => {
    render(<AppointmentForm />)
    expect(form('appointment')).not.toBeNull()
  })

  it('has a submut button', () => {
    render(<AppointmentForm />)
    const submitButton = container.querySelector(
      'input[type="submit"]'
    )
    expect(submitButton).not.toBeNull()
  })

  const field = name => form('appointment').elements[name]

  const labelFor = formElement =>
    container.querySelector(`label[for="${formElement}"]`)

  const itRendersAsASelectBox = fieldName => {
    it('renders as a select box', () => {
      render(<AppointmentForm />)
      expect(field(fieldName)).not.toBeNull()
      expect(field(fieldName).tagName).toEqual('SELECT')
    })
  }

  const itInitiallyHasABlankValueChosen = fieldName => {
    it('initially has a blank value chosen', () => {
      render(<AppointmentForm />)
      const firstNode = field(fieldName).childNodes[0]
      expect(firstNode.value).toEqual('')
      expect(firstNode.selected).toBeTruthy()
    })
  }

  const findOption = (dropdownNode, textContent) => {
    const options = Array.from(dropdownNode.childNodes)
    return options.find(
      option => option.textContent === textContent
    )
  }

  const itPreselectsExistingValue = (
    fieldName,
    props,
    existingValue
  ) => {
    it('pre-selects the existing value', () => {
      render(
        <AppointmentForm
          { ...props }
          { ...{ [fieldName]: existingValue } }
        />
      )
      const option = findOption(
        field(fieldName),
        existingValue
      )
      expect(option.selected).toBeTruthy()
    })
  }

  const itRendersALabel = (fieldName, text) => {
    it('renders a label', () => {
      render(<AppointmentForm />)
      expect(labelFor(fieldName)).not.toBeNull()
      expect(labelFor(fieldName).textContent).toEqual(text)
    })
  }

  const itAssignsAnIdThatMatchesTheLabelId = fieldName => {
    it('assigns an id that matches the label id', () => {
      render(<AppointmentForm />)
      expect(field(fieldName).id).toEqual(fieldName)
    })
  }

  const expectToShowValueOnFormSubmit = (fieledName, value) =>
    (props) => expect(props[fieledName]).toEqual(value)

  const itSubmitsExistingValue = (fieldName, props) => {
    it('saves existing value when submitted', async () => {
      expect.hasAssertions();
      render(
        <AppointmentForm
          {...props}
          {...{ [fieldName]: 'value' }}
          onSubmit={
            expectToShowValueOnFormSubmit(fieldName, 'value')
          }
        />
      );
      await ReactTestUtils.Simulate.submit(form('appointment'));
    });
  };

  const itSubmitsNewValue = (fieldName, props) => {
    it('saves new value when submitted', async () => {
      expect.hasAssertions()
      render(
        <AppointmentForm
          { ...props }
          { ...{ [fieldName]: 'existingValue' } }
          onSubmit={
            expectToShowValueOnFormSubmit(fieldName, 'newValue')
          }
        />
      )
      await ReactTestUtils.Simulate.change(field(fieldName), {
        target: { value: "newValue", name: fieldName }
      })
      await ReactTestUtils.Simulate.submit(form('appointment'))
    })
  }

  describe('service field', () => {
    const selectableServices = ['Cut', 'Blow-dry']

    itRendersAsASelectBox('service')
    itInitiallyHasABlankValueChosen('service')
    itPreselectsExistingValue(
      'service',
      { selectableServices },
      'Blow-dry'
    )
    itRendersALabel('service', 'Salon service')
    itAssignsAnIdThatMatchesTheLabelId('service')
    itSubmitsExistingValue(
      'service',
      { serviceStylists: { value: [] } }
    )
    itSubmitsNewValue(
      'service',
      { serviceStylists: { newValue: [], existingValue: [] } }
    )

    it('lists all salon services', () => {
      render(
        <AppointmentForm
          selectableServices={selectableServices}
        />
      )
      const optionNodes = Array.from(field('service').childNodes)
      const renderedServices = optionNodes.map(
        node => node.textContent
      )
      expect(renderedServices).toEqual(
        expect.arrayContaining(selectableServices)
      )
    })
  })

  describe('stylist field', () => {
    const selectableStylists = ['Ashley', 'Jo']

    itRendersAsASelectBox('stylist')
    itInitiallyHasABlankValueChosen('stylist')
    itPreselectsExistingValue(
      'stylist',
      { selectableStylists },
      'Ashley'
    )
    itRendersALabel('stylist', 'Stylist')
    itAssignsAnIdThatMatchesTheLabelId('stylist')
    itSubmitsExistingValue(
      'stylist',
      { selectableStylists },
    )
    itSubmitsNewValue(
      'stylist',
      { selectableStylists },
    )

    it('lists only stylists that can perform the selected service', () => {
      const selectableServices = ['1', '2']
      const selectableStylists = ['A', 'B', 'C']
      const serviceStylists = { '1': ['A', 'B'] }

      render(
        <AppointmentForm
          { ...{selectableServices, selectableStylists, serviceStylists} }
        />
      )
      ReactTestUtils.Simulate.change(field('service'), {
        target: { value: '1', name: 'service' }
      })

      const optionNodes = Array.from(field('stylist').childNodes)
      const renderedServices = optionNodes.map(
        node => node.textContent
      )
      expect(renderedServices).toEqual(
        expect.arrayContaining(['A', 'B'])
      )
    })
  })

  describe('time slot table', () => {
    const today = new Date()
    const availableTimeSlots = [
      { startsAt: today.setHours(9, 0, 0, 0) },
      { startsAt: today.setHours(9, 30, 0, 0) }
    ]

    const timeSlotTable = () =>
      container.querySelector('table#time-slots')

    const startsAtField = index =>
      container.querySelectorAll(`input[name="startsAt"]`)[index]

    it('renders a table for time slots', () => {
      render(<AppointmentForm />)
      expect(timeSlotTable()).not.toBeNull()
    })

    it(
      `renders a time slot for every half an hour
       between open and close times`,
      () => {
        render(
          <AppointmentForm salonOpensAt={9} salonClosesAt={11} />
        )
        const timesOfDay = timeSlotTable().querySelectorAll(
          'tbody >* th'
        )
        expect(timesOfDay).toHaveLength(4)
        expect(timesOfDay[0].textContent).toEqual('09:00')
        expect(timesOfDay[1].textContent).toEqual('09:30')
        expect(timesOfDay[3].textContent).toEqual('10:30')
      })

    it('renders an empty cell at the start of the header row', () => {
      render(<AppointmentForm />)
      const headerRow = timeSlotTable().querySelector(
        'thead > tr'
      )
      expect(headerRow.firstChild.textContent).toEqual('')
    })

    it('renders a week of available dates', () => {
      const today = new Date(2018, 11, 1)
      render(<AppointmentForm today={today} />)
      const dates = timeSlotTable().querySelectorAll(
        'thead >* th:not(:first-child)'
      )
      expect(dates).toHaveLength(7)
      expect(dates[0].textContent).toEqual('Sat 01')
      expect(dates[1].textContent).toEqual('Sun 02')
      expect(dates[6].textContent).toEqual('Fri 07')
    })

    it('renders a radio button for each time slot', () => {
      render(
        <AppointmentForm
          availableTimeSlots={availableTimeSlots}
          today={today}
        />
      )
      const cells = timeSlotTable().querySelectorAll('td')
      expect(
        cells[0].querySelector('input[type="radio"]')
      ).not.toBeNull()
      expect(
        cells[7].querySelector('input[type="radio"]')
      ).not.toBeNull()
    })

    it('does not render radio buttons for unavailable time slots', () => {
      render(<AppointmentForm availableTimeSlots={[]} />)
      const timesOfDay = timeSlotTable().querySelectorAll('input')
      expect(timesOfDay).toHaveLength(0)
    })

    it(
      'sets radio button values to the index of the corresponding appointment',
      () => {
        render(
          <AppointmentForm
            availableTimeSlots={availableTimeSlots}
            today={today}
          />
        )
        expect(startsAtField(0).value).toEqual(
          availableTimeSlots[0].startsAt.toString()
        )
        expect(startsAtField(1).value).toEqual(
          availableTimeSlots[1].startsAt.toString()
        )
      })

    it('pre-selects the existing value', () => {
      render(
        <AppointmentForm
          availableTimeSlots={availableTimeSlots}
          today={today}
          startsAt={availableTimeSlots[0].startsAt}
        />
      )
      expect(startsAtField(0).checked).toEqual(true)
    })

    it('saves existing value when submitted', async () => {
      expect.hasAssertions()
      render(
        <AppointmentForm
          availableTimeSlots={availableTimeSlots}
          today={today}
          startsAt={availableTimeSlots[0].startsAt}
          onSubmit={
            expectToShowValueOnFormSubmit(
              'startsAt', availableTimeSlots[0].startsAt
            )
          }
        />
      )
      ReactTestUtils.Simulate.submit(form('appointment'))
    })

    it('saves new value when submitted', () => {
      expect.hasAssertions()
      render(
        <AppointmentForm
          availableTimeSlots={availableTimeSlots}
          today={today}
          startsAt={availableTimeSlots[0].startsAt}
          onSubmit={
            expectToShowValueOnFormSubmit(
              'startsAt', availableTimeSlots[1].startsAt
            )
          }
        />
      )
      ReactTestUtils.Simulate.change(startsAtField(1), {
        target: {
          value: availableTimeSlots[1].startsAt.toString(),
          name: 'startsAt'
        }
      })
      ReactTestUtils.Simulate.submit(form('appointment'))
    })

    it('filetrs appointments by selected slylists', () => {
      const availableTimeSlots = [
        {
          startsAt: today.setHours(9, 0, 0, 0),
          stylists: ['A', 'B']
        },
        {
          startsAt: today.setHours(9, 30, 0, 0),
          stylists: ['A']
        }
      ]
      render(
        <AppointmentForm
          availableTimeSlots={availableTimeSlots}
          today={today}
        />
      )
      ReactTestUtils.Simulate.change(field('stylist'), {
        target: { value: 'B', name: 'stylist' }
      })

      const cells = timeSlotTable().querySelectorAll('td')
      expect(
        cells[0].querySelector('input[type="radio"]')
      ).not.toBeNull()
      expect(
        cells[7].querySelector('input[type="radio"]')
      ).toBeNull()
    })
  })
})