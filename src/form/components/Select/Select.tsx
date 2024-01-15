import React from 'react'
import Select from 'react-select'
import { FormFields, FormStoreType } from '../../../store'
import { observer } from "mobx-react";

interface SelectOption {
  label: string
  value: string
}

interface SelectProps<T extends FormFields> {
  name: string
  options: SelectOption[]
  formStore: FormStoreType<T>
}
const CustomSelect = observer(<T extends FormFields>({
  name,
  options,
  formStore,
}: SelectProps<T>) => {
  const handleChange = (selectedOption: any) => {
    formStore.setField(name, selectedOption ? selectedOption.value : '')
  }

  return (
    <div>
      <Select
        options={options}
        value={options.find((option) => option.value === formStore.fields[name])}
        onChange={handleChange}
      />
      {formStore.errors[name] && <span>{formStore.errors[name]}</span>}
    </div>
  )
})

export default CustomSelect
