<template>
  <mu-paper
    :class="{ 'is-drag-over': isDragOver }"
    class="dropzone"
    draggable="true"
    @click="handleClick"
    @dragenter="handleDragOver"
    @dragover.prevent
    @dragleave="handleDragLeave"
    @drop.prevent="handleDrop"
  >
    <div class="center">
      <mu-icon class="icon-upload" value="cloud_upload" size="60" />
      <div class="text">将文件拖到此处，或点击上传</div>
    </div>
    <input v-show="false" ref="fileInput" :accept="accept" type="file" multiple @change="handleChange">
  </mu-paper>
</template>

<script>
import { formatMap } from '@/config'

const types = Object.values(formatMap).map(item => item.type)

export default {
  name: 'Dropzone',
  data() {
    return {
      isDragOver: false
    }
  },
  computed: {
    accept() {
      return types.join(',')
    }
  },
  methods: {
    handleClick() {
      this.$refs.fileInput.click()
    },
    getFiles(fileList) {
      return Array
        .from(fileList)
        .filter(({ type }) => types.includes(type))
    },
    handleChange() {
      const files = this.getFiles(this.$refs.fileInput.files)

      if (files.length) {
        this.$emit('input', files)
      }

      this.$refs.fileInput.value = ''
    },
    handleDrop(e) {
      const files = this.getFiles(e.dataTransfer.files)

      if (files.length) {
        this.$emit('input', files)
      }

      this.isDragOver = false
    },
    handleDragOver() {
      this.isDragOver = true
    },
    handleDragLeave() {
      this.isDragOver = false
    }
  }
}
</script>

<style lang="scss" scoped>
.dropzone {
  display: flex;
  height: 300px;
  text-align: center;
  color: #999;
  border: 1px dashed #E8E8E8;
  cursor: pointer;
  transition: .3s;

  &:hover, &.is-drag-over {
    color: #666;
    border-color: #CDCDCD;

    .mu-icon {
      color: #CDCDCD;
    }
  }
}

.center {
  margin: auto;
}

.icon-upload {
  color: #DCDCDC;
  transition: .3s;
}
</style>
