import React from 'react'
import { FormStoreType } from '../../../store'

interface NumberInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string
  formStore: FormStoreType<any>
}

const NumberInput: React.FC<NumberInputProps> = ({ name, formStore, ...rest }) => {
  return (
    <div>
      <input
        type="number"
        name={name}
        value={formStore.fields[name] || ''}
        onChange={(e) => formStore.setField(name, e.target.value)}
        {...rest}
      />
      {formStore.errors[name] && <span>{formStore.errors[name]}</span>}
    </div>
  )
}

export default NumberInput
