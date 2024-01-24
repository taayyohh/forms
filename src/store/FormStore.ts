import { action, makeAutoObservable, runInAction } from 'mobx'
import { ZodSchema, ZodError } from 'zod'

export interface FormFields {
  [key: string]: any
}

type FormErrors<T extends FormFields> = {
  [P in keyof T | '_submit']?: string
}

export type FormStoreType<T extends FormFields> = {
  fields: T
  errors: FormErrors<T>
  setField: <K extends keyof T>(field: K, value: T[K]) => void
  validate: () => Promise<boolean>
  submit: (submissionHandler: (fields: T) => Promise<any>) => Promise<void>
  resetForm: () => void
}

class FormStore<T extends FormFields, U extends ZodSchema<T>> {
  fields: T
  errors: FormErrors<T> = {}
  validationSchema: U
  initialFields: T

  constructor(initialFields: T, validationSchema: U) {
    makeAutoObservable(this)
    this.fields = initialFields
    this.initialFields = initialFields
    this.validationSchema = validationSchema
  }

  setField<K extends keyof T>(field: K, value: T[K]): void {
    this.fields[field] = value
    this.errors[field] = ''
  }

  async validate(): Promise<boolean> {
    try {
      await this.validationSchema.parseAsync(this.fields)
      runInAction(() => {
        this.errors = {} // Reset all errors
      })
      return true
    } catch (error) {
      if (error instanceof ZodError) {
        runInAction(() => {
          let e = error as ZodError
          e.errors.forEach((err) => {
            const path = err.path[0]
            if (typeof path === 'string') {
              this.errors[path as keyof T] = err.message
            }
          })
        })
      } else {
        // Handle or log the unexpected error
        console.error('An unexpected error occurred:', error)
      }
      return false
    }
  }

  async submit(submissionHandler: (fields: T) => Promise<any>): Promise<void> {
    const isValid = await this.validate()
    if (!isValid) {
      throw new Error('Validation failed')
    }

    try {
      await submissionHandler(this.fields)
      // Reset form or handle success state as needed
    } catch (error) {
      if (error instanceof Error) {
        let e: Error = error
        runInAction(() => {
          this.errors._submit = e.message
        })
      } else {
        // Handle or log the unexpected error
        console.error('An unexpected error occurred:', error)
      }
    }
  }

  resetForm(): void {
    this.fields = { ...this.initialFields }
    this.errors = {}
  }
}

export default FormStore
