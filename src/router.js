import VueRouter from 'vue-router';
import Search from './components/Search';
import AboutUs from './components/AboutUs';
import Missing from './components/Missing';
import NoShow from './components/NoShow';
import Show from './components/Show';

const routes = [
  { path: '/about', component: AboutUs },
  { path: '/', component: Search,
    children: [
      {
        // UserProfile will be rendered inside User's <router-view>
        // when /user/:id/profile is matched
        name: 'search',
        path: '/search/:query/:episode?',
        component: Show,
        props(route) {
          const props = { ...route.params }
          props.id = +props.id
          return props
        },
      },
      {
        // UserPosts will be rendered inside User's <router-view>
        // when /user/:id/posts is matched
        path: '/',
        component: NoShow
      }
    ]
  },
  { path: '*', component: Missing },
];

export default new VueRouter({routes});