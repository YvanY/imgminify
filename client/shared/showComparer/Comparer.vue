<template>
  <div class="overlay">
    <mu-button class="close-btn" icon @click="close">
      <mu-icon value="close" size="24" color="white" />
    </mu-button>

    <mu-chip class="label" color="grey900">{{ labelContent }}</mu-chip>

    <div class="carousel">
      <div class="container">
        <mu-fade-transition mode="out-in">
          <div v-for="(field, index) in urlFields" v-if="index === active" :key="index" class="item">
            <a :href="file[field]" target="_blank"><img :src="file[field]" class="img"></a>
          </div>
        </mu-fade-transition>
      </div>

      <mu-button class="navigate-btn prev-btn" icon @click="prev">
        <mu-icon value="navigate_before" size="32" color="white" />
      </mu-button>

      <mu-button class="navigate-btn next-btn" icon @click="next">
        <mu-icon value="navigate_next" size="32" color="white" />
      </mu-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Comparer',

  props: {
    file: {
      type: Object,
      default: () => {}
    }
  },

  data() {
    return {
      urlFields: ['ourl', 'jurl', 'purl'],
      active: 0
    }
  },

  computed: {
    labelContent() {
      switch (this.active) {
        case 0:
          return '原图'
        case 1:
          return 'JPEG'
        case 2:
          return 'PNG'
      }
    }
  },

  created() {
    document.body.style.paddingLeft = window.innerWidth - document.body.clientWidth + 'px'
    document.body.style.overflow = 'hidden'
  },

  destroyed() {
    document.body.style.paddingLeft = null
    document.body.style.overflow = null
  },

  methods: {
    mod(n, m) {
      return ((n % m) + m) % m
    },
    prev() {
      this.active = this.mod(this.active - 1, this.urlFields.length)
    },
    next() {
      this.active = this.mod(this.active + 1, this.urlFields.length)
    },
    close() {
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>
.overlay {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1000;
  min-width: 960px;
  background: rgba(0, 0, 0, .4);
}

.label {
  position: absolute;
  top: 40px;
  left: 30px;
  z-index: 9;
}

.carousel {
  height: 100%;
  overflow: auto;

  &::-webkit-scrollbar {
    display: none;
  }
}

.container {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 100px;
  min-height: 100%;
}

.img {
  max-width: 100%;
}

.close-btn {
  position: fixed;
  right: 30px;
  top: 30px;
  z-index: 10000;
}

.navigate-btn {
  position: absolute;
  top: 50%;
  transform: translate3d(0, -50%, 0);
}

.prev-btn {
  left: 16px;
}

.next-btn {
  right: 16px;
}
</style>
