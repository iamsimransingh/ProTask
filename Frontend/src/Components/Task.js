import axios from 'axios';
import React from 'react';
import Todo from './Todo';
import './Task.css';
import '../App.css';
import {useParams, withRouter} from 'react-router-dom';
import MultiSelect from "react-multi-select-component";
import Select from 'react-dropdown-select';
import {connect} from 'react-redux'
import * as actionTypes from './store/action'
import useSWR from 'swr';
import AssignTodo from './Assigntodo';

class Task extends React.Component{

    state={
        listOfTask:[{}],
        mytask:'',
        assigntask:'',
        id:'',
        selected1:[],
        listOfUsers:[],
        listOfAssignTask:[],
        data:null
    }
    
    setSelected1 = (value)=>{
         let arr=[...this.state.selected1];
         arr.push(value)
         this.setState({selected1:arr})
    }
    fetcher=()=>{
       axios.post(`http://localhost:8000/user/getUser/${this.props.match.params.id}`).then((res)=>res.data)
    }
    setTodos=(myTask,assignedTask)=>{
      this.setState({listOfTask:myTask,listOfAssignTask:assignedTask})
    }
    componentDidMount(){
        const id=(this.props.match.params.id)
        const url=`http://localhost:8000/user/getUser/${id}`;
        axios.get(url).then((result)=>{
            console.log(result);
            this.setState({listOfTask:result.data.myTask,id,listOfAssignTask:result.data.assignedTask})
            axios.get('http://localhost:8000/task/getAllUsers')
            .then((res)=>{
                
                this.setState({listOfUsers:res.data,})
                console.log(this.state.listOfUsers)
            }).catch((err)=>{
               console.log(err);
            })
            
        }).catch((err)=>{
            console.log(err);
        })
    }

    addTask=()=>{
       axios.put("http://localhost:8000/task/addMyTask",{id:this.state.id,task:this.state.mytask})
       .then((result)=>{
           console.log(result);
           this.setState({task:'',listOfTask:result.data.myTask,user:result})
       }).catch((err)=>{
           console.log(err);
       })
    }

    assignTask=()=>{
      console.log("In assignTask")
      let listOfUser=[];
      this.state.selected1.forEach(element=>{
        let obj={}
        obj["username"]=element.label
        listOfUser.push(obj)
      })
      console.log(listOfUser)
      axios.post('http://localhost:8000/task/delegateTask',{listOfUser,task:this.state.assigntask,id:this.props.match.params.id}).then((res)=>{
        console.log(res)
        this.setState({listOfTask:res.data.myTask,listOfAssignTask:res.data.assignedTask})
        
      }).catch((err)=>{
        console.log(err);
      })
    }

    ArrowRenderer2 = () =>{
      return(
          <button className="access-btn" strokeWidth="0">
             <i className="fas fa-tags"></i>
          </button>
         )
          };

    render(){
        var myTask=[] ;
        var assignTask=[];
        console.log(this.state.selected1)
         myTask=this.state.listOfTask.map((element,index)=>{
          return <Todo Task={element.Task} id={this.state.id} status={element.status} progress={element.progress} set={this.setTodos}/>
        })
       
        assignTask=this.state.listOfAssignTask.map((element)=>{
            return <AssignTodo Task={element.Task} id={this.state.id} status={element.status} progress={element.progress} set={this.setTodos}/>
        })
        
        return(
            <div className="Task">
              <header>
              <h1>ProTask</h1> 
              </header>
              <div className="welc">
                <h2> Welcome {this.props.match.params.username} </h2>
              </div>
              <div className="task-grid" >
              {}
                <div className= "my-todo-column">
                  <h3>My tasks</h3>
                <form>
                 <input value={this.state.task} onChange={(event)=>this.setState({...this.state,mytask:event.target.value})} type="text" className="todo-input" /> 
                 <button onClick={this.addTask} className="todo-button" type="submit">
                   <i className="fas fa-plus-square"></i>
                 </button>
              </form>
                  {myTask}
                  </div>
                <div className="assign-todo-column">
                <h3>Assign tasks</h3>
                <form>
                 <input value={this.state.assigntask} onChange={(event)=>this.setState({...this.state,assigntask:event.target.value})} type="text" className="todo-input" /> 
                 
                 <div className="dropdown"> 
                 <Select
    multi
    options={this.state.listOfUsers}
    onChange={(values) => this.setState({selected1:values})}
    className="react-select"
    placeholder="Assign Tasks ..."
  />

 </div>
 <button  className="todo-button" type="submit" onClick={this.assignTask}>
                   <i className="fas fa-plus-square"></i>
                 </button>
              </form> 
               {assignTask}
                </div>
              </div>
            </div>  
        )
    }
}

export default withRouter(Task);
