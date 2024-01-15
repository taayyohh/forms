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
      <div>
        <AsyncSelect isMulti loadOptions={loadOptions} onChange={handleChange} />
        {formStore.errors[name] && <span>{formStore.errors[name]}</span>}
      </div>
    )
  },
)

export default CustomMultiSelect
