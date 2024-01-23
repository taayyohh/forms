import React, { useEffect, useState } from 'react'
import AsyncSelect from 'react-select/async'
import { FormStoreType, FormFields } from '../../../store'
import { observer } from 'mobx-react'
import { ActionMeta, SingleValue } from 'react-select'

export interface SelectOption {
  label: string
  value: string
}

interface SingleSelectProps<T extends FormFields> {
  name: keyof T
  loadOptions: (inputValue: string) => Promise<SelectOption[]>
  formStore: FormStoreType<T>
}

const CustomSelect = observer(
  <T extends FormFields>({ name, loadOptions, formStore }: SingleSelectProps<T>) => {
    const [selectedOption, setSelectedOption] = useState<SelectOption | null>(null)

    useEffect(() => {
      const loadInitialOption = async () => {
        const currentValue = formStore.fields[name] as string
        if (currentValue) {
          const options = await loadOptions('')
          const selected = options.find((option) => option.value === currentValue)
          setSelectedOption(selected || null)
        }
      }
      loadInitialOption()
    }, [formStore.fields, name, loadOptions])

    const handleChange = (
      newValue: SingleValue<SelectOption>,
      actionMeta: ActionMeta<SelectOption>,
    ) => {
      setSelectedOption(newValue)
      if (newValue) {
        formStore.setField(name, newValue.value as unknown as T[keyof T])
      } else {
        formStore.setField(name, '' as unknown as T[keyof T])
      }
    }

    return (
      <div className={'flex flex-col text-black'}>
        <AsyncSelect
          cacheOptions
          defaultOptions
          loadOptions={loadOptions}
          onChange={handleChange}
          value={selectedOption}
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
