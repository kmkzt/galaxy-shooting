import type { Meta, StoryObj } from '@storybook/react-vite'
import { useGameStore } from '../../store/gameStore'
import Start from './Start'

const meta = {
  component: Start,
  decorators: [
    (Story) => {
      useGameStore.setState({ play: { active: false } })
      return <Story />
    },
  ],
} satisfies Meta<typeof Start>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
