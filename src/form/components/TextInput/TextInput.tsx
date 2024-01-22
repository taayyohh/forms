import React from 'react'
import { FormStoreType, FormFields } from '../../../store'
import { observer } from 'mobx-react'
import clsx from 'clsx'

interface TextInputProps<T extends FormFields>
  extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string
  formStore: FormStoreType<T>
}

const TextInput = observer(
  <T extends FormFields>({
    name,
    formStore,
    className,
    ...rest
  }: TextInputProps<T>) => {
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      formStore.setField(name, e.target.value as unknown as T[keyof T])
    }

    const inputClassName = clsx('w-full border p-2 text-black', className)
    const fieldValue = formStore.fields[name] || '' // Fetching the current value from the form store

    return (
      <div className={'flex flex-col'}>
        <input
          name={String(name)}
          value={fieldValue} // Using fieldValue as the input's value
          className={inputClassName}
          onChange={handleInputChange}
          {...rest}
        />
        {formStore.errors[name] && (
          <span className="py-1 text-xs lowercase text-rose-800">
            {formStore.errors[name]}
          </span>
        )}
      </div>
    )
  },
)

export default TextInput
