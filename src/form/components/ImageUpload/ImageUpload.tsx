import React, { useState, ChangeEvent, DragEvent } from 'react'
import { observer } from 'mobx-react'
import { useKeenSlider } from 'keen-slider/react'
import 'keen-slider/keen-slider.min.css'
import { FormStoreType, FormFields } from '../../../store'
import { MemoryBlockStore } from 'ipfs-car/blockstore/memory'
import { packToBlob } from 'ipfs-car/pack/blob'
import { NFTStorage } from 'nft.storage'
import { TrackDetails } from 'keen-slider'

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
    const [sliderRef] = useKeenSlider({
      loop: true,
      detailsChanged(s) {
        setDetails(s.track.details)
      },
      initial: 2,
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
        let existingURIs = (formStore[name as keyof typeof formStore] as string[]) || []
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
        formStore.setField(name, newImageURIs as unknown as T[keyof T]) // Update the formStore with cumulative URIs

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

    function scaleStyle(idx: number) {
      if (!details) return {}
      const slide = details.slides[idx]
      const scale_size = 0.7
      const scale = 1 - (scale_size - scale_size * slide.portion)
      return {
        transform: `scale(${scale})`,
        WebkitTransform: `scale(${scale})`,
      }
    }

    return (
      <div className="flex flex-col md:flex-row gap-4 p-4">
        <div className="flex-1">
          <div
            className="border-dashed border-2 border-gray-300 rounded-lg p-4 text-center"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
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
          <div ref={sliderRef} className="keen-slider zoom-out">
            {previews.map((url, idx) => (
              <div key={idx} className="keen-slider__slide zoom-out__slide">
                <div style={scaleStyle(idx)}>
                  <img src={url} alt={`preview-${idx}`} />
                </div>
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
