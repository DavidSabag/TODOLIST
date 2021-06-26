import { inject as service } from '@ember/service';
import Component from '@ember/component';
//import config from '../config/environment';

export default Component.extend({
  session: service('session'),

  actions: {
    async authenticate() {
        
      try {
        let { email, password } = this;
        await this.get('session').authenticate('authenticator:token', email, password);
    

      } catch (err) {
        this.set('errorMessage', err);
      }
    },

    updateEmail(e){
      this.set('email', e.target.value)
    },
    updatePassword(e){
      this.set('password', e.target.value)
    }

  }

});