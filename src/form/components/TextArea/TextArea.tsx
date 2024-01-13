import React from 'react'
import { FormStoreType } from '../../../store'
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  name: string
  formStore: FormStoreType<any>
}

const Textarea: React.FC<TextareaProps> = ({ name, formStore, ...rest }) => {
  return (
    <div>
      <textarea
        name={name}
        value={formStore.fields[name] || ''}
        onChange={(e) => formStore.setField(name, e.target.value)}
        {...rest}
      />
      {formStore.errors[name] && <span>{formStore.errors[name]}</span>}
    </div>
  )
}

export default Textarea
