export enum FileFormat {
  Webp = '.webp',
}

export enum HTTPResponseStatusCode {
  TooManyRequest = 429,
  Unauthorized = 401,
  Forbidden = 403,
  BadRequest = 400,
  InternalServerError = 500,
}

export enum ErrorCode {
  AUTHENTICATION_FAILED = 'AUTHENTICATION_FAILED',
}

export enum LanguageCode {
  en = 'en',
  id = 'id',
}

export enum ImageType {
  JPEG = 'image/jpeg',
  JPG = 'image/jpg',
  PNG = 'image/png',
  WEBP = 'image/webp',
}

export enum RedirectedPage {
  Home = 'home',
  Search = 'search',
  SearchPhone = 'search-phone',
}

export enum PageFrom {
  CarResult = 'car_results',
  CarResultDetails = 'car_result_details',
  CarResultVariant = 'car_result_variant',
}
