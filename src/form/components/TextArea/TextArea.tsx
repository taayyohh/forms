import React, { useState, useEffect } from 'react'
import { FormStoreType, FormFields } from '../../../store'
import { observer } from 'mobx-react'
import clsx from 'clsx'

interface TextareaProps<T extends FormFields>
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'name'> {
  name: keyof T
  formStore: FormStoreType<T>
  className?: string
}

const TextArea = observer(
  <T extends FormFields>({ name, formStore, className, ...rest }: TextareaProps<T>) => {
    const [inputValue, setInputValue] = useState(formStore.fields[name] || '')

    useEffect(() => {
      setInputValue(formStore.fields[name] || '')
    }, [formStore.fields[name], name])

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = e.target.value
      setInputValue(newValue)
      formStore.setField(name, newValue as unknown as T[keyof T])
    }

    const textareaClassName = clsx(
      'w-full min-h-[200px] resize-none border p-2 text-black outline-none',
      className,
    )

    return (
      <div className={'flex flex-col'}>
        <textarea
          name={String(name)}
          value={inputValue}
          className={textareaClassName}
          onChange={handleInputChange}
          {...rest}
        />
        {formStore.errors[name] && (
          <span className="py-1 lowercase text-xs text-rose-800">
            {formStore.errors[name]}
          </span>
        )}
      </div>
    )
  },
)

export default TextArea
