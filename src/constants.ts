import path from 'node:path'

export const UPLOAD_DIR = process.env.UPLOAD_DIR
  ? path.join(process.cwd(), process.env.UPLOAD_DIR)
  : path.join(process.cwd(), 'uploads')

export const ARCHIVE_NAME = 'converter.zip'
export const USER_TRANSFORMED_IMAGES_FOLDER = 'transformed'
export const USER_RAW_IMAGES_FOLDER = 'raw'
export const COOKIE_ID = 'user-id'
export const CANVAS_MARK_SIZE = 8
export const CANVAS_LINE_WIDTH = 3
export const MIN_CROP_SIZE = 130
