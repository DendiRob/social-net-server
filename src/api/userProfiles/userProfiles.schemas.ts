import * as yup from 'yup';

export const getFile = yup.object({
  fileId: yup.number().required()
});
