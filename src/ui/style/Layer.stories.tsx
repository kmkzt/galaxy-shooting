import type { Meta, StoryObj } from '@storybook/react-vite'
import Layer from './Layer'

const meta = {
  component: Layer,
} satisfies Meta<typeof Layer>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithContent: Story = {
  args: {
    children: <div style={{ color: 'white', fontSize: '24px' }}>Hello World</div>,
  },
}

export const CustomBackground: Story = {
  args: {
    background: 'rgba(0, 0, 128, 0.6)',
    children: <div style={{ color: 'white', fontSize: '24px' }}>Custom BG</div>,
  },
}
