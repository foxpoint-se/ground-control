import { useEffect, useRef } from 'react'
import { Marker, MarkerProps } from 'react-leaflet'
import 'leaflet-rotatedmarker'

interface RotatedMarkerProps extends MarkerProps {
  rotationAngle: number
}

export const RotatableMarker = ({ rotationAngle, ...props }: RotatedMarkerProps) => {
  const markerRef = useRef<L.Marker>()
  useEffect(() => {
    if (markerRef.current) {
      markerRef.current.setRotationAngle(rotationAngle)
    }
  }, [rotationAngle])

  // Note: Had problems with flickering when doing the if-check higher up in the tree.
  // Works better when instead always passing down defined or undefined props and checking them here.
  return props.position[0] && props.position[1] && <Marker ref={markerRef} {...props} />
}
