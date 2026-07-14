/**
 * movie router
 */

import { factories } from '@strapi/strapi';
import { MOVIE_UID } from '../../../constants';

export default factories.createCoreRouter(MOVIE_UID);
