import * as Yup from 'yup';

export default Yup.object().shape({
  name: Yup.string().required('Required'),
  openshiftVersion: Yup.string().required('Required'),
});
