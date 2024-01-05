import { type ResultFactory, validationResult } from 'express-validator';
import { type Request } from 'express';

const formatErrors = (req: Request) => {
  const myValidationResult: ResultFactory<string> =
    validationResult.withDefaults({
      formatter: (error) => error.msg as string
    });
  return myValidationResult(req).array();
};
export default formatErrors;
