import React, { useState, ChangeEvent } from 'react'
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
    const [isUploading, setIsUploading] = useState<boolean>(false)

    const [sliderRef, slider] = useKeenSlider<HTMLDivElement>({
      loop: true,
      mode: 'free-snap',
      slides: 1.5,
      breakpoints: {
        '(min-width: 400px)': {
          slides: 2.5,
        },
        '(min-width: 1000px)': {
          slides: 3.5,
        },
      },
    })

    const handleFileUpload = async (event: ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(event.target.files || [])
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
        for (const file of files) {
          const car = await packToBlob({
            input: [{ content: file, path: file.name }],
            blockstore: new MemoryBlockStore(),
          })

          const cid = await client.storeCar(car.car)
          const previewUrl = `https://ipfs.io/ipfs/${cid}/${encodeURIComponent(file.name)}`
          setPreviews((prev) => [...prev, previewUrl])
        }

        setIsUploading(false)
      } catch (err) {
        setIsUploading(false)
        setUploadArtworkError(err)
      }
    }

    return (
      <div className="relative mb-8 flex flex-col">
        <div className="relative flex w-full flex-col items-center">
          <input
            name={String(name)}
            type="file"
            multiple
            onChange={handleFileUpload}
            disabled={isUploading}
          />
          {isUploading && <div>Uploading...</div>}
          <div ref={sliderRef} className="keen-slider">
            {previews.map((url, idx) => (
              <div key={idx} className="keen-slider__slide">
                <img src={url} alt={`preview-${idx}`} />
              </div>
            ))}
          </div>
          {uploadArtworkError?.mime && (
            <div className="p-4 text-sm">
              <ul className="m-0">
                <li>{uploadArtworkError.mime}</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    )
  },
)

export default ImageUpload
