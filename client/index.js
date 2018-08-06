import 'muse-ui/lib/styles/base.less'
import 'muse-ui/lib/styles/theme.less'

import Vue from 'vue'
import App from './App'
import { Paper, Icon, DataTable, Form, Switch, Radio, TextField, Checkbox, Button, Chip, Tooltip } from 'muse-ui'
import Helpers from 'muse-ui/lib/Helpers'

Vue.use(Helpers)
Vue.use(Paper)
Vue.use(Icon)
Vue.use(DataTable)
Vue.use(Form)
Vue.use(Switch)
Vue.use(Radio)
Vue.use(TextField)
Vue.use(Checkbox)
Vue.use(Button)
Vue.use(Chip)
Vue.use(Tooltip)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App)
})
