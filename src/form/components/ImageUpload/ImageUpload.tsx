import React, { useState, ChangeEvent, DragEvent } from 'react'
import { observer } from 'mobx-react'
import { useKeenSlider } from 'keen-slider/react'
import 'keen-slider/keen-slider.min.css'
import { FormStoreType, FormFields } from '../../../store'
import { MemoryBlockStore } from 'ipfs-car/blockstore/memory'
import { packToBlob } from 'ipfs-car/pack/blob'
import { NFTStorage } from 'nft.storage'

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
    const [imageURIs, setImageURIs] = useState<string[]>([]) // Store the URIs of uploaded images
    const [isUploading, setIsUploading] = useState<boolean>(false)

    const [sliderRef] = useKeenSlider<HTMLDivElement>({
      loop: true,
      mode: 'free-snap',
      slides: 1,
    })

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
        const newImageURIs = []
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
        setImageURIs(newImageURIs)
        formStore.setField(name, newImageURIs as unknown as T[keyof T])

        setIsUploading(false)
      } catch (err) {
        setIsUploading(false)
        setUploadArtworkError(err)
      }
    }

    return (
      <div className="flex flex-col md:flex-row gap-4 p-4">
        <div className="flex-1">
          <div
            className="border-dashed border-2 border-gray-300 rounded-lg p-4 text-center"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleFileUpload}
          >
            <input
              type="file"
              multiple
              onChange={handleFileUpload}
              disabled={isUploading}
              className="hidden"
            />
            Drag and drop files here or click to upload
          </div>
        </div>
        <div className="flex-1">
          <div ref={sliderRef} className="keen-slider">
            {previews.map((url, idx) => (
              <div key={idx} className="keen-slider__slide">
                <img src={url} alt={`preview-${idx}`} className="w-full h-auto" />
              </div>
            ))}
          </div>
        </div>
        {uploadArtworkError?.mime && (
          <div className="p-4 text-sm">
            <ul className="m-0">
              <li>{uploadArtworkError.mime}</li>
            </ul>
          </div>
        )}
        {isUploading && <div>Uploading...</div>}
      </div>
    )
  },
)

export default ImageUpload
