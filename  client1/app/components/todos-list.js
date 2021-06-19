import Component from '@ember/component';
import config from '../config/environment';

export default Component.extend({
    
    init(){
        this._super();
        this.getTasks(); 
    },

    getTasks(){
        this.set('user', sessionStorage.getItem('user'))
        const { user } = this;
        fetch(`${config.apiHost}/getTasks/${user}`)
        .then(res => res.json())
        .then(tasks =>{
            this.set('tasks',tasks.todos);
        })
        .catch(err => alert(err))
    },
    actions: {
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
            })
            .catch(err => alert(err))
        },
        onShare(e){ 
            this.set('taskToReflect',e.target.getAttribute('value'))
            this.set('is_done',e.target.getAttribute('is_done'))
            const modal = this.element.getElementsByClassName('share-lst')[0];
            modal.style.display = "block";

            fetch(`${config.apiHost}/getUsersShare/${this.taskToReflect}`,{
                method: 'GET',
                headers: {
                    'Content-Type':'application/json'
                }
            })
            .then( res => res.json())
            .then( res => {
                this.set('users',res.shares.filter(s => s.email !== this.user))
            })
            .catch(err => alert(err))
            
            
            if(e.target.className.includes('fill')){
                e.target.className ='bi bi-share';
            }else{
                e.target.className ='bi bi-share-fill';
            }         
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
            })
            .catch(err => alert(err))
        },
        shareTask(e){
            const shared_with = e.target.getAttribute('value') //who
            const { taskToReflect, user, is_done } = this

            fetch(`${config.apiHost}/shareTask`,{
                method: 'PUT',
                headers: {
                    'Content-Type':'application/json'
                },
                body: JSON.stringify({
                    user, taskToReflect, shared_with, is_done
                    
                })
            })
            .then(res => res.json())
            .then(newTodos => {
                this.set('todos',[...newTodos])
            })
            .catch(err => alert(err))

        }

    }

});