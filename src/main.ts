import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import esLang from 'element-plus/es/locale/lang/es'

// Date management.
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import 'dayjs/locale/es'

// @ts-ignore
import InstantSearch from 'vue-instantsearch/vue3/es';

import './assets/main.scss'


dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.locale('es')

const app = createApp(App)

app.use(createPinia())

app.use(router)
app.use(ElementPlus, {
    locale: esLang,
})
app.use(InstantSearch)

app.mount('#app')
