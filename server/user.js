const users =[];

const addUsers=({ id, name, room})=>{
    if(name,room){
        name = name.trim().toLowerCase();  // if user input name inbetween white spaces then that white space will remove using this trim function
        room = room.trim().toLowerCase();
    }
 
    //users.push(name,room)
    
 const existUser = users.find((user)=> user.room === room && user.name === name)  // here we are finding if that user name, id, room, is same or not
     
   if(existUser){
    return { error: 'Username is taken' }
    }
 const user = { id, name, room };

 users.push(user);
 
 return { user }
}

const removeUser=(id)=>{
  const indexId = users.findIndex((user)=>user.id === id);

  if(indexId !== -1){
      return users.splice(indexId, 1)[0];
  }
}

const getUser=(id)=>users.find((user)=>user.id === id);

const getUsersInRoom=(room)=>users.filter((user)=>user.room === room)

module.exports = { addUsers, removeUser, getUser, getUsersInRoom }