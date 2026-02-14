import type { Meta, StoryObj } from '@storybook/react-vite'
import { useGameStore } from '../../store/gameStore'
import { GameMenu } from './GameMenu'

const meta = {
  component: GameMenu,
  decorators: [
    (Story) => {
      useGameStore.setState({
        score: { point: 0 },
        spaceShip: {
          ...useGameStore.getState().spaceShip,
          position: { x: 0, y: 0, z: 0 },
        },
        meteos: {},
      })
      return <Story />
    },
  ],
} satisfies Meta<typeof GameMenu>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithScore: Story = {
  decorators: [
    (Story) => {
      useGameStore.setState({
        score: { point: 12345 },
        spaceShip: {
          ...useGameStore.getState().spaceShip,
          position: { x: 10, y: 5, z: 200 },
        },
        meteos: {
          0: {
            guid: 0,
            pattern: 0,
            position: { x: 0, y: 0, z: 0 },
            rotation: { x: 0, y: 0, z: 0 },
            scale: { x: 1, y: 1, z: 1 },
          },
          1: {
            guid: 1,
            pattern: 1,
            position: { x: 1, y: 1, z: 1 },
            rotation: { x: 0, y: 0, z: 0 },
            scale: { x: 1, y: 1, z: 1 },
          },
          2: {
            guid: 2,
            pattern: 2,
            position: { x: 2, y: 2, z: 2 },
            rotation: { x: 0, y: 0, z: 0 },
            scale: { x: 1, y: 1, z: 1 },
          },
        },
      })
      return <Story />
    },
  ],
}
