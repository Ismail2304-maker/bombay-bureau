import "dotenv/config"
import { createClient } from "next-sanity"
import { apiVersion, dataset, projectId } from "../env.js"

/* READ CLIENT */
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
})

/* WRITE CLIENT (for automation) */
export const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})