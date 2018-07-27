import Vue from 'vue'
import Comparer from './Comparer'

export default file => new Vue({
  extends: Comparer,
  propsData: { file },
  created() {
    document.body.appendChild(this.$mount().$el)
  },
  destroyed() {
    document.body.removeChild(this.$el)
  },
  methods: {
    close() {
      this.$destroy()
    }
  }
})
