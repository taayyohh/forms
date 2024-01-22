import React from 'react'
import { FormStoreType, FormFields } from '../../../store'
import { observer } from 'mobx-react'
import clsx from 'clsx'

interface TextareaProps<T extends FormFields>
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  name: string
  formStore: FormStoreType<T>
}

const Textarea = observer(
  <T extends FormFields>({ name, formStore, className, ...rest }: TextareaProps<T>) => {
    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      formStore.setField(name as keyof T, e.target.value as unknown as T[keyof T])
    }

    const textareaClassName = clsx(
      'w-full min-h-[200px] resize-none border p-2 text-black outline-none',
      className,
    )

    return (
      <div className={'flex flex-col'}>
        <textarea
          name={name}
          className={textareaClassName}
          onChange={handleInputChange}
          value={formStore.fields[name as keyof T] as unknown as string}
          {...rest}
        />
        {formStore.errors[name as keyof T] && (
          <span className="py-1 text-xs lowercase text-rose-800">
            {formStore.errors[name as keyof T]}
          </span>
        )}
      </div>
    )
  },
)

export default Textarea
