import { TransitionProps } from '@mui/material/transitions'
import { Slide as Transition } from '@mui/material'
import React, { forwardRef, useCallback } from 'react'

type SlideTransition = {
  direction?: 'up' | 'left' | 'right' | 'down'
}
export default function SlideTransition({ direction = 'up' }: SlideTransition) {
  const Slide = useCallback(
    forwardRef(
      (
        props: TransitionProps & {
          children: React.ReactElement<any, any>
        },
        ref: React.Ref<unknown>
      ) => {
        return <Transition direction={direction} ref={ref} {...props} />
      }
    ),
    []
  )
  return { Slide }
}
