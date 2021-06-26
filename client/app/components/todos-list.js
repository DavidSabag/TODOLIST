import Component from '@ember/component';
import config from '../config/environment';

export default Component.extend({
    
    init(){
        this._super();
        this.getTasks(); 
        this.getAllUsers();
        
    },
    getAllUsers(){
        fetch(`${config.apiHost}/getAllUsers`)
        .then(res => res.json())
        .then(users =>{
            const allUsers = users.allUsers.map(user => {
                return{
                    email: user.email,
                    is_shared: false
                }
            })
            this.set('users',allUsers.filter(user => user.email !== this.user));
    
        })
        .catch(err => alert(err))

    },
    getSharedWith(shares, users){
        const newUsers = []
        let isShares = false;
        if(shares.length === 0){
            return users.map(user => {
                return {
                    email: user.email,
                    is_shared: false
                }     
            })  
        }
        for(let user of users){
            isShares = false
            for(let sh of shares){
                if(user.email === sh.shared_with ){
                    newUsers.push({
                        email: user.email,
                        is_shared: true
                    })
                    isShares = true
                }
            }
            if(!isShares){
                newUsers.push(user)
            }
        }
        return newUsers;   
    },

    getTasks(){
        this.set('user', sessionStorage.getItem('user'))
        const { user } = this;
        fetch(`${config.apiHost}/getTasks/${user}`)
        .then(res => res.json())
        .then(tasks =>{
            this.set('tasks',tasks.todos);
            this.updateCounters()

        })
        .catch(err => alert(err))
    },
    updateCounters(){
        this.set('complited', this.tasks.filter(task => task.is_done === 1).length)
        this.set('uncomplited', this.tasks.length - this.complited)
        this.set('total', this.tasks.length)
    },
    actions: {
        logOut(){
            window.location.reload()
        },
        toggleTask(e) {
            const { user } = this;
            const task = e.target.nextElementSibling.innerHTML;
            fetch(`${config.apiHost}/updateTask`,{
                method: 'PUT',
                headers: {
                    'Content-Type':'application/json'
                },
                body: JSON.stringify({
                    email:user,
                    todo: task
                })
            })
            .then( res => res.json())
            .then( newTasks =>{
                this.set('tasks',[...newTasks])
                this.updateCounters()
            })
            .catch(err => alert(err))
        },
        onShare(e){      
             const modal = this.element.getElementsByClassName('share-lst')[0];
             modal.style.display = "block";
             const taskToReflect = e.target.getAttribute('value')
             const is_done = e.target.getAttribute('is_done')
             this.set('taskToReflect',taskToReflect)
             this.set('is_done',is_done)
             const { user } = this;
            fetch(`${config.apiHost}/getUsersShare/${user}/${taskToReflect}`,{
                method: 'GET',
                headers: {
                    'Content-Type':'application/json'
                }
            })
            .then( res => res.json())
            .then( res => {
                const { users } = this;
                const newUsers = this.getSharedWith(res.shares, users)
                this.set('users',[...newUsers])   
   
            })
            .catch(err => alert(err))
            
        },
        addTodo(){
            const modal = this.element.getElementsByClassName('modal')[0];
            modal.style.display = "block";            
        },
        onAddModalClose(){
            const modal = this.element.getElementsByClassName('modal')[0];
            modal.style.display = "none";
            
        },
        onShareModalClose(){
            const modal = this.element.getElementsByClassName('share-lst')[0];
            modal.style.display = "none";
        },
        addTask(){
            const { user } = this;
            const value = this.$('#add-task-input')[0].value;
    
            fetch(`${config.apiHost}/addtask`,{
                method: 'POST',
                headers: {
                    'Content-Type':'application/json'
                },
                body: JSON.stringify({
                    email:user,
                    todo: value
                })
            })
            .then(res => res.json())
            .then( todo => {
                const {tasks} = this
                tasks.push(todo)
                this.set('tasks',[...tasks])
                this.$('#add-task-input')[0].value = "";
                this.updateCounters()
                
            })
            .catch(err => alert(err))
        },
        removeTask(e){
            const { user } = this;
            const task = e.target.getAttribute('value');
            fetch(`${config.apiHost}/removeTask/${user}/${task}`,{
                method: 'DELETE',
                headers: {
                    'Content-Type':'application/json'
                }
            })
            .then( res => res.json())
            .then( newTasks => {
                this.set('tasks',[...newTasks])
                this.updateCounters()
            })
            .catch(err => alert(err))
        }, 
        shareTask(e){
            const shared_with = e.target.getAttribute('value') //who
            const is_shared = e.target.checked
            const { taskToReflect, user, is_done } = this
            fetch(`${config.apiHost}/shareTask`,{
                method: 'PUT',
                headers: {
                    'Content-Type':'application/json'
                },
                body: JSON.stringify({
                    user, taskToReflect, is_done, is_shared, shared_with
                    
                })
            })
            .then(res => res.json())
            .then( newTasks => {
                this.set('tasks',[...newTasks])
                
            })
            .catch(err => alert(err))

        }

    }

});