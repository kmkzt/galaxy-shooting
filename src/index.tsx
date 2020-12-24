import React from 'react'
import { hydrate } from 'react-dom'
import App from '@/app'

const app = document.getElementById('app') as HTMLElement
hydrate(<App />, app)
