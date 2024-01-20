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
      formStore.setField(name, e.target.value as unknown as T[keyof T])
    }

    const textareaClassName = clsx(
      'w-full min-h-[200px] resize-none border p-2 text-black outline-none',
      className,
    )

    return (
      <div className={'flex flex-col'}>
        <textarea
          name={String(name)}
          className={textareaClassName}
          onChange={handleInputChange}
          {...rest}
        />
        {formStore.errors[name] && (
          <span className="py-1 lowercase text-xs text-rose-800">{formStore.errors[name]}</span>
        )}
      </div>
    )
  },
)

export default Textarea
