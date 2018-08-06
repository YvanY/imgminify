<template>
  <div id="app">
    <options-form :options.sync="globalOptions" />

    <dropzone @input="handleInput" />

    <file-list :files="files" class="file-list" @remove="handleRemove" />
  </div>
</template>

<script>
import Dropzone from '@/components/Dropzone'
import FileList from '@/components/FileList'
import OptionsForm from '@/components/OptionsForm'
import defaultOptions from '@/components/OptionsForm/defaultOptions'

export default {
  name: 'App',
  components: { OptionsForm, FileList, Dropzone },
  data() {
    return {
      globalOptions: { ...defaultOptions },
      files: []
    }
  },
  methods: {
    handleInput(rawFiles) {
      this.files = this.files.concat(
        rawFiles.map(raw => {
          const xhr = new XMLHttpRequest()
          const fd = new FormData()
          const options = { ...this.globalOptions }
          const file = {
            raw,
            options,
            oname: raw.name,
            osize: raw.size,
            otype: raw.type,
            thumbnail: URL.createObjectURL(raw),
            progress: 0,
            status: 'uploading'
          }

          fd.append('file', raw)
          Object.keys(options).forEach(key => fd.append(key, options[key]))

          xhr.onprogress = ({ loaded, total }) => {
            file.progress = loaded / total
          }

          xhr.onload = () => {
            const isSuccess = xhr.status === 200
            const newFile = {
              ...file,
              status: isSuccess ? 'success' : 'fail'
            }

            if (isSuccess) {
              Object.assign(newFile, JSON.parse(xhr.responseText))
            }

            this.files.splice(this.files.indexOf(file), 1, newFile)
          }

          xhr.onerror = xhr.upload.onerror = () => {
            file.status = 'fail'
          }

          xhr.open('post', '/upload')
          xhr.send(fd)

          return file
        })
      )
    },
    handleRemove(file) {
      URL.revokeObjectURL(file.thumbnail)

      this.files.splice(this.files.indexOf(file), 1)
    }
  }
}
</script>

<style scoped>
#app {
  margin: 0 auto;
  padding: 30px 30px 150px;
  width: 960px;
}

.file-list {
  margin-top: 50px;
}
</style>
