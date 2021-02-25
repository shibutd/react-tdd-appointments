import React from 'react'
import ReactTestUtils from 'react-dom/test-utils';

import { createContainer } from './domManipulators'
import { CustomerForm } from '../src/CustomerForm'

describe('CustomerForm', () => {
  let render, container

  beforeEach(() => {
    ({ render, container } = createContainer())
  })

  const form = id => container.querySelector(`form[id="${id}"]`)

  const field = name => form('customer').elements[name]

  const labelFor = formElement =>
    container.querySelector(`label[for="${formElement}"]`)

  it('renders a form', () => {
    render(<CustomerForm />)
    expect(form('customer')).not.toBeNull()
  })

  const expectToBeInputFieldOfTypeText = formElement => {
    expect(formElement).not.toBeNull()
    expect(formElement.tagName).toEqual('INPUT')
    expect(formElement.type).toEqual('text')
  }

  const itRendersAsATextBox = (fieldName) =>
    it('renders as a text box', () => {
      render(<CustomerForm />)
      expectToBeInputFieldOfTypeText(field(fieldName))
    })

  const itIncludesTheExistingValue = (fieldName) =>
    it('includes the existing value', () => {
      render(<CustomerForm { ...{[fieldName]: 'value'} } />)
      expect(field(fieldName).value).toEqual('value')
    })

  const rendersALabel = (fieldName, labelText) =>
    it('renders a label', () => {
      render(<CustomerForm />)
      expect(labelFor(fieldName)).not.toBeNull()
      expect(labelFor(fieldName).textContent).toEqual(labelText)
    })

  const assignsAnIdThatMatchesTheLabelId = (fieldName) =>
    it('assigns an id that matches the label id', () => {
      render(<CustomerForm />)
      expect(field(fieldName).id).toEqual(fieldName)
    })

  const expectToShowValueOnFormSubmit = (fieldName, value) =>
    (props) => expect(props[fieldName]).toEqual(value)

  const savesExistingValueWhenSubmitted = (fieldName, value) =>
    it('saves existing value when submitted', async () => {
      expect.hasAssertions()
      render(
        <CustomerForm
          { ...{[fieldName]: value} }
          onSubmit={expectToShowValueOnFormSubmit(fieldName, value)}
        />
      )
      await ReactTestUtils.Simulate.submit(form('customer'))
    })

  const savesNewValueWhenSubmitted = (fieldName, value) =>
    it('saves new value when submitted', async () => {
      expect.hasAssertions()
      render(
        <CustomerForm
          { ...{[fieldName]: 'existingValue'} }
          onSubmit={expectToShowValueOnFormSubmit(fieldName, value)}
        />
      )
      await ReactTestUtils.Simulate.change(field(fieldName), {
        target: { name: fieldName, value }
      })
      await ReactTestUtils.Simulate.submit(form('customer'))
    })

  describe('first name field', () => {
    itRendersAsATextBox('firstName')
    itIncludesTheExistingValue('firstName')
    rendersALabel('firstName', 'First name')
    assignsAnIdThatMatchesTheLabelId('firstName')
    savesExistingValueWhenSubmitted('firstName', 'firstName')
    savesNewValueWhenSubmitted('firstName', 'firstName')
  })

  describe('last name field', () => {
    itRendersAsATextBox('lastName')
    itIncludesTheExistingValue('lastName')
    rendersALabel('lastName', 'Last name')
    assignsAnIdThatMatchesTheLabelId('lastName')
    savesExistingValueWhenSubmitted('lastName', 'lastName')
    savesNewValueWhenSubmitted('lastName', 'lastName')
  })

  describe('phone number field', () => {
    itRendersAsATextBox('phoneNumber')
    itIncludesTheExistingValue('phoneNumber')
    rendersALabel('phoneNumber', 'Phone number')
    assignsAnIdThatMatchesTheLabelId('phoneNumber')
    savesExistingValueWhenSubmitted('phoneNumber', '0123456789')
    savesNewValueWhenSubmitted('phoneNumber', '1234567890')
  })

  it('has a submit button', () => {
    render(<CustomerForm />)
    const submitButton = container.querySelector(
      'input[type="submit"]'
    )
    expect(submitButton).not.toBeNull()
    expect(submitButton.tagName).toEqual('INPUT')
    expect(submitButton.type).toEqual('submit')
  })
})