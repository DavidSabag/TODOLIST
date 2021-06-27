import Base from 'ember-simple-auth/authenticators/base';

import config from '../config/environment';

export default Base.extend({

    async authenticate(email, password){
        
        const res = await fetch(`${config.apiHost}/login`,{
            method: 'POST',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify({
                email, password
            })
        })
        if(res.ok){
            sessionStorage.setItem('user',email)
            return res.json();
        }else{
            const err = await res.json();
            throw new Error(err.error)
        }
    },


})

