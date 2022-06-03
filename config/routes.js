export default [
  {
    path: '/login',
    layout: false,
    component: './Login',
  },

  {
    path: '/',
    routes: [
      {
        path: '/',
        redirect: './dashboard',
      },
      {
        path: '/dashboard',
        name: 'dashboard',
        icon: 'PieChartOutlined',
        component: '@/pages/Dashboard',
      },
      {
        path: '/user',
        name: 'user',
        icon: 'UserOutlined',
        component: '@/pages/User',
      },
      {
        path: '/goods',
        name: 'goods',
        icon: 'InboxOutlined',
        component: '@/pages/Goods',
      },
      {
        path: '/test',
        name: 'test',
        icon: 'BugOutlined',
        component: './test',
      },
    ],
  },
  {
    component: './404',
  },
];
