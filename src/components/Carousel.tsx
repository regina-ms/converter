import React, { PropsWithChildren, useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { EmblaCarouselType, EmblaOptionsType } from 'embla-carousel'

interface CarouselProps extends PropsWithChildren {
  options?: EmblaOptionsType
}

function Carousel({ options, children }: CarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel(options)

  useEffect(() => {
    console.log(emblaApi)
  }, [emblaApi])
  return (
    <div className='embla' ref={emblaRef}>
      <div className='embla__container'>{children}</div>
    </div>
  )
}

function CarouselSlide() {
  return <></>
}

type UseNavigationButtonsTypes = {
  prevDisabled: boolean
  nextDisabled: boolean
  onNextClick: () => void
  onPrevClick: () => void
}

const useNavigationButtons = (emblaApi: EmblaCarouselType | undefined): UseNavigationButtonsTypes => {
  const [nextDisabled, setNextDisabled] = useState(true)
  const [prevDisabled, setPrevDisabled] = useState(true)

  const onNextClick = useCallback(() => {
    if (!emblaApi) return

    emblaApi.scrollNext
  }, [emblaApi])

  const onPrevClick = useCallback(() => {
    if (!emblaApi) return

    emblaApi.scrollPrev
  }, [emblaApi])

  const onSelect = useCallback((emblaApi: EmblaCarouselType) => {
    setNextDisabled(!emblaApi.canScrollNext())
    setPrevDisabled(!emblaApi.canScrollPrev())
  }, [])

  useEffect(() => {
    if (!emblaApi) return

    onSelect(emblaApi)

    emblaApi.on('reInit', onSelect).on('select', onSelect)
  }, [emblaApi, onSelect])

  return {
    prevDisabled,
    nextDisabled,
    onNextClick,
    onPrevClick,
  }
}

export default Carousel
