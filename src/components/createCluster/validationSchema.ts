import * as Yup from 'yup';

export default Yup.object().shape({
  clusterName: Yup.string().required('Required'),
  DNSDomain: Yup.string().required('Required'),
  pullSecret: Yup.string().when('$providePullSecret', {
    is: true,
    then: Yup.string().required('Required')
  }),
  username: Yup.string().when('$providePullSecret', {
    is: false,
    then: Yup.string().required('Required')
  }),
  password: Yup.string().when('$providePullSecret', {
    is: false,
    then: Yup.string().required('Required')
  })
});
