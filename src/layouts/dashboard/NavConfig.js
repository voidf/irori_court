// component
import Iconify from '../../components/Iconify';

// ----------------------------------------------------------------------

import LOCALIZATIONPACK from '../../localization/str';

const navstring = LOCALIZATIONPACK.nav;

const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;

const navConfig = [
  {
    title: navstring.dashboard,
    path: '/dashboard/app',
    icon: getIcon('eva:pie-chart-2-fill'),
  },
  {
    title: 'user',
    path: '/dashboard/user',
    icon: getIcon('eva:people-fill'),
  },
  {
    title: 'product',
    path: '/dashboard/products',
    icon: getIcon('eva:shopping-bag-fill'),
  },
  {
    title: 'blog',
    path: '/dashboard/blog',
    icon: getIcon('eva:file-text-fill'),
  },
  {
    title: navstring.login,
    path: '/login',
    icon: getIcon('eva:lock-fill'),
  },
  {
    title: navstring.register,
    path: '/register',
    icon: getIcon('eva:person-add-fill'),
  },
  {
    title: 'Not found',
    path: '/404',
    icon: getIcon('eva:alert-triangle-fill'),
  },
  {
    title: navstring.problem,
    path: '/dashboard/problemlist',
    icon: getIcon('eva:alert-triangle-fill'),
  },
];

export default navConfig;
