import React from 'react'
import AsyncSelect from 'react-select/async'
import { FormStoreType, FormFields } from '../../../store'
import { observer } from 'mobx-react'

interface SelectOption {
  label: string
  value: string
}

interface MultiSelectProps<T extends FormFields> {
  name: keyof T
  loadOptions: (inputValue: string) => Promise<SelectOption[]>
  formStore: FormStoreType<T>
}

const CustomMultiSelect = observer(
  <T extends FormFields>({ name, loadOptions, formStore }: MultiSelectProps<T>) => {
    const handleChange = (selectedOptions: any) => {
      const values = selectedOptions
        ? selectedOptions.map((option: SelectOption) => option.value)
        : []
      formStore.setField(name, values as unknown as T[keyof T])
    }

    return (
      <div className={'flex flex-col text-black'}>
        <AsyncSelect
          cacheOptions
          defaultOptions
          loadOptions={loadOptions}
          onChange={handleChange}
          isMulti
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

export default CustomMultiSelect
