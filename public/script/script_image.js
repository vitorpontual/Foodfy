const PhotosUploads = {
    uploadLimit: '',
    input: '',
    preview: document.querySelector('#photos-preview'),
    files: [],
    handleFileInput(event, limit){
        const {files: fileList} = event.target
        PhotosUploads.input = event.target

        PhotosUploads.uploadLimit = limit 

        if (PhotosUploads.hasLimit(event)) return

        Array.from(fileList).forEach(file => {
            PhotosUploads.files.push(file)

            const reader = new FileReader()
            reader.onload = () => {
                const image = new Image()
                image.src = String(reader.result)
                const container = PhotosUploads.getContainer(image)
                PhotosUploads.preview.appendChild(container)
            }
	   console.log(reader)

            reader.readAsDataURL(file)
        })

        PhotosUploads.input.files = PhotosUploads.getAllFiles()
    },
    hasLimit(event){
        const { uploadLimit, input, preview } = PhotosUploads
        const { files: fileList} = input

        if(fileList.length > uploadLimit) {
            alert(`Envie no máximo ${uploadLimit} fotos`)
            return true
        }

        const photosDiv = []
        
        preview.childNodes.forEach(item => {
            if (item.classList && item.classList.value == 'photo'){
                photosDiv.push(item)
            }
        })


        const totalPhotos = fileList.length + photosDiv.length
        if(totalPhotos > uploadLimit){
            alert(`Você atingiu o limite máximo de fotos`)
            return true
        }
        return false

    },
    getAllFiles(){
        const dataTransfer = new ClipboardEvent('').clipboardData || new DataTransfer()

        PhotosUploads.files.forEach( file => dataTransfer.items.add(file))

        return dataTransfer.files
    },
    getContainer(image){
        const container = document.createElement('div')
        container.classList.add('photo')
        container.onclick = PhotosUploads.removePhoto
        container.appendChild(image)
        container.appendChild(PhotosUploads.getRemoveButton())
        return container
    },
    getRemoveButton(){
        const button = document.createElement('i')
        button.classList.add('material-icons')
        button.innerHTML = 'close'
        return button
    },
    removePhoto(event){
        const photosDiv = event.target.parentNode
        const photosArray = Array.from(PhotosUploads.preview.children)
        const index = photosArray.indexOf(photosDiv)

        PhotosUploads.files.splice(index, 1)
        PhotosUploads.input.files = PhotosUploads.getAllFiles()
        photosDiv.remove()
    },
    removeOldPhoto(event){
        const photoDiv = event.target.parentNode
        
        if(photoDiv.id) {
            const removedFiles = document.querySelector('input[name="removed_files"]')
            if (removedFiles){
                removedFiles.value += `${photoDiv.id},`
            }

            photoDiv.remove()
        }
    }
}

const ImageGallery = {
    highlight: document.querySelector('.gallery .highlight > img'),
    previews: document.querySelectorAll('.gallery-preview img'),
    setImage(event){
        const {target} = event

        ImageGallery.previews.forEach(preview => preview.classList.remove('active'))
        target.classList.add('active')

        ImageGallery.highlight.src = target.src
        Lightbox.image.src = target.src
    }
}

const Lightbox = {
    target: document.querySelector('.lightbox-target'),
    image: document.querySelector('.lightbox-target img'),
    closeButton: document.querySelector('.lightbox-target a.lightbox-close'),
    open(){
        Lightbox.target.style.opacity = 1
        Lightbox.target.style.top = 0
        Lightbox.target.style.bottom = 0
        Lightbox.closeButton.top = '33px'
    },
    close(){
        Lightbox.target.style.opacity = 1
        Lightbox.target.style.top = '-100%'
        Lightbox.target.style.bottom = 'initial'
        Lightbox.closeButton.style.top = '80px'
    }
}

