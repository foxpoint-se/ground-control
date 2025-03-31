declare module "leaflet.glify" {
  import { Map } from "leaflet";

  interface GlifyOptions {
    map: Map;
    data: any; // GeoJSON data
    click?: (e: any, feature: any) => void;
  }

  interface GlifyInstance {
    destroy: () => void;
  }

  interface Glify {
    points: (options: GlifyOptions) => GlifyInstance;
    lines: (options: GlifyOptions) => GlifyInstance;
    shapes: (options: GlifyOptions) => GlifyInstance;
  }

  const glify: Glify;
  export default glify;
}
