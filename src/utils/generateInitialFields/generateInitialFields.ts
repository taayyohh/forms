import { FormFieldType } from '../../form'
import { FieldConfig } from '../../form/components/Form/Form'

function generateInitialFields<T extends object>(fieldsConfig: FieldConfig[]): T {
  const initialFields: Partial<T> = {}

  fieldsConfig.forEach((field) => {
    switch (field.type) {
      case FormFieldType.Text:
      case FormFieldType.TextArea:
      case FormFieldType.ImageUpload:
        initialFields[field.name as keyof T] = '' as any
        break
      case FormFieldType.Number:
        initialFields[field.name as keyof T] = 0 as any
        break
      case FormFieldType.MultiSelect:
        initialFields[field.name as keyof T] = [] as any
        break
      case FormFieldType.MultiItem:
        if (field.fields) {
          initialFields[field.name as keyof T] = field.fields.map((subField) => ({
            [subField.name]: subField.type === 'number' ? 0 : '',
          })) as any
        }
        break
      default:
        break
    }
  })

  return initialFields as T
}

export default generateInitialFields
