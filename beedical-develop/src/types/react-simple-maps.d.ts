declare module 'react-simple-maps' {
  import * as React from 'react';

  export interface ComposableMapProps {
    projection?: string;
    projectionConfig?: {
      scale?: number;
      rotation?: [number, number, number];
      center?: [number, number];
    };
    width?: number;
    height?: number;
    style?: React.CSSProperties;
    className?: string;
    children?: React.ReactNode; // Ajoutez cette ligne
  }

  export class ComposableMap extends React.Component<ComposableMapProps> {}

  export interface GeographiesProps {
    geography?: string | object;
    children: (geographies: any) => React.ReactNode;
  }

  export class Geographies extends React.Component<GeographiesProps> {}

  export interface GeographyProps {
    geography?: object;
    style?: React.CSSProperties;
    className?: string;
    fill?: string; // Ajoutez cette ligne
    stroke?: string; // Ajoutez cette ligne
  }

  export class Geography extends React.Component<GeographyProps> {}

  export interface MarkerProps {
    coordinates: [number, number];
    children?: React.ReactNode;
  }

  export class Marker extends React.Component<MarkerProps> {}
}
