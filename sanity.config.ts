import { defineConfig } from "sanity"
import { structureTool } from "sanity/structure"
import { visionTool } from "@sanity/vision"

import { projectId, dataset } from "./sanity/env"
import { schemaTypes } from "./sanity/schemaTypes"

export default defineConfig({
  name: "default",
  title: "Bombay Bureau",

  projectId,
  dataset,

  plugins: [structureTool(), visionTool()],

  schema: {
    types: schemaTypes,
  },
})