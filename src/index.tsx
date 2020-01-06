import React from 'react'
import { hydrate } from 'react-dom'
import { setConfig } from 'react-hot-loader'
import App from '@/app'

setConfig({
  reloadHooks: false
})

const app = document.getElementById('app') as HTMLElement
hydrate(<App />, app)
