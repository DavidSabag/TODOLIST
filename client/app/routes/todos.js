import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  session: service(),

  beforeModel(transs) {
    this.get('session').requireAuthentication(transs,'login');
  },
});