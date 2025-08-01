import { readFileSync } from 'node:fs'
import path from 'node:path'
import process from 'node:process'

export const cwd = process.cwd()
export const pkg = JSON.parse(readFileSync(path.resolve(cwd, 'package.json'), 'utf8'))
