import type { Meta, StoryObj } from '@storybook/react-vite'
import { useGameStore } from '../../store/gameStore'
import MenuPanel from './MenuPanel'

const meta = {
  component: MenuPanel,
  decorators: [
    (Story) => {
      useGameStore.setState({
        play: { active: false },
        load: { spaceShip: true, meteolites: true },
      })
      return <Story />
    },
  ],
} satisfies Meta<typeof MenuPanel>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
