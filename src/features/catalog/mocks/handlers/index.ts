import { http, HttpResponse } from 'msw';
import { mockProducts } from '../data';

const notFound = () =>
  HttpResponse.json(
    {
      timestamp: new Date().toISOString(),
      status: 404,
      error: 'Not Found',
      message: 'Product not found.',
      errors: [],
    },
    { status: 404 },
  );

/** Same answers as the Java API for `GET /products/{code}`. */
const handlersCatalog = [
  http.get('*/products/:code', ({ params }) => {
    const product = mockProducts.find(({ code }) => code === params.code);
    return product ? HttpResponse.json(product) : notFound();
  }),
];

export default handlersCatalog;
