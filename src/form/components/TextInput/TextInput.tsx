import React from 'react'

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string
  formStore: {
    fields: Record<string, any>
    errors: Record<string, string | undefined>
    setField: (field: string, value: any) => void
  }
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
