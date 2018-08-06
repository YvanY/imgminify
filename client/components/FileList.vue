<template>
  <div>
    <mu-data-table :columns="columns" :data="files" :loading="loading" no-data-text="愣着啊，上传图片干啥ヽ(#`Д´)ﾉ">
      <template slot="th" slot-scope="column">
        <template v-if="column.type === 'checkbox'">
          <mu-checkbox
            :input-value="isSelectAll(column.listname)"
            @change="toggleSelectAll(column.listname)"
          />
        </template>
        <template v-else>{{ column.title }}</template>
      </template>

      <template slot-scope="{ row: file }">
        <td class="thumbnail">
          <div :style="{ backgroundImage: `url(${file.thumbnail})` }" class="img" />
        </td>
        <mu-tooltip :content="file.oname" placement="bottom-start" tooltip-class="name-tooltip">
          <td class="name">{{ file.oname }}</td>
        </mu-tooltip>
        <td class="osize is-right"><a :href="file.thumbnail" :download="file.oname" class="download-link">{{ filesize(file.osize) }}</a></td>
        <td class="jsize is-right"><a v-if="file.status === 'success'" :href="file.jurl" :download="file.jname" class="download-link">{{ filesize(file.jsize) }}</a></td>
        <td class="jcheckbox mu-checkbox-col">
          <mu-checkbox
            v-if="file.status === 'success'"
            :input-value="isSelect('selectJpegs', file)"
            @change="toggleSelect('selectJpegs', file)"
          />
        </td>
        <td class="psize is-right"><a v-if="file.status === 'success'" :href="file.purl" :download="file.pname" class="download-link">{{ file.psize && filesize(file.psize) }}</a></td>
        <td class="pcheckbox mu-checkbox-col">
          <mu-checkbox
            v-if="file.status === 'success'"
            :input-value="isSelect('selectPngs', file)"
            @change="toggleSelect('selectPngs', file)"
          />
        </td>
        <td class="acts is-right">
          <mu-icon v-if="file.status === 'success'" class="act icon-zoom" value="zoom_in" size="20" @click="showComparer(file)" />
          <mu-icon class="act icon-delete" value="close" size="20" @click="$emit('remove', file)" />
        </td>
      </template>
    </mu-data-table>

    <mu-paper v-if="files.length">
      <form action="/zip" method="POST" target="_blank">
        <input :value="sources" type="hidden" name="sources">
        <mu-button :disabled="!selectJpegs.length && !selectPngs.length" full-width color="primary" type="submit"><mu-icon left value="save_alt" size="18" />下载</mu-button>
      </form>
    </mu-paper>
  </div>
</template>

<script>
import filesize from 'filesize'
import showComparer from '@/shared/showComparer'

export default {
  name: 'FileList',
  props: {
    files: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      selectJpegs: [],
      selectPngs: [],
      columns: [
        { title: '', class: 'thumbnail', width: 48 },
        { title: '文件名' },
        { title: '原始', align: 'right', width: 120 },
        { title: 'JPEG', align: 'right', width: 120 },
        { type: 'checkbox', class: 'mu-checkbox-col', listname: 'selectJpegs', width: 75 },
        { title: 'PNG', align: 'right', width: 120 },
        { type: 'checkbox', class: 'mu-checkbox-col', listname: 'selectPngs', width: 75 },
        { title: '操作', align: 'right', width: 120 }
      ]
    }
  },
  computed: {
    sources() {
      return JSON.stringify([
        ...this.selectPngs.map(file => file.purl),
        ...this.selectJpegs.map(file => file.jurl)
      ])
    },
    loading() {
      return this.files.some(file => file.status === 'uploading')
    }
  },
  methods: {
    showComparer,
    filesize,
    isSelect(listname, file) {
      return this[listname].indexOf(file) !== -1
    },
    isSelectAll(listname) {
      const { length } = this[listname]
      return !!length && length === this.files.length
    },
    toggleSelectAll(listname) {
      this[listname] = this.isSelectAll(listname) ? [] : [...this.files]
    },
    toggleSelect(listname, file) {
      const list = this[listname]
      const index = list.indexOf(file)

      if (index === -1) {
        list.push(file)
      } else {
        list.splice(index, 1)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
td {
  padding-top: 9px;
  padding-bottom: 9px;
  height: 48px;
  white-space: nowrap;
}

.thumbnail {
  padding-left: 9px;
  padding-right: 9px;

  .img {
    width: 30px;
    height: 30px;
    background: center / cover no-repeat;
  }
}

.act {
  color: #DCDCDC;
  vertical-align: middle;
  transition: .3s;
  cursor: pointer;

  &:hover {
    color: inherit;
  }

  & + .act {
    margin-left: 5px;
  }
}

.download-link {
  color: #2196F3;
  transition: .3s;

  &:hover {
    color: #1565C0;
  }
}
</style>

<style>
.name-tooltip {
  transform: translateX(24px);
}
</style>
