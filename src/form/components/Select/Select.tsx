import React from 'react'
import AsyncSelect from 'react-select/async'
import { observer } from 'mobx-react'
import { FormStoreType, FormFields } from '../../../store'

interface SelectOption {
  label: string
  value: string
}

interface CustomSelectProps<T extends FormFields> {
  name: keyof T
  loadOptions: (inputValue: string) => Promise<SelectOption[]>
  formStore: FormStoreType<T>
  className?: string
}

const CustomSelect = observer(
  <T extends FormFields>({
    name,
    loadOptions,
    formStore,
    className,
  }: CustomSelectProps<T>) => {
    const handleChange = (selectedOption: SelectOption | null) => {
      formStore.setField(
        name as keyof T,
        (selectedOption ? selectedOption.value : '') as T[keyof T],
      )
    }

    const selectedValue = formStore.fields[name] as string
    const value = selectedValue ? { label: selectedValue, value: selectedValue } : null

    return (
      <div className={'flex flex-col text-black'}>
        <AsyncSelect
          cacheOptions
          defaultOptions
          loadOptions={loadOptions}
          onChange={handleChange}
          value={value}
          className={className}
        />
        {formStore.errors[name] && (
          <span className="py-1 text-xs text-rose-800 lowercase">
            {formStore.errors[name]}
          </span>
        )}
      </div>
    )
  },
)

export default CustomSelect
