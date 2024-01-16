import React from 'react'
import { FormStoreType, FormFields } from '../../../store'
import { observer } from 'mobx-react'
import clsx from 'clsx'

interface TextareaProps<T extends FormFields>
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  name: string
  formStore: FormStoreType<T>
}

const Textarea = observer(
  <T extends FormFields>({ name, formStore, className, ...rest }: TextareaProps<T>) => {
    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      formStore.setField(name, e.target.value as unknown as T[keyof T])
    }

    const textareaClassName = clsx(
      'border p-2 rounded',
      className,
    )

    return (
      <div>
        <textarea
          name={String(name)}
          className={textareaClassName}
          onChange={handleInputChange}
          {...rest}
        />
        {formStore.errors[name] && (
          <span className="text-red-500">{formStore.errors[name]}</span>
        )}
      </div>
    )
  },
)

export default Textarea
