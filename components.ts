import {defineAsyncComponent} from 'vue';

import SeriesHeader from './components/SeriesHeader.vue';
import SeriesList from './components/SeriesList.vue';
import Searchbox from "~/vue components/search/searchbox.vue";

const Components = {
    SeriesHeader,
    SeriesList,
    Searchbox
}

export default defineAsyncComponent(Components)