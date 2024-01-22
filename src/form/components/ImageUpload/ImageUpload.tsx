import React, { useState, ChangeEvent, DragEvent, useRef, useEffect } from 'react'
import { observer } from 'mobx-react'
import { KeenSliderInstance, useKeenSlider } from 'keen-slider/react'
import 'keen-slider/keen-slider.min.css'
import './styles.css'
import { FormStoreType, FormFields } from '../../../store'
import { MemoryBlockStore } from 'ipfs-car/blockstore/memory'
import { packToBlob } from 'ipfs-car/pack/blob'
import { NFTStorage } from 'nft.storage'
import { KeenSliderHooks, TrackDetails } from 'keen-slider'

interface ImageUploadProps<T extends FormFields> {
  name: keyof T
  formStore: FormStoreType<T>
}

const ImageUpload = observer(
  <T extends FormFields>({ name, formStore }: ImageUploadProps<T>) => {
    const client = new NFTStorage({
      token: process.env.NEXT_PUBLIC_NFT_STORAGE_TOKEN || '',
    })
    const acceptableMIME = [
      'image/jpeg',
      'image/png',
      'image/svg+xml',
      'image/webp',
      'image/gif',
    ]
    const [uploadArtworkError, setUploadArtworkError] = useState<any>()
    const [previews, setPreviews] = useState<string[]>([])
    const [isUploading, setIsUploading] = useState<boolean>(false)
    const [details, setDetails] = React.useState<TrackDetails | null>(null)
    const [slider, setSlider] = useState<KeenSliderInstance<
      {},
      {},
      KeenSliderHooks
    > | null>(null)

    // Reinitialize slider when new images are added
    useEffect(() => {
      if (slider && previews.length) {
        slider.update()
      }
    }, [previews, slider])

    const [sliderRef, sliderInstance] = useKeenSlider<HTMLDivElement>({
      loop: false,
      mode: 'free-snap',
      slides: {
        perView: 1,
        spacing: 10,
      },
      detailsChanged(s) {
        setDetails(s.track.details)
      },
      created(s) {
        setSlider(s)
      },
    })

    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleClickUploadArea = () => {
      fileInputRef.current?.click()
    }

    const handleFileUpload = async (
      event: ChangeEvent<HTMLInputElement> | DragEvent,
    ) => {
      let files: File[]
      if (event.type === 'drop') {
        files = Array.from((event as DragEvent).dataTransfer.files)
      } else {
        files = Array.from((event as ChangeEvent<HTMLInputElement>).target.files || [])
      }

      if (!files.length) return

      const unsupportedFile = files.find((file) => !acceptableMIME.includes(file.type))
      if (unsupportedFile) {
        setUploadArtworkError({
          mime: `${unsupportedFile.type} is an unsupported file type`,
        })
        return
      }

      setIsUploading(true)
      setUploadArtworkError(null)

      try {
        let existingURIs = (formStore.fields[name] as string[]) || []
        let newImageURIs = [...existingURIs]
        for (const file of files) {
          const car = await packToBlob({
            input: [{ content: file, path: file.name }],
            blockstore: new MemoryBlockStore(),
          })

          const cid = await client.storeCar(car.car)
          const uri = `ipfs://${cid}/${encodeURIComponent(file.name)}`
          const previewUrl = `https://ipfs.io/ipfs/${cid}/${encodeURIComponent(file.name)}`

          newImageURIs.push(uri)
          setPreviews((prev) => [...prev, previewUrl])
        }
        formStore.setField(name as keyof T, newImageURIs as T[keyof T])

        setIsUploading(false)
      } catch (err) {
        setIsUploading(false)
        setUploadArtworkError(err)
      }
    }

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault()
    }

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      handleFileUpload(e)
    }

    return (
      <div className="flex flex-col gap-4 p-4 border overflow-hidden">
        <div
          className="flex-1 border border-opacity-10 rounded-lg"
          onClick={handleClickUploadArea}
        >
          <div
            className="p-6 text-center h-full"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileUpload}
              disabled={isUploading}
              className="hidden"
            />
            {isUploading
              ? 'Uploading...'
              : ' Drag and drop files here or click to upload'}
          </div>
        </div>
        <div className="flex-1 h-72 w-full">
          <div ref={sliderRef} className="keen-slider h-full w-full">
            {previews.map((src, idx) => (
              <div key={idx} className="keen-slider__slide zoom-out__slide">
                <img src={src} />
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  },
)

export default ImageUpload
