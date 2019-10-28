import React, { FC, useCallback } from 'react'
import styled from 'styled-components'
import { useSelector } from 'react-redux'
import { RootStore } from '@/store'

export const Menu: FC<{}> = ({}) => {
  const point = useSelector<RootStore, number>(({ point }) => point)
  return <Wrap>POINT: {point}</Wrap>
}

const Wrap = styled.div`
  display: flex;
  flex-wrap: wrap;
`
