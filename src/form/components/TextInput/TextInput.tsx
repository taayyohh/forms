import React from 'react'
import { FormStoreType } from '../../../store'

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string
  formStore: FormStoreType<any>
}

const TextInput: React.FC<TextInputProps> = ({ name, formStore, ...rest }) => {
  return (
    <div>
      <input
        name={name}
        value={formStore.fields[name] || ''}
        onChange={(e) => formStore.setField(name, e.target.value)}
        {...rest}
      />
      {formStore.errors[name] && <span>{formStore.errors[name]}</span>}
    </div>
  )
}

export default TextInput
