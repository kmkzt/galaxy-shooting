import styled from 'styled-components'

export interface Props {
  zIndex?: number
  background?: string
}
export default styled.div<Props>`
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: ${({ background }) => background || 'rgba(0, 0, 0, 0.4)'};
  padding: 12px;
  display: flex;
  justify-content: center;
  align-content: center;
  align-items: center;
  z-index: ${({ zIndex }) => zIndex || 'auto'};
`
