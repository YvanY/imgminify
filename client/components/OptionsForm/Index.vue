<template>
  <mu-form :model="localOptions" class="opt-form" label-position="left" label-width="100">
    <div class="form-col">
      <mu-form-item label="渐进显示">
        <mu-switch v-model="localOptions.interlace" />
      </mu-form-item>
      <mu-form-item label="清除元信息">
        <mu-switch v-model="localOptions.strip" />
      </mu-form-item>
      <mu-form-item label="色度采样率">
        <mu-radio v-for="item in samplingFactors" :key="item" v-model="localOptions.samplingFactor" :value="item" :label="item" />
      </mu-form-item>
      <mu-form-item label="质量">
        <mu-text-field v-model="localOptions.quality" />
      </mu-form-item>
      <!--
      <mu-form-item label="格式转换">
        <mu-switch v-model="localOptions.changeFormat" />
      </mu-form-item>
      <mu-expand-transition>
        <div v-if="localOptions.changeFormat" >
          <mu-form-item label="格式">
            <mu-radio v-for="item in formats" :key="item" v-model="localOptions.format" :value="item" :label="item" />
          </mu-form-item>
        </div>
      </mu-expand-transition>
      -->
    </div>
    <div class="form-col">
      <mu-form-item label="调整尺寸">
        <mu-switch v-model="localOptions.resize" />
      </mu-form-item>
      <mu-expand-transition>
        <div v-if="localOptions.resize">
          <mu-form-item label="仅缩小">
            <mu-switch v-model="localOptions.shrinkOnly" />
          </mu-form-item>
          <mu-form-item label="保持比例">
            <mu-switch v-model="localOptions.maintainAspectRatio" />
          </mu-form-item>
          <mu-form-item label="宽度">
            <mu-text-field v-model="localOptions.width" />
          </mu-form-item>
          <mu-form-item label="高度">
            <mu-text-field v-model="localOptions.height" />
          </mu-form-item>
        </div>
      </mu-expand-transition>
    </div>
  </mu-form>
</template>

<script>
import defaultOptions from './defaultOptions'
import { formatMap, samplingFactors } from '@/config'

export default {
  name: 'OptionsForm',
  props: {
    options: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      formats: Object.keys(formatMap),
      samplingFactors,
      localOptions: { ...defaultOptions }
    }
  },
  watch: {
    localOptions: {
      deep: true,
      handler() {
        this.$emit('update:options', { ...this.localOptions })
      }
    },
    options: {
      deep: true,
      immediate: true,
      handler() {
        Object.assign(this.localOptions, this.options)
      }
    }
  }
}
</script>

<style scoped>
.opt-form {
  display: flex;
  justify-content: space-between;
  min-height: 330px;
}

.form-col {
  flex: 0 0 calc(50% - 50px);
}
</style>
