import type { Meta, StoryObj } from '@storybook/react-vite'
import { useGameStore } from '../../store/gameStore'
import Loading from './Loading'

const meta = {
  component: Loading,
} satisfies Meta<typeof Loading>

export default meta
type Story = StoryObj<typeof meta>

export const Loading_: Story = {
  name: 'Loading',
  decorators: [
    (Story) => {
      useGameStore.setState({ load: { spaceShip: false, meteolites: false } })
      return <Story />
    },
  ],
}

export const Loaded: Story = {
  decorators: [
    (Story) => {
      useGameStore.setState({ load: { spaceShip: true, meteolites: true } })
      return <Story />
    },
  ],
}
