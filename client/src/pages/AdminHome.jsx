import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUsers, setLoading, setError } from '../redux/admin/adminSlice';

const AdminHome = () => {
  const dispatch = useDispatch();
  const usersList = useSelector((state) => state.admin.users);
  const [dashboardData, setDashboardData] = useState({ totalUsers: 0 });
  const [searchQuery, setSearchQuery] = useState('');
  const [newUser, setNewUser] = useState({ username: '', email: '', password: '' });
  const loading = useSelector((state) => state.admin.loading);
  const error = useSelector((state) => state.admin.error);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/admin/dashboard', {
          credentials: 'include',
        });

        if (!response.ok) throw new Error('Failed to fetch dashboard data');
        const data = await response.json();
        setDashboardData(data);
      } catch (err) {
        console.error(err);
        dispatch(setError(err.message));
      }
    };

    fetchDashboardData();
  }, [dispatch]);

  useEffect(() => {
    const fetchUsers = async () => {
      dispatch(setLoading(true));
      try {
        const response = await fetch('http://localhost:5000/api/admin/users', {
          credentials: 'include',
        });
        if (!response.ok) throw new Error('Failed to fetch users');
        const data = await response.json();
        dispatch(setUsers(data.users));
      } catch (err) {
        console.error(err);
        dispatch(setError(err.message));
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchUsers();
  }, [dispatch]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredUsers = usersList.filter(
    (user) =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateUser = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to create user');
      alert('User created successfully');
      setNewUser({ username: '', email: '', password: '' });
    } catch (err) {
      console.error(err);
      alert('Error creating user');
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/users/${userId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to delete user');
      alert('User deleted successfully');
    } catch (err) {
      console.error(err);
      alert('Error deleting user');
    }
  };

  const handleEditUser = (user) => {
    const updatedUsername = prompt('Enter new username:', user.username);
    const updatedEmail = prompt('Enter new email:', user.email);
    if (updatedUsername && updatedEmail) {
      // Implement update logic here
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>
      <p>Total Users: {dashboardData.totalUsers}</p>

      <input
        type="text"
        placeholder="Search users by name or email"
        value={searchQuery}
        onChange={handleSearch}
        className="search-input"
      />

      <div className="user-form">
        <input
          type="text"
          placeholder="Username"
          value={newUser.username}
          onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email"
          value={newUser.email}
          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          value={newUser.password}
          onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
        />
        <button onClick={handleCreateUser}>Create User</button>
      </div>

      <table className="user-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user._id}>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>
                <button onClick={() => handleEditUser(user)}>Edit</button>
                <button onClick={() => handleDeleteUser(user._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <style jsx>{`
        .admin-dashboard {
          font-family: Arial, sans-serif;
          padding: 20px;
        }
        h2 {
          font-size: 24px;
          color: #333;
        }
        .search-input {
          margin-bottom: 20px;
          padding: 8px;
          width: 100%;
          max-width: 400px;
          font-size: 16px;
          border: 1px solid #ccc;
          border-radius: 4px;
        }
        .user-form {
          margin: 20px 0;
          display: flex;
          gap: 10px;
        }
        .user-form input {
          padding: 8px;
          border: 1px solid #ccc;
          border-radius: 4px;
          font-size: 16px;
        }
        .user-form button {
          padding: 8px 12px;
          background-color: #007bff;
          color: #fff;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        .user-form button:hover {
          background-color: #0056b3;
        }
        .user-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
        }
        .user-table th,
        .user-table td {
          padding: 12px;
          border: 1px solid #ddd;
          text-align: left;
        }
        .user-table th {
          background-color: #f4f4f4;
        }
        .user-table tr:nth-child(even) {
          background-color: #f9f9f9;
        }
        .user-table button {
          margin-right: 8px;
          padding: 6px 12px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          background-color: #28a745;
          color: #fff;
        }
        .user-table button:hover {
          background-color: #218838;
        }
        .user-table button:nth-child(2) {
          background-color: #dc3545;
        }
        .user-table button:nth-child(2):hover {
          background-color: #c82333;
        }
      `}</style>
    </div>
  );
};

export default AdminHome;
