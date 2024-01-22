import React, { useEffect, useState } from 'react'
import AsyncSelect from 'react-select/async'
import { FormStoreType, FormFields } from '../../../store'
import { observer } from 'mobx-react'
import { ActionMeta, MultiValue } from 'react-select'

export interface SelectOption {
  label: string
  value: string
}

interface MultiSelectProps<T extends FormFields> {
  name: keyof T
  loadOptions: (inputValue: string) => Promise<SelectOption[]>
  transformOption: (data: any) => SelectOption // Function to transform data to {value, label}
  formStore: FormStoreType<T>
}

const CustomMultiSelect = observer(
  <T extends FormFields>({
    name,
    loadOptions,
    transformOption,
    formStore,
  }: MultiSelectProps<T>) => {
    const [selectedOptions, setSelectedOptions] = useState<SelectOption[]>([])

    useEffect(() => {
      const loadInitialOptions = async () => {
        const currentValues = (formStore.fields[name] as string[]) || []
        const options = await loadOptions('')
        const transformedOptions = options.map(transformOption)
        const selected = transformedOptions.filter((option) =>
          currentValues.includes(option.value),
        )
        setSelectedOptions(selected)
      }
      loadInitialOptions()
    }, [formStore.fields, name, loadOptions, transformOption])

    const handleChange = (newValue: MultiValue<SelectOption>) => {
      // Extract the values from the selected options
      const values = newValue ? newValue.map((option) => option.value) : []
      formStore.setField(name, values as unknown as T[keyof T])
    }

    return (
      <div className={'flex flex-col text-black'}>
        <AsyncSelect
          cacheOptions
          defaultOptions
          loadOptions={loadOptions}
          onChange={handleChange}
          value={selectedOptions}
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
