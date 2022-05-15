// Type definitions for Leaflet.RotatedMarker 0.2
// Copied from: https://github.com/bbecquet/Leaflet.RotatedMarker
// Only changed to declare module 'react-leaflet' instead of 'leaflet'

import * as L from 'leaflet';

declare module 'react-leaflet' {
    interface MarkerOptions {
        rotationAngle?: number | undefined; // Rotation angle, in degrees, clockwise. (Default = 0)
        rotationOrigin?: string | undefined; // The rotation center, as a transform-origin CSS rule. (Default = 'bottom center')
    }

    interface Marker {
        /*
        * Sets the rotation angle value.
        */
        setRotationAngle(newAngle: number): this;

        /**
         * Sets the rotation origin value.
         */
        setRotationOrigin(newOrigin: string): this;
    }
}