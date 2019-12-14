import * as R from 'ramda';

function toBeEmpty(received) {
  return R.isEmpty(received)
    ? {
      message: () => 'expected given object not to be empty',
      pass: true,
    } : {
      message: () => 'expected given object to be empty',
      pass: false,
    };
}

const getKeyTypeMap = R.mapObjIndexed(val => typeof val);

function toMatchShapeWith(received, referenceObject) {
  const shape = getKeyTypeMap(referenceObject);
  const receivedShape = getKeyTypeMap(received);

  return R.equals(shape, receivedShape)
    ? {
      message: () => `
      given object was of provided shape:
      ${JSON.stringify(shape)}
      `,
      pass: true,
    } : {
      message: () => `
      given object was not of provided shape;
      shape of received: ${JSON.stringify(receivedShape)}
      expected shape: ${JSON.stringify(shape)}
      `,
      pass: false,
    };
}

function allElementsSatisfy(received, predicate) {
  return R.all(predicate)(received)
    ? {
      message: () => 'expected all elements of array to satisfy predicate',
      pass: true,
    } : {
      message: () => 'expected all elements of array to satisfy predicate',
      pass: false,
    };
}

expect.extend({
  allElementsSatisfy,
  toBeEmpty,
  toMatchShapeWith,
});
