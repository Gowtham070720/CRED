import { useEffect,useState } from 'react'
import axios from 'axios'
import './App.css'

function App() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userData, setUserData] = useState({name:"",age:"",city:""});

    // Function to fetch all users from the backend
  const getAllUsers = async () => {
    try {
      const res = await axios.get('http://localhost:3000/users');
      setUsers(res.data);
      setFilteredUsers(res.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };
  
  useEffect(() => {
    getAllUsers();
  }, []);


  //search functionality
  const handleSearchChange = (e) => {
    const searchText = e.target.value.toLowerCase();
    const filteredUsers = users.filter(user =>
      user.name.toLowerCase().includes(searchText) ||
      user.city.toLowerCase().includes(searchText) ||
      user.age.toString().includes(searchText)
    );
    setFilteredUsers(filteredUsers);
  
  };  

  // Delete functionality
  const handleDelet = async (id) => {
    const isConfirm = window.confirm("Are you sure you want to delete this user?");
    if (isConfirm){
      await axios.delete(`http://localhost:3000/users/${id}`).then((res) => {
        setUsers(res.data); 
        setFilteredUsers(res.data);
      });
    }

  
  };

  //close modal
  const closeModal = () => {
    setIsModalOpen(false);
    getAllUsers();
  };

  // Add Record functionality (placeholder)
  const handleAddRecord = () => {
    setUserData({name:"",age:"",city:""});
    setIsModalOpen(true);
  };

  // Handle input data change
  const  handleData = (e) => {
    setUserData({...userData,[e.target.name]:e.target.value});
  };
  // Submit new user data
  const handleSubmit = async (e) => {
    e.preventDefault();
    if(userData.id){
      // Update functionality can be implemented here
      await axios.patch(`http://localhost:3000/users/${userData.id}`, userData).then((res)=>{
      console.log(res);
    });

    }else{
      // Add new user
      await axios.post('http://localhost:3000/users', userData).then((res)=>{
      console.log(res);
    });
      
    }
    closeModal();
    setUserData({name:"",age:"",city:""});
    

  };

  // Update Record functionality (placeholder)
  const handleUpdateRecord = (user) => {
    // Placeholder for update functionality
    setUserData(user);
    setIsModalOpen(true);
    alert(`Update functionality for ${user.name} is not implemented yet.`);
  };

  return (
    <>
      <div className='container'>
        <h3>CRUD Application with react and node.</h3>
        <div className='input-search'>
          <input type='search'placeholder='Search Text Here'  onChange={handleSearchChange}/>
          <button  className='btn green' onClick={handleAddRecord}>ADD Record</button>
        </div>
        <table className='table'>
          <thead>
            <tr>
              <th>S.No</th>
              <th>Name</th>
              <th>Age</th>
              <th>City</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers && filteredUsers.map((user, index) => (
              <tr key={user.id}>
                <td>{index + 1}</td>
                <td>{user.name}</td>
                <td>{user.age}</td>
                <td>{user.city}</td>
                <td><button className='btn green' onClick={()=>handleUpdateRecord(user)}>Edit</button></td>
                <td><button onClick={()=>handleDelet(user.id)} className='btn red'>Delete</button></td>
              </tr>
            ))}
            
          </tbody>
        </table>
        {isModalOpen && (
          <div className="modal">
            <div className="modal-content">
              <span className='close' onClick={closeModal}>
                &times;

              </span>
              <h3>{userData.id ? "Edit User" : "Add New User"}</h3>
              <div className='input-group'>
              <label htmlFor='name'>
                Name:</label>
                <input
                  type="text"
                  value={userData.name} name='name' id='name'
                  onChange={handleData}
                />
              </div>

              <div className='input-group'>
              <label htmlFor='age'>
                Age:</label>
                <input
                  type="text"
                  value={userData.age} name='age' id='age'
                  onChange={handleData}
                />
              </div>

              <div className='input-group'>
              <label htmlFor='city'>
                City:</label>
                <input
                  type="text"
                  value={userData.city} name='city' id='city'
                  onChange={handleData}
                />
              
              </div>
              
              <button className='btn green' onClick={handleSubmit}>Submit</button>
            </div>
          </div>
        )}
      </div>
      
    </>
  )
}

export default App
