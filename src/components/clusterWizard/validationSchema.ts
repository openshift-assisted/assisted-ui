import * as Yup from 'yup';

export default Yup.object().shape({
  clusterName: Yup.string().required('Required'),
  DNSDomain: Yup.string().required('Required'),
});
