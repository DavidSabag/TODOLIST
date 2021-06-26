import { inject as service } from '@ember/service';
import Component from '@ember/component';
import config from '../config/environment';

export default Component.extend({
  session: service('session'),

  actions: {
    async addUser(self){
        const { email,addpassword } = self
        const res = await fetch(`${config.apiHost}/adduser`,{
            method: 'POST',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify({
                email, addpassword
            })
        })
        
        if(res.ok){
            self.set('success', res)
            self.set('email', '')
            self.set('addpassword', '')
            self.set('repassword', '')
            
        }else{
            const err = await res.json();
            self.set('errorMessage', err.error)
        }
    },

    checkEnterdPassword(){
      const { addpassword, repassword } = this;
      if(addpassword !== repassword){
        this.set('errorMessage','Bad password input');
      } else{
          this.actions.addUser(this);
      }
    },

    addEmail(e){
      this.set('email', e.target.value)
    },
    addPassword(e){
      this.set('addpassword', e.target.value)
    },
    rePassword(e){
        this.set('repassword', e.target.value)
    }
    
  }

});