import React from 'react'
import { FormFields, FormStoreType } from '../../../store'
import { observer } from 'mobx-react'
import clsx from 'clsx'

interface NumberInputProps<T extends FormFields>
  extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string
  formStore: FormStoreType<T>
  className?: string // Allow className to be passed as a prop
}

const NumberInput = observer(
  <T extends FormFields>({
    name,
    formStore,
    className,
    ...rest
  }: NumberInputProps<T>) => {
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      formStore.setField(name, e.target.value as unknown as T[keyof T])
    }

    // Combine Tailwind classes with passed className
    const inputClassName = clsx(
      'border p-2 text-black', // Tailwind classes
      className, // User-provided classes
    )

    return (
      <div>
        <input
          type="number"
          name={name}
          className={inputClassName}
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

export default NumberInput
