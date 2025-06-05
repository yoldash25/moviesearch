import { createRouter, createWebHistory } from 'vue-router'
import SearchView from '../views/SearchView.vue'
import HomePage from '../views/HomePage.vue'
import MovieModal from '../components/MovieModal.vue'
import Favourite from '../components/Favourite.vue'
import GenresCard from '../components/GenresCard.vue'
import GenreMovies from '../components/GenreMovies.vue'

const routes = [
    {
        path: '/',
        name: 'Home',
        component: HomePage
    },
    {
        path: '/search',
        name: 'Search',
        component: SearchView
    },
    {
        path: '/movie/:id',
        name: 'MovieModal',
        component: MovieModal,
    },
    {
        path: '/favourites',
        name: 'Favourite',
        component: Favourite
    },
    {
        path: '/genres',
        name: 'GenresCard',
        component: GenresCard
    },
    {
        path: '/genres/:id',
        name: 'GenreMovies',
        component: GenreMovies
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;