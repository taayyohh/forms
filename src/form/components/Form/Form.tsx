import React from 'react'
import { ZodSchema } from 'zod'
import { TextInput } from '../TextInput'
import { NumberInput } from '../NumberInput'
import { TextArea } from '../TextArea'
import { MultiSelect } from '../MultiSelect'
import { MultiItem } from '../MultiItem'
import { ImageUpload } from '../ImageUpload'
import { FormFields } from '../../../store'
import { SelectOption } from '../MultiSelect/MultiSelect'
import { ArrayObjectField } from '../MultiItem/MultiItem'
import clsx from 'clsx'
import { useFormStore } from '../../../hooks'
import { FormFieldType } from '../../types'

export interface FieldConfig {
  name: string
  type: FormFieldType
  placeholder?: string
  loadOptions?: (inputValue: string) => Promise<SelectOption[]>
  options?: string[]
  defaultValue?: any
  fields?: ArrayObjectField[] // For nested fields like in MultiItem
  className?: string
}

interface FormProps<T extends FormFields> {
  fieldsConfig: FieldConfig[]
  initialFields: T
  validationSchema: ZodSchema<T>
  onSubmit: (fields: T) => Promise<void>
  className?: string
}

const Form = <T extends FormFields>({
  fieldsConfig,
  initialFields,
  validationSchema,
  onSubmit,
  className,
}: FormProps<T>) => {
  const { formStore, handleSubmit } = useFormStore<T>({
    initialFields,
    validationSchema,
    onSubmit,
  })

  const renderField = (fieldConfig: FieldConfig) => {
    switch (fieldConfig.type) {
      case FormFieldType.Text:
        return (
          <TextInput
            name={fieldConfig.name}
            formStore={formStore}
            placeholder={fieldConfig.placeholder}
            className={fieldConfig.className}
          />
        )
      case FormFieldType.Number:
        return (
          <NumberInput
            name={fieldConfig.name}
            formStore={formStore}
            placeholder={fieldConfig.placeholder}
            className={fieldConfig.className}
          />
        )
      case FormFieldType.TextArea:
        return (
          <TextArea
            name={fieldConfig.name}
            formStore={formStore}
            placeholder={fieldConfig.placeholder}
            className={fieldConfig.className}
          />
        )
      case FormFieldType.MultiSelect:
        return !!fieldConfig.loadOptions ? (
          <MultiSelect
            name={fieldConfig.name}
            formStore={formStore}
            loadOptions={fieldConfig.loadOptions}
          />
        ) : null
      case FormFieldType.MultiItem:
        return !!fieldConfig.fields ? (
          <MultiItem
            name={fieldConfig.name}
            formStore={formStore}
            fields={fieldConfig.fields}
          />
        ) : null
      case FormFieldType.ImageUpload:
        return <ImageUpload name={fieldConfig.name} formStore={formStore} />
      default:
        return null
    }
  }

  return (
    <form className={clsx('flex flex-col gap-4', className)} onSubmit={handleSubmit}>
      {fieldsConfig.map((fieldConfig) => (
        <div key={fieldConfig.name}>{renderField(fieldConfig)}</div>
      ))}
      <button
        type="submit"
        className="inline-flex self-start rounded p-3 px-6 mt-8 border hover:bg-[#111] text-xs text-white uppercase font-bold focus:outline-none"
      >
        Submit
      </button>
    </form>
  )
}

export default Form
